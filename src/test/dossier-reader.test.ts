import { describe, expect, it, beforeEach } from "vitest";
import { createDossierSnapshot } from "../application/DossierReader";
import { getInstallationItemPolicy } from "../application/InstallationItemPolicy";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

describe("dossier read model", () => {
  it("uses one item policy for required placements across all views", () => {
    expect(getInstallationItemPolicy("Kring")).toMatchObject({
      presentation: "panel-device",
      requiresBoardPlacement: true,
      requiresSituationPlacement: false,
    });
    expect(getInstallationItemPolicy("Bord").presentation).toBe("structural");
    expect(getInstallationItemPolicy("Contactdoos")).toMatchObject({
      presentation: "field-device",
      requiresSituationPlacement: true,
    });
  });

  it("assigns a stable unique id to every missing dossier field", () => {
    const structure = loadFixture("example001.eds");
    const schema = new LegacySchemaStore(structure);
    const situation = new LegacySituationPlanStore(structure);

    const metadataIssues = createDossierSnapshot(schema.getSnapshot(), situation.getSnapshot())
      .issues.filter(issue => issue.code === "MISSING_DOSSIER_METADATA");

    expect(metadataIssues.length).toBeGreaterThan(1);
    expect(new Set(metadataIssues.map(issue => issue.id)).size).toBe(metadataIssues.length);
    expect(metadataIssues.every(issue => issue.itemId === undefined)).toBe(true);
  });

  it("reports missing situation links for field items and treats circuit protection as a board device", () => {
    const structure = loadFixture("example001.eds");
    const schema = new LegacySchemaStore(structure);
    const situation = new LegacySituationPlanStore(structure);

    const dossier = createDossierSnapshot(schema.getSnapshot(), situation.getSnapshot());
    const circuit = schema.getSnapshot().document.getAllItems().find(item => item.type === "Kring")!;

    expect(dossier.items.find(item => item.itemId === circuit.id)).toMatchObject({
      presentation: "panel-device",
      circuitId: circuit.id,
    });
    expect(dossier.issues.some(issue => issue.code === "MISSING_SITUATION_PLACEMENT")).toBe(true);
  });

  it("does not need a second persisted link when an occurrence is present", () => {
    const structure = loadFixture("example001.eds");
    const schema = new LegacySchemaStore(structure);
    const situation = new LegacySituationPlanStore(structure);
    const fieldItem = schema.getSnapshot().document.getAllItems().find(item => (
      item.role === "item" && item.type === "Contactdoos"
    ))!;
    const defaults = structure.sitplan.getDefaults();
    structure.sitplan.addElementFromElectroItem(fieldItem.id, 1, 10, 10, "auto", "", "rechts", defaults.fontsize, defaults.scale, defaults.rotate);
    situation.synchronizeLegacyDocument();

    const dossier = createDossierSnapshot(schema.getSnapshot(), situation.getSnapshot());
    expect(dossier.items.find(item => item.itemId === fieldItem.id)?.situationOccurrenceIds).toHaveLength(1);
    expect(dossier.issues.some(issue => issue.itemId === fieldItem.id && issue.code === "MISSING_SITUATION_PLACEMENT")).toBe(false);
  });
});
