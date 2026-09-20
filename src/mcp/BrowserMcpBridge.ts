import type { AddDistributionBoardProperties, AgentGraphOperation, SchemaStore } from "../application/SchemaStore";
import type { SituationPlanStore } from "../application/SituationPlanStore";
import { createDossierSnapshot } from "../application/DossierReader";

interface BridgeRequest {
  readonly kind: "request";
  readonly id: string;
  readonly method: string;
  readonly params?: unknown;
}

/** Browser side of the loopback bridge. It exposes only application projections. */
export class BrowserMcpBridge {
  private socket: WebSocket | null = null;

  constructor(
    private readonly schemaStore: SchemaStore,
    private readonly situationPlanStore: SituationPlanStore,
    private readonly endpoint = "ws://127.0.0.1:9234",
  ) {}

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return;
    const socket = new WebSocket(this.endpoint);
    this.socket = socket;
    socket.addEventListener("open", () => socket.send(JSON.stringify({ kind: "browser.hello" })));
    socket.addEventListener("message", (event) => this.handleMessage(String(event.data)));
    socket.addEventListener("close", () => {
      if (this.socket === socket) this.socket = null;
    });
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  private async handleMessage(payload: string): Promise<void> {
    let request: BridgeRequest;
    try {
      request = JSON.parse(payload) as BridgeRequest;
      if (request.kind !== "request" || typeof request.id !== "string" || typeof request.method !== "string") return;
    } catch {
      return;
    }
    try {
      this.respond(request.id, { ok: true, result: await this.execute(request) });
    } catch (error) {
      this.respond(request.id, { ok: false, error: error instanceof Error ? error.message : "Onbekende fout." });
    }
  }

  private async execute(request: BridgeRequest): Promise<unknown> {
    const schema = this.schemaStore.getSnapshot();
    switch (request.method) {
      case "get_dossier_summary": {
        const dossier = createDossierSnapshot(schema, this.situationPlanStore.getSnapshot());
        return {
          revision: schema.revision,
          boards: schema.document.getBoards().map(board => ({ id: board.id, name: board.name, location: board.location })),
          itemCount: dossier.items.length,
          issues: dossier.issues,
          placementTasks: schema.placementTasks,
        };
      }
      case "list_circuits":
        return schema.document.getAllItems()
          .filter(item => item.role === "item" && item.type === "Kring")
          .map(item => ({ id: item.id, label: item.label, boardId: schema.document.getBoardForItem(item.id)?.id ?? null, summary: item.summary }));
      case "get_item": {
        const itemId = getItemId(request.params);
        const item = schema.document.getItem(itemId);
        if (!item) throw new Error(`Item ${itemId} bestaat niet.`);
        const dossier = createDossierSnapshot(schema, this.situationPlanStore.getSnapshot());
        return { item, links: dossier.items.find(link => link.itemId === itemId) ?? null };
      }
      case "find_items": {
        const query = getTextParam(request.params, "query").toLocaleLowerCase("nl-BE");
        return schema.document.getAllItems().filter(item => item.role === "item" && (
          item.label.toLocaleLowerCase("nl-BE").includes(query) || item.type.toLocaleLowerCase("nl-BE").includes(query)
        ));
      }
      case "list_placement_tasks":
        return schema.placementTasks;
      case "propose_change_set": {
        const baseRevision = getNumberParam(request.params, "baseRevision");
        if (baseRevision !== schema.revision) throw new Error("Het dossier is gewijzigd; lees het opnieuw en maak een nieuw voorstel.");
        const operations = getOperations(request.params);
        const description = getTextParam(request.params, "description");
        const summary = describeProposal(operations, description);
        if (!await requestProposalApproval(summary)) {
          return { approved: false, summary };
        }
        this.schemaStore.commands.applyAgentChangeSet(operations);
        return { approved: true, summary, revision: this.schemaStore.getSnapshot().revision };
      }
      case "add_distribution_board": {
        const baseRevision = getNumberParam(request.params, "baseRevision");
        if (baseRevision !== schema.revision) throw new Error("Het dossier is gewijzigd; lees het opnieuw en maak een nieuw voorstel.");
        const feederCircuitId = getNumberParam(request.params, "feederCircuitId");
        const properties = getBoardProperties(request.params);
        const summary = `Voorstel van assistent: nieuw verdeelbord '${properties.name}' toevoegen, gevoed door kring ${feederCircuitId}.`;
        if (!await requestProposalApproval(summary)) {
          return { approved: false, summary };
        }
        const boardId = this.schemaStore.commands.addDistributionBoard(feederCircuitId, properties);
        return { approved: true, summary, boardId, revision: this.schemaStore.getSnapshot().revision };
      }
      default:
        throw new Error(`MCP-methode '${request.method}' wordt niet ondersteund.`);
    }
  }

