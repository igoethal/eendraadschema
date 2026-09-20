export interface BoardLayoutRail {
  readonly id: string;
  readonly name: string;
  readonly moduleCapacity: number;
}

export interface BoardLayoutPlacement {
  readonly itemId: number;
  readonly railId: string;
  readonly startModule: number;
  readonly moduleWidth: number;
}

export interface BoardLayout {
  readonly boardId: string;
  readonly rails: readonly BoardLayoutRail[];
  readonly placements: readonly BoardLayoutPlacement[];
}

export function freezeBoardLayout(layout: BoardLayout): BoardLayout {
  return Object.freeze({
    boardId: layout.boardId,
    rails: Object.freeze(layout.rails.map(rail => Object.freeze({ ...rail }))),
    placements: Object.freeze(layout.placements.map(placement => Object.freeze({ ...placement }))),
  });
}

export function parseBoardLayouts(
  value: unknown,
  validBoardIds: ReadonlySet<string>,
  validItemIds: ReadonlySet<number>,
): BoardLayout[] {
  if (!Array.isArray(value)) return [];
  const layouts: BoardLayout[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate) || typeof candidate.boardId !== "string" || !validBoardIds.has(candidate.boardId)) {
      continue;
    }
    const rails = Array.isArray(candidate.rails)
      ? candidate.rails.filter(isRail).map(rail => ({ ...rail }))
      : [];
    const railIds = new Set(rails.map(rail => rail.id));
    const occupiedItems = new Set<number>();
    const placements = Array.isArray(candidate.placements)
      ? candidate.placements.filter(isPlacement).filter((placement) => {
          if (
            !validItemIds.has(placement.itemId)
            || !railIds.has(placement.railId)
            || occupiedItems.has(placement.itemId)
          ) return false;
          occupiedItems.add(placement.itemId);
          return true;
        }).map(placement => ({ ...placement }))
      : [];
    layouts.push({ boardId: candidate.boardId, rails, placements });
  }
  return layouts;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRail(value: unknown): value is BoardLayoutRail {
  return isRecord(value)
    && typeof value.id === "string"
    && value.id.length > 0
    && typeof value.name === "string"
    && Number.isInteger(value.moduleCapacity)
    && Number(value.moduleCapacity) > 0;
}

function isPlacement(value: unknown): value is BoardLayoutPlacement {
  return isRecord(value)
    && Number.isInteger(value.itemId)
    && typeof value.railId === "string"
    && Number.isInteger(value.startModule)
    && Number(value.startModule) >= 0
    && Number.isInteger(value.moduleWidth)
    && Number(value.moduleWidth) > 0;
}
