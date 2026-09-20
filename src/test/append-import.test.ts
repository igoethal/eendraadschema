// @vitest-environment node

import { describe, expect, it } from "vitest";
import type { BoardLayout } from "../domain/BoardLayout";
import type { DistributionBoard } from "../domain/DistributionBoard";
import { appendStructure, mergeAppendedBoardLayouts, mergeAppendedBoards } from "../importExport/importExport";
import { Hierarchical_List } from "../Hierarchical_List";

const targetBoards: readonly DistributionBoard[] = [
  { id: "main", name: "Hoofdbord", rootItemIds: [1, 2] },
  {
    id: "board-7",
    name: "Garage",
    rootItemIds: [7],
    feeder: { sourceBoardId: "main", sourceCircuitId: 5 },
  },
];

describe("appendStructure", () => {
  it("merges into the supplied document without consulting global state", () => {
    const target = new Hierarchical_List();
    target.addItem("Bord");
    const appended = new Hierarchical_List();
    appended.addItem("Kring");
    const targetLength = target.length;
    const appendedLength = appended.length;
    const previousMaximumId = Math.max(...target.id);

    appendStructure(target, appended);

    expect(target.length).toBe(targetLength + appendedLength);
    expect(target.id.filter(id => id > previousMaximumId)).toHaveLength(appendedLength);
    expect(target.data.every(item => item.sourcelist === target)).toBe(true);
  });
});

describe("mergeAppendedBoards", () => {
  it("keeps the target boards unchanged when the appended document only has a main board", () => {
    const merged = mergeAppendedBoards(
      targetBoards,
      [{ id: "main", name: "Hoofdbord", rootItemIds: [1] }],
      100,
    );
    expect(merged).toEqual(targetBoards);
  });

  it("remaps secondary board item IDs and feeders by the append offset", () => {
    const appended: DistributionBoard[] = [
      { id: "main", name: "Hoofdbord", rootItemIds: [1] },
      {
        id: "board-4",
        name: "Tuinhuis",
        location: "Tuin",
        rootItemIds: [4],
        feeder: {
          sourceBoardId: "main",
          sourceCircuitId: 3,
          cableType: "XVB",
          conductorSection: "5G6",
          lengthMeters: 12,
        },
      },
    ];

    const merged = mergeAppendedBoards(targetBoards, appended, 100);

    expect(merged.slice(0, 2)).toEqual(targetBoards);
    expect(merged[2]).toEqual({
      id: "board-104",
      name: "Tuinhuis",
      location: "Tuin",
      rootItemIds: [104],
      feeder: {
        sourceBoardId: "main",
        sourceCircuitId: 103,
        cableType: "XVB",
        conductorSection: "5G6",
        lengthMeters: 12,
      },
    });
  });

  describe("mergeAppendedBoardLayouts", () => {
    it("remaps boards, item IDs and colliding rail IDs", () => {
      const appendedBoards: readonly DistributionBoard[] = [
        { id: "main", name: "Hoofdbord", rootItemIds: [1] },
        {
          id: "board-4",
          name: "Tuinhuis",
          rootItemIds: [4],
          feeder: { sourceBoardId: "main", sourceCircuitId: 3 },
        },
      ];
      const targetLayouts: readonly BoardLayout[] = [{
        boardId: "main",
        rails: [{ id: "rail-1", name: "Bestaand", moduleCapacity: 18 }],
        placements: [{ itemId: 2, railId: "rail-1", startModule: 0, moduleWidth: 2 }],
      }];
      const appendedLayouts: readonly BoardLayout[] = [
        {
          boardId: "main",
          rails: [{ id: "rail-1", name: "Nieuw", moduleCapacity: 12 }],
          placements: [{ itemId: 1, railId: "rail-1", startModule: 1, moduleWidth: 1 }],
        },
        {
          boardId: "board-4",
          rails: [{ id: "rail-1", name: "Tuinhuis", moduleCapacity: 12 }],
          placements: [{ itemId: 4, railId: "rail-1", startModule: 0, moduleWidth: 3 }],
        },
      ];

      const merged = mergeAppendedBoardLayouts(
        targetLayouts, appendedLayouts, targetBoards, appendedBoards, 100);

      expect(merged.find(layout => layout.boardId === "main")).toEqual({
        boardId: "main",
        rails: [
          { id: "rail-1", name: "Bestaand", moduleCapacity: 18 },
          { id: "rail-1-2", name: "Nieuw", moduleCapacity: 12 },
        ],
        placements: [
          { itemId: 2, railId: "rail-1", startModule: 0, moduleWidth: 2 },
          { itemId: 101, railId: "rail-1-2", startModule: 1, moduleWidth: 1 },
        ],
      });
      expect(merged.find(layout => layout.boardId === "board-104")).toEqual({
        boardId: "board-104",
        rails: [{ id: "rail-1", name: "Tuinhuis", moduleCapacity: 12 }],
        placements: [{ itemId: 104, railId: "rail-1", startModule: 0, moduleWidth: 3 }],
      });
    });
  });

  it("remaps feeders between appended boards to the regenerated board IDs", () => {
    const appended: DistributionBoard[] = [
      { id: "main", name: "Hoofdbord", rootItemIds: [1] },
      {
        id: "board-4",
        name: "Bijgebouw",
        rootItemIds: [4],
        feeder: { sourceBoardId: "main", sourceCircuitId: 3 },
      },
      {
        id: "board-6",
        name: "Tuinhuis",
        rootItemIds: [6],
        feeder: { sourceBoardId: "board-4", sourceCircuitId: 5 },
      },
    ];

    const merged = mergeAppendedBoards(targetBoards, appended, 100);
    const annex = merged.find((board) => board.name === "Bijgebouw");
    const shed = merged.find((board) => board.name === "Tuinhuis");

    expect(annex?.id).toBe("board-104");
    expect(shed?.feeder?.sourceBoardId).toBe("board-104");
    expect(shed?.feeder?.sourceCircuitId).toBe(105);
  });

  it("generates unique board IDs when the preferred ID is already taken", () => {
    const appended: DistributionBoard[] = [
      { id: "main", name: "Hoofdbord", rootItemIds: [1] },
      {
        id: "board-x",
        name: "Kelder",
        rootItemIds: [7],
        feeder: { sourceBoardId: "main", sourceCircuitId: 3 },
      },
    ];

    // Offset 0 makes the preferred ID "board-7", which the target already uses.
    const merged = mergeAppendedBoards(targetBoards, appended, 0);
    const cellar = merged.find((board) => board.name === "Kelder");

    expect(cellar?.id).toBe("board-7-2");
    expect(new Set(merged.map((board) => board.id)).size).toBe(merged.length);
  });
});
