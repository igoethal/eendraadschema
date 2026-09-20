import type { ConfiguredItemProperties } from "../../../application/ConfiguredItemProperties";

export interface ConfiguredEditorField {
  readonly key: string;
  readonly label: string;
  readonly advanced?: boolean;
  readonly visible?: (properties: ConfiguredItemProperties) => boolean;
  readonly options?: (properties: ConfiguredItemProperties, options: readonly string[]) => readonly string[];
}

export interface ConfiguredItemEditorConfig {
  readonly fields: readonly ConfiguredEditorField[];
}

const numberFields: readonly ConfiguredEditorField[] = [
  { key: "numberMode", label: "Nummering", visible: (properties) => properties.canEditNumber },
  { key: "number", label: "Nummer", visible: (properties) => properties.canEditNumber },
];
const addressField: ConfiguredEditorField = { key: "address", label: "Adres of tekst" };
const textLayoutFields: readonly ConfiguredEditorField[] = [
  { key: "text", label: "Tekst (nieuwe lijn = |)" },
  { key: "widthMode", label: "Breedte" },
  { key: "width", label: "Handmatige breedte", visible: (properties) => properties.values.widthMode === "handmatig" },
  { key: "bold", label: "Vet", advanced: true },
  { key: "italic", label: "Cursief", advanced: true },
  { key: "alignment", label: "Horizontale uitlijning", advanced: true },
];
const differentialProtections = ["differentieel", "differentieelautomaat"];
const breakerProtections = ["automatisch", "differentieelautomaat"];
const protectedPhases = ["automatisch", "differentieel", "differentieelautomaat", "smelt"];
const shortCircuitProtections = ["automatisch", "differentieel", "differentieelautomaat"];
const attributedSwitchTypes = [
  "enkelpolig", "dubbelpolig", "driepolig", "kruis_enkel", "dubbelaansteking",
  "wissel_enkel", "wissel_dubbel", "dimschakelaar", "dimschakelaar wissel",
];
const splashProofSwitchTypes = [...attributedSwitchTypes, "rolluikschakelaar"];
const pullSwitchTypes = attributedSwitchTypes.filter((type) => !type.startsWith("dimschakelaar"));

function switchFields(includeMagneticContact: boolean): readonly ConfiguredEditorField[] {
  return [
    { key: "switchType", label: "Type schakelaar" },
    { key: "switchCount", label: "Aantal schakelaars", visible: (properties) => ["enkelpolig", "dubbelpolig", ...(includeMagneticContact ? ["magneetcontact"] : [])].includes(String(properties.values.switchType)), options: (properties, options) => {
      const current = String(properties.values.switchType);
      const maximum = current === "enkelpolig" ? 5 : current === "dubbelpolig" ? 2 : 20;
      const allowLegacyZero = properties.values.switchCount === "0";
      return options.filter((option) => (allowLegacyZero && option === "0") || (Number(option) >= 1 && Number(option) <= maximum));
    } },
    { key: "splashProof", label: "Halfwaterdicht", advanced: true, visible: (properties) => splashProofSwitchTypes.includes(String(properties.values.switchType)) },
    { key: "indicatorLight", label: "Verklikkerlampje", advanced: true, visible: (properties) => attributedSwitchTypes.includes(String(properties.values.switchType)) },
    { key: "signalLight", label: "Signalisatielampje", advanced: true, visible: (properties) => attributedSwitchTypes.includes(String(properties.values.switchType)) },
    { key: "pullSwitch", label: "Trekschakelaar", advanced: true, visible: (properties) => pullSwitchTypes.includes(String(properties.values.switchType)) },
    { key: "normallyClosed", label: "Normaal gesloten", visible: (properties) => properties.values.switchType === "contact" },
    { key: "control", label: "Sturing", visible: (properties) => properties.values.switchType === "contact" },
  ];
}

function numbered(fields: readonly ConfiguredEditorField[]): ConfiguredItemEditorConfig {
  return { fields: [...numberFields, ...fields, addressField] };
}

