import {
  CONFIGURED_ITEM_PROPERTY_SCHEMAS,
  type ConfiguredItemPropertyChanges,
} from "./ConfiguredItemProperties";
import { SchemaCommandError } from "./SchemaStore";

export function validateAndMapConfiguredItemChanges(
  type: string,
  changes: ConfiguredItemPropertyChanges,
): Readonly<Record<string, unknown>> {
  const itemSchema = CONFIGURED_ITEM_PROPERTY_SCHEMAS[type];
  if (itemSchema === undefined) {
    throw new SchemaCommandError("INVALID_CHANGE", `Itemtype '${type}' heeft geen geconfigureerde eigenschappen.`);
  }

  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(changes)) {
    const field = itemSchema.fields[key];
    if (field === undefined) {
      throw new SchemaCommandError("INVALID_CHANGE", `Onbekende eigenschap '${key}' voor '${type}'.`);
    }
    if (field.kind === "boolean") {
      if (typeof value !== "boolean") {
        throw new SchemaCommandError("INVALID_CHANGE", `Ja/nee verwacht voor '${key}'.`);
      }
    } else {
      if (typeof value !== "string") {
        throw new SchemaCommandError("INVALID_CHANGE", `Tekst verwacht voor '${key}'.`);
      }
      if (field.kind === "select" && !field.options?.includes(value)) {
        throw new SchemaCommandError("INVALID_CHANGE", `Ongeldige keuze voor '${key}'.`);
      }
    }
    mapped[field.legacyKey] = value;
  }
  return Object.freeze(mapped);
}
