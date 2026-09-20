import type {
  CircuitProperties,
  CircuitPropertyChanges,
} from "../../../application/SchemaPropertyReader";

export interface CircuitSectionProps {
  readonly properties: CircuitProperties;
  readonly update: (changes: CircuitPropertyChanges) => void;
}
