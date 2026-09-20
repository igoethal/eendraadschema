import type { Hierarchical_List } from "../Hierarchical_List";
import {
  CONFIGURED_ITEM_PROPERTY_SCHEMAS,
  configuredItemTypes,
  type ConfiguredItemProperties,
  type ConfiguredPropertyValue,
} from "./ConfiguredItemProperties";
import { BASIC_CONSUMER_TYPES } from "./SchemaPropertyReader";
import type {
  CircuitProperties,
  BasicConsumerProperties,
  SchemaPropertyReader,
  SocketProperties,
  LightPointProperties,
} from "./SchemaPropertyReader";

const basicConsumerTypes: ReadonlySet<string> = new Set(BASIC_CONSUMER_TYPES);

function text(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

export class LegacySchemaPropertyReader implements SchemaPropertyReader {
  private readonly circuits: ReadonlyMap<number, CircuitProperties>;
  private readonly sockets: ReadonlyMap<number, SocketProperties>;
  private readonly basicConsumers: ReadonlyMap<number, BasicConsumerProperties>;
  private readonly lightPoints: ReadonlyMap<number, LightPointProperties>;
  private readonly configuredItems: ReadonlyMap<number, ConfiguredItemProperties>;

  constructor(structure: Hierarchical_List) {
    const firstRootChildId = structure.getFirstChildId(0);
    const circuits = new Map<number, CircuitProperties>();
    const sockets = new Map<number, SocketProperties>();
    const basicConsumers = new Map<number, BasicConsumerProperties>();
    const lightPoints = new Map<number, LightPointProperties>();
    const configuredItems = new Map<number, ConfiguredItemProperties>();
    for (let ordinal = 0; ordinal < structure.length; ordinal += 1) {
      if (!structure.active[ordinal]) continue;
      const item = structure.getElectroItemById(structure.id[ordinal]);
      if (item === null) continue;
      if (item.getType() === "Kring") circuits.set(item.id, Object.freeze({
        itemId: item.id,
        nameMode: text(item.props.autoKringNaam || "auto"),
        name: text(item.props.naam),
        protection: text(item.props.bescherming),
        poleCount: text(item.props.aantal_polen),
        amperage: text(item.props.amperage),
        differentialCurrent: text(item.props.differentieel_delta_amperage),
        differentialType: text(item.props.type_differentieel),
        breakerCurve: text(item.props.curve_automaat),
        shortCircuitRating: text(item.props.kortsluitvermogen),
        selectiveDifferential: item.props.differentieel_is_selectief === true,
        phase: text(item.props.fase),
        normallyClosed: item.props.normaalGesloten === true,
        control: text(item.props.sturing),
        hasCable: item.props.kabel_is_aanwezig === true,
        cableType: text(item.props.type_kabel),
        cableLocation: text(item.props.kabel_locatie),
        cableInConduit: item.props.kabel_is_in_buis === true,
        residential: item.props.huishoudelijk !== false,
        address: text(item.props.adres),
        text: text(item.props.tekst),
        startsNewPage: item.props.newPage === true,
        canStartNewPage: item.parent === 0 && item.id !== firstRootChildId,
      }));
      if (item.getType() === "Contactdoos") {
        const parent = item.getParent();
        sockets.set(item.id, Object.freeze({
          itemId: item.id,
          numberMode: text(item.props.autonr || "manueel"),
          number: text(item.props.nr),
          canEditNumber: parent !== null && ["Kring", "Domotica module (verticaal)"].includes(parent.getType()),
          grounded: item.props.is_geaard === true,
          childSafe: item.props.is_kinderveilig === true,
          splashProof: item.props.is_halfwaterdicht === true,
          multiPhase: item.props.is_meerfasig === true,
          phaseCount: text(item.props.aantal_fases_indien_meerfasig),
          hasNeutral: item.props.heeft_nul_indien_meerfasig === true,
          builtInSwitch: item.props.heeft_ingebouwde_schakelaar === true,
          outletCount: text(item.props.aantal),
          inDistributionBoard: item.props.in_verdeelbord === true,
          address: text(item.props.adres),
        }));
      }
      if (basicConsumerTypes.has(item.getType())) {
        const parent = item.getParent();
        basicConsumers.set(item.id, Object.freeze({
          itemId: item.id,
          type: item.getType() as BasicConsumerProperties["type"],
          numberMode: text(item.props.autonr || "manueel"),
          number: text(item.props.nr),
          canEditNumber: parent !== null && ["Kring", "Domotica module (verticaal)"].includes(parent.getType()),
          address: text(item.props.adres),
        }));
      }
      if (item.getType() === "Lichtpunt") {
        const parent = item.getParent();
        lightPoints.set(item.id, Object.freeze({
          itemId: item.id,
          numberMode: text(item.props.autonr || "manueel"),
          number: text(item.props.nr),
          canEditNumber: parent !== null && ["Kring", "Domotica module (verticaal)"].includes(parent.getType()),
          lampType: text(item.props.type_lamp),
          tubeCount: text(item.props.aantal_buizen_indien_TL),
          count: text(item.props.aantal),
          wallLight: item.props.is_wandlamp === true,
          splashProof: item.props.is_halfwaterdicht === true,
          builtInSwitch: item.props.heeft_ingebouwde_schakelaar === true,
          emergencyLighting: text(item.props.type_noodverlichting),
          address: text(item.props.adres),
        }));
      }
      if (configuredItemTypes.has(item.getType())) {
        const type = item.getType();
        const itemSchema = CONFIGURED_ITEM_PROPERTY_SCHEMAS[type];
        const values: Record<string, ConfiguredPropertyValue> = {};
        for (const [key, field] of Object.entries(itemSchema.fields)) {
          const rawValue = item.props[field.legacyKey] ?? field.defaultValue;
          values[key] = field.kind === "boolean" ? rawValue === true : text(rawValue);
        }
        const parent = item.getParent();
        configuredItems.set(item.id, Object.freeze({
          itemId: item.id,
          type,
          canEditNumber: parent !== null && ["Kring", "Domotica module (verticaal)"].includes(parent.getType()),
          parentType: parent?.getType() ?? null,
          childCount: item.getNumChilds(),
          canStartNewPage: item.parent === 0 && item.id !== firstRootChildId,
          values: Object.freeze(values),
        }));
      }
    }
    this.circuits = circuits;
    this.sockets = sockets;
    this.basicConsumers = basicConsumers;
    this.lightPoints = lightPoints;
    this.configuredItems = configuredItems;
  }

  getCircuit(itemId: number): CircuitProperties | undefined {
    return this.circuits.get(itemId);
  }

  getSocket(itemId: number): SocketProperties | undefined {
    return this.sockets.get(itemId);
  }

  getBasicConsumer(itemId: number): BasicConsumerProperties | undefined {
    return this.basicConsumers.get(itemId);
  }

  getLightPoint(itemId: number): LightPointProperties | undefined {
    return this.lightPoints.get(itemId);
  }

  getConfiguredItem(itemId: number): ConfiguredItemProperties | undefined {
    return this.configuredItems.get(itemId);
  }
}
