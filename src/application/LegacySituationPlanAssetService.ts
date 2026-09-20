import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import type { SituationPlanView } from "../sitplan/SituationPlanView";
import type { LegacySchemaStore } from "./LegacySchemaStore";
import type { LegacySituationPlanStore } from "./LegacySituationPlanStore";
import {
  SITUATION_ONLY_SYMBOL_TYPES,
  SituationPlanAssetError,
  type AddSituationSymbolOptions,
  type SituationBackgroundImportResult,
  type SituationPlanAssetService,
  type SituationSymbolAddResult,
} from "./SituationPlanAssetService";

interface DecodedImage {
  readonly dataUrl: string;
  readonly width: number;
  readonly height: number;
}

type ImageFileDecoder = (file: File) => Promise<DecodedImage>;

export class LegacySituationPlanAssetService implements SituationPlanAssetService {
  constructor(
    private readonly schemaStore: LegacySchemaStore,
    private readonly situationStore: LegacySituationPlanStore,
    private readonly paperElement: HTMLElement,
    private readonly historyChanged: () => void,
    private readonly decodeImage: ImageFileDecoder = decodeImageFile,
  ) {}

  async importBackground(file: File): Promise<SituationBackgroundImportResult> {
    const view = this.requireView();
    const image = await this.decodeImage(file);
    if (image.width <= 0 || image.height <= 0) {
      throw new SituationPlanAssetError(
        "INVALID_IMAGE",
        "De gekozen afbeelding heeft geen geldige afmetingen.",
      );
    }

    const structure = this.situationStore.getLegacyDocument();
    const defaults = structure.sitplan.getDefaults();
    const scale = Math.floor(Math.min(
      defaults.scale,
      this.paperElement.offsetWidth * 0.995 / image.width,
      this.paperElement.offsetHeight * 0.995 / image.height,
    ) * 10_000) / 10_000;
    const elementId = this.situationStore.commands.addCustomElement({
      page: structure.sitplan.getActivePage(),
      position: {
        x: this.paperElement.offsetWidth / 2,
        y: this.paperElement.offsetHeight / 2,
      },
      size: { width: image.width, height: image.height },
      labelFontSize: defaults.fontsize,
      scale,
      rotation: defaults.rotate,
      svg: `<svg width="${image.width}" height="${image.height}"><image href="${image.dataUrl}" width="${image.width}" height="${image.height}"/></svg>`,
    });
    const element = structure.sitplan.getElements().find(candidate => candidate.id === elementId);
    if (!element) {
      throw new SituationPlanAssetError("CANVAS_UNAVAILABLE", "De plattegrond kon niet worden geplaatst.");
    }
    this.selectImportedElement(view, element);
    this.historyChanged();

    return {
      elementId: element.id,
      scaledToFit: scale !== defaults.scale,
      largeFile: image.dataUrl.length > 5_000_000,
    };
  }

  addSituationOnlySymbol(options: AddSituationSymbolOptions): SituationSymbolAddResult {
    const view = this.requireView();
    if (
      !SITUATION_ONLY_SYMBOL_TYPES.includes(options.type)
      || !Number.isFinite(options.scale)
      || options.scale <= 0
      || !Number.isFinite(options.rotation)
    ) {
      throw new SituationPlanAssetError(
        "INVALID_SYMBOL_OPTIONS",
        "Kies een geldig symbool, een positieve schaal en een geldige rotatie.",
      );
    }

    if (options.useScaleAsDefault) {
      this.situationStore.commands.updateDefaults({ scale: options.scale });
    }
    const itemId = this.schemaStore.commands.addSituationOnlyItem(options.type);
    const structure = this.situationStore.getLegacyDocument();
    view.addElectroItem(
      itemId,
      "manueel",
      "",
      "rechts",
      structure.sitplan.getDefaults().fontsize,
      options.scale,
      options.rotation,
    );
    this.schemaStore.synchronizeLegacyDocument(structure);
    this.historyChanged();

    const matchingElements = structure.sitplan.getElements()
      .filter(candidate => candidate.getElectroItemId() === itemId);
    const element = matchingElements[matchingElements.length - 1];
    if (!element) {
      throw new SituationPlanAssetError(
        "CANVAS_UNAVAILABLE",
        "Het symbool kon niet op het situatieschema worden geplaatst.",
      );
    }
    return { elementId: element.id, itemId };
  }

  private requireView(): SituationPlanView {
    const view = this.situationStore.getLegacyDocument().sitplanview;
    if (!view) {
      throw new SituationPlanAssetError(
        "CANVAS_UNAVAILABLE",
        "Open het situatieschema voordat u een bestand of symbool toevoegt.",
      );
    }
    return view;
  }

  private selectImportedElement(view: SituationPlanView, element: SituationPlanElement): void {
    view.syncToSitPlan();
    view.clearSelection();
    view.redraw();
    view.selectOneBox(element.boxref);
  }
}

function decodeImageFile(file: File): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new SituationPlanAssetError(
      "INVALID_IMAGE",
      "De gekozen afbeelding kon niet worden gelezen.",
    ));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new SituationPlanAssetError("INVALID_IMAGE", "De gekozen afbeelding is ongeldig."));
        return;
      }
      const dataUrl = reader.result;
      const image = new Image();
      image.onerror = () => reject(new SituationPlanAssetError(
        "INVALID_IMAGE",
        "Dit afbeeldingsformaat wordt niet door de browser ondersteund.",
      ));
      image.onload = () => resolve({
        dataUrl,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
