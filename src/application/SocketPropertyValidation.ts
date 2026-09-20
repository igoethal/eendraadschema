import { SchemaCommandError } from "./SchemaStore";
import {
  SOCKET_NUMBER_MODES,
  SOCKET_OUTLET_COUNTS,
  SOCKET_PHASE_COUNTS,
  type SocketPropertyChanges,
} from "./SchemaPropertyReader";

const legacyKeys = Object.freeze({
  numberMode: "autonr",
  number: "nr",
  grounded: "is_geaard",
  childSafe: "is_kinderveilig",
  splashProof: "is_halfwaterdicht",
  multiPhase: "is_meerfasig",
  phaseCount: "aantal_fases_indien_meerfasig",
  hasNeutral: "heeft_nul_indien_meerfasig",
  builtInSwitch: "heeft_ingebouwde_schakelaar",
  outletCount: "aantal",
  inDistributionBoard: "in_verdeelbord",
  address: "adres",
} satisfies Readonly<Record<keyof SocketPropertyChanges, string>>);

const optionValues: Readonly<Partial<Record<keyof SocketPropertyChanges, ReadonlySet<string>>>> = {
  numberMode: new Set(SOCKET_NUMBER_MODES),
  phaseCount: new Set(SOCKET_PHASE_COUNTS),
  outletCount: new Set(SOCKET_OUTLET_COUNTS),
};
const freeTextKeys = new Set<keyof SocketPropertyChanges>(["number", "address"]);
const booleanKeys = new Set<keyof SocketPropertyChanges>([
  "grounded", "childSafe", "splashProof", "multiPhase", "hasNeutral",
  "builtInSwitch", "inDistributionBoard",
]);

function invalid(key: string, message: string): never {
  throw new SchemaCommandError("INVALID_CHANGE", `Ongeldige contactdooswaarde voor '${key}': ${message}`);
}

export function validateAndMapSocketChanges(
  changes: Readonly<SocketPropertyChanges>,
): Readonly<Record<string, unknown>> {
  const legacyChanges: Record<string, unknown> = {};
  for (const [runtimeKey, value] of Object.entries(changes)) {
    if (!Object.prototype.hasOwnProperty.call(legacyKeys, runtimeKey)) {
      invalid(runtimeKey, "onbekende eigenschap");
    }
    const key = runtimeKey as keyof SocketPropertyChanges;
    const options = optionValues[key];
    if (options !== undefined) {
      if (typeof value !== "string" || !options.has(value)) invalid(runtimeKey, "niet-toegestane keuze");
    } else if (freeTextKeys.has(key)) {
      if (typeof value !== "string") invalid(runtimeKey, "tekst verwacht");
    } else if (booleanKeys.has(key)) {
      if (typeof value !== "boolean") invalid(runtimeKey, "ja/nee-waarde verwacht");
    } else {
      invalid(runtimeKey, "eigenschap heeft geen validatieregel");
    }
    legacyChanges[legacyKeys[key]] = value;
  }
  return Object.freeze(legacyChanges);
}
