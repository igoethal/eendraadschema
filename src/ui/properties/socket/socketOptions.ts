import type {
  SocketNumberMode,
  SocketOutletCount,
  SocketPhaseCount,
} from "../../../application/SchemaPropertyReader";
import type { PropertyOption } from "../PropertyFields";

export const socketNumberModeOptions = [
  ["auto", "Automatisch"], ["manueel", "Manueel"],
] as const satisfies ReadonlyArray<PropertyOption<SocketNumberMode>>;

export const socketOutletCountOptions = [
  ["1", "1"], ["2", "2"], ["3", "3"],
  ["4", "4"], ["5", "5"], ["6", "6"],
] as const satisfies ReadonlyArray<PropertyOption<SocketOutletCount>>;

export const socketPhaseCountOptions = [
  ["1", "1"], ["2", "2"], ["3", "3"],
] as const satisfies ReadonlyArray<PropertyOption<SocketPhaseCount>>;
