import { boardConnectionCreatesCycle } from "../domain/DistributionBoard";
import type { SchemaDocumentReader } from "./SchemaDocumentReader";

export type ValidationSeverity = "info" | "warning" | "error";

export interface ValidationIssue {
  readonly id: string;
  readonly severity: ValidationSeverity;
  readonly itemId?: number;
  readonly boardId?: string;
  readonly code: string;
  readonly message: string;
}

/** Structural document validation, independent from React and the browser DOM. */
export function validateSchemaDocument(document: SchemaDocumentReader): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const boards = document.getBoards();
  const boardIds = new Set<string>();

  for (const board of boards) {
    if (boardIds.has(board.id)) {
      issues.push(issue("error", "DUPLICATE_BOARD_ID", board.id, undefined,
        `Verdeelbord-ID '${board.id}' komt meer dan één keer voor.`));
    }
    boardIds.add(board.id);

    if (board.rootItemIds.length === 0) {
      issues.push(issue("error", "BOARD_WITHOUT_ROOT", board.id, undefined,
        `Verdeelbord '${board.name}' heeft geen elektrisch wortelelement.`));
    }
    for (const rootItemId of board.rootItemIds) {
      const root = document.getItem(rootItemId);
      if (!root) {
        issues.push(issue("error", "MISSING_BOARD_ROOT", board.id, rootItemId,
          `Verdeelbord '${board.name}' verwijst naar een ontbrekend wortelelement.`));
        continue;
      }
      const expectedParentId = board.feeder?.sourceCircuitId ?? null;
      if (root.parentId !== expectedParentId) {
        issues.push(issue("error", "INVALID_BOARD_ROOT_PARENT", board.id, rootItemId,
          `Verdeelbord '${board.name}' is niet gekoppeld aan de verwachte voeding.`));
      }
    }

    if (board.id === "main") {
      if (board.feeder) {
        issues.push(issue("error", "MAIN_BOARD_HAS_FEEDER", board.id, undefined,
          "Het hoofdbord mag geen voeding vanuit een ander verdeelbord hebben."));
      }
      continue;
    }

    if (!board.feeder) {
      issues.push(issue("error", "BOARD_WITHOUT_FEEDER", board.id, undefined,
        `Verdeelbord '${board.name}' heeft geen voedende kring.`));
      continue;
    }
    const sourceBoard = document.getBoard(board.feeder.sourceBoardId);
    if (!sourceBoard) {
      issues.push(issue("error", "MISSING_SOURCE_BOARD", board.id, board.feeder.sourceCircuitId,
        `De voeding van '${board.name}' verwijst naar een ontbrekend verdeelbord.`));
    }
    const sourceCircuit = document.getItem(board.feeder.sourceCircuitId);
    if (!sourceCircuit || sourceCircuit.type !== "Kring") {
      issues.push(issue("error", "MISSING_FEEDER_CIRCUIT", board.id, board.feeder.sourceCircuitId,
        `De voeding van '${board.name}' verwijst niet naar een geldige kring.`));
    } else if (document.getBoardForItem(sourceCircuit.id)?.id !== board.feeder.sourceBoardId) {
      issues.push(issue("error", "FEEDER_BOARD_MISMATCH", board.id, sourceCircuit.id,
        `De voedende kring van '${board.name}' hoort niet bij het opgegeven bronbord.`));
    }
    if (boardConnectionCreatesCycle(boards, board.id, board.feeder.sourceBoardId)) {
      issues.push(issue("error", "BOARD_CONNECTION_CYCLE", board.id, board.feeder.sourceCircuitId,
        `De voeding van '${board.name}' maakt een cyclus tussen verdeelborden.`));
    }
  }

  for (const item of document.getAllItems()) {
    if (!document.getBoardForItem(item.id)) {
      issues.push(issue("error", "ORPHANED_ITEM", undefined, item.id,
        `Item ${item.id} hoort niet bij een verdeelbord.`));
    }
    if (item.type === "Omschakelaar") {
      validateOmschakelaar(document, item.id, issues);
    }
  }

  return Object.freeze(issues);
}

function validateOmschakelaar(
  document: SchemaDocumentReader,
  itemId: number,
  issues: ValidationIssue[],
): void {
  const directChildren = document.getChildren(itemId);
  const connectors = directChildren.filter(child => child.type === "Omschakelaarpoort");
  if (connectors.length !== 3) {
    issues.push(issue("error", "OMSCHAKELAAR_PORT_COUNT", undefined, itemId,
      "Een omschakelaar moet exact drie aansluitpoorten hebben (OUT1, IN en OUT2)."));
  }

  const portNames = connectors.map(connector => connector.summary.connectionPort);
  if (new Set(portNames).size !== portNames.length) {
    issues.push(issue("error", "OMSCHAKELAAR_DUPLICATE_PORT", undefined, itemId,
      "De aansluitpoorten van de omschakelaar moeten uniek zijn."));
  }

  for (const connector of connectors) {
    const children = document.getChildren(connector.id);
    if (children.length > 1 || children.some(child => child.type !== "Kring")) {
      issues.push(issue("error", "OMSCHAKELAAR_INVALID_PORT_CHILD", undefined, connector.id,
        "Een omschakelaarpoort mag maximaal één kring bevatten."));
    }
  }
  for (const child of directChildren) {
    if (child.type !== "Omschakelaarpoort") {
      issues.push(issue("error", "OMSCHAKELAAR_INVALID_PORT_CHILD", undefined, child.id,
        "Een omschakelaar mag alleen vaste aansluitpoorten bevatten."));
    }
  }
}

function issue(
  severity: ValidationSeverity,
  code: string,
  boardId: string | undefined,
  itemId: number | undefined,
  message: string,
): ValidationIssue {
  return Object.freeze({
    id: `${code}:${boardId ?? "document"}:${itemId ?? "none"}`,
    severity,
    boardId,
    itemId,
    code,
    message,
  });
}
