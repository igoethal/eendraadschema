export interface CircuitProperties {
  readonly itemId: number;
  readonly nameMode: string;
  readonly name: string;
  readonly protection: string;
  readonly poleCount: string;
  readonly amperage: string;
  readonly differentialCurrent: string;
  readonly differentialType: string;
  readonly breakerCurve: string;
  readonly shortCircuitRating: string;
  readonly selectiveDifferential: boolean;
  readonly phase: string;
  readonly normallyClosed: boolean;
  readonly control: string;
  readonly hasCable: boolean;
  readonly cableType: string;
  readonly cableLocation: string;
  readonly cableInConduit: boolean;
  readonly residential: boolean;
  readonly address: string;
  readonly text: string;
  readonly startsNewPage: boolean;
  readonly canStartNewPage: boolean;
}

export const CIRCUIT_NAME_MODES = ["auto", "manueel"] as const;
export const CIRCUIT_PROTECTIONS = [
  "automatisch", "differentieel", "differentieelautomaat", "smelt", "geen",
  "contact", "zekeringscheider", "relais", "schemer", "overspanningsbeveiliging",
] as const;
export const CIRCUIT_POLE_COUNTS = ["", "1", "2", "3", "4", "-"] as const;
export const CIRCUIT_DIFFERENTIAL_TYPES = ["", "A", "B"] as const;
export const CIRCUIT_BREAKER_CURVES = ["", "B", "C", "D", "U"] as const;
export const CIRCUIT_PHASES = ["", "L1", "L2", "L3"] as const;
export const CIRCUIT_CONTROLS = ["", "spoel"] as const;
export const CIRCUIT_CABLE_LOCATIONS = [
  "N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand",
] as const;

export type CircuitNameMode = typeof CIRCUIT_NAME_MODES[number];
export type CircuitProtection = typeof CIRCUIT_PROTECTIONS[number];
export type CircuitPoleCount = typeof CIRCUIT_POLE_COUNTS[number];
export type CircuitDifferentialType = typeof CIRCUIT_DIFFERENTIAL_TYPES[number];
export type CircuitBreakerCurve = typeof CIRCUIT_BREAKER_CURVES[number];
export type CircuitPhase = typeof CIRCUIT_PHASES[number];
export type CircuitControl = typeof CIRCUIT_CONTROLS[number];
export type CircuitCableLocation = typeof CIRCUIT_CABLE_LOCATIONS[number];

export interface CircuitPropertyChanges {
  readonly nameMode?: CircuitNameMode;
  readonly name?: string;
  readonly protection?: CircuitProtection;
  readonly poleCount?: CircuitPoleCount;
  readonly amperage?: string;
  readonly differentialCurrent?: string;
  readonly differentialType?: CircuitDifferentialType;
  readonly breakerCurve?: CircuitBreakerCurve;
  readonly shortCircuitRating?: string;
  readonly selectiveDifferential?: boolean;
  readonly phase?: CircuitPhase;
  readonly normallyClosed?: boolean;
  readonly control?: CircuitControl;
  readonly hasCable?: boolean;
  readonly cableType?: string;
  readonly cableLocation?: CircuitCableLocation;
  readonly cableInConduit?: boolean;
  readonly residential?: boolean;
  readonly address?: string;
  readonly text?: string;
  readonly startsNewPage?: boolean;
}

export interface SocketProperties {
  readonly itemId: number;
  readonly numberMode: string;
  readonly number: string;
  readonly canEditNumber: boolean;
  readonly grounded: boolean;
  readonly childSafe: boolean;
  readonly splashProof: boolean;
  readonly multiPhase: boolean;
  readonly phaseCount: string;
  readonly hasNeutral: boolean;
  readonly builtInSwitch: boolean;
  readonly outletCount: string;
  readonly inDistributionBoard: boolean;
  readonly address: string;
}

