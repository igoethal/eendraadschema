import {
  EMERGENCY_LIGHTING_TYPES,
  LIGHT_POINT_COUNTS,
  LIGHT_POINT_TUBE_COUNTS,
  LIGHT_POINT_TYPES,
  type LightPointPropertyChanges,
} from "../../../application/SchemaPropertyReader";
import { DraftTextField } from "../DraftTextField";
import type { ItemEditorProps } from "../ItemEditorProps";
import { CheckboxField, SelectField, type PropertyOption } from "../PropertyFields";
import { socketNumberModeOptions } from "../socket/socketOptions";
import { useSchemaSnapshot } from "../../useSchemaSnapshot";
import { propertyStyles } from "../../uiStyles";

function options<Value extends string>(values: readonly Value[]): ReadonlyArray<PropertyOption<Value>> {
  return values.map((value) => [value, value]);
}

const lampTypeOptions = options(LIGHT_POINT_TYPES);
const tubeCountOptions = options(LIGHT_POINT_TUBE_COUNTS);
const lightCountOptions = options(LIGHT_POINT_COUNTS);
const emergencyOptions = options(EMERGENCY_LIGHTING_TYPES);

export function LightPointPropertiesEditor({ itemId, schemaStore }: ItemEditorProps) {
  const properties = useSchemaSnapshot(schemaStore).properties.getLightPoint(itemId);
  if (properties === undefined) return null;
  const update = (changes: LightPointPropertyChanges) => schemaStore.commands.updateLightPoint(itemId, changes);

  return (
    <form className={propertyStyles.form} onSubmit={(event) => event.preventDefault()}>
      <fieldset className={propertyStyles.fieldset}>
        <legend>Lichtpunt</legend>
        {properties.canEditNumber ? (
          <div className={propertyStyles.row}>
            <SelectField label="Nummering" value={properties.numberMode} options={socketNumberModeOptions} onChange={(numberMode) => update({ numberMode })} />
            <DraftTextField key={`number:${properties.number}`} label="Nummer" value={properties.number} disabled={properties.numberMode === "auto"} onCommit={(number) => update({ number })} />
          </div>
        ) : null}
        <SelectField label="Lamptype" value={properties.lampType} options={lampTypeOptions} onChange={(lampType) => update({ lampType })} />
        {properties.lampType === "TL" ? <SelectField label="Aantal buizen" value={properties.tubeCount} options={tubeCountOptions} onChange={(tubeCount) => update({ tubeCount })} /> : null}
        <SelectField label="Aantal lampen" value={properties.count} options={lightCountOptions} onChange={(count) => update({ count })} />
        <DraftTextField key={`address:${properties.address}`} label="Adres of tekst" value={properties.address} onCommit={(address) => update({ address })} />
      </fieldset>
      <details className={propertyStyles.advanced}>
        <summary>Geavanceerde instellingen</summary>
        <CheckboxField label="Wandlamp" checked={properties.wallLight} onChange={(wallLight) => update({ wallLight })} />
        <CheckboxField label="Halfwaterdicht" checked={properties.splashProof} onChange={(splashProof) => update({ splashProof })} />
        <CheckboxField label="Ingebouwde schakelaar" checked={properties.builtInSwitch} onChange={(builtInSwitch) => update({ builtInSwitch })} />
        <SelectField label="Noodverlichting" value={properties.emergencyLighting} options={emergencyOptions} onChange={(emergencyLighting) => update({ emergencyLighting })} />
      </details>
    </form>
  );
}
