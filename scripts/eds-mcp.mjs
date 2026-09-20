#!/usr/bin/env node
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const port = Number(process.env.EDS_MCP_PORT ?? 9234);
const httpPort = Number(process.env.EDS_MCP_HTTP_PORT ?? 9235);
const command = process.argv[2] ?? "help";

if (command === "serve") startBridge();
else if (command === "stdio") await startStdioAdapter();
else if (command === "http") await startHttpAdapter();
else {
  console.error("Gebruik: eds-mcp serve | eds-mcp stdio | eds-mcp http");
  process.exitCode = 1;
}

function startBridge() {
  const browserBySocket = new Map();
  const pending = new Map();
  const server = new WebSocketServer({ host: "127.0.0.1", port });
  server.on("connection", (socket, request) => {
    // Browsers send their Origin; adapters do not. Never accept a remote origin.
    const origin = request.headers.origin;
    if (origin && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin)) return socket.close(1008, "Local origins only");
    socket.on("message", (raw) => {
      let message;
      try { message = JSON.parse(String(raw)); } catch { return; }
      if (message.kind === "browser.hello") {
        browserBySocket.clear();
        browserBySocket.set(socket, true);
        socket.send(JSON.stringify({ kind: "browser.ready" }));
        return;
      }
      if (message.kind === "adapter.hello") {
        socket.send(JSON.stringify({ kind: "adapter.ready" }));
        return;
      }
      if (message.kind === "request" && typeof message.id === "string") {
        const browser = [...browserBySocket.keys()].find(candidate => candidate.readyState === WebSocket.OPEN);
        if (!browser) return socket.send(JSON.stringify({ kind: "response", id: message.id, ok: false, error: "De browser is niet verbonden met de lokale brug." }));
        pending.set(message.id, socket);
        browser.send(JSON.stringify(message));
        return;
      }
      if (message.kind === "response" && typeof message.id === "string") {
        const adapter = pending.get(message.id);
        pending.delete(message.id);
        if (adapter?.readyState === WebSocket.OPEN) adapter.send(JSON.stringify(message));
      }
    });
    socket.on("close", () => {
      browserBySocket.delete(socket);
      for (const [id, adapter] of pending) if (adapter === socket) pending.delete(id);
    });
  });
  server.on("listening", () => {
    console.error(`EDS MCP bridge actief op ws://127.0.0.1:${port}`);
    console.error("Open de app met ?mcp=on en configureer uw MCP-client met: npm run mcp:http (of npm run mcp:stdio)");
  });
  server.on("error", (error) => {
    console.error(`EDS MCP bridge kon niet starten: ${error.message}`);
    process.exitCode = 1;
  });
}

/** Registers the shared tool set on an McpServer, backed by a bridge `request` function. */
function registerTools(mcp, request) {
  const text = (value) => ({ content: [{ type: "text", text: JSON.stringify(value, null, 2) }] });
  const call = async (method, params = {}) => text(await request(method, params));
  mcp.registerTool("get_dossier_summary", { description: "Geeft een samenvatting van het actuele Belgische elektrische dossier, inclusief koppelfouten." }, () => call("get_dossier_summary"));
  mcp.registerTool("list_circuits", { description: "Lijst alle kringen uit het levende eendraadschema." }, () => call("list_circuits"));
  mcp.registerTool("get_item", { description: "Geeft een elektrisch item en zijn koppelingen met situatieplan/bordindeling.", inputSchema: { itemId: z.number().int() } }, ({ itemId }) => call("get_item", { itemId }));
  mcp.registerTool("find_items", { description: "Zoekt elektrische items op naam of type.", inputSchema: { query: z.string().min(1) } }, ({ query }) => call("find_items", { query }));
  mcp.registerTool("list_placement_tasks", { description: "Lijst open fysieke plaatsingstaken voor situatieschema en bordindeling." }, () => call("list_placement_tasks"));
  mcp.registerTool("propose_change_set", {
    description: "Toont de gebruiker een voorstel voor een graphwijziging. Pas alleen toe na duidelijke uitleg; de browser vraagt expliciete goedkeuring.",
    inputSchema: {
      baseRevision: z.number().int(),
      description: z.string().min(1),
      operations: z.array(z.object({ kind: z.enum(["add-item", "update-item", "move-item", "delete-item", "create-placement-task"]) }).passthrough()).min(1),
    },
  }, ({ baseRevision, description, operations }) => call("propose_change_set", { baseRevision, description, operations }));
  mcp.registerTool("add_distribution_board", {
    description: "Voegt een nieuw verdeelbord toe, gevoed door een bestaande kring. Toont de gebruiker een voorstel; de browser vraagt expliciete goedkeuring.",
    inputSchema: {
      baseRevision: z.number().int(),
      feederCircuitId: z.number().int(),
      properties: z.object({
        name: z.string().min(1),
        location: z.string().optional(),
        cableType: z.string().optional(),
        conductorSection: z.string().optional(),
        lengthMeters: z.number().optional(),
      }),
    },
  }, ({ baseRevision, feederCircuitId, properties }) => call("add_distribution_board", { baseRevision, feederCircuitId, properties }));
}

