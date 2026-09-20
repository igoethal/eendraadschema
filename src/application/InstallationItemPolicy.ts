/** How an electrical item participates in the three dossier views. */
export type InstallationItemPresentation = "field-device" | "panel-device" | "structural";

export interface InstallationItemPolicy {
  readonly presentation: InstallationItemPresentation;
  readonly requiresSituationPlacement: boolean;
  readonly requiresBoardPlacement: boolean;
}

const FIELD_DEVICE_POLICY: InstallationItemPolicy = Object.freeze({
  presentation: "field-device",
  requiresSituationPlacement: true,
  requiresBoardPlacement: false,
});

const PANEL_DEVICE_POLICY: InstallationItemPolicy = Object.freeze({
  presentation: "panel-device",
  requiresSituationPlacement: false,
  requiresBoardPlacement: true,
});

const STRUCTURAL_POLICY: InstallationItemPolicy = Object.freeze({
  presentation: "structural",
  requiresSituationPlacement: false,
  requiresBoardPlacement: false,
});

const ITEM_POLICIES: Readonly<Record<string, InstallationItemPolicy>> = Object.freeze({
  Aansluiting: STRUCTURAL_POLICY,
  Aardingsonderbreker: STRUCTURAL_POLICY,
  Bord: STRUCTURAL_POLICY,
  Container: STRUCTURAL_POLICY,
  Leiding: STRUCTURAL_POLICY,
  Splitsing: STRUCTURAL_POLICY,
  Verlenging: STRUCTURAL_POLICY,
  "Vrije tekst": STRUCTURAL_POLICY,
  "Vrije ruimte": STRUCTURAL_POLICY,
  Domotica: PANEL_DEVICE_POLICY,
  "Domotica module (verticaal)": PANEL_DEVICE_POLICY,
  Elektriciteitsmeter: PANEL_DEVICE_POLICY,
  Kring: PANEL_DEVICE_POLICY,
  Overspanningsbeveiliging: PANEL_DEVICE_POLICY,
  Transformator: PANEL_DEVICE_POLICY,
  "Zekering/differentieel": PANEL_DEVICE_POLICY,
});

/** Unknown public item types are field devices unless explicitly classified. */
export function getInstallationItemPolicy(type: string): InstallationItemPolicy {
  return ITEM_POLICIES[type] ?? FIELD_DEVICE_POLICY;
}

export function getItemPresentation(type: string): InstallationItemPresentation {
  return getInstallationItemPolicy(type).presentation;
}
