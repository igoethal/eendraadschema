import {
  CONFIGURED_ITEM_PROPERTY_SCHEMAS,
  type ConfiguredItemProperties,
  type ConfiguredPropertyValue,
} from "../../../application/ConfiguredItemProperties";
import { DraftTextField } from "../DraftTextField";
import type { ItemEditorProps } from "../ItemEditorProps";
import { CheckboxField, SelectField, type PropertyOption } from "../PropertyFields";
import {
  configuredItemEditorConfigs,
  type ConfiguredEditorField,
} from "./configuredItemEditorConfig";
import { useSchemaSnapshot } from "../../useSchemaSnapshot";
import { propertyStyles } from "../../uiStyles";

function optionLabel(value: string): string {
  const labels: Readonly<Record<string, string>> = {
    "": "Geen",
    standaard: "Standaard",
    blokbatterij: "Blokbatterij",
    luidspreker: "Luidspreker",
    intercom: "Intercom",
    ventilator: "Ventilator",
    afzuigkap: "Afzuigkap",
    driehoek: "Driehoek",
    pijltjes: "Pijltjes",
    auto: "Automatisch",
    manueel: "Manueel",
  };
  return labels[value] ?? value;
}

function ConfiguredField({
  field,
  properties,
  update,
}: {
  readonly field: ConfiguredEditorField;
  readonly properties: ConfiguredItemProperties;
  readonly update: (key: string, value: ConfiguredPropertyValue) => void;
}) {
  const definition = CONFIGURED_ITEM_PROPERTY_SCHEMAS[properties.type].fields[field.key];
  const value = properties.values[field.key];
  if (definition === undefined || value === undefined) return null;

  if (definition.kind === "boolean") {
    return <CheckboxField label={field.label} checked={value === true} onChange={(checked) => update(field.key, checked)} />;
  }
  if (definition.kind === "select") {
    const allowedOptions = field.options?.(properties, definition.options ?? []) ?? definition.options ?? [];
    const options: ReadonlyArray<PropertyOption<string>> = allowedOptions.map(
      (option) => [option, optionLabel(option)],
    );
    return <SelectField label={field.label} value={String(value)} options={options} onChange={(selected) => update(field.key, selected)} />;
  }
  return (
    <DraftTextField
      key={`${field.key}:${String(value)}`}
      label={field.label}
      value={String(value)}
      disabled={field.key === "number" && properties.values.numberMode === "auto"}
      onCommit={(text) => update(field.key, text)}
    />
  );
}

export function ConfiguredItemPropertiesEditor({ itemId, schemaStore }: ItemEditorProps) {
  const properties = useSchemaSnapshot(schemaStore).properties.getConfiguredItem(itemId);
  if (properties === undefined) return null;
  const config = configuredItemEditorConfigs[properties.type];
  if (config === undefined) return null;

  const visibleFields = config.fields.filter((field) => field.visible?.(properties) ?? true);
  const commonFields = visibleFields.filter((field) => field.advanced !== true);
  const advancedFields = visibleFields.filter((field) => field.advanced === true);
  const update = (key: string, value: ConfiguredPropertyValue) => {
    schemaStore.commands.updateConfiguredItem(itemId, { [key]: value });
  };

  return (
    <form className={propertyStyles.form} onSubmit={(event) => event.preventDefault()}>
      <fieldset className={propertyStyles.fieldset}>
        <legend>{properties.type}</legend>
        {commonFields.length === 0 ? <p>Dit item heeft geen bewerkbare eigenschappen.</p> : null}
        {commonFields.map((field) => (
          <ConfiguredField key={field.key} field={field} properties={properties} update={update} />
        ))}
      </fieldset>
      {advancedFields.length > 0 ? (
        <details className={propertyStyles.advanced}>
          <summary>Geavanceerde instellingen</summary>
          {advancedFields.map((field) => (
            <ConfiguredField key={field.key} field={field} properties={properties} update={update} />
          ))}
        </details>
      ) : null}
    </form>
  );
}
