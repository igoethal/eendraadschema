import { describe, expect, it, vi } from "vitest";
import { LegacyFileService, type FileApiAdapter } from "../application/FileService";
import { Hierarchical_List } from "../Hierarchical_List";
import { decodeEds, encodeEds, structureFromJson } from "../legacy/persistence/EdsCodec";
import { hierarchySnapshot } from "./helpers";

function createDocument(): Hierarchical_List {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const circuit = structure.createItem("Kring");
  circuit.props.naam = "Keuken";
  structure.insertChildAfterId(circuit, board.id);
  return structure;
}

function createService(overrides: {
  fileApiAvailable?: boolean;
  fileApi?: Partial<FileApiAdapter>;
} = {}) {
  const structure = createDocument();
  const fileApi: FileApiAdapter = {
    filename: null,
    lastsaved: "10:00:00",
    readFile: vi.fn(async () => "TXT0050000{}"),
    save: vi.fn(async () => undefined),
    saveAs: vi.fn(async () => undefined),
    ...overrides.fileApi,
  };
  const manualSaver = { saveManually: vi.fn() };
  const downloadFallback = vi.fn();
  const afterExport = vi.fn();
  const service = new LegacyFileService({
    getDocument: () => structure,
    getFileApi: () => fileApi,
    isFileApiAvailable: () => overrides.fileApiAvailable ?? true,
    getManualSaver: () => manualSaver,
    downloadFallback,
    afterExport,
  });
  return { structure, service, fileApi, manualSaver, downloadFallback, afterExport };
}

describe("encodeEds", () => {
  it("round trips a document through the compressed EDS format", () => {
    const original = createDocument();
    const payload = encodeEds(original.toJsonObject(true));

    expect(payload.startsWith("EDS0060000")).toBe(true);
    const decoded = decodeEds(payload);
    const reloaded = structureFromJson(decoded.text, null, decoded.version);
    expect(hierarchySnapshot(reloaded)).toEqual(hierarchySnapshot(original));
  });

  it("falls back to the TXT format when compression is disabled or fails", () => {
    const original = createDocument();
    const uncompressed = encodeEds(original.toJsonObject(true), true);
    expect(uncompressed.startsWith("TXT0060000")).toBe(true);

    const failing = encodeEds(original.toJsonObject(true), false, () => {
      throw new Error("boom");
    });
    expect(failing.startsWith("TXT0060000")).toBe(true);
  });
});

describe("LegacyFileService", () => {
  it("reports file state for the File System Access flow", () => {
    const { service, fileApi } = createService();
    expect(service.getState()).toMatchObject({
      fileApiAvailable: true,
      hasOpenFile: false,
      compressionDisabled: false,
    });

    fileApi.filename = "schema.eds";
    expect(service.getState().hasOpenFile).toBe(true);
  });

  it("forces the save-as picker when there is no open file handle", async () => {
    const { service, fileApi, manualSaver, afterExport } = createService();

    await service.saveDocument(false);

    expect(fileApi.saveAs).toHaveBeenCalledTimes(1);
    expect(fileApi.save).not.toHaveBeenCalled();
    expect(manualSaver.saveManually).toHaveBeenCalledTimes(1);
    expect((manualSaver.saveManually.mock.calls[0][0] as string).startsWith("TXT0060000")).toBe(true);
    expect(afterExport).toHaveBeenCalledTimes(1);
  });

  it("saves in place when a file handle exists", async () => {
    const { service, fileApi } = createService({ fileApi: { filename: "schema.eds" } });

    await service.saveDocument(false);

    expect(fileApi.save).toHaveBeenCalledTimes(1);
    expect(fileApi.saveAs).not.toHaveBeenCalled();
    expect((fileApi.save as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatch(/^EDS0060000/);
  });

  it("uses the download fallback without the File System Access API", async () => {
    const { service, structure, fileApi, manualSaver, downloadFallback } = createService({
      fileApiAvailable: false,
    });

    await service.saveDocument(true);

    expect(downloadFallback).toHaveBeenCalledTimes(1);
    expect(downloadFallback.mock.calls[0][1]).toBe(structure.properties.filename);
    expect(fileApi.save).not.toHaveBeenCalled();
    expect(fileApi.saveAs).not.toHaveBeenCalled();
    expect(manualSaver.saveManually).toHaveBeenCalledTimes(1);
  });

  it("does not mark a manual save when the file picker is dismissed", async () => {
    const abortError = Object.assign(new Error("dismissed"), { name: "AbortError" });
    const { service, manualSaver, afterExport } = createService({
      fileApi: { saveAs: vi.fn(async () => { throw abortError; }) },
    });

    await expect(service.saveDocument(true)).rejects.toThrow("dismissed");
    expect(manualSaver.saveManually).not.toHaveBeenCalled();
    expect(afterExport).not.toHaveBeenCalled();
  });

  it("respects the disable-compression preference", async () => {
    const { service, structure, fileApi } = createService({ fileApi: { filename: "schema.eds" } });
    structure.properties.disableEDSCompression = true;

    await service.saveDocument(false);

    expect((fileApi.save as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatch(/^TXT0060000/);
    expect(service.getState().compressionDisabled).toBe(true);
  });
});
