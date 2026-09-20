import type {
  CircuitBreakerCurve,
  CircuitCableLocation,
  CircuitControl,
  CircuitDifferentialType,
  CircuitNameMode,
  CircuitPhase,
  CircuitPoleCount,
  CircuitProtection,
} from "../../../application/SchemaPropertyReader";
import type { PropertyOption } from "../PropertyFields";

export const nameModeOptions = [
  ["auto", "Automatisch"], ["manueel", "Manueel"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitNameMode>>;

export const protectionOptions = [
  ["automatisch", "Automaat"],
  ["differentieel", "Differentieel"],
  ["differentieelautomaat", "Differentieelautomaat"],
  ["smelt", "Smeltzekering"],
  ["geen", "Geen bescherming"],
  ["contact", "Contact"],
  ["zekeringscheider", "Zekeringscheider"],
  ["relais", "Relais"],
  ["schemer", "Schemerschakelaar"],
  ["overspanningsbeveiliging", "Overspanningsbeveiliging"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitProtection>>;

export const poleCountOptions = [
  ["2", "2"], ["3", "3"], ["4", "4"], ["-", "−"], ["1", "1"], ["", "Niet opgegeven"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitPoleCount>>;

export const differentialTypeOptions = [
  ["", "Niet opgegeven"], ["A", "A"], ["B", "B"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitDifferentialType>>;

export const breakerCurveOptions = [
  ["", "Niet opgegeven"], ["B", "B"], ["C", "C"], ["D", "D"], ["U", "U"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitBreakerCurve>>;

export const phaseOptions = [
  ["", "Niet opgegeven"], ["L1", "L1"], ["L2", "L2"], ["L3", "L3"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitPhase>>;

export const controlOptions = [
  ["", "Geen"], ["spoel", "Spoel"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitControl>>;

export const cableLocationOptions = [
  ["N/A", "Niet opgegeven"],
  ["Ondergronds", "Ondergronds"],
  ["Luchtleiding", "Luchtleiding"],
  ["In wand", "In wand"],
  ["Op wand", "Op wand"],
] as const satisfies ReadonlyArray<PropertyOption<CircuitCableLocation>>;
