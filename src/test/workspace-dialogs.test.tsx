import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyFileService } from "../application/FileService";
import { LegacyPrintService } from "../application/PrintService";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { SVGSymbols } from "../SVGSymbols";
import { FileDialog } from "../ui/workspace/FileDialog";
import { PrintDialog } from "../ui/workspace/PrintDialog";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

describe("workspace file and print dialogs", () => {
  it("updates file settings and saves through FileService", async () => {
    const structure = loadFixture("example001.eds");
    const saveAs = vi.fn(async () => {});
    const fileService = new LegacyFileService({
      getDocument: () => structure,
      getFileApi: () => ({
        filename: null,
        lastsaved: "",
        readFile: async () => "",
        save: async () => {},
        saveAs,
      }),
      isFileApiAvailable: () => true,
      getManualSaver: () => undefined,
      downloadFallback: () => {},
    });
    const schemaStore = new LegacySchemaStore(structure);
    render(
      <FileDialog
        fileService={fileService}
        schemaStore={schemaStore}
        onOpen={() => {}}
        onAppend={() => {}}
        onClose={() => {}}
      />,
    );

    fireEvent.change(screen.getByLabelText("Bestandsnaam"), { target: { value: "bord.eds" } });
    fireEvent.click(screen.getByLabelText(/Compatibele tekstuitvoer/));
    fireEvent.click(screen.getByRole("button", { name: "Opslaan als" }));

    await waitFor(() => expect(saveAs).toHaveBeenCalledOnce());
    expect(schemaStore.getSnapshot().document.getDocumentDetails()).toBeDefined();
    expect(fileService.getState()).toMatchObject({
      filename: "bord.eds",
      compressionDisabled: true,
    });
  });

  it("renders and navigates the print preview through PrintService", () => {
    SVGSymbols.clearSymbols();
    const structure = loadFixture("example001.eds");
    const service = new LegacyPrintService(() => structure);
    const download = vi.fn();
    render(
      <PrintDialog
        printService={service}
        svgExportService={{ download }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Afdrukken" })).toBeInTheDocument();
    expect(screen.getByLabelText("Voorbeeldpagina")).toHaveValue("0");
    fireEvent.change(screen.getByLabelText("Papierformaat"), { target: { value: "A3" } });
    expect(service.getPreviewState().paperSize).toBe("A3");
    fireEvent.click(screen.getByRole("button", { name: "SVG downloaden" }));
    expect(download).toHaveBeenCalledWith(expect.stringContaining("<svg"), "eendraadschema_print.svg");
  });
});
