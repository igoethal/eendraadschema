import { SituationPlan } from "./SituationPlan";
import { SituationPlanElement } from "./SituationPlanElement";
import { AdresType, AdresLocation } from "./SituationPlanElement";
import { SituationPlanView_Selected } from "./SituationPlanView_Selected";
import { MouseDrag } from "./MouseDrag";
import { EventManager } from "../EventManager";
import { getXYRectangleSize } from "./GeometricFunctions";
import type { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { legacyUi } from "../ui/legacyStyles";
import type { Hierarchical_List } from "../Hierarchical_List";
import { SITUATION_ZOOM_INTERVAL } from "./SituationPlanConfig";
import type { NoticeStore } from "../application/NoticeStore";

export interface SituationPlanSelection {
    readonly elementIds: readonly string[];
    readonly primaryElementId: string | null;
}

export type SituationPlanSelectionListener = (selection: SituationPlanSelection) => void;

/**
 * Deze class behandelt het tekenen van het situatieplan.
 * 
 * Er wordt regelmatig de terminologie Box gebruikt in de code. Een box is een sleepbaar element en kan zowel
 * een eendraadschema symbool zijn als een ingelezen extern bestand.
 */

export class SituationPlanView {

    private zoomfactor: number = 1;
    private initialZoomToFitPending = true;
    private readonly selectPadding: number;

    /** Referentie naar meerdere DIV's waar het stuatieplan wordt weergegeven 
     *   - paper: hieronder hangen de reële elementen en dit stelt het printable gedeelte van het schema voor
     *   - canvas: deze bevat paper en ook het niet printable gedeelte
    */
    private canvas: HTMLElement = null;
    private paper: HTMLElement = null;

    private draggedBox: HTMLElement = null; /** Box die op dit moment versleept wordt of null */
    private draggedHalo: { left: number, top: number, right: number, bottom: number } = { left: 0, top: 0, right: 0, bottom: 0 };
    private dragHistorySequence = 0;
    private dragHistoryKey: string | null = null;

    private selected: SituationPlanView_Selected = new SituationPlanView_Selected();

    private mousedrag: MouseDrag; /** behandelt het verslepen van een box */

    private sitplan: SituationPlan;
    private sitplanStore: LegacySituationPlanStore;
    private readonly noticeStore: NoticeStore;
    private readonly onSelectionChanged: SituationPlanSelectionListener;

    private event_manager;

    constructor(
        canvas: HTMLElement,
        paper: HTMLElement,
        sitplanStore: LegacySituationPlanStore,
        noticeStore: NoticeStore,
        onSelectionChanged: SituationPlanSelectionListener = () => {},
    ) {
        this.canvas = canvas;
        this.paper = paper;
        this.selectPadding = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--selectPadding'),
        ) || 0;
        this.sitplanStore = sitplanStore;
        this.noticeStore = noticeStore;
        this.onSelectionChanged = onSelectionChanged;
        this.sitplan = sitplanStore.getLegacyDocument().sitplan;
        this.paper.style.transformOrigin = 'top left'; // Keep the origin point consistent when scaling

        this.mousedrag = new MouseDrag((clientX, clientY) => {
            const bounds = this.canvas.getBoundingClientRect();
            return this.canvasPosToPaperPos(clientX - bounds.left, clientY - bounds.top);
        });
        this.event_manager = new EventManager();

        // Verwijder alle selecties wanneer we ergens anders klikken dan op een box
        this.event_manager.addEventListener(canvas, 'mousedown', () => this.clearSelection());
        this.event_manager.addEventListener(canvas, 'touchstart', () => this.clearSelection());

        // Control wieltje om te zoomen
        this.event_manager.addEventListener(canvas, 'wheel', (event: WheelEvent) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            const zoom = -event.deltaY / 1000;
            if (Math.abs(zoom) >= 0.01) {
                const bounds = this.canvas.getBoundingClientRect();
                let canvasx = event.clientX - bounds.left;
                let canvasy = event.clientY - bounds.top;
                this.zoomIncrement(-event.deltaY / 2000, canvasx, canvasy);
            }
        }, { passive: false })
    }

    /**
     * Converteert een coördinaat van het zichtbare deel van het canvas (scherm-coordinaten die starten links boven het canvas)
     * naar een coördinaat op het papier.
     * 
     * De coördinatentransformatie steunt op het volgende
     *   canvasx = paperx * zoomfactor - canvas.scrollLeft + paperPadding
     *   canvasy = papery * zoomfactor  - canvas.scrollTop + paperPadding
     * 
     * @param {number} canvasx - De x-co ordinaat in het canvas.
     * @param {number} canvasy - De y-co ordinaat in het canvas.
     * @returns {Object} Object {x,y} met de x-coördinaat en y-coördinaat op het paper.
     */
    canvasPosToPaperPos(canvasx: number, canvasy: number) {
        const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));

        return {
            x: (canvasx + this.canvas.scrollLeft - paperPadding) / this.zoomfactor,
            y: (canvasy + this.canvas.scrollTop - paperPadding) / this.zoomfactor
        };
    }

    /**
     * Converteert een punt oöordinaat op het papier naar een coördinaat op het canvas (omgekeerde van hierboven).
     * 
     * @param {number} paperx - De x-coördinaat op het paper.
     * @param {number} papery - De y-coördinaat op het papier.
     * @returns {Object} Object {x,y} met de x-coördinaat en y-coördinaat op het canvas.
     */

    paperPosToCanvasPos(paperx: number, papery: number) {
        const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));

        return {
            x: paperx * this.zoomfactor - this.canvas.scrollLeft + paperPadding,
            y: papery * this.zoomfactor - this.canvas.scrollTop + paperPadding
        };
    }

    /**
     * Indien een gewenste coördinaat op zowel het canvas als het papier gegeven zijn, hoe moeten we dan scrollen?
     * 
     * @param {number} canvasx - De x-co ordinaat in het canvas.
     * @param {number} canvasy - De y-co ordinaat in het canvas.
     * @param {number} paperx - De x-coördinaat op het paper.
     * @param {number} papery - De y-coördinaat op het papier.
     * @returns {Object} Object {x,y} met de gewenste scrollLeft en scrollTop.
     */

    canvasAndPaperPosToScrollPos(canvasx: number, canvasy: number, paperx: number, papery: number) {
        const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));
        return {
            x: paperx * this.zoomfactor - canvasx + paperPadding + 0.5,
            y: papery * this.zoomfactor - canvasy + paperPadding + 0.5
        };
    }

    /**
     * Maakt deze instance ongedaan en verwijderd alle door deze instance aangemaakte elementen uit de DOM.
     * 
     * Verwijderd eerst de eventmanager en daarna alle elementen in het situatieplan. 
     * Als een element een referentie naar een box heeft, wordt deze verwijderd uit de DOM.
     * Als een element een referentie naar een label heeft, wordt deze verwijderd uit de DOM.
     */
    dispose() {
        //Verwijder de event manager
        this.event_manager.dispose();
        //Ga over all situationplanelements and verwijder de bijhorende boxes uit the DOM
        for (let element of this.sitplan.getElements()) {
            if (element.boxref != null) element.boxref.remove();
            if (element.boxlabelref != null) element.boxlabelref.remove();
        }
    }

    /**
     * Zorgt ervoor dat alle elementen in het situatieplan een link hebben naar
     * het eendraadschema.
     * 
     * Als een element in het situatieplan verwijst naar een symbool dat niet langer in 
     * het eendraadschema zit, wordt het element verwijderd uit het situatieplan.
     * 
     * Deze functie zorgt er niet voor dat ook elk element effectief een box heeft in de DOM.
     * Dit gebeurt pas in de redraw functie.
     */
    syncToSitPlan() {
        this.sitplan.syncToEendraadSchema();
    }

    /**
     * Stel de zoomfactor in zodat het paper-element volledig in het browser window wordt weergegeven
     * 
     * @param paperPadding - De padding rond het papier in pixels. Dit wordt gebruikt
     *   om te berekenen hoeveel ruimte beschikbaar is voor het papier. De standaard
     *   is de CSS-waarde van --paperPadding.
     */
    zoomToFit(paperPadding: number = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'))): boolean {
        if (
            !Number.isFinite(paperPadding)
            || this.canvas.offsetWidth <= 0
            || this.canvas.offsetHeight <= 0
            || this.paper.offsetWidth <= 0
            || this.paper.offsetHeight <= 0
        ) return false;

        const scale = Math.min(
            (this.canvas.offsetWidth - paperPadding * 2) / this.paper.offsetWidth,
            (this.canvas.offsetHeight - paperPadding * 2) / this.paper.offsetHeight,
        );

        if (!Number.isFinite(scale) || scale <= 0) return false;

        this.setzoom(scale);
        this.initialZoomToFitPending = false;
        return true;
    }

    ensureInitialZoomToFit(): void {
        if (this.initialZoomToFitPending) this.zoomToFit();
    }

    /**
     * Geeft de huidige zoomfactor terug.
     * @returns De huidige zoomfactor.
     */
    getZoomFactor() {
        return this.zoomfactor;
    }

    /**
     * Stel de zoomfactor in.
     * @param factor - De zoomfactor, standaard 1.
     */
    setzoom(factor: number = 1) {
        this.zoomfactor = factor;
        this.paper.style.transform = `scale(${factor})`;
    }

    /**
     * Verhoogt of verlaagt de zoomfactor met een bepaalde waarde.
     * 
     * @param increment - De waarde waarmee de zoomfactor moet worden aangepast.
     *   Een positieve waarde vergroot de zoom, terwijl een negatieve waarde de zoom verkleint.
     *   Standaard is deze waarde 0, wat betekent dat er geen aanpassing is.
    */
    zoomIncrement(increment: number = 0, canvasx: number = this.canvas.offsetWidth / 2, canvasy: number = this.canvas.offsetHeight / 2) { //increment is a value indicating how much we can zoom
        let mousePosOnPaper = this.canvasPosToPaperPos(canvasx, canvasy);
        this.setzoom(
            Math.min(SITUATION_ZOOM_INTERVAL.max,
                Math.max(SITUATION_ZOOM_INTERVAL.min, this.zoomfactor * (1 + increment))
            )
        );
        const scrollPos = this.canvasAndPaperPosToScrollPos(canvasx, canvasy, mousePosOnPaper.x, mousePosOnPaper.y);
        this.canvas.scrollLeft = scrollPos.x;
        this.canvas.scrollTop = scrollPos.y;
    }

    private makeBox(element: SituationPlanElement, fragment: DocumentFragment = null) {
        // Box aanmaken op de DOM voor het symbool of in te laden externe figuur
        // extra property sitPlanElementRef toegevoegd aan DOM zodat we later ons situatieplan element kunnen terugvinden
        let box = document.createElement('div');
        Object.assign(box, {
            id: element.id,
            className: `${legacyUi.situationBox}${element.movable ? '' : ' cursor-default'}`,
            sitPlanElementRef: element,
        });
        box.setAttribute('movable', (element.movable ? 'true' : 'false'));
        element.boxref = box;

        // Boxlabel aanmaken op de DOM voor de tekst bij het symbool
        let boxlabel = document.createElement('div');
        Object.assign(boxlabel, {
            id: element.id + '_label',
            className: `${legacyUi.situationLabel}${element.movable ? '' : ' cursor-default'}`,
            sitPlanElementRef: element,
        });
        boxlabel.setAttribute('movable', (element.movable ? 'true' : 'false'));
        boxlabel.textContent = element.getAdres();
        element.boxlabelref = boxlabel;

        // Content updaten en toevoegen aan de DOM
        this.updateBoxContent(element); //content moet eerst updated worden om te weten hoe groot de box is
        if (fragment) fragment.append(box, boxlabel); else this.paper.append(box, boxlabel);
        //this.updateSymbolAndLabelPosition(element); //pas als alles op de DOM zit kunnen we berekenen waar het label hoort

        // Event handlers voor het bewegen met muis of touch
        box.addEventListener('mousedown', this.startDrag);
        box.addEventListener('touchstart', this.startDrag);
        boxlabel.addEventListener('mousedown', this.startDrag);
        boxlabel.addEventListener('touchstart', this.startDrag);
    }

    /**
     * Werk de content van het box-element en label-element van een situatieplanelement bij in de DOM.
     * 
     * Deze functie controleert eerst of het box-element bestaat, zo-niet doet deze functie niets.
     * Daarna wordt de SVG van het symbool van het element gegenereerd.  Indien dit verschilt van wat reeds op de DOM zit wordt de innerHTML van het het box-element gewijzigd.
     * Daarnaast wordt de tekst van het label-element bijgewerkt en de fontsize ingesteld.
     * 
     * TODO: de functie getScaledSVG wordt altijd uitgevoerd en is nodig om te weten of de DOM moet aangepast worden maar dit is minder efficient.
     *       er zijn mogelijk betere manieren om de parameter sitPlanElement.needsViewUpdate te bepalen dan de SVG effectief genereren en te vergelijken met de bestaande SVG op de DOM, 
     *       bijvoorbeeld door een trigger op manipulatie in het ééndraadschema zelf.
     * 
     * @param sitPlanElement - Het situatieplanelement dat aangepast moet worden.
     */
    private updateBoxContent(sitPlanElement: SituationPlanElement | null) {
        if (!sitPlanElement) return;

        const box = sitPlanElement.boxref;
        const boxlabel = sitPlanElement.boxlabelref;

        if (box == null) return;

        let svg = sitPlanElement.getScaledSVG(); // Deze call past ook viewUpdateNeeded aan en moet dus eerst gebeuren

        if (sitPlanElement.needsViewUpdate) {
            sitPlanElement.needsViewUpdate = false;

            if (svg != null) box.innerHTML = svg; else box.innerHTML = '';
        };

        if (boxlabel != null) {
            const adres = sitPlanElement.getAdres() ?? '';
            if (sitPlanElement.labelfontsize != null) boxlabel.style.fontSize = String(sitPlanElement.labelfontsize) + 'px';
            if (adres !== boxlabel.textContent) boxlabel.textContent = adres;
        }
    }

    /**
     * Berekent de positie van het label van een situationplanelement in functie vna de grootte van het situationplanelement.
     * het situationplanelement moet daarvoor reeds een box hebben die aan de DOM werd toegevoegd om de grootte van deze box te kunnen bepalen.
     * 
     * Wijzigt eveneens de grootte, en positie van het DIV-element dat het label van een situationplanelement bevat in de DOM.
     * Controleert ook of het label op een zichtbare pagina staat en maakt het onzichtbaar indien nodig.
     * 
     * @param sitPlanElement - Het situatieplanelement waarvoor de positie van het label moet worden berekend.
     */

    private updateLabelPosition(sitPlanElement: SituationPlanElement | null) {
        if (!sitPlanElement) return;

        const boxlabel = sitPlanElement.boxlabelref as HTMLElement | null;
        if (!boxlabel) return;

        const scale = sitPlanElement.getscale();
        const forbiddenLabelZone = getXYRectangleSize(
            sitPlanElement.sizex * scale + this.selectPadding,
            sitPlanElement.sizey * scale + this.selectPadding,
            sitPlanElement.rotate
        );

        // Berekken de x/left positie van het label
        const adreslocation = sitPlanElement.getAdresLocation();
        const labelX = adreslocation === 'links'
            ? sitPlanElement.posx - forbiddenLabelZone.width / 2 - boxlabel.offsetWidth / 2
            : adreslocation === 'rechts'
                ? sitPlanElement.posx + forbiddenLabelZone.width / 2 + boxlabel.offsetWidth / 2
                : sitPlanElement.posx;
        const left = `${labelX - boxlabel.offsetWidth / 2}px`;
        if (boxlabel.style.left != left) boxlabel.style.left = left; // Vermijd aanpassingen DOM indien niet nodig

        // Bereken de y/top positie van het label
        // Deze bevat wat meer complexe trickery om alles min of meer overeen te doen komen tussen print en scherm
        let top: string;
        let labelY: number;
        switch (adreslocation) {
            case 'boven': {
                top = `${sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.8}px`;
                labelY = sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.5 / 2;
                break;
            }
            case 'onder': {
                top = `${sitPlanElement.posy + forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.2}px`;
                labelY = sitPlanElement.posy + forbiddenLabelZone.height / 2 + boxlabel.offsetHeight * 0.7 / 2;
                break;
            }
            default:
                top = `${sitPlanElement.posy - boxlabel.offsetHeight / 2}px`;
                labelY = sitPlanElement.posy + 1;
        }
        sitPlanElement.setDerivedLabelPosition({ x: labelX, y: labelY });
        if (boxlabel.style.top != top) boxlabel.style.top = top; // Vermijd aanpassingen DOM indien niet nodig

        if (this.sitplan.getActivePage() == sitPlanElement.page) {
            if (boxlabel.classList.contains('hidden')) boxlabel.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        } else {
            if (!boxlabel.classList.contains('hidden')) boxlabel.classList.add('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
    }

    /**
     * Wijzigt de grootte, positie en rotatietransformatie van het DIV-element dat een situationplanelement bevat in de DOM.
     * Controleert ook of het symbool op een zichtbare pagina staat en maakt het onzichtbaar indien nodig.
     * 
     * @param sitPlanElement Het situationplanelement dat aangepast moet worden.
     */

    private updateSymbolPosition(sitPlanElement: SituationPlanElement | null) {

        function getRotationTransform(sitPlanElement: SituationPlanElement | null): string {
            if (!sitPlanElement) return '';

            const [rotation, spiegel] = sitPlanElement.berekenAfbeeldingsRotatieEnSpiegeling();

            return `rotate(${rotation}deg)` + (spiegel ? ' scaleX(-1)' : '');
        }

        if (!sitPlanElement) return;

        const div = sitPlanElement.boxref as HTMLElement | null;
        if (!div) return;

        const scale = sitPlanElement.getscale();
        const contentwidth = sitPlanElement.sizex * scale;
        const contentheight = sitPlanElement.sizey * scale;

        const left = ((sitPlanElement.posx - contentwidth / 2 - this.selectPadding)).toString() + "px";
        if (div.style.left != left) div.style.left = left; // Vermijd aanpassingen DOM indien niet nodig

        const top = ((sitPlanElement.posy - contentheight / 2 - this.selectPadding)).toString() + "px";
        if (div.style.top != top) div.style.top = top; // Vermijd aanpassingen DOM indien niet nodig

        const width = ((contentwidth + this.selectPadding * 2)).toString() + "px";
        if (div.style.width != width) div.style.width = width; // Vermijd aanpassingen DOM indien niet nodig

        const height = ((contentheight + this.selectPadding * 2)).toString() + "px";
        if (div.style.height != height) div.style.height = height; // Vermijd aanpassingen DOM indien niet nodig

        const transform = getRotationTransform(sitPlanElement);
        if (div.style.transform != transform) div.style.transform = transform; // Vermijd aanpassingen DOM indien niet nodig

        if (this.sitplan.getActivePage() == sitPlanElement.page) {
            if (div.classList.contains('hidden')) div.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        } else {
            if (!div.classList.contains('hidden')) div.classList.add('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
    }

    /**
     * Werkt de positie van het symbool bij op de DOM indien nodig.
     * Berekent de positie van het label en werkt deze bij op de DOM indien nodig
     *     * 
     * @param sitPlanElement - Het situationplanelement
     */

    private updateSymbolAndLabelPosition(sitPlanElement: SituationPlanElement | null) {
        if (!sitPlanElement) return;
        this.updateSymbolPosition(sitPlanElement); // Eerst content aanpassen anders kennen we de grootte van het symbool niet
        this.updateLabelPosition(sitPlanElement);
    }

    /**
     * Werkt de situatieplanweergave bij door elementen te synchroniseren met de onderliggende datastructuur.
     *
     * Deze functie zorgt er eerst voor dat alle elementen in het situatieplan een overeenkomstige box in de DOM hebben.
     * Het creëert ontbrekende boxes en voegt deze toe aan het document. Vervolgens werkt het de positie en 
     * het label van elk symbool bij volgens de huidige staat. Daarna past het de weergave aan om de actieve pagina 
     * weer te geven en werkt het de UI-ribbon bij.
     *
     * Deze methode meet en logt de tijd die nodig is om de redraw-operatie te voltooien.
     * Het gebruik van document fragments maakt de redraw aanzienlijk sneller in google chrome.
     * In Firefox is deze ook snel zonder document fragments.
     */

    redraw() {
        const start = performance.now();
        const previousSelection = this.getSelection();
        this.syncToSitPlan();

        const fragment: DocumentFragment = document.createDocumentFragment();

        let appendNeeded = false;
        for (let element of this.sitplan.getElements()) {
            if (!element.boxref) { this.makeBox(element, fragment); appendNeeded = true; }
        }
        if (appendNeeded) this.paper.append(fragment); // We moeten de boxes toevoegen aan de DOM alvorens de label positie te berekenen aangezien we de size van de labels moeten kennen
        this.synchronizeStackingOrder();

        this.showPage(this.sitplan.getActivePage());
        for (let element of this.sitplan.getElements()) {
            if (element.page == this.sitplan.getActivePage()) {
                this.updateBoxContent(element);
                this.updateSymbolAndLabelPosition(element);
            }
        }
        this.restoreSelection(previousSelection);

        const end = performance.now();
        console.log(`Redraw took ${end - start}ms`);
    }

    private synchronizeStackingOrder(): void {
        this.sitplan.getElements().forEach((element, index) => {
            if (element.boxref) element.boxref.style.zIndex = String(index);
            if (element.boxlabelref) element.boxlabelref.style.zIndex = String(index);
        });
    }

    /**
     * Geeft de ordinal van het geselecteerde element terug in de array van het situatieplan.
     * 
     * @returns {number | null} De id van de geselecteerde box, of null.
     */
    getLastSelectedBoxOrdinal(): number | null {
        if (this.selected.length() == 0) return null;

        return this.sitplan.getElements().findIndex(e => e.boxref == this.selected.getLastSelected());
    }

    /**
     * Geeft de ordinals van de geselecteerde elementen terug in de array van het situatieplan.
     * 
     * @returns {number[] | null} De ordinals van de geselecteerde boxes, of null.
     */
    getSelectedBoxesOrdinals(): number[] {
        if (this.selected.length() == 0) return [];

        const elements = this.sitplan.getElements();
        return elements.filter(e => this.selected.includes(e.boxref)).map(e => elements.indexOf(e));
    }

    /**
     * Maakt de gegeven box de geselecteerde box.
     * 
     * @param box - Het element dat geselecteerd moet worden.
     */
    public selectOneBox(box: HTMLElement | null) {
        if (!box) return;
        this.clearSelection(false);
        this.setBoxSelected(box, true);
        this.selected.selectOne(box);
        this.emitSelectionChanged();
    }

    /**
     * Maakt de gegeven box geselecteerd als deze niet null is.
     * 
     * @param box - Het element dat geselecteerd moet worden.
     */
    public selectBox(box: HTMLElement | null) {
        if (!box) return;
        this.setBoxSelected(box, true);
        this.selected.select(box);
        this.emitSelectionChanged();
    }

    /**
     * Selecteert de gegeven box als deze niet al geselecteerd is, of deselecteert deze als deze al geselecteerd is.
     * De allerlaatste box in de selectie wordt nooit gedeselecteerd.
     * 
     * @param box - Het element dat geselecteerd moet worden.
     */
    public selectToggleBox(box: HTMLElement | null) {
        if (!box) return;
        this.selected.toggleButNeverRemoveLast(box);
        this.setBoxSelected(box, this.selected.includes(box));
        this.emitSelectionChanged();
    }

    /**
     * Verwijdert de selectie van alle boxes.
     */
    clearSelection(notify: boolean = true) {
        const hadSelection = this.selected.length() > 0;
        let boxes = this.paper.querySelectorAll('.box');
        boxes.forEach(box => this.setBoxSelected(box as HTMLElement, false));
        this.selected.clear();
        if (notify && hadSelection) this.emitSelectionChanged();
    }

    private getSelection(): SituationPlanSelection {
        const elementIds = this.getSelectedElementIds();
        const primary = (this.selected.getLastSelected() as HTMLElement & {
            sitPlanElementRef?: SituationPlanElement;
        } | null)?.sitPlanElementRef?.id ?? null;
        return { elementIds, primaryElementId: primary };
    }

    private emitSelectionChanged(): void {
        this.onSelectionChanged(this.getSelection());
    }

    private restoreSelection(selection: SituationPlanSelection): void {
        const activePage = this.sitplan.getActivePage();
        const selectedIds = new Set(selection.elementIds);
        const available = this.sitplan.getElements().filter(element => (
            element.page === activePage && selectedIds.has(element.id) && element.boxref !== null
        ));
        this.clearSelection(false);
        for (const element of available) {
            this.setBoxSelected(element.boxref, true);
            this.selected.select(element.boxref);
        }
        const primary = available.find(element => element.id === selection.primaryElementId);
        if (primary?.boxref) this.selected.select(primary.boxref);
        const restored = this.getSelection();
        if (
            restored.primaryElementId !== selection.primaryElementId
            || restored.elementIds.length !== selection.elementIds.length
            || restored.elementIds.some((id, index) => id !== selection.elementIds[index])
        ) this.onSelectionChanged(restored);
    }

    private setBoxSelected(box: HTMLElement, selected: boolean) {
        const canMove = box.getAttribute('movable') !== 'false';
        box.classList.toggle('selected', selected);
        box.classList.toggle('[border-width:calc(var(--selectPadding)*1px)]', selected);
        box.classList.toggle('border-green-600', selected && canMove);
        box.classList.toggle('border-red-600', selected && !canMove);
    }

    /**
     * Send the selected box to the back of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     * 
     * @returns void
     */
    sendToBack() {
        if (this.selected.length() == 0) return;
        this.sitplanStore.commands.sendElementsToBack(this.getSelectedElementIds());
    }

    /**
     * Send the selected box to the front of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     * 
     * @returns void
     */
    bringToFront() {
        if (this.selected.length() == 0) return;
        this.sitplanStore.commands.bringElementsToFront(this.getSelectedElementIds());
    }

    private getSelectedElementIds(): string[] {
        return this.selected.getAllSelected().flatMap(selected => {
            const element = (selected as HTMLElement & { sitPlanElementRef?: SituationPlanElement }).sitPlanElementRef;
            return element ? [element.id] : [];
        });
    }

    /**
     * De halo rond een SituationPlanElement is de ruimte die wordt mee gesleept rond het referentie-element.
     * Deze bevat de unie van alle geselecteerde en movable andere elementen.
     * Deze informatie is nodig om tijdens het slepen te bepalen of alle elementen nog op aanvaardbare plaatsen zitten.
     * 
     * @param sitPlanReferenceElement - Het situatieplanelement in het midden van de geselecteerde boxen.
     * @returns {Object} Een object met de volgende properties:
     *   - left: de afstand links van het element in het midden tot de linker rand van de unie
     *   - right: de afstand rechts van het element in het midden tot de rechter rand van de unie
     *   - top: de afstand boven het element in het midden tot de boven rand van de unie
     *   - bottom: de afstand onder het element in het midden tot de onder rand van de unie
     */
    private getDraggedHaloAroundElement(sitPlanReferenceElement: SituationPlanElement) {
        // Bereken de unie van de centra van alle geselecteerde boxes
        let xmin = sitPlanReferenceElement.posx;
        let ymin = sitPlanReferenceElement.posy;
        let xmax = sitPlanReferenceElement.posx;
        let ymax = sitPlanReferenceElement.posy;

        for (let selected of this.selected.getAllSelected()) {
            if ((selected == null) || (selected === this.draggedBox)) continue;
            const sitPlanElement = (selected as any).sitPlanElementRef;
            if (sitPlanElement == null) continue;
            if (sitPlanElement.movable == false) continue;
            xmin = Math.min(xmin, sitPlanElement.posx);
            ymin = Math.min(ymin, sitPlanElement.posy);
            xmax = Math.max(xmax, sitPlanElement.posx);
            ymax = Math.max(ymax, sitPlanElement.posy);
        }

        // Hoeveel ruimte moeten we laten rond de geselecteerde boxes
        const halo = {
            left: sitPlanReferenceElement.posx - xmin,
            right: xmax - sitPlanReferenceElement.posx,
            top: sitPlanReferenceElement.posy - ymin,
            bottom: ymax - sitPlanReferenceElement.posy
        };

        return halo;
    }

    /**
     * Start een sleepactie voor een box in het situatieplan.
     * 
     * @param event - De gebeurtenis die de sleepactie activeert (muisklik of touchstart).
     */
    private startDrag = (event) => {

        // Initialisatie
        if (event == null) return;
        const shiftPressed = event.shiftKey; //Controleert of de shift-toets is ingedrukt 
        if (event.button == 1) return; //Indien de middelste knop werd gebruikt doen we niets
        // Geklikte box identificeren. Hou er rekening mee dat ook op een boxlabel kan geklikt zijn
        let box: HTMLElement = null;
        const dragTarget = event.currentTarget as HTMLElement & {
            sitPlanElementRef?: SituationPlanElement;
        };
        let sitPlanElement = dragTarget.sitPlanElementRef;
        if (sitPlanElement == null) return;

        if (dragTarget.classList.contains('box')) box = dragTarget;
        else if (dragTarget.classList.contains('boxlabel')) box = sitPlanElement.boxref;
        if (box == null) return;

        // Nu gaan we de box selecteren. Dit moet zowel voor de linker als de rechter muisknop
        // Als de shift toets werd ingedrukt houden we ook de reeds bestaande selectie in stand
        if (shiftPressed) {
            this.selectToggleBox(box);
        } else {
            if (!this.selected.includes(box)) this.clearSelection();     // Wist bestaande selectie als de huidige box er nog niet in zit
            this.selectBox(box); // Voegt de huidige box toe aan de selectie
        }
        event.stopPropagation();   // Voorkomt body klikgebeurtenis

        // Indien de rechter muisknop werd gebruikt gaan we na selectie niet verder met slepen
        if (event.button == 2) return;

        // OK, het is een touch event of de linkse knop dus we gaan verder met slepen maar controlleren eerst of we dat wel mogen
        // we doen dit op basis van de box waarop we geklikt hebben, dit bijft de referentie voor het slepen, ook al bewegen
        // eventueel andere geselecteerde boxes mee. De checks moeten falen voor zowel waarden false als null
        if (!box.classList.contains('selected')) return; // Dit kan vreemd lijken maar is perfect mogelijk, bijvoorbeeld als
        // de shift toets werd ingedrukt om de selectie te verwijderen
        if (box.getAttribute('movable') == 'false') return;

        this.draggedBox = box; // Houdt de box die we aan het slepen zijn
        this.dragHistorySequence += 1;
        this.dragHistoryKey = `situation-drag-${this.dragHistorySequence}`;

        // Hoeveel ruimte slepen we mee in de halo van alle geselecteerde en movable boxes
        this.draggedHalo = this.getDraggedHaloAroundElement(sitPlanElement);

        switch (event.type) {
            case 'mousedown':
                this.mousedrag.startDrag(event.clientX, event.clientY, sitPlanElement.posx, sitPlanElement.posy);
                document.addEventListener('mousemove', this.processDrag);
                document.addEventListener('mouseup', this.stopDrag);
                break;
            case 'touchstart':
                const touch = event.touches[0];
                this.mousedrag.startDrag(touch.clientX, touch.clientY, sitPlanElement.posx, sitPlanElement.posy);
                document.addEventListener('touchmove', this.processDrag, { passive: false });
                document.addEventListener('touchend', this.stopDrag);
                break;
            default:
                console.error('Ongeldige event voor startDrag functie');
        }
    }

    /**
     * Stopt de sleepactie van een box in het situatieplan en stopt de eventlisteners.
     * 
     * @param event - De gebeurtenis die de sleepactie stopt (muisklik release of touchend).
     */
    private stopDrag = (event) => {
        const showArrowHelp = () => {
            void this.noticeStore.commands.show({
                key: 'sitplan.arrowdrag',
                title: 'Tip: symbolen verplaatsen',
                paragraphs: ['Voor fijnere controle tijdens het verschuiven van symbolen kan je ook de pijltjestoetsen gebruiken.'],
                remember: { defaultChecked: true },
            });
        };

        event.stopPropagation();

        switch (event.type) {
            case 'mouseup':
                document.removeEventListener('mousemove', this.processDrag);
                document.removeEventListener('mouseup', this.stopDrag);
                if (this.mousedrag.hassMoved) {
                    showArrowHelp();
                }
                break;
            case 'touchend':
                document.removeEventListener('touchmove', this.processDrag);
                document.removeEventListener('touchend', this.stopDrag);
                if (this.mousedrag.hassMoved) {
                    showArrowHelp();
                }
                break;
            default:
                console.error('Ongeldige event voor stopDrag functie');
        }
        this.draggedBox = null;
        this.dragHistoryKey = null;
    }

    /**
     * Verwerkt een muisklik of touch event tijdens het slepen van een box in het situatieplan.
     * 
     * @param event - De gebeurtenis die verwerkt wordt (muisklik of touchmove).
     */
    private processDrag = (event) => {
        if (this.draggedBox) {

            // Initialisatie
            event.preventDefault();

            const sitPlanReferenceElement = (this.draggedBox as any).sitPlanElementRef;
            if (sitPlanReferenceElement === null) return;

            // Nieuwe locatie van het referentie-element bepalen
            let newPaperPos: { x: number, y: number };
            if (event.type === 'mousemove') newPaperPos = this.mousedrag.returnNewPaperPos(event.clientX, event.clientY);
            else if (event.type === 'touchmove') {
                const touch = event.touches[0];
                newPaperPos = this.mousedrag.returnNewPaperPos(touch.clientX, touch.clientY);
            }

            // De referentiebox moet in de viewBox (het zichtbare deel van het schema) blijven en geen van de geselecteerde
            // elementen mogen links of boven een negatieve coordinaat krijgen en onbereikbaar worden
            const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));

            const viewBox = {
                x: (this.canvas.scrollLeft - paperPadding) / this.zoomfactor,
                y: (this.canvas.scrollTop - paperPadding) / this.zoomfactor,
                width: (this.canvas.offsetWidth) / this.zoomfactor,
                height: (this.canvas.offsetHeight) / this.zoomfactor
            }

            newPaperPos.x = Math.min(viewBox.x + viewBox.width,
                Math.max(viewBox.x, this.draggedHalo.left - paperPadding / this.zoomfactor, newPaperPos.x));
            newPaperPos.y = Math.min(viewBox.y + viewBox.height,
                Math.max(viewBox.y, this.draggedHalo.top - paperPadding / this.zoomfactor, newPaperPos.y));

            // Routeer de volledige selectie als één gevalideerde commandotransactie.
            const shift = { x: newPaperPos.x - sitPlanReferenceElement.posx, y: newPaperPos.y - sitPlanReferenceElement.posy };
            if (this.dragHistoryKey) {
                this.sitplanStore.commands.translateElements(
                    this.getSelectedElementIds(),
                    shift,
                    this.dragHistoryKey,
                );
            }
        }
    }

    /**
     * Selecteer een pagina.
     * 
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    selectPage(page: number) {
        this.sitplanStore.commands.selectPage(page);
    }

    /**
     * Toont enkel de elementen die op de pagina staan die als parameter wordt meegegeven.
     * 
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    showPage(page: number) {
        for (let element of this.sitplan.getElements()) {
            if (element.page != page) {
                element.boxref.classList.add('hidden');
                element.boxlabelref.classList.add('hidden');
            } else {
                element.boxref.classList.remove('hidden');
                element.boxlabelref.classList.remove('hidden');
            }
        }
    }

    /**
     * Voegt een ElectroItem toe aan het situatieplan.
     * 
     * @param id - Het ID van het ElectroItem dat moet worden toegevoegd.
     * @param adrestype - Het type adres van het ElectroItem.
     * @param adres - Het adres van het ElectroItem.
     * @param adreslocation - De locatie van het adres van het ElectroItem.
     * @param labelfontsize - De grootte van het lettertype van het label van het ElectroItem.
     * @param scale - De schaal van het ElectroItem.
     * @param rotate - De rotatie van het ElectroItem.
     */
    addElectroItem = (id: number | null,
        adrestype: AdresType,
        adres: string,
        adreslocation: AdresLocation,
        labelfontsize: number,
        scale: number,
        rotate: number,
        posx: number = null,
        posy: number = null,
    ) => {

        let paperPos = this.canvasPosToPaperPos(50, 50);

        if (posx == null) posx = paperPos.x;
        if (posy == null) posy = paperPos.y;

        if (id != null) {
            const elementId = this.sitplanStore.commands.addOccurrence({
                itemId: id,
                page: this.sitplan.getActivePage(),
                position: { x: posx, y: posy },
                addressType: adrestype,
                address: adres,
                addressLocation: adreslocation,
                labelFontSize: labelfontsize,
                scale,
                rotation: rotate,
            });
            const element = this.sitplan.getElements().find(candidate => candidate.id === elementId);
            this.syncToSitPlan();
            this.clearSelection();
            this.redraw();
            this.selectOneBox(element?.boxref ?? null); // We moeten dit na redraw doen anders bestaat de box mogelijk nog niet
        } else {
            alert('Geen geldig ID ingegeven!');
        }
    }

} // *** END CLASS ***

/** Prepare the legacy canvas without changing application navigation state. */
export function prepareSituationPlanPage(
    structure: Hierarchical_List,
    situationPlanStore: LegacySituationPlanStore,
    noticeStore: NoticeStore,
    onSelectionChanged: SituationPlanSelectionListener = () => {},
) {
    if (!(structure.sitplan)) { structure.sitplan = new SituationPlan(structure) };
    situationPlanStore.synchronizeLegacyDocument(structure);

    if (!(structure.sitplanview)) {
        //Verwijder eerst alle elementen op de DOM met id beginnend met "SP_" om eventuele wezen
        //uit eerdere oefeningen te voorkomen
        let elements = document.querySelectorAll('[id^="SP_"]');
        elements.forEach(e => e.remove());
        //Maak dan de SituationPlanView
        structure.sitplanview = new SituationPlanView(
            document.getElementById('canvas'),
            document.getElementById('paper'),
            situationPlanStore,
            noticeStore,
            onSelectionChanged);

    };
    if (structure.properties.legacySchakelaars == null) {
        if (structure.sitplan.heeftEenzameSchakelaars()) {
            void noticeStore.commands.show({
                key: 'sitplan.legacySwitchSymbols',
                title: 'Weergave van schakelaars kiezen',
                paragraphs: [
                    'Dit oudere dossier bevat schakelaars die vroeger met een kort stukje leiding werden weergegeven.',
                    'Kies of je de vroegere weergave voor dit dossier wilt behouden, of de gangbare symbolen zonder het extra lijntje wilt gebruiken.',
                ],
                illustration: 'switch-symbols',
                actions: [
                    { id: 'keep', label: 'Vroegere weergave behouden', tone: 'neutral' },
                    { id: 'drop', label: 'Nieuwe symbolen gebruiken', tone: 'primary' },
                ],
            }).then(choice => {
                structure.properties.legacySchakelaars = choice === 'keep';
                if (choice === 'drop') structure.sitplan.dropLegacySchakelaars();
                structure.sitplanview.redraw();
            });
            return;
        } else {
            structure.properties.legacySchakelaars = false; // We gaan dadelijk naar de nieuwe situatie
        }
    }

    structure.sitplanview.redraw();
    structure.sitplanview.ensureInitialZoomToFit();
    void noticeStore.commands.show({
        key: 'sitplan.introductie',
        title: 'Situatieschema tekenen',
        paragraphs: [
            'Laad een plattegrond met “Achtergrond” en voeg elektrische symbolen toe vanuit de lijst “Nog te plaatsen”.',
            'Selecteer een symbool om positie, schaal, rotatie, label en koppeling in de rechterzijbalk te bewerken.',
        ],
        link: { label: 'Open de handleiding van het situatieschema', href: 'Documentation/sitplandoc.pdf' },
        remember: {},
    });
}
