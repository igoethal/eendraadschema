import { Hierarchical_List } from "../../Hierarchical_List";
import { Electro_Item } from "../../List_Item/Electro_Item";
import { SituationPlan } from "../../sitplan/SituationPlan";
import { parseDossierMetadata, parsePlacementTasks } from "../../domain/Dossier";
import { parseDistributionBoards, type DistributionBoard } from "../../domain/DistributionBoard";
import { parseBoardLayouts, type BoardLayout } from "../../domain/BoardLayout";

export interface DecodedEds {
  readonly text: string;
  readonly version: number;
}

export const CURRENT_EDS_VERSION = 6;

export function wrapCurrentEdsPayload(format: "EDS" | "TXT", payload: string): string {
  return `${format}${String(CURRENT_EDS_VERSION).padStart(3, "0")}0000${payload}`;
}

type LegacyStructure = {
  length: number;
  data: any[];
  active: boolean[];
  id: number[];
  curid: number;
  properties?: any;
  print_table?: any;
  sitplanjson?: any;
  boards?: DistributionBoard[];
  placementTasks?: unknown;
  boardLayouts?: BoardLayout[];
};

type Inflate = (input: Uint8Array) => Uint8Array;
type Deflate = (input: Uint8Array) => Uint8Array;

function defaultInflate(input: Uint8Array): Uint8Array {
  const globalPako = (globalThis as typeof globalThis & {
    pako?: { inflate(value: Uint8Array): Uint8Array };
  }).pako;
  if (!globalPako) throw new Error("Pako is niet beschikbaar om het EDS-bestand te decomprimeren.");
  return globalPako.inflate(input);
}

function defaultDeflate(input: Uint8Array): Uint8Array {
  const globalPako = (globalThis as typeof globalThis & {
    pako?: { deflate(value: Uint8Array): Uint8Array };
  }).pako;
  if (!globalPako) throw new Error("Pako is niet beschikbaar om het EDS-bestand te comprimeren.");
  return globalPako.deflate(input);
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  const CHUNK_SIZE = 0x8000; // Verwerk 32KB chunks
  let binaryString = "";
  for (let index = 0; index < uint8Array.length; index += CHUNK_SIZE) {
    binaryString += String.fromCharCode.apply(
      null,
      uint8Array.subarray(index, index + CHUNK_SIZE),
    );
  }
  return btoa(binaryString);
}

/** Encode a serialized document as an EDS payload: compressed and Base64
 *  wrapped when possible, with a fallback to the uncompressed TXT format. */
export function encodeEds(
  jsonText: string,
  disableCompression = false,
  deflate: Deflate = defaultDeflate,
): string {
  if (!disableCompression) {
    try {
      const deflated = deflate(new TextEncoder().encode(jsonText));
      return wrapCurrentEdsPayload("EDS", uint8ArrayToBase64(deflated));
    } catch (error) {
      console.log("Terugvallen naar TXT-uitvoer vanwege compressiefout: " + error);
    }
  }
  return wrapCurrentEdsPayload("TXT", jsonText);
}

export function upgradeVersion(structure: LegacyStructure, version: number): void {
  if (
    version === 1
    && structure.length > 0
    && structure.data[0].keys === undefined
    && structure.data[0].props !== undefined
  ) {
    version = 3;
  }

  if (version < 2) {
    for (let index = 0; index < structure.length; index += 1) {
      const keys = structure.data[index].keys;
      if (keys[0][2] === "Vrije tekst" && keys[16][2] !== "verbruiker") {
        if (Number(keys[22][2]) > 0) keys[22][2] = String(Number(keys[22][2]) + 30);
        else keys[18][2] = "automatisch";
        if (keys[16][2] !== "zonder kader") keys[16][2] = "verbruiker";
      }
    }
  }

  if (version < 3) {
    for (let index = 0; index < structure.length; index += 1) {
      if (structure.data[index].keys[0][2] === "Stopcontact") {
        structure.data[index].keys[0][2] = "Contactdoos";
      }
      if (structure.data[index].keys[0][2] === "Leeg") {
        structure.data[index].keys[0][2] = "Aansluitpunt";
      }
    }
  }

  if (version === 3) {
    for (let index = 0; index < structure.length; index += 1) {
      if (structure.data[index].props.type === "Stopcontact") {
        structure.data[index].props.type = "Contactdoos";
      }
    }
  }

  if (version < 4) {
    if (version < 3) {
      for (let index = 0; index < structure.length; index += 1) {
        const keys = structure.data[index].keys;
        if (keys[0][2] === "Bord" && keys[10][2] !== "") keys[10][2] = `<${keys[10][2]}>`;
      }
    } else {
      for (let index = 0; index < structure.length; index += 1) {
        const props = structure.data[index].props;
        if (props.type === "Bord" && props.naam !== "") props.naam = `<${props.naam}>`;
      }
    }
  }

  if (version >= 3 && version <= 4) {
    for (let index = 0; index < structure.length; index += 1) {
      if (structure.data[index].props.type === "Leeg") {
        structure.data[index].props.type = "Aansluitpunt";
      }
    }
  }
}

