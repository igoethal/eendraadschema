import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { getBoardBreadcrumbTrail } from "../ui/boards/BoardBreadcrumbs";
import { HierarchyTree } from "../ui/hierarchy/HierarchyTree";

afterEach(cleanup);

function createNestedBoards() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();

  const feederId = schemaStore.commands.addItem(board.id, "Kring");
  const garageBoardId = schemaStore.commands.addDistributionBoard(feederId, { name: "Garage" });
  const garageRootId = schemaStore.getSnapshot().document.getBoard(garageBoardId)!.rootItemIds[0];
  const garageCircuitId = schemaStore.commands.addItem(garageRootId, "Kring");
  const shedBoardId = schemaStore.commands.addDistributionBoard(garageCircuitId, { name: "Tuinhuis" });

  return { schemaStore, editorStore, garageBoardId, shedBoardId };
}

describe("getBoardBreadcrumbTrail", () => {
  it("walks the feeder chain from the main board to the active board", () => {
    const { schemaStore, garageBoardId, shedBoardId } = createNestedBoards();
    const document = schemaStore.getSnapshot().document;

    expect(getBoardBreadcrumbTrail(document, shedBoardId).map((board) => board.name))
      .toEqual(["Hoofdbord", "Garage", "Tuinhuis"]);
    expect(getBoardBreadcrumbTrail(document, garageBoardId).map((board) => board.name))
      .toEqual(["Hoofdbord", "Garage"]);
    expect(getBoardBreadcrumbTrail(document, "main").map((board) => board.name))
      .toEqual(["Hoofdbord"]);
    expect(getBoardBreadcrumbTrail(document, "bestaat-niet")).toEqual([]);
  });
});

describe("BoardBreadcrumbs in the tree", () => {
  it("hides breadcrumbs on the main board and shows the trail on nested boards", () => {
    const { schemaStore, editorStore, shedBoardId } = createNestedBoards();
    const { rerender } = render(
      <HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />,
    );
    expect(screen.queryByRole("navigation", { name: /Voedingspad/ })).not.toBeInTheDocument();

    editorStore.commands.selectBoard(shedBoardId);
    rerender(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    const breadcrumbs = screen.getByRole("navigation", { name: /Voedingspad/ });
    expect(breadcrumbs).toHaveTextContent("Hoofdbord");
    expect(breadcrumbs).toHaveTextContent("Garage");
    expect(breadcrumbs).toHaveTextContent("Tuinhuis");
  });

  it("navigates to an ancestor board when its crumb is clicked", () => {
    const { schemaStore, editorStore, garageBoardId, shedBoardId } = createNestedBoards();
    editorStore.commands.selectBoard(shedBoardId);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    const breadcrumbs = screen.getByRole("navigation", { name: /Voedingspad/ });
    fireEvent.click(screen.getByRole("button", { name: "Garage" }));

    expect(editorStore.getSnapshot().activeBoardId).toBe(garageBoardId);
    expect(breadcrumbs).toBeInTheDocument();
  });
});
