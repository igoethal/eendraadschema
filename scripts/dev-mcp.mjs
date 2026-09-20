#!/usr/bin/env node
// Starts the whole local MCP development setup with one command, in the order that works:
//   1. MCP bridge (ws://127.0.0.1:9234)      - must be up BEFORE the browser tab loads
//   2. MCP HTTP adapter (http://127.0.0.1:9235/mcp) - what the MCP client connects to
//   3. Vite dev server, then print the URL to open (with ?mcp=on)
// Ctrl+C stops everything. If any part dies, everything is stopped so you never end up
// with a half-running setup (a restarted bridge silently disconnects the browser tab).
import { spawn } from "node:child_process";
import { connect } from "node:net";

const bridgePort = Number(process.env.EDS_MCP_PORT ?? 9234);
const httpPort = Number(process.env.EDS_MCP_HTTP_PORT ?? 9235);
const vitePort = Number(process.env.EDS_DEV_PORT ?? 5173);
const children = [];
let stopping = false;

function stopAll(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => process.exit(code), 300);
}

function start(label, command, args) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
  children.push(child);
  const prefix = (stream, target) => stream.on("data", (chunk) => {
    for (const line of String(chunk).split("\n")) if (line.trim()) target.write(`[${label}] ${line}\n`);
  });
  prefix(child.stdout, process.stdout);
  prefix(child.stderr, process.stderr);
  child.on("exit", (code) => {
    if (stopping) return;
    console.error(`[${label}] is gestopt (code ${code}); alles wordt afgesloten.`);
    stopAll(1);
  });
  return child;
}

function waitForPort(port, name, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 15_000;
    const attempt = () => {
      const socket = connect({ port, host });
      socket.once("connect", () => { socket.destroy(); resolve(); });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() > deadline) reject(new Error(`${name} reageert niet op poort ${port}.`));
        else setTimeout(attempt, 200);
      });
    };
    attempt();
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

try {
  start("brug", "node", ["scripts/eds-mcp.mjs", "serve"]);
  await waitForPort(bridgePort, "De MCP-brug");
  start("mcp-http", "node", ["scripts/eds-mcp.mjs", "http"]);
  await waitForPort(httpPort, "De MCP HTTP-server");
  start("vite", "node", ["node_modules/vite/bin/vite.js", "--port", String(vitePort), "--strictPort"]);
  await waitForPort(vitePort, "Vite", "localhost");
  console.log(`\nAlles draait. Open (of herlaad) deze URL in de browser:\n\n    http://localhost:${vitePort}/?mcp=on\n`);
  console.log("Herlaad de tab nooit vóór de brug draait, en herstart de brug niet terwijl de tab open staat.");
  console.log("Ctrl+C stopt alles.\n");
} catch (error) {
  console.error(error.message);
  stopAll(1);
}
