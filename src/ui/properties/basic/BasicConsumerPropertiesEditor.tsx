import type { BasicConsumerPropertyChanges } from "../../../application/SchemaPropertyReader";
import { DraftTextField } from "../DraftTextField";
import type { ItemEditorProps } from "../ItemEditorProps";
import { SelectField } from "../PropertyFields";
import { socketNumberModeOptions } from "../socket/socketOptions";
import { useSchemaSnapshot } from "../../useSchemaSnapshot";
import { propertyStyles } from "../../uiStyles";

export function BasicConsumerPropertiesEditor({ itemId, schemaStore }: ItemEditorProps) {
  const properties = useSchemaSnapshot(schemaStore).properties.getBasicConsumer(itemId);
  if (properties === undefined) return null;

  function update(changes: BasicConsumerPropertyChanges): void {
    schemaStore.commands.updateBasicConsumer(itemId, changes);
  }

  return (
    <form className={propertyStyles.form} onSubmit={(event) => event.preventDefault()}>
      <fieldset className={propertyStyles.fieldset}>
        <legend>{properties.type}</legend>
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
        <DraftTextField
          key={`address:${properties.address}`}
          label="Adres of tekst"
          value={properties.address}
          onCommit={(address) => update({ address })}
        />
      </fieldset>
    </form>
  );
}