export const configuredItemEditorConfigs: Readonly<Record<string, ConfiguredItemEditorConfig>> = Object.freeze({
  Aansluiting: { fields: [
    { key: "name", label: "Naam" },
    ...numberFields,
    { key: "protection", label: "Bescherming" },
    { key: "poleCount", label: "Aantal polen", visible: (properties) => properties.values.protection !== "geen" },
    { key: "amperage", label: "Stroom (A)", visible: (properties) => properties.values.protection !== "geen" },
    { key: "differentialCurrent", label: "Differentieelstroom (mA)", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "differentialType", label: "Type differentieel", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "breakerCurve", label: "Curve automaat", visible: (properties) => breakerProtections.includes(String(properties.values.protection)) },
    { key: "shortCircuitRating", label: "Kortsluitstroom (kA)", visible: (properties) => shortCircuitProtections.includes(String(properties.values.protection)) },
    { key: "selectiveDifferential", label: "Selectieve differentieel", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "phase", label: "Fase", visible: (properties) => protectedPhases.includes(String(properties.values.protection)) },
    { key: "normallyClosed", label: "Normaal gesloten", visible: (properties) => ["contact", "zekeringscheider"].includes(String(properties.values.protection)) },
    { key: "cableAfterMeter", label: "Kabeltype na teller" },
    { key: "cableBeforeMeter", label: "Kabeltype vóór teller" },
    { key: "residential", label: "Huishoudelijke installatie", advanced: true, visible: (properties) => properties.values.shortCircuitRating !== "" && shortCircuitProtections.includes(String(properties.values.protection)) },
    { key: "startsNewPage", label: "Start op nieuwe pagina", advanced: true, visible: (properties) => properties.canStartNewPage },
    addressField,
  ] },
  Batterij: numbered([{ key: "symbol", label: "Symbool" }]),
  Boiler: numbered([{ key: "accumulation", label: "Accumulatie" }]),
  Bord: { fields: [
    { key: "name", label: "Naam" },
    { key: "grounded", label: "Geaard" },
    { key: "busbarExtensionRight", label: "Balk rechts verlengen (px)" },
  ] },
  Domotica: numbered([{ key: "text", label: "Tekst (nieuwe lijn = |)" }]),
  "Domotica module (verticaal)": { fields: [
    ...numberFields,
    { key: "text", label: "Tekst" },
  ] },
  "Domotica gestuurde verbruiker": numbered([
    { key: "wireless", label: "Draadloos" },
    { key: "localButton", label: "Lokale drukknop" },
    { key: "programmed", label: "Geprogrammeerd" },
    { key: "detection", label: "Detectie" },
    { key: "externalControl", label: "Externe sturing" },
    { key: "externalControlType", label: "Type externe sturing", visible: (properties) => properties.values.externalControl === true },
  ]),
  Drukknop: numbered([
    { key: "buttonType", label: "Type" },
    { key: "fixtureCount", label: "Aantal armaturen" },
    { key: "buttonsPerFixture", label: "Knoppen per armatuur" },
    { key: "indicatorLight", label: "Verklikkerlampje", advanced: true },
    { key: "splashProof", label: "Halfwaterdicht", advanced: true },
    { key: "shielded", label: "Afgeschermd", advanced: true },
  ]),
  Ketel: numbered([
    { key: "boilerType", label: "Type" },
    { key: "energySource", label: "Energiebron" },
    { key: "heatFunction", label: "Warmtefunctie" },
    { key: "count", label: "Aantal" },
  ]),
  Leiding: numbered([
    { key: "cableType", label: "Type kabel" },
    { key: "cableLocation", label: "Plaatsing" },
    { key: "inConduit", label: "In buis", visible: (properties) => properties.values.cableLocation !== "Luchtleiding" },
  ]),
  Lichtcircuit: numbered([
    ...switchFields(false),
    { key: "lightCount", label: "Aantal lichtpunten" },
  ]),
  Media: numbered([
    { key: "symbol", label: "Symbool" },
    { key: "count", label: "Aantal", visible: (properties) => ["luidspreker", "intercom"].includes(String(properties.values.symbol)) },
  ]),
  Omvormer: numbered([
    { key: "text", label: "Tekst" },
    { key: "inCircuit", label: "In kring", advanced: true, visible: (properties) => properties.parentType === "Kring" },
    { key: "micro", label: "Micro-omvormer", advanced: true, visible: (properties) => properties.childCount <= 1 },
  ]),
  Omschakelaar: { fields: [
    { key: "poleCount", label: "Aantal polen" },
    { key: "amperage", label: "Nominale stroom" },
    { key: "parentPort", label: "Inkomende leiding op poort" },
    { key: "address", label: "Adres/omschrijving" },
  ] },
  Schakelaars: numbered(switchFields(true)),
  Transformator: numbered([{ key: "voltage", label: "Spanning" }]),
  "USB lader": numbered([{ key: "count", label: "Aantal" }]),
  Ventilator: numbered([{ key: "fanType", label: "Type" }]),
  Verbruiker: numbered(textLayoutFields),
  Verlenging: numbered([{ key: "width", label: "Breedte" }]),
  Verwarmingstoestel: numbered([
    { key: "accumulation", label: "Accumulatie" },
    { key: "fan", label: "Ventilator", visible: (properties) => properties.values.accumulation === true },
  ]),
  "Vrije ruimte": { fields: [{ key: "width", label: "Breedte" }] },
  "Vrije tekst": { fields: [
    ...numberFields,
    ...textLayoutFields,
    { key: "frameType", label: "Type" },
    { ...addressField, visible: (properties) => properties.values.frameType !== "zonder kader" },
  ] },
  "Warmtepomp/airco": numbered([
    { key: "heatFunction", label: "Warmtefunctie" },
    { key: "count", label: "Aantal" },
  ]),
  "Zeldzame symbolen": { fields: [
    ...numberFields,
    { key: "symbol", label: "Symbool" },
    { ...addressField, visible: (properties) => properties.values.symbol === "deurslot" },
  ] },
  "Zekering/differentieel": { fields: [
    ...numberFields,
    { key: "protection", label: "Bescherming" },
    { key: "poleCount", label: "Aantal polen" },
    { key: "amperage", label: "Stroom (A)" },
    { key: "differentialCurrent", label: "Differentieelstroom (mA)", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "differentialType", label: "Type differentieel", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "breakerCurve", label: "Curve automaat", visible: (properties) => breakerProtections.includes(String(properties.values.protection)) },
    { key: "shortCircuitRating", label: "Kortsluitstroom (kA)", visible: (properties) => shortCircuitProtections.includes(String(properties.values.protection)) },
    { key: "selectiveDifferential", label: "Selectieve differentieel", visible: (properties) => differentialProtections.includes(String(properties.values.protection)) },
    { key: "phase", label: "Fase" },
    { key: "residential", label: "Huishoudelijke installatie", advanced: true, visible: (properties) => properties.values.shortCircuitRating !== "" && shortCircuitProtections.includes(String(properties.values.protection)) },
    { key: "startsNewPage", label: "Start op nieuwe pagina", advanced: true, visible: (properties) => properties.canStartNewPage },
  ] },
  Zonnepaneel: numbered([
    { key: "count", label: "Aantal" },
    { key: "symbol", label: "Symbool" },
  ]),
  Splitsing: { fields: [] },
});
