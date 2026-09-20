import { DraftTextField } from "../DraftTextField";
import { CheckboxField } from "../PropertyFields";
import type { CircuitSectionProps } from "./CircuitSectionProps";
import { propertyStyles } from "../../uiStyles";

export function CircuitAdvancedFields({ properties, update }: CircuitSectionProps) {
  const showsShortCircuit = ["automatisch", "differentieel", "differentieelautomaat"].includes(properties.protection);
  return (
    <details className={propertyStyles.advanced}>
      <summary>Geavanceerde instellingen</summary>
      {properties.shortCircuitRating !== "" && showsShortCircuit ? <CheckboxField label="Huishoudelijke installatie" checked={properties.residential} onChange={(residential) => update({ residential })} /> : null}
      <DraftTextField key={`text:${properties.text}`} label="Tekst" value={properties.text} onCommit={(text) => update({ text })} />
      <DraftTextField key={`address:${properties.address}`} label="Adres" value={properties.address} onCommit={(address) => update({ address })} />
      {properties.canStartNewPage ? <CheckboxField label="Start op nieuwe pagina" checked={properties.startsNewPage} onChange={(startsNewPage) => update({ startsNewPage })} /> : null}
    </details>
  );
}
