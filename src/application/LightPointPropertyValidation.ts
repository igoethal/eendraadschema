import { SchemaCommandError } from "./SchemaStore";
import {
  EMERGENCY_LIGHTING_TYPES,
  LIGHT_POINT_COUNTS,
  LIGHT_POINT_TUBE_COUNTS,
  LIGHT_POINT_TYPES,
  SOCKET_NUMBER_MODES,
  type LightPointPropertyChanges,
} from "./SchemaPropertyReader";

const legacyKeys = Object.freeze({
  numberMode: "autonr",
  number: "nr",
  lampType: "type_lamp",
  tubeCount: "aantal_buizen_indien_TL",
  count: "aantal",
  wallLight: "is_wandlamp",
  splashProof: "is_halfwaterdicht",
  builtInSwitch: "heeft_ingebouwde_schakelaar",
  emergencyLighting: "type_noodverlichting",
  address: "adres",
} satisfies Readonly<Record<keyof LightPointPropertyChanges, string>>);

const options: Readonly<Partial<Record<keyof LightPointPropertyChanges, ReadonlySet<string>>>> = {
  numberMode: new Set(SOCKET_NUMBER_MODES),
  lampType: new Set(LIGHT_POINT_TYPES),
  tubeCount: new Set(LIGHT_POINT_TUBE_COUNTS),
  count: new Set(LIGHT_POINT_COUNTS),
  emergencyLighting: new Set(EMERGENCY_LIGHTING_TYPES),
};
const textKeys = new Set<keyof LightPointPropertyChanges>(["number", "address"]);
const booleanKeys = new Set<keyof LightPointPropertyChanges>([
  "wallLight", "splashProof", "builtInSwitch",
]);

export function validateAndMapLightPointChanges(
  changes: Readonly<LightPointPropertyChanges>,
): Readonly<Record<string, unknown>> {
  const mapped: Record<string, unknown> = {};
  for (const [runtimeKey, value] of Object.entries(changes)) {
    if (!Object.prototype.hasOwnProperty.call(legacyKeys, runtimeKey)) {
      throw new SchemaCommandError("INVALID_CHANGE", `Onbekende lichtpunteigenschap '${runtimeKey}'.`);
    }
    const key = runtimeKey as keyof LightPointPropertyChanges;
    if (options[key] !== undefined) {
      if (typeof value !== "string" || !options[key]!.has(value)) {
        throw new SchemaCommandError("INVALID_CHANGE", `Ongeldige keuze voor '${runtimeKey}'.`);
      }
    } else if (textKeys.has(key)) {
      if (typeof value !== "string") throw new SchemaCommandError("INVALID_CHANGE", `Tekst verwacht voor '${runtimeKey}'.`);
    } else if (booleanKeys.has(key)) {
      if (typeof value !== "boolean") throw new SchemaCommandError("INVALID_CHANGE", `Ja/nee verwacht voor '${runtimeKey}'.`);
    }
    mapped[legacyKeys[key]] = value;
  }
  return Object.freeze(mapped);
}