async function startStdioAdapter() {
  const bridge = await connectBridge();
  const mcp = new McpServer({ name: "eendraadschema", version: "0.1.0" });
  registerTools(mcp, (method, params) => bridge.request(method, params));
  await mcp.connect(new StdioServerTransport());
}

/**
 * Long-running HTTP MCP server. Unlike the stdio adapter (spawned and held open by the MCP
 * client for the whole session), this process can be restarted independently — editing this
 * file only requires bouncing `npm run mcp:http`, not the MCP client's session.
 */
async function startHttpAdapter() {
  const bridge = await connectBridge();
  const server = createServer(async (req, res) => {
    if (req.method !== "POST" && req.method !== "GET" && req.method !== "DELETE") {
      res.writeHead(405).end();
      return;
    }
    // Stateless: one McpServer/transport pair per request, no session tracking.
    const mcp = new McpServer({ name: "eendraadschema", version: "0.1.0" });
    registerTools(mcp, (method, params) => bridge.request(method, params));
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => { transport.close(); mcp.close(); });
    await mcp.connect(transport);
    await transport.handleRequest(req, res);
  });
  server.listen(httpPort, "127.0.0.1", () => {
    console.error(`EDS MCP HTTP-server actief op http://127.0.0.1:${httpPort}/mcp`);
  });
  server.on("error", (error) => {
    console.error(`EDS MCP HTTP-server kon niet starten: ${error.message}`);
    process.exitCode = 1;
  });
}

function connectBridge() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}`);
    const waiting = new Map();
    const timeout = setTimeout(() => reject(new Error("Geen lokale EDS MCP-brug gevonden. Start eerst 'eds-mcp serve'.")), 3000);
    socket.on("open", () => socket.send(JSON.stringify({ kind: "adapter.hello" })));
    socket.on("message", (raw) => {
      const message = JSON.parse(String(raw));
      if (message.kind === "adapter.ready") {
        clearTimeout(timeout);
        return resolve({ request(method, params) {
          return new Promise((resolveRequest, rejectRequest) => {
            const id = crypto.randomUUID();
            const timer = setTimeout(() => { waiting.delete(id); rejectRequest(new Error("De browser reageert niet op de MCP-aanvraag.")); }, 300_000);
            waiting.set(id, { resolve: resolveRequest, reject: rejectRequest, timer });
            socket.send(JSON.stringify({ kind: "request", id, method, params }));
          });
        } });
      }
      if (message.kind === "response") {
        const pending = waiting.get(message.id);
        if (!pending) return;
        waiting.delete(message.id); clearTimeout(pending.timer);
        message.ok ? pending.resolve(message.result) : pending.reject(new Error(message.error ?? "MCP-aanvraag mislukt."));
      }
    });
    socket.on("error", error => { clearTimeout(timeout); reject(error); });
  });
}