  private respond(id: string, body: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const record = typeof body === "object" && body !== null ? body as Record<string, unknown> : { result: body };
      this.socket.send(JSON.stringify({ kind: "response", id, ...record }));
    }
  }
}

function requestProposalApproval(summary: string): Promise<boolean> {
  return new Promise((resolve) => window.dispatchEvent(new CustomEvent("eds-mcp-proposal", { detail: { summary, resolve } })));
}

function getRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Ongeldige MCP-parameters.");
  return value as Record<string, unknown>;
}
function getItemId(value: unknown): number { return getNumberParam(value, "itemId"); }
function getNumberParam(value: unknown, key: string): number {
  const result = getRecord(value)[key];
  if (!Number.isInteger(result)) throw new Error(`'${key}' moet een geheel getal zijn.`);
  return result as number;
}
function getTextParam(value: unknown, key: string): string {
  const result = getRecord(value)[key];
  if (typeof result !== "string" || result.trim() === "") throw new Error(`'${key}' moet tekst bevatten.`);
  return result.trim();
}
function getOperations(value: unknown): readonly AgentGraphOperation[] {
  const operations = getRecord(value).operations;
  if (!Array.isArray(operations) || operations.length === 0) throw new Error("Geef minstens één wijziging op.");
  for (const operation of operations) {
    const record = getRecord(operation);
    if (!["add-item", "update-item", "move-item", "delete-item", "create-placement-task"].includes(String(record.kind))) {
      throw new Error("Het voorstel bevat een ongeldige wijziging.");
    }
  }
  return operations as AgentGraphOperation[];
}
function getOptionalTextParam(value: unknown, key: string): string | undefined {
  const result = getRecord(value)[key];
  if (result === undefined) return undefined;
  if (typeof result !== "string") throw new Error(`'${key}' moet tekst zijn.`);
  return result;
}
function getBoardProperties(value: unknown): AddDistributionBoardProperties {
  const record = getRecord(value);
  const properties = record.properties;
  if (typeof properties !== "object" || properties === null || Array.isArray(properties)) {
    throw new Error("'properties' moet een object zijn.");
  }
  const name = getTextParam({ name: (properties as Record<string, unknown>).name }, "name");
  const location = getOptionalTextParam(properties, "location");
  const cableType = getOptionalTextParam(properties, "cableType");
  const conductorSection = getOptionalTextParam(properties, "conductorSection");
  const lengthMetersRaw = (properties as Record<string, unknown>).lengthMeters;
  if (lengthMetersRaw !== undefined && typeof lengthMetersRaw !== "number") throw new Error("'lengthMeters' moet een getal zijn.");
  const lengthMeters = lengthMetersRaw as number | undefined;
  return { name, location, cableType, conductorSection, lengthMeters };
}
function describeProposal(operations: readonly AgentGraphOperation[], description: string): string {
  const names = operations.map(operation => operation.kind).join(", ");
  return `Voorstel van assistent: ${description}\nWijzigingen (${operations.length}): ${names}.`;
}
