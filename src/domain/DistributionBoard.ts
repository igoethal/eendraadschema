export interface BoardFeeder {
  readonly sourceBoardId: string;
  readonly sourceCircuitId: number;
  readonly cableType?: string;
  readonly conductorSection?: string;
  readonly lengthMeters?: number;
}
export interface DistributionBoard {
  readonly id: string;
  readonly name: string;
  readonly location?: string;
  readonly feeder?: BoardFeeder;
  readonly rootItemIds: readonly number[];
}

export const DEFAULT_MAIN_BOARD_ID = "main";

export function createDefaultMainBoard(rootItemIds: readonly number[]): DistributionBoard {
  return {
    id: DEFAULT_MAIN_BOARD_ID,
    name: "Hoofdbord",
    rootItemIds: [...rootItemIds],
  };
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function parseFeeder(value: unknown): BoardFeeder | undefined {
  if (value === null || typeof value !== "object") return undefined;
  const feeder = value as Record<string, unknown>;
  if (typeof feeder.sourceBoardId !== "string" || !Number.isInteger(feeder.sourceCircuitId)) {
    return undefined;
  }
  const lengthMeters = typeof feeder.lengthMeters === "number" && Number.isFinite(feeder.lengthMeters)
    ? feeder.lengthMeters
    : undefined;
  return {
    sourceBoardId: feeder.sourceBoardId,
    sourceCircuitId: feeder.sourceCircuitId as number,
    cableType: optionalText(feeder.cableType),
    conductorSection: optionalText(feeder.conductorSection),
    lengthMeters,
  };
}

/** Parse persisted board metadata without depending on the browser or React. */
export function parseDistributionBoards(
  value: unknown,
  defaultRootItemIds: readonly number[],
): DistributionBoard[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [createDefaultMainBoard(defaultRootItemIds)];
  }

  const boards: DistributionBoard[] = [];
  const usedIds = new Set<string>();
  for (const rawBoard of value) {
    if (rawBoard === null || typeof rawBoard !== "object") continue;
    const board = rawBoard as Record<string, unknown>;
    if (typeof board.id !== "string" || board.id.trim() === "" || usedIds.has(board.id)) continue;
    const rootItemIds = Array.isArray(board.rootItemIds)
      ? board.rootItemIds.filter((id): id is number => Number.isInteger(id))
      : [];
    boards.push({
      id: board.id,
      name: typeof board.name === "string" ? board.name : "Verdeelbord",
      location: optionalText(board.location),
      feeder: parseFeeder(board.feeder),
      rootItemIds,
    });
    usedIds.add(board.id);
  }

  if (boards.length === 0) return [createDefaultMainBoard(defaultRootItemIds)];
  return boards;
}

export function findBoardIdForItem(
  boards: readonly DistributionBoard[],
  itemId: number,
  getParentId: (itemId: number) => number | null | undefined,
): string | undefined {
  const boardIdByRootItemId = new Map<number, string>();
  for (const board of boards) {
    for (const rootItemId of board.rootItemIds) boardIdByRootItemId.set(rootItemId, board.id);
  }

  let currentItemId: number | null | undefined = itemId;
  const visited = new Set<number>();
  while (currentItemId !== null && currentItemId !== undefined && !visited.has(currentItemId)) {
    const boardId = boardIdByRootItemId.get(currentItemId);
    if (boardId !== undefined) return boardId;
    visited.add(currentItemId);
    currentItemId = getParentId(currentItemId);
  }
  return undefined;
}

export function boardConnectionCreatesCycle(
  boards: readonly DistributionBoard[],
  boardId: string,
  sourceBoardId: string,
): boolean {
  if (boardId === sourceBoardId) return true;
  const boardsById = new Map(boards.map((board) => [board.id, board]));
  const visited = new Set<string>();
  let currentBoardId: string | undefined = sourceBoardId;
  while (currentBoardId !== undefined && !visited.has(currentBoardId)) {
    if (currentBoardId === boardId) return true;
    visited.add(currentBoardId);
    currentBoardId = boardsById.get(currentBoardId)?.feeder?.sourceBoardId;
  }
  return false;
}
