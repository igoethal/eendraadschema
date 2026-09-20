import type { Hierarchical_List } from "../Hierarchical_List";
import { encodeEds, wrapCurrentEdsPayload } from "../legacy/persistence/EdsCodec";

/** Structural subset of the legacy importExportUsingFileAPI object. */
export interface FileApiAdapter {
  filename: string | null;
  lastsaved: string;
  readFile(): Promise<string>;
  save(content: string): Promise<void>;
  saveAs(content: string): Promise<void>;
}

export interface ManualSaver {
  saveManually(text: string): void;
}

export interface FileServiceState {
  readonly filename: string;
  readonly fileApiAvailable: boolean;
  readonly hasOpenFile: boolean;
  readonly lastSavedAt: string | null;
  readonly compressionDisabled: boolean;
}

export interface FileServiceDependencies {
  readonly getDocument: () => Hierarchical_List;
  readonly getFileApi: () => FileApiAdapter;
  readonly isFileApiAvailable: () => boolean;
  readonly getManualSaver: () => ManualSaver | undefined;
  /** Browser download fallback when the File System Access API is missing. */
  readonly downloadFallback: (content: string, filename: string) => void;
  /** Post-export hook (deployment-specific upload of the exported payload). */
  readonly afterExport?: (payload: string) => void;
}

export interface FileService {
  getState(): FileServiceState;
  openDocumentText(): Promise<string>;
  saveDocument(saveAs: boolean): Promise<void>;
}

/** React-facing adapter for opening and saving EDS documents. It preserves
 *  the File System Access flow, the plain-download fallback and the manual
 *  autosave bookkeeping the legacy file page performs. */
export class LegacyFileService implements FileService {
  constructor(private readonly deps: FileServiceDependencies) {}

  getState(): FileServiceState {
    const document = this.deps.getDocument();
    const fileApi = this.deps.getFileApi();
    const fileApiAvailable = this.deps.isFileApiAvailable();
    return {
      filename: document.properties.filename,
      fileApiAvailable,
      hasOpenFile: fileApiAvailable && fileApi.filename !== null,
      lastSavedAt: fileApiAvailable ? fileApi.lastsaved ?? null : null,
      compressionDisabled: document.properties.disableEDSCompression === true,
    };
  }

  /** Read a document through the File System Access API. The caller decides
   *  what to do with the text (usually EDStoStructure). */
  async openDocumentText(): Promise<string> {
    return this.deps.getFileApi().readFile();
  }

  /** Encode and save the current document. `saveAs` forces a file picker;
   *  without an open file handle it is forced regardless. */
  async saveDocument(saveAs: boolean): Promise<void> {
    const document = this.deps.getDocument();
    const jsonText = document.toJsonObject(true);
    const payload = encodeEds(jsonText, document.properties.disableEDSCompression === true);
    // The autosave comparison format is always uncompressed TXT.
    const autosaveText = wrapCurrentEdsPayload("TXT", jsonText);

    if (this.deps.isFileApiAvailable()) {
      const fileApi = this.deps.getFileApi();
      const mustPickFile = saveAs || fileApi.filename == null;
      if (mustPickFile) {
        await fileApi.saveAs(payload);
      } else {
        await fileApi.save(payload);
      }
      this.deps.getManualSaver()?.saveManually(autosaveText);
    } else {
      this.deps.downloadFallback(payload, document.properties.filename);
      this.deps.getManualSaver()?.saveManually(autosaveText);
    }

    this.deps.afterExport?.(payload);
  }
}