export const SOCKET_NUMBER_MODES = ["auto", "manueel"] as const;
export const SOCKET_PHASE_COUNTS = ["1", "2", "3"] as const;
export const SOCKET_OUTLET_COUNTS = ["1", "2", "3", "4", "5", "6"] as const;

export type SocketNumberMode = typeof SOCKET_NUMBER_MODES[number];
export type SocketPhaseCount = typeof SOCKET_PHASE_COUNTS[number];
export type SocketOutletCount = typeof SOCKET_OUTLET_COUNTS[number];

export interface SocketPropertyChanges {
  readonly numberMode?: SocketNumberMode;
  readonly number?: string;
  readonly grounded?: boolean;
  readonly childSafe?: boolean;
  readonly splashProof?: boolean;
  readonly multiPhase?: boolean;
  readonly phaseCount?: SocketPhaseCount;
  readonly hasNeutral?: boolean;
  readonly builtInSwitch?: boolean;
  readonly outletCount?: SocketOutletCount;
  readonly inDistributionBoard?: boolean;
  readonly address?: string;
}

export const BASIC_CONSUMER_TYPES = [
  "Aansluitpunt",
  "Aardingsonderbreker",
  "Aftakdoos",
  "Bel",
  "Diepvriezer",
  "Droogkast",
  "Elektriciteitsmeter",
  "Elektrische oven",
  "EV lader",
  "Koelkast",
  "Kookfornuis",
  "Meerdere verbruikers",
  "Microgolfoven",
  "Motor",
  "Overspanningsbeveiliging",
  "Stoomoven",
  "Vaatwasmachine",
  "Wasmachine",
] as const;

export type BasicConsumerType = typeof BASIC_CONSUMER_TYPES[number];

export interface BasicConsumerProperties {
  readonly itemId: number;
  readonly type: BasicConsumerType;
  readonly numberMode: string;
  readonly number: string;
  readonly canEditNumber: boolean;
  readonly address: string;
}

export interface BasicConsumerPropertyChanges {
  readonly numberMode?: SocketNumberMode;
  readonly number?: string;
  readonly address?: string;
}

export const LIGHT_POINT_TYPES = ["standaard", "TL", "spot", "led"] as const;
export const LIGHT_POINT_TUBE_COUNTS = ["1", "2", "3", "4"] as const;
export const LIGHT_POINT_COUNTS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
] as const;
export const EMERGENCY_LIGHTING_TYPES = ["Geen", "Centraal", "Decentraal"] as const;

export interface LightPointProperties {
  readonly itemId: number;
  readonly numberMode: string;
  readonly number: string;
  readonly canEditNumber: boolean;
  readonly lampType: string;
  readonly tubeCount: string;
  readonly count: string;
  readonly wallLight: boolean;
  readonly splashProof: boolean;
  readonly builtInSwitch: boolean;
  readonly emergencyLighting: string;
  readonly address: string;
}

export interface LightPointPropertyChanges {
  readonly numberMode?: SocketNumberMode;
  readonly number?: string;
  readonly lampType?: typeof LIGHT_POINT_TYPES[number];
  readonly tubeCount?: typeof LIGHT_POINT_TUBE_COUNTS[number];
  readonly count?: typeof LIGHT_POINT_COUNTS[number];
  readonly wallLight?: boolean;
  readonly splashProof?: boolean;
  readonly builtInSwitch?: boolean;
  readonly emergencyLighting?: typeof EMERGENCY_LIGHTING_TYPES[number];
  readonly address?: string;
}

/** Read-only, UI-independent projection for gradually migrated property editors. */
export interface SchemaPropertyReader {
  getCircuit(itemId: number): CircuitProperties | undefined;
  getSocket(itemId: number): SocketProperties | undefined;
  getBasicConsumer(itemId: number): BasicConsumerProperties | undefined;
  getLightPoint(itemId: number): LightPointProperties | undefined;
  getConfiguredItem(itemId: number): ConfiguredItemProperties | undefined;
}
import type { ConfiguredItemProperties } from "./ConfiguredItemProperties";
