import type { SocketPropertyChanges } from "../../../application/SchemaPropertyReader";
import { DraftTextField } from "../DraftTextField";
import type { ItemEditorProps } from "../ItemEditorProps";
import { CheckboxField, SelectField } from "../PropertyFields";
import {
  socketNumberModeOptions,
  socketOutletCountOptions,
  socketPhaseCountOptions,
} from "./socketOptions";
import { useSchemaSnapshot } from "../../useSchemaSnapshot";
import { propertyStyles } from "../../uiStyles";

export function SocketPropertiesEditor({ itemId, schemaStore }: ItemEditorProps) {
  const properties = useSchemaSnapshot(schemaStore).properties.getSocket(itemId);
  if (properties === undefined) return null;

  function update(changes: SocketPropertyChanges): void {
    schemaStore.commands.updateSocket(itemId, changes);
  }

  return (
    <form className={propertyStyles.form} onSubmit={(event) => event.preventDefault()}>
      <fieldset className={propertyStyles.fieldset}>
        <legend>Contactdoos</legend>
        {properties.canEditNumber ? (
          <div className={propertyStyles.row}>
            <SelectField
              label="Nummering"
              value={properties.numberMode}
              options={socketNumberModeOptions}
              onChange={(numberMode) => update({ numberMode })}
            />
            <DraftTextField
              key={`number:${properties.number}`}
              label="Nummer"
              value={properties.number}
              disabled={properties.numberMode === "auto"}
              onCommit={(number) => update({ number })}
            />
          </div>
        ) : null}
        <SelectField
          label="Aantal contactdozen"
          value={properties.outletCount}
          options={socketOutletCountOptions}
          onChange={(outletCount) => update({ outletCount })}
        />
        <CheckboxField label="Geaard" checked={properties.grounded} onChange={(grounded) => update({ grounded })} />
        <CheckboxField label="Kinderveilig" checked={properties.childSafe} onChange={(childSafe) => update({ childSafe })} />
        <DraftTextField
          key={`address:${properties.address}`}
          label="Adres of tekst"
          value={properties.address}
          onCommit={(address) => update({ address })}
        />
      </fieldset>

      <details className={propertyStyles.advanced}>
        <summary>Geavanceerde instellingen</summary>
        <CheckboxField label="Halfwaterdicht" checked={properties.splashProof} onChange={(splashProof) => update({ splashProof })} />
        <CheckboxField label="Meerfasig" checked={properties.multiPhase} onChange={(multiPhase) => update({ multiPhase })} />
        {properties.multiPhase ? (
          <div className={propertyStyles.row}>
            <SelectField
              label="Aantal fasen"
              value={properties.phaseCount}
              options={socketPhaseCountOptions}
              onChange={(phaseCount) => update({ phaseCount })}
            />
            <CheckboxField label="Met nul" checked={properties.hasNeutral} onChange={(hasNeutral) => update({ hasNeutral })} />
          </div>
        ) : null}
        <CheckboxField label="Ingebouwde schakelaar" checked={properties.builtInSwitch} onChange={(builtInSwitch) => update({ builtInSwitch })} />
        <CheckboxField label="In verdeelbord" checked={properties.inDistributionBoard} onChange={(inDistributionBoard) => update({ inDistributionBoard })} />
      </details>
    </form>
  );
}
