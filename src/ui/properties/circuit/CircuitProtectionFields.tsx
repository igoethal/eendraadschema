import { DraftTextField } from "../DraftTextField";
import { optionalPositiveNumber } from "../fieldValidation";
import { CheckboxField, SelectField } from "../PropertyFields";
import type { CircuitSectionProps } from "./CircuitSectionProps";
import {
  breakerCurveOptions,
  controlOptions,
  differentialTypeOptions,
  nameModeOptions,
  phaseOptions,
  poleCountOptions,
  protectionOptions,
} from "./circuitOptions";
import { propertyStyles } from "../../uiStyles";

export function CircuitProtectionFields({ properties, update }: CircuitSectionProps) {
  const showsPolesAndAmperage = !["geen", "relais"].includes(properties.protection);
  const showsDifferential = ["differentieel", "differentieelautomaat"].includes(properties.protection);
  const showsCurve = ["automatisch", "differentieelautomaat"].includes(properties.protection);
  const showsPhase = ["automatisch", "differentieel", "differentieelautomaat", "smelt"].includes(properties.protection);
  const showsShortCircuit = ["automatisch", "differentieel", "differentieelautomaat"].includes(properties.protection);

  return (
    <fieldset className={propertyStyles.fieldset}>
      <legend>Kring</legend>
      <SelectField label="Naamgeving" value={properties.nameMode} options={nameModeOptions} onChange={(nameMode) => update({ nameMode })} />
      <DraftTextField key={`name:${properties.name}`} label="Naam" value={properties.name} disabled={properties.nameMode === "auto"} onCommit={(name) => update({ name })} />
      <SelectField label="Bescherming" value={properties.protection} options={protectionOptions} onChange={(protection) => update({ protection })} />
      {showsPolesAndAmperage ? (
        <div className={propertyStyles.row}>
          <SelectField label="Aantal polen" value={properties.poleCount} options={poleCountOptions} onChange={(poleCount) => update({ poleCount })} />
          <DraftTextField key={`amperage:${properties.amperage}`} label="Stroom (A)" value={properties.amperage} inputMode="decimal" validate={optionalPositiveNumber} onCommit={(amperage) => update({ amperage })} />
        </div>
      ) : null}
      {showsDifferential ? (
        <div className={propertyStyles.row}>
          <DraftTextField key={`differential:${properties.differentialCurrent}`} label="Differentieelstroom (mA)" value={properties.differentialCurrent} inputMode="decimal" validate={optionalPositiveNumber} onCommit={(differentialCurrent) => update({ differentialCurrent })} />
          <SelectField label="Type differentieel" value={properties.differentialType} options={differentialTypeOptions} onChange={(differentialType) => update({ differentialType })} />
        </div>
      ) : null}
      {showsCurve ? <SelectField label="Curve automaat" value={properties.breakerCurve} options={breakerCurveOptions} onChange={(breakerCurve) => update({ breakerCurve })} /> : null}
      {showsShortCircuit ? <DraftTextField key={`short-circuit:${properties.shortCircuitRating}`} label="Kortsluitvermogen (kA)" value={properties.shortCircuitRating} inputMode="decimal" validate={optionalPositiveNumber} onCommit={(shortCircuitRating) => update({ shortCircuitRating })} /> : null}
      {showsDifferential ? <CheckboxField label="Selectieve differentieel" checked={properties.selectiveDifferential} onChange={(selectiveDifferential) => update({ selectiveDifferential })} /> : null}
      {showsPhase ? <SelectField label="Fase" value={properties.phase} options={phaseOptions} onChange={(phase) => update({ phase })} /> : null}
      {["contact", "zekeringscheider"].includes(properties.protection) ? <CheckboxField label="Normaal gesloten" checked={properties.normallyClosed} onChange={(normallyClosed) => update({ normallyClosed })} /> : null}
      {properties.protection === "contact" ? <SelectField label="Sturing" value={properties.control} options={controlOptions} onChange={(control) => update({ control })} /> : null}
    </fieldset>
  );
}
