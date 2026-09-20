import { SchemaCommandError } from "./SchemaStore";
import {
  BASIC_CONSUMER_TYPES,
  SOCKET_NUMBER_MODES,
  type BasicConsumerPropertyChanges,
} from "./SchemaPropertyReader";

export const basicConsumerTypes: ReadonlySet<string> = new Set(BASIC_CONSUMER_TYPES);

const legacyKeys = Object.freeze({
  numberMode: "autonr",
  number: "nr",
  address: "adres",
} satisfies Readonly<Record<keyof BasicConsumerPropertyChanges, string>>);

export function validateAndMapBasicConsumerChanges(
  changes: Readonly<BasicConsumerPropertyChanges>,
): Readonly<Record<string, unknown>> {
  const legacyChanges: Record<string, unknown> = {};
  for (const [runtimeKey, value] of Object.entries(changes)) {
    if (!Object.prototype.hasOwnProperty.call(legacyKeys, runtimeKey)) {
      throw new SchemaCommandError("INVALID_CHANGE", `Onbekende basiseigenschap '${runtimeKey}'.`);
    }
    const key = runtimeKey as keyof BasicConsumerPropertyChanges;
    if (key === "numberMode") {
      if (typeof value !== "string" || !SOCKET_NUMBER_MODES.includes(value as "auto" | "manueel")) {
        throw new SchemaCommandError("INVALID_CHANGE", "Nummering moet automatisch of manueel zijn.");
      }
    } else if (typeof value !== "string") {
      throw new SchemaCommandError("INVALID_CHANGE", `Eigenschap '${runtimeKey}' moet tekst zijn.`);
    }
    legacyChanges[legacyKeys[key]] = value;
  }
  return Object.freeze(legacyChanges);
}
