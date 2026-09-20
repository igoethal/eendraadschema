import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { HierarchyTree } from "../ui/hierarchy/HierarchyTree";
import { loadFixture } from "./helpers";

afterEach(cleanup);

function createHierarchy() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const circuit = structure.createItem("Kring");
  circuit.props.naam = "G";
  structure.insertChildAfterId(circuit, board.id);
  const socket = structure.createItem("Contactdoos");
  socket.props.nr = "1";
  structure.insertChildAfterId(socket, circuit.id);
  const editorStore = new LocalEditorStore();
  const schemaStore = new LegacySchemaStore(structure);
  return { structure, schemaStore, editorStore, board, circuit, socket };
}

describe("HierarchyTree", () => {
  it.each(["example_default.eds", "example000.eds", "example001.eds"])(
    "renders every editable hierarchy node from %s",
    (fixture) => {
      const structure = loadFixture(fixture);
      const schemaStore = new LegacySchemaStore(structure);
      const editorStore = new LocalEditorStore();
      const editableItems = schemaStore.getSnapshot().document
        .getAllItems()
        .filter((item) => item.role === "item");
      for (const item of editableItems) editorStore.commands.expandItem(item.id);

      const view = render(
        <HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />,
      );

      expect(view.container.querySelectorAll("[data-hierarchy-item-id]")).toHaveLength(
        editableItems.length,
      );
    },
  );

  it("renders the electrical hierarchy and keeps generated attributes hidden", () => {
    const { structure, schemaStore, editorStore, board, circuit } = createHierarchy();
    const controller = structure.createItem("Domotica gestuurde verbruiker");
    structure.insertChildAfterId(controller, circuit.id);
    const attribute = structure.createItem("Drukknop");
    attribute.props.isAttribuut = true;
    structure.insertChildAfterId(attribute, controller.id);
    schemaStore.synchronizeLegacyDocument(structure);
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    editorStore.commands.expandItem(controller.id);

    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByRole("navigation", { name: "Elektrische hiërarchie" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Hoofdbord" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Kring G" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Contactdoos 1" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Drukknop" })).not.toBeInTheDocument();
  });

  it("supports selection, expansion, and arrow-key navigation", () => {
    const { schemaStore, editorStore, board, circuit } = createHierarchy();
    editorStore.commands.expandItem(board.id);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    const boardButton = screen.getByRole("button", { name: "Hoofdbord" });
    const circuitButton = screen.getByRole("button", { name: "Kring G" });
    fireEvent.click(circuitButton);
    expect(editorStore.getSnapshot().selectedItemId).toBe(circuit.id);
    expect(circuitButton).toHaveAttribute("aria-current", "true");

    boardButton.focus();
    fireEvent.keyDown(boardButton, { key: "ArrowDown" });
    expect(circuitButton).toHaveFocus();
    expect(editorStore.getSnapshot().selectedItemId).toBe(circuit.id);

    fireEvent.click(screen.getByRole("button", { name: "Uitklappen: Kring G" }));
    expect(screen.getByRole("button", { name: "Contactdoos 1" })).toBeVisible();
  });

  it("adds and duplicates items exclusively through schema commands", () => {
    const { schemaStore, editorStore, board, circuit } = createHierarchy();
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.click(screen.getByRole("button", { name: "Kring G" }));
    const addSelect = screen.getByLabelText("Onderdeel toevoegen onder Kring G");
    expect(addSelect.querySelectorAll("optgroup").length).toBeGreaterThan(2);
    fireEvent.change(addSelect, { target: { value: "Lichtpunt" } });
    fireEvent.click(within(addSelect.closest("div")!).getByRole("button", { name: "Toevoegen" }));

    const light = schemaStore.getSnapshot().document
      .getChildren(circuit.id)
      .find((item) => item.type === "Lichtpunt");
    expect(light).toBeDefined();
    expect(editorStore.getSnapshot().selectedItemId).toBe(light?.id);

    fireEvent.click(screen.getByRole("button", { name: /Contactdoos \d+/ }));
    fireEvent.click(screen.getByRole("button", { name: /Contactdoos \d+ dupliceren/ }));
    expect(schemaStore.getSnapshot().document.getChildren(circuit.id)
      .filter((item) => item.type === "Contactdoos")).toHaveLength(2);
  });

  it("shows fixed omschakelaar ports without structural controls", () => {
    const { schemaStore, editorStore, board, circuit } = createHierarchy();
    const switchId = schemaStore.commands.addItem(circuit.id, "Omschakelaar");
    const port = schemaStore.getSnapshot().document.getChildren(switchId)[0];
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    editorStore.commands.expandItem(switchId);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.click(screen.getByRole("button", { name: "OUT1" }));

    expect(screen.queryByLabelText("Type van OUT1")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "OUT1 verwijderen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "OUT1 dupliceren" })).not.toBeInTheDocument();
    const addSelect = screen.getByLabelText("Onderdeel toevoegen onder OUT1");
    expect(Array.from(addSelect.querySelectorAll("option"), option => option.value)).toContain("Kring");
    expect(schemaStore.getSnapshot().document.getItem(port.id)?.capabilities.canDelete).toBe(false);
  });

  it("changes types and expands composite items through dedicated controls", () => {
    const { schemaStore, editorStore, board, circuit, socket } = createHierarchy();
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.click(screen.getByRole("button", { name: "Contactdoos 1" }));
    fireEvent.change(screen.getByLabelText("Type van Contactdoos 1"), {
      target: { value: "Lichtcircuit" },
    });
    schemaStore.commands.updateConfiguredItem(socket.id, { lightCount: "2" });

    fireEvent.click(screen.getByRole("button", { name: /Lichtcircuit.*uitpakken/ }));
    expect(schemaStore.getSnapshot().document.getItem(socket.id)?.type).toBe("Lichtpunt");
    expect(schemaStore.getSnapshot().document.getChildren(circuit.id)
      .some((item) => item.type === "Schakelaars")).toBe(true);
  });

  it("requires confirmation before deleting a subtree", () => {
    const { schemaStore, editorStore, board, circuit, socket } = createHierarchy();
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    editorStore.commands.selectItem(socket.id);
    const confirmDelete = vi.fn(() => false);
    const view = render(
      <HierarchyTree
        schemaStore={schemaStore}
        editorStore={editorStore}
        confirmDelete={confirmDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Contactdoos 1 verwijderen" }));
    expect(schemaStore.getSnapshot().document.getItem(socket.id)).toBeDefined();

    view.rerender(
      <HierarchyTree
        schemaStore={schemaStore}
        editorStore={editorStore}
        confirmDelete={() => true}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Contactdoos 1 verwijderen" }));

    expect(schemaStore.getSnapshot().document.getItem(socket.id)).toBeUndefined();
    expect(editorStore.getSnapshot().selectedItemId).toBeNull();
  });

  it("moves siblings and exposes command-layer undo and redo", () => {
    const { schemaStore, editorStore, board, circuit, socket } = createHierarchy();
    const lightId = schemaStore.commands.addItem(circuit.id, "Lichtpunt");
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.click(screen.getByRole("button", { name: /Contactdoos \d+/ }));
    fireEvent.click(screen.getByRole("button", { name: /Contactdoos \d+ omhoog verplaatsen/ }));
    expect(schemaStore.getSnapshot().document.getItem(circuit.id)?.childIds).toEqual([
      socket.id,
      lightId,
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Ongedaan maken" }));
    expect(schemaStore.getSnapshot().document.getItem(circuit.id)?.childIds).toEqual([
      lightId,
      socket.id,
    ]);
    expect(screen.getByRole("button", { name: "Opnieuw" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Opnieuw" }));
    expect(schemaStore.getSnapshot().document.getItem(circuit.id)?.childIds).toEqual([
      socket.id,
      lightId,
    ]);
  });

  it("shows an actionable empty state", () => {
    const schemaStore = new LegacySchemaStore(new Hierarchical_List());
    const editorStore = new LocalEditorStore();
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByText(/nog geen elektrische onderdelen/i)).toBeVisible();
    const rootSelect = screen.getByLabelText("Onderdeel op hoofdniveau toevoegen");
    fireEvent.click(within(rootSelect.closest("div")!).getByRole("button", { name: "Toevoegen" }));

    expect(schemaStore.getSnapshot().document.getRootItems()).toHaveLength(1);
    expect(schemaStore.getSnapshot().document.getRootItems()[0].type).toBe("Aansluiting");
  });

  it("creates and navigates secondary boards without mixing their editable trees", () => {
    const { schemaStore, editorStore, board, circuit } = createHierarchy();
    editorStore.commands.expandItem(board.id);
    editorStore.commands.expandItem(circuit.id);
    const view = render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.click(screen.getByText("+ Verdeelbord toevoegen"));
    const addForm = screen.getByText("+ Verdeelbord toevoegen").closest("details")!;
    fireEvent.change(within(addForm).getByLabelText("Naam"), { target: { value: "Garage" } });
    fireEvent.change(within(addForm).getByLabelText("Locatie"), { target: { value: "Achterbouw" } });
    fireEvent.change(within(addForm).getByLabelText("Gevoed door"), { target: { value: String(circuit.id) } });
    fireEvent.click(within(addForm).getByRole("button", { name: "Verdeelbord toevoegen" }));

    const garage = schemaStore.getSnapshot().document.getBoards().find((candidate) => candidate.name === "Garage")!;
    const garageRootId = garage.rootItemIds[0];
    expect(editorStore.getSnapshot().activeBoardId).toBe(garage.id);
    expect(screen.getByRole("button", { name: /▣ Garage/ })).toHaveAttribute("aria-current", "page");
    expect(view.container.querySelector(`[data-hierarchy-item-id="${garageRootId}"]`)).toBeVisible();
    expect(view.container.querySelector(`[data-hierarchy-item-id="${circuit.id}"]`)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /▣ Hoofdbord/ }));
    expect(editorStore.getSnapshot().activeBoardId).toBe("main");
    expect(view.container.querySelector(`[data-hierarchy-item-id="${circuit.id}"]`)).toBeVisible();
    expect(view.container.querySelector(`[data-hierarchy-item-id="${garageRootId}"]`)).not.toBeInTheDocument();
  });
});
