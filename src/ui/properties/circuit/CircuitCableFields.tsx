import { DraftTextField } from "../DraftTextField";
import { CheckboxField, SelectField } from "../PropertyFields";
import type { CircuitSectionProps } from "./CircuitSectionProps";
import { cableLocationOptions } from "./circuitOptions";
import { propertyStyles } from "../../uiStyles";

export function CircuitCableFields({ properties, update }: CircuitSectionProps) {
  return (
    <fieldset className={propertyStyles.fieldset}>
      <legend>Voedingskabel</legend>
      <CheckboxField label="Kabel aanwezig" checked={properties.hasCable} onChange={(hasCable) => update({ hasCable })} />
      {properties.hasCable ? (
        <>
          <DraftTextField key={`cable:${properties.cableType}`} label="Kabeltype" value={properties.cableType} onCommit={(cableType) => update({ cableType })} />
          <SelectField label="Plaatsing" value={properties.cableLocation} options={cableLocationOptions} onChange={(cableLocation) => update({ cableLocation })} />
          {properties.cableLocation !== "Luchtleiding" ? <CheckboxField label="In buis" checked={properties.cableInConduit} onChange={(cableInConduit) => update({ cableInConduit })} /> : null}
        </>
      ) : null}
    </fieldset>
  );
}
