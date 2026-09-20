import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { ItemPropertiesPanel } from "../ui/properties/ItemPropertiesPanel";

afterEach(cleanup);

function createSelectedSocket() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const socket = structure.createItem("Contactdoos");
  structure.insertChildAfterId(socket, circuit.id);
  structure.reNumber(false);
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  editorStore.commands.selectItem(socket.id);
  return { schemaStore, editorStore, socketId: socket.id };
}

describe("SocketPropertiesEditor", () => {
  it("edits common socket fields through typed commands and history", () => {
    const { schemaStore, editorStore, socketId } = createSelectedSocket();
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByRole("group", { name: "Contactdoos" })).toBeVisible();
    expect(screen.getByLabelText("Nummer")).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Nummering"), { target: { value: "manueel" } });
    const number = screen.getByLabelText("Nummer");
    fireEvent.change(number, { target: { value: "G1" } });
    fireEvent.blur(number);
    fireEvent.change(screen.getByLabelText("Aantal contactdozen"), { target: { value: "4" } });
    fireEvent.click(screen.getByLabelText("Geaard"));
    const address = screen.getByLabelText("Adres of tekst");
    fireEvent.change(address, { target: { value: "Werkbank" } });
    fireEvent.blur(address);

    expect(schemaStore.getSnapshot().properties.getSocket(socketId)).toMatchObject({
      numberMode: "manueel",
      number: "G1",
      outletCount: "4",
      grounded: false,
      address: "Werkbank",
    });
    expect(schemaStore.getSnapshot().canUndo).toBe(true);

    schemaStore.commands.undo();
    expect(schemaStore.getSnapshot().properties.getSocket(socketId)?.address).toBe("");
    schemaStore.commands.redo();
    expect(schemaStore.getSnapshot().properties.getSocket(socketId)?.address).toBe("Werkbank");
  });

  it("reveals multi-phase fields and updates advanced socket properties", () => {
    const { schemaStore, editorStore, socketId } = createSelectedSocket();
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.queryByLabelText("Aantal fasen")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Meerfasig"));
    fireEvent.change(screen.getByLabelText("Aantal fasen"), { target: { value: "2" } });
    fireEvent.click(screen.getByLabelText("Met nul"));
    fireEvent.click(screen.getByLabelText("Halfwaterdicht"));
    fireEvent.click(screen.getByLabelText("Ingebouwde schakelaar"));
    fireEvent.click(screen.getByLabelText("In verdeelbord"));

    expect(schemaStore.getSnapshot().properties.getSocket(socketId)).toMatchObject({
      multiPhase: true,
      phaseCount: "2",
      hasNeutral: true,
      splashProof: true,
      builtInSwitch: true,
      inDistributionBoard: true,
    });
  });

  it("shows an unknown legacy selection without rewriting it", () => {
    const { schemaStore, editorStore, socketId } = createSelectedSocket();
    const socket = schemaStore.getLegacyDocument().getElectroItemById(socketId)!;
    socket.props.aantal = "historisch";
    schemaStore.synchronizeLegacyDocument(schemaStore.getLegacyDocument());

    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByLabelText<HTMLSelectElement>("Aantal contactdozen").value).toBe("historisch");
    expect(screen.getByRole("option", { name: "Huidige waarde: historisch" })).toBeInTheDocument();
    expect(socket.props.aantal).toBe("historisch");
  });
});