export function structureFromJson(
  text: string,
  oldStructure: Hierarchical_List | null = null,
  version: number = 0,
): Hierarchical_List {
  if (oldStructure !== null) oldStructure.dispose();

  const input = JSON.parse(text) as LegacyStructure;
  if (version !== 0) upgradeVersion(input, version);

  const output = new Hierarchical_List();
  if (input.properties !== undefined) {
    if (input.properties.filename !== undefined) output.properties.filename = input.properties.filename;
    if (input.properties.owner !== undefined) output.properties.owner = input.properties.owner;
    if (input.properties.control !== undefined) output.properties.control = input.properties.control;
    if (input.properties.installer !== undefined) output.properties.installer = input.properties.installer;
    if (input.properties.info !== undefined) output.properties.info = input.properties.info;
    if (input.properties.dpi !== undefined) output.properties.dpi = input.properties.dpi;
    if (input.properties.currentView !== undefined) output.properties.currentView = input.properties.currentView;
    if (input.properties.disableEDSCompression !== undefined) {
      output.properties.disableEDSCompression = input.properties.disableEDSCompression;
    }
    output.properties.legacySchakelaars = input.properties.legacySchakelaars ?? null;
    output.properties.dossier = parseDossierMetadata(input.properties.dossier);
  }

  if (input.print_table !== undefined) {
    output.print_table.setHeight(input.print_table.height);
    output.print_table.setMaxWidth(input.print_table.maxwidth);
    output.print_table.setPaperSize(input.print_table.papersize);
    output.print_table.setModeVertical(input.print_table.modevertical);
    output.print_table.setstarty(input.print_table.starty);
    output.print_table.setstopy(input.print_table.stopy);
    output.print_table.enableAutopage = input.print_table.enableAutopage ?? false;
    output.print_table.includeBoardLayout = input.print_table.includeBoardLayout ?? false;

    for (let index = 0; index < input.print_table.pages.length; index += 1) {
      if (index !== 0) output.print_table.addPage();
      output.print_table.pages[index].height = input.print_table.pages[index].height;
      output.print_table.pages[index].start = input.print_table.pages[index].start;
      output.print_table.pages[index].stop = input.print_table.pages[index].stop;
      if (input.print_table.pages[index].info !== null) {
        output.print_table.pages[index].info = input.print_table.pages[index].info;
      }
    }
  }

  if (input.sitplanjson !== undefined) {
    output.sitplan = new SituationPlan(output);
    output.sitplan.fromJsonObject(input.sitplanjson);
  }

  for (let index = 0; index < input.length; index += 1) {
    if (version !== 0 && version < 3) {
      output.addItem(input.data[index].keys[0][2]);
      (output.data[index] as Electro_Item).convertLegacyKeys(input.data[index].keys);
      output.data[index].props.autoKringNaam = "manueel";
      output.data[index].props.autonr = "manueel";
    } else {
      output.addItem(input.data[index].props.type);
      Object.assign(output.data[index].props, input.data[index].props);

      if (input.data[index].props.type === "Kring" && !input.data[index].props.autoKringNaam) {
        output.data[index].props.autoKringNaam = "manueel";
      }
      if (
        input.data[index].props.nr !== undefined
        && input.data[index].props.nr !== null
        && !input.data[index].props.autonr
      ) {
        output.data[index].props.autonr = "manueel";
      }
      if (input.data[index].props.type === "Batterij" && input.data[index].props.symbool == null) {
        output.data[index].props.symbool = "blokbatterij";
      }
    }

    output.data[index].parent = input.data[index].parent;
    output.active[index] = input.active[index];
    output.id[index] = input.id[index];
    output.data[index].id = input.data[index].id;
    output.data[index].indent = input.data[index].indent;
    output.data[index].collapsed = input.data[index].collapsed;
  }

  output.curid = input.curid;
  output.voegAttributenToeAlsNodigEnReSort();
  const activeRootItemIds = output.data
    .filter((item, index) => output.active[index] && item.parent === 0)
    .map((item) => item.id);
  const activeItemIds = new Set(
    output.data.filter((item, index) => output.active[index]).map((item) => item.id),
  );
  // Drop root references to items that no longer exist so a stale persisted ID
  // degrades gracefully instead of producing validation errors on every load.
  output.boards = parseDistributionBoards(input.boards, activeRootItemIds).map((board) =>
    board.feeder === undefined
      ? board
      : { ...board, rootItemIds: board.rootItemIds.filter((itemId) => activeItemIds.has(itemId)) },
  );
  output.boardLayouts = parseBoardLayouts(
    input.boardLayouts,
    new Set(output.boards.map(board => board.id)),
    activeItemIds,
  );
  output.placementTasks = parsePlacementTasks(input.placementTasks, activeItemIds);
  return output;
}

export function decodeEds(input: string, inflate: Inflate = defaultInflate): DecodedEds {
  if (input.startsWith("EDS")) {
    let version = Number(input.substring(3, 6));
    if (Number.isNaN(version)) version = 1;

    const binary = atob(input.substring(10));
    const compressed = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      compressed[index] = binary.charCodeAt(index);
    }
    const inflated = inflate(compressed);
    try {
      return { text: new TextDecoder("utf-8").decode(inflated), version };
    } catch {
      let text = "";
      for (const byte of inflated) text += String.fromCharCode(byte);
      return { text, version };
    }
  }

  if (input.startsWith("TXT")) {
    let version = Number(input.substring(3, 6));
    if (Number.isNaN(version)) version = 3;
    return { text: input.substring(10), version };
  }

  return { text: input, version: 1 };
}

// Compatibility names used by the existing application and saved-file tests.
export const EDStoJson = decodeEds;
export const json_to_structure = structureFromJson;
