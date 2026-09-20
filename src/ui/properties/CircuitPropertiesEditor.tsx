import type { CircuitPropertyChanges } from "../../application/SchemaPropertyReader";
import type { ItemEditorProps } from "./ItemEditorProps";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { CircuitAdvancedFields } from "./circuit/CircuitAdvancedFields";
import { CircuitCableFields } from "./circuit/CircuitCableFields";
import { CircuitProtectionFields } from "./circuit/CircuitProtectionFields";
import { propertyStyles } from "../uiStyles";

export function CircuitPropertiesEditor({ itemId, schemaStore }: ItemEditorProps) {
  const properties = useSchemaSnapshot(schemaStore).properties.getCircuit(itemId);
  if (properties === undefined) return null;

  function update(changes: CircuitPropertyChanges): void {
    schemaStore.commands.updateCircuit(itemId, changes);
  }

  return (
    <form className={propertyStyles.form} onSubmit={(event) => event.preventDefault()}>
      <CircuitProtectionFields properties={properties} update={update} />
      <CircuitCableFields properties={properties} update={update} />
      <CircuitAdvancedFields properties={properties} update={update} />
    </form>
  );
}
