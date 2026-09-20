import { SchemaCommandError } from "./SchemaStore";
import {
  CIRCUIT_BREAKER_CURVES,
  CIRCUIT_CABLE_LOCATIONS,
  CIRCUIT_CONTROLS,
  CIRCUIT_DIFFERENTIAL_TYPES,
  CIRCUIT_NAME_MODES,
  CIRCUIT_PHASES,
  CIRCUIT_POLE_COUNTS,
  CIRCUIT_PROTECTIONS,
  type CircuitPropertyChanges,
} from "./SchemaPropertyReader";

const legacyKeys = Object.freeze({
  nameMode: "autoKringNaam",
  name: "naam",
  protection: "bescherming",
  poleCount: "aantal_polen",
  amperage: "amperage",
  differentialCurrent: "differentieel_delta_amperage",
  differentialType: "type_differentieel",
  breakerCurve: "curve_automaat",
  shortCircuitRating: "kortsluitvermogen",
  selectiveDifferential: "differentieel_is_selectief",
  phase: "fase",
  normallyClosed: "normaalGesloten",
  control: "sturing",
  hasCable: "kabel_is_aanwezig",
  cableType: "type_kabel",
  cableLocation: "kabel_locatie",
  cableInConduit: "kabel_is_in_buis",
  residential: "huishoudelijk",
  address: "adres",
  text: "tekst",
  startsNewPage: "newPage",
} satisfies Readonly<Record<keyof CircuitPropertyChanges, string>>);

const optionValues: Readonly<Partial<Record<keyof CircuitPropertyChanges, ReadonlySet<string>>>> = {
  nameMode: new Set(CIRCUIT_NAME_MODES),
  protection: new Set(CIRCUIT_PROTECTIONS),
  poleCount: new Set(CIRCUIT_POLE_COUNTS),
  differentialType: new Set(CIRCUIT_DIFFERENTIAL_TYPES),
  breakerCurve: new Set(CIRCUIT_BREAKER_CURVES),
  phase: new Set(CIRCUIT_PHASES),
  control: new Set(CIRCUIT_CONTROLS),
  cableLocation: new Set(CIRCUIT_CABLE_LOCATIONS),
};

const freeTextKeys = new Set<keyof CircuitPropertyChanges>([
  "name", "cableType", "address", "text",
]);
const numericTextKeys = new Set<keyof CircuitPropertyChanges>([
  "amperage", "differentialCurrent", "shortCircuitRating",
]);
const booleanKeys = new Set<keyof CircuitPropertyChanges>([
  "selectiveDifferential", "normallyClosed", "hasCable", "cableInConduit",
  "residential", "startsNewPage",
]);

function invalid(key: string, message: string): never {
  throw new SchemaCommandError("INVALID_CHANGE", `Ongeldige kringwaarde voor '${key}': ${message}`);
}

function isOptionalPositiveNumber(value: string): boolean {
  const normalized = value.trim().replace(",", ".");
  return normalized === "" || (Number.isFinite(Number(normalized)) && Number(normalized) > 0);
}

export function validateAndMapCircuitChanges(
  changes: Readonly<CircuitPropertyChanges>,
): Readonly<Record<string, unknown>> {
  const legacyChanges: Record<string, unknown> = {};
  for (const [runtimeKey, value] of Object.entries(changes)) {
    if (!Object.prototype.hasOwnProperty.call(legacyKeys, runtimeKey)) {
      invalid(runtimeKey, "onbekende eigenschap");
    }
    const key = runtimeKey as keyof CircuitPropertyChanges;
    const options = optionValues[key];
    if (options !== undefined) {
      if (typeof value !== "string" || !options.has(value)) invalid(runtimeKey, "niet-toegestane keuze");
    } else if (freeTextKeys.has(key)) {
      if (typeof value !== "string") invalid(runtimeKey, "tekst verwacht");
    } else if (numericTextKeys.has(key)) {
      if (typeof value !== "string" || !isOptionalPositiveNumber(value)) {
        invalid(runtimeKey, "positief getal of lege waarde verwacht");
      }
    } else if (booleanKeys.has(key)) {
      if (typeof value !== "boolean") invalid(runtimeKey, "ja/nee-waarde verwacht");
    } else {
      invalid(runtimeKey, "eigenschap heeft geen validatieregel");
    }
    legacyChanges[legacyKeys[key]] = value;
  }
  return Object.freeze(legacyChanges);
}
