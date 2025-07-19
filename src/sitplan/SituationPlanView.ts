import { SituationPlan } from "./SituationPlan";
import { SituationPlanElement } from "./SituationPlanElement";
import { AdresType, AdresLocation } from "./SituationPlanElement";
import { SituationPlanView_SideBar } from "./SituationPlanView_SideBar";
import { SituationPlanView_Selected } from "./SituationPlanView_Selected";
import { ContextMenu } from "./ContextMenu";
import { MouseDrag } from "./MouseDrag";
import { EventManager } from "../EventManager";
import { showSelectPopup, htmlspecialchars } from "../general";
import { getXYRectangleSize } from "./GeometricFunctions";
import { HelperTip } from "../documentation/HelperTip";
import { Dialog } from "../documentation/Dialog";
import { SituationPlanView_ElementPropertiesPopup } from "./SituationPlanView_ElementPropertiesPopup";
import { SituationPlanView_MultiElementPropertiesPopup } from "./SituationPlanView_MultiElementPropertiesPopup";
import { AskLegacySchakelaar } from "../importExport/AskLegacySchakelaar";

enum MovableType {Movable, NotMovable, Mixed, Undefined};

/**
 * Deze class behandelt het tekenen van het situatieplan.
 * 
 * Er wordt regelmatig de terminologie Box gebruikt in de code. Een box is een sleepbaar element en kan zowel
 * een eendraadschema symbool zijn als een ingelezen extern bestand.
 */

export class SituationPlanView {

    private zoomfactor:number = 1;

    /** Referentie naar meerdere DIV's waar het stuatieplan wordt weergegeven 
     *   - paper: hieronder hangen de reële elementen en dit stelt het printable gedeelte van het schema voor
     *   - canvas: deze bevat paper en ook het niet printable gedeelte
    */
    private canvas: HTMLElement = null;
    private paper: HTMLElement = null;

    public sideBar: SituationPlanView_SideBar = new SituationPlanView_SideBar(document.getElementById('sidebar'));

    public contextMenu: ContextMenu = null;
    
    private draggedBox:HTMLElement = null; /** Box die op dit moment versleept wordt of null */
    private draggedHalo: {left: number, top: number, right: number, bottom: number} = {left: 0, top: 0, right: 0, bottom: 0};

    private selected: SituationPlanView_Selected = new SituationPlanView_Selected();

    private mousedrag: MouseDrag; /** behandelt het verslepen van een box */
    
    private sitplan;
    
    private event_manager;

    constructor(canvas: HTMLElement, paper: HTMLElement, sitplan: SituationPlan) {
        this.canvas = canvas;
        this.paper = paper;
        this.contextMenu = new ContextMenu();

        this.sitplan = sitplan;
        this.paper.style.transformOrigin = 'top left'; // Keep the origin point consistent when scaling

        this.mousedrag = new MouseDrag();
        this.event_manager = new EventManager();
        
        // Verwijder alle selecties wanneer we ergens anders klikken dan op een box
        this.event_manager.addEventListener(canvas, 'mousedown', () => { this.contextMenu.hide(); this.clearSelection(); } );
        this.event_manager.addEventListener(canvas, 'touchstart', () => { this.contextMenu.hide(); this.clearSelection(); } );

        // Control wieltje om te zoomen
        this.event_manager.addEventListener(canvas, 'wheel', (event: WheelEvent) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            const zoom = -event.deltaY/1000;
            if (Math.abs(zoom)>=0.01) {
                const menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
                const ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
                const sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));
                let canvasx = event.clientX - sideBarWidth;
                let canvasy = event.clientY - menuHeight - ribbonHeight;
                this.zoomIncrement(-event.deltaY/2000, canvasx, canvasy);
            }
        }, { passive: false })

        // Voegt event handlers toe voor de pijltjestoesten
        this.attachArrowKeys();
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
        for (let element of this.sitplan.elements) {
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
    zoomToFit(paperPadding: number = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'))) {

        const sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));

        const scale = Math.min(
            (this.canvas.offsetWidth - paperPadding * 2) / this.paper.offsetWidth,
            (this.canvas.offsetHeight - paperPadding * 2) / this.paper.offsetHeight,
        );

        this.setzoom(scale);
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
        /*const menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
        const ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
        const sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));
        const paperPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--paperPadding'));*/
        let mousePosOnPaper = this.canvasPosToPaperPos(canvasx, canvasy);
        this.setzoom(
            Math.min(globalThis.SITPLANVIEW_ZOOMINTERVAL.MAX,
                Math.max(globalThis.SITPLANVIEW_ZOOMINTERVAL.MIN, this.zoomfactor * (1 + increment))
            )
        );
        const scrollPos = this.canvasAndPaperPosToScrollPos(canvasx, canvasy, mousePosOnPaper.x, mousePosOnPaper.y);
        this.canvas.scrollLeft = scrollPos.x;
        this.canvas.scrollTop = scrollPos.y;
    }

    private getSelectionMovability() {
        let situatie = MovableType.Undefined;
        for (let selectedBox of this.selected.getAllSelected()) {
            let sitPlanElement:SituationPlanElement = (selectedBox as any).sitPlanElementRef;
            if (sitPlanElement != null) {
                switch (sitPlanElement.movable) {
                    case true:
                        if (situatie == MovableType.Undefined || situatie == MovableType.Movable) situatie = MovableType.Movable;
                        else if (situatie == MovableType.NotMovable) situatie = MovableType.Mixed;
                        break;
                    case false: default:
                        if (situatie == MovableType.Undefined || situatie == MovableType.NotMovable) situatie = MovableType.NotMovable;
                        else if (situatie == MovableType.Movable) situatie = MovableType.Mixed;
                        break;
                }
            }
        }
        return situatie;
    }

    /**
     * Verwisselt de movable property van de geselecteerde box-elementen.
     * 
     * Alle boxen worden gewisseld, ook als ze niet allemaal dezelfde property hebben
     */
    private toggleSelectedBoxesMovable(desiredSituatie = MovableType.Undefined) {

        if (desiredSituatie == MovableType.Undefined) {
            let startSituatie = this.getSelectionMovability(); 
            desiredSituatie = (startSituatie == MovableType.Movable || startSituatie == MovableType.Mixed) 
                                               ? MovableType.NotMovable : MovableType.Movable;
        }

        for (let selectedBox of this.selected.getAllSelected()) {
            let sitPlanElement:SituationPlanElement = (selectedBox as any).sitPlanElementRef;
            if (sitPlanElement != null) {
                let boxlabel = sitPlanElement.boxlabelref as HTMLElement | null;
                switch (desiredSituatie) {
                    case MovableType.NotMovable:
                        sitPlanElement.movable = false; 
                        selectedBox.setAttribute('movable', 'false');
                        if (boxlabel != null) boxlabel.setAttribute('movable', 'false');
                        break;
                    case MovableType.Movable: 
                        sitPlanElement.movable = true; 
                        selectedBox.setAttribute('movable', 'true');
                        if (boxlabel != null) boxlabel.setAttribute('movable', 'true');
                        break;
                    default:
                        // do nothing
                }
            }
        }
             
        //if the above iteration had at least one element, store in globalThis.undostruct
        if (this.selected.length() > 0) globalThis.undostruct.store();
    }

    /**
     * Verandert de pagina van de geselecteerde box-elementen.
     * 
     * Als er elementen geselecteerd zijn, wordt een popup getoond om de pagina te selecteren.
     * De pagina die reeds actief is, wordt niet getoond in de lijst.
     * 
     * @fires showSelectPopup
     * @fires selectPage
     * @fires selectBox
     * @fires globalThis.undostruct.store
     */
    private changePageSelectedBoxes() {
        if (this.selected.length() > 0) {
            const pages = Array.from({length: this.sitplan.numPages}, (_, i) => String(i + 1)).filter(page => page !== String(this.sitplan.activePage));
            let selectedBoxes = this.selected.getAllSelected().filter(e => e != null);
            let selectedMovableBoxes = selectedBoxes.filter(e => (e as any).sitPlanElementRef != null && (e as any).sitPlanElementRef.movable);
            let selectedSitPlanElements = selectedBoxes.map(e => (e as any).sitPlanElementRef).filter(e => e != null);
            let selectedMovableSitPlanElements = selectedSitPlanElements.filter(e => e.movable);
            (async () => {
                const result = await showSelectPopup("Nieuwe pagina:", pages);
                if (result !== null) {
                    for (let element of selectedMovableSitPlanElements) element.changePage(+result);
                    this.selectPage(+result);
                    for (let box of selectedMovableBoxes) this.selectBox(box);
                    globalThis.undostruct.store();
                } else {
                    // Do nothing, selection canceled
                }
            })();    
        }
    }

    /**
     * Toont het contextmenu op de locatie van de muis.
     * 
     * @param event - De muisgebeurtenis die het menu opent (right click).
     */
    private showContextMenu = (event: MouseEvent) => {
        if (this.selected.length() < 1) return;

        let sitPlanElement:SituationPlanElement = (this.selected.getLastSelected() as any).sitPlanElementRef;
        if (sitPlanElement == null) return;

        event.preventDefault();

        this.contextMenu.clearMenu();

        if (sitPlanElement.movable) {
            this.contextMenu.addMenuItem('Draai rechts', () => { this.rotateSelectedBoxes(90, true) }, 'Ctrl →');
            this.contextMenu.addMenuItem('Draai links', () => { this.rotateSelectedBoxes(-90, true) }, 'Ctrl ←');
            this.contextMenu.addLine();
        }

        this.contextMenu.addMenuItem('Bewerk', this.editSelectedBox.bind(this), 'Enter');
        this.contextMenu.addLine();
    
        switch (this.getSelectionMovability()) {
            case MovableType.Movable:
                this.contextMenu.addMenuItem('Vergrendel', this.toggleSelectedBoxesMovable.bind(this), 'Ctrl L');    
                break;
            case MovableType.NotMovable:
                this.contextMenu.addMenuItem('Ontgrendel', this.toggleSelectedBoxesMovable.bind(this), 'Ctrl L');
                break;
            case MovableType.Mixed:
                this.contextMenu.addMenuItem('Vergrendel', () => {this.toggleSelectedBoxesMovable.bind(this)(MovableType.NotMovable)}, 'Ctrl L');
                this.contextMenu.addMenuItem('Ontgrendel', () => {this.toggleSelectedBoxesMovable.bind(this)(MovableType.Movable)}, '');
                break;
        } 
            
        if (sitPlanElement.movable) {
            this.contextMenu.addLine();

            this.contextMenu.addMenuItem('Verwijder', () => {
                this.deleteSelectedBoxes();
                globalThis.undostruct.store(); }, 'Del');
            
            if ( (this.sitplan.numPages > 1) && (sitPlanElement.movable) ) {
                this.contextMenu.addLine();
                this.contextMenu.addMenuItem('Naar pagina..', this.changePageSelectedBoxes.bind(this), 'PgUp/PgDn');
            }
        }

        this.contextMenu.show(event);
    }

    /**
     * Maakt een box en een label op de DOM of in een document-fragmentaan voor een element in het situatieplan.
     * 
     * Een box is een sleepbaar element en kan zowel een symbool van het eendraadschema
     * zijn als een in te laden extern bestand.
     *  
     * Event handlers voor het bewegen met muis of touch worden toegevoegd.
     * 
     * Deze functie checkt om efficientie-redenen niet dat het situatieplanelement geldig is
     * en verwijst naar een bestaand element in het eendraadschema. Deze check dient op
     * voorhand te gebeuren, bijvoorbeeld door gebruik te maken van de functie syncToSitPlan.
     * 
     * @param element - Het element in het situatieplan dat een box op de DOM nodig heeft.
     */
    private makeBox(element: SituationPlanElement, fragment: DocumentFragment = null) {
        // Box aanmaken op de DOM voor het symbool of in te laden externe figuur
        // extra property sitPlanElementRef toegevoegd aan DOM zodat we later ons situatieplan element kunnen terugvinden
        let box = document.createElement('div'); 
        Object.assign(box, {id: element.id, className: "box", sitPlanElementRef: element}); 
        box.setAttribute('movable', (element.movable ? 'true' : 'false'));
        element.boxref = box;

        // Boxlabel aanmaken op de DOM voor de tekst bij het symbool
        let boxlabel = document.createElement('div');
        Object.assign(boxlabel, {id: element.id + '_label', className: "boxlabel", sitPlanElementRef: element});
        boxlabel.setAttribute('movable', (element.movable ? 'true' : 'false'));
        boxlabel.innerHTML = htmlspecialchars(element.getAdres()); // is deze nodig? Wellicht reeds onderdeel van updateContent
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
        box.addEventListener('contextmenu', this.showContextMenu);
        boxlabel.addEventListener('contextmenu', this.showContextMenu);
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
            let adres = sitPlanElement.getAdres();
            if (sitPlanElement.labelfontsize != null) boxlabel.style.fontSize = String(sitPlanElement.labelfontsize) + 'px';
            let newadres = (adres != null ? htmlspecialchars(adres) : '');
            if (newadres != boxlabel.innerHTML) boxlabel.innerHTML = newadres;
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
            sitPlanElement.sizex * scale + globalThis.SITPLANVIEW_SELECT_PADDING, 
            sitPlanElement.sizey * scale + globalThis.SITPLANVIEW_SELECT_PADDING, 
            sitPlanElement.rotate
        );

        // Berekken de x/left positie van het label
        const adreslocation = sitPlanElement.getAdresLocation();
        switch (adreslocation) {
            case 'links': sitPlanElement.labelposx = sitPlanElement.posx - forbiddenLabelZone.width / 2 - boxlabel.offsetWidth / 2; break;
            case 'rechts': sitPlanElement.labelposx = sitPlanElement.posx + forbiddenLabelZone.width / 2 + boxlabel.offsetWidth / 2; break;
            default: sitPlanElement.labelposx = sitPlanElement.posx;
        }
        const left = `${sitPlanElement.labelposx - boxlabel.offsetWidth / 2}px`;
        if (boxlabel.style.left != left) boxlabel.style.left = left; // Vermijd aanpassingen DOM indien niet nodig

        // Bereken de y/top positie van het label
        // Deze bevat wat meer complexe trickery om alles min of meer overeen te doen komen tussen print en scherm
        let top: string;
        switch (adreslocation) {
            case 'boven': {
                top = `${sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.8}px`;
                sitPlanElement.labelposy = sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.5 / 2;
                break;
            }
            case 'onder': {
                top = `${sitPlanElement.posy + forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.2}px`;
                sitPlanElement.labelposy = sitPlanElement.posy + forbiddenLabelZone.height / 2 + boxlabel.offsetHeight * 0.7 / 2;
                break;
            }
            default:
                top = `${sitPlanElement.posy - boxlabel.offsetHeight / 2}px`;
                sitPlanElement.labelposy = sitPlanElement.posy + 1;
        }
        if (boxlabel.style.top != top) boxlabel.style.top = top; // Vermijd aanpassingen DOM indien niet nodig

        if (this.sitplan.activePage == sitPlanElement.page) {
            if (boxlabel.classList.contains('hidden')) boxlabel.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        } else  {
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
        const contentwidth = sitPlanElement.sizex*scale;
        const contentheight = sitPlanElement.sizey*scale;
    
        const left = ((sitPlanElement.posx-contentwidth/2-globalThis.SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        if (div.style.left != left) div.style.left = left; // Vermijd aanpassingen DOM indien niet nodig

        const top = ((sitPlanElement.posy-contentheight/2-globalThis.SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        if (div.style.top != top) div.style.top = top; // Vermijd aanpassingen DOM indien niet nodig

        const width = ((contentwidth + globalThis.SITPLANVIEW_SELECT_PADDING*2)).toString() + "px";
        if (div.style.width != width) div.style.width = width; // Vermijd aanpassingen DOM indien niet nodig

        const height = ((contentheight + globalThis.SITPLANVIEW_SELECT_PADDING*2)).toString() + "px";
        if (div.style.height != height) div.style.height = height; // Vermijd aanpassingen DOM indien niet nodig
        
        const transform = getRotationTransform(sitPlanElement);
        if (div.style.transform != transform) div.style.transform = transform; // Vermijd aanpassingen DOM indien niet nodig

        if (this.sitplan.activePage == sitPlanElement.page) {
            if (div.classList.contains('hidden')) div.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        } else  {
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
        this.syncToSitPlan();
        
        const fragment: DocumentFragment = document.createDocumentFragment();

        let appendNeeded = false;
        for (let element of this.sitplan.elements) {
            if (!element.boxref) { this.makeBox(element, fragment); appendNeeded = true; }
        }
        if (appendNeeded) this.paper.append(fragment); // We moeten de boxes toevoegen aan de DOM alvorens de label positie te berekenen aangezien we de size van de labels moeten kennen

        this.showPage(this.sitplan.activePage);
        for (let element of this.sitplan.elements) {
            if (element.page == this.sitplan.activePage) {
                this.updateBoxContent(element);
                this.updateSymbolAndLabelPosition(element);
            }
        }

        this.updateRibbon();
        this.sideBar.render();

        const end = performance.now();
        console.log(`Redraw took ${end - start}ms`);
    }

    /**
     * Geeft de ordinal van het geselecteerde element terug in de array van het situatieplan.
     * 
     * @returns {number | null} De id van de geselecteerde box, of null.
     */
    getLastSelectedBoxOrdinal(): number | null {
        if (this.selected.length() == 0) return null;
    
        return this.sitplan.elements.findIndex(e => e.boxref == this.selected.getLastSelected());
    }

    /**
     * Geeft de ordinals van de geselecteerde elementen terug in de array van het situatieplan.
     * 
     * @returns {number[] | null} De ordinals van de geselecteerde boxes, of null.
     */
    getSelectedBoxesOrdinals(): number[] {
        if (this.selected.length() == 0) return [];
    
        return this.sitplan.elements.filter(e => this.selected.includes(e.boxref)).map(e => this.sitplan.elements.indexOf(e));
    }

    /**
     * Maakt de gegeven box de geselecteerde box.
     * 
     * @param box - Het element dat geselecteerd moet worden.
     */
    public selectOneBox(box: HTMLElement | null) {
        if (!box) return;
        box.classList.add('selected');
        this.selected.selectOne(box);
        globalThis.undostruct.updateSelectedBoxes();
    }

    /**
     * Maakt de gegeven box geselecteerd als deze niet null is.
     * 
     * @param box - Het element dat geselecteerd moet worden.
     */
    public selectBox(box: HTMLElement | null) {
        if (!box) return;
        box.classList.add('selected');
        this.selected.select(box);
        globalThis.undostruct.updateSelectedBoxes();
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
        if (this.selected.includes(box)) box.classList.add('selected'); else box.classList.remove('selected');
        globalThis.undostruct.updateSelectedBoxes();
    }

    /**
     * Verwijdert de selectie van alle boxes.
     */
    clearSelection() {
        let boxes = document.querySelectorAll('.box');
        boxes.forEach(b => b.classList.remove('selected'));
        this.selected.clear();
    }

    /**
     * Verwijdert de geselecteerde boxen en verwijdert deze ook uit het situatieplan.
     * Verwijdert ook de bijhorende labels.
     */
    deleteSelectedBoxes() {
        if (this.selected.length() == 0) return;

        for (let selectedBox of this.selected.getAllSelected()) {
            let sitPlanElement = (selectedBox as any).sitPlanElementRef;
            if (sitPlanElement == null) continue;
            if (sitPlanElement.movable == false) continue;

            selectedBox.remove();
            if (sitPlanElement.boxlabelref != null) sitPlanElement.boxlabelref.remove();

            this.sitplan.removeElement(sitPlanElement);
        }
        this.selected.clear();
        this.sideBar.render();
    }

    /**
     * Send the selected box to the back of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     * 
     * @returns void
     */
    sendToBack() {
        if (this.selected.length() == 0) return;

        for (let element of this.sitplan.elements) {
            if (element.boxref != null) {
                let newzindex;

                if ( (this.selected.includes(element.boxref)) && (element.movable != false) )
                    newzindex = 0
                else 
                    newzindex = (parseInt(element.boxref.style.zIndex) || 0)+1; 
                
                element.boxref.style.zIndex = newzindex.toString();
                if (element.boxlabelref != null) { 
                    element.boxlabelref.style.zIndex = newzindex.toString(); }
                
            }
        }            
        
        this.sitplan.orderByZIndex();
        globalThis.undostruct.store();
    }

    /**
     * Send the selected box to the front of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     * 
     * @returns void
     */
    bringToFront(undoStore: boolean = true) {
        if (this.selected.length() == 0) return;

        let newzindex = 0;
        for (let element of this.sitplan.elements) {
            if ( (element.boxref != null) && (!this.selected.includes(element.boxref)) ) {
                newzindex = Math.max(newzindex, parseInt(element.boxref.style.zIndex) || 0);
            } 
        }
        newzindex += 1;            

        for (let selected of this.selected.getAllSelected()) {
            let element = (selected as any).sitPlanElementRef;
            if (element == null) { this.sitplan.syncToSitPlan(); return; }
            if (element.movable == false) continue;
            selected.style.zIndex = newzindex.toString();
            if (element.boxlabelref != null) element.boxlabelref.style.zIndex = newzindex.toString();
        }

        this.sitplan.orderByZIndex();
        if (undoStore) globalThis.undostruct.store();
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
            if ( (selected == null) || (selected === this.draggedBox) ) continue;
            const sitPlanElement = (selected as any).sitPlanElementRef;
            if (sitPlanElement == null) continue;
            if (sitPlanElement.movable == false) continue;
            xmin = Math.min(xmin, sitPlanElement.posx);
            ymin = Math.min(ymin, sitPlanElement.posy);
            xmax = Math.max(xmax, sitPlanElement.posx);
            ymax = Math.max(ymax, sitPlanElement.posy);
        }

        // Hoeveel ruimte moeten we laten rond de geselecteerde boxes
        const halo = {left: sitPlanReferenceElement.posx - xmin, 
            right: xmax - sitPlanReferenceElement.posx, 
            top: sitPlanReferenceElement.posy - ymin,
            bottom: ymax - sitPlanReferenceElement.posy};  

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
        this.contextMenu.hide();
        
        // Geklikte box identificeren. Hou er rekening mee dat ook op een boxlabel kan geklikt zijn
        let box:HTMLElement = null;
        let sitPlanElement = event.target.sitPlanElementRef;
        if (sitPlanElement == null) return;

        if (event.target.classList.contains('box')) box = event.target;
        else if (event.target.classList.contains('boxlabel')) box = sitPlanElement.boxref;
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
        function showArrowHelp() {
            const helperTip = new HelperTip(globalThis.appDocStorage);
            helperTip.show('sitplan.arrowdrag',
            `<h3>Tip: Symbolen verplaatsen</h3>
            <p>Voor fijnere controle tijdens het verschuiven van symbolen kan u ook de pijltjes op het toetsenbord gebruiken.</p>`,true);
        }

        event.stopPropagation();

        switch (event.type) {
            case 'mouseup':
                document.removeEventListener('mousemove', this.processDrag);
                document.removeEventListener('mouseup', this.stopDrag);
                if (this.mousedrag.hassMoved) {
                    showArrowHelp();
                    globalThis.undostruct.store();
                }
                break;
            case 'touchend':
                document.removeEventListener('touchmove', this.processDrag);
                document.removeEventListener('touchend', this.stopDrag);
                if (this.mousedrag.hassMoved) {
                    showArrowHelp();
                    globalThis.undostruct.store();
                }
                break;
            default:
                console.error('Ongeldige event voor stopDrag functie');
        }
        this.draggedBox = null;        
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
            let newPaperPos: {x: number, y: number};
            if (event.type === 'mousemove') newPaperPos = this.mousedrag.returnNewPaperPos(event.clientX,event.clientY);
            else if (event.type === 'touchmove') {
                const touch = event.touches[0];
                newPaperPos = this.mousedrag.returnNewPaperPos(touch.clientX,touch.clientY);
            }  

            // De referentiebox moet in de viewBox (het zichtbare deel van het schema) blijven en geen van de geselecteerde
            // elementen mogen links of boven een negatieve coordinaat krijgen en onbereikbaar worden
            const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));

            const viewBox = { 
                x: (this.canvas.scrollLeft - paperPadding) / this.zoomfactor,
                y: (this.canvas.scrollTop - paperPadding) / this.zoomfactor,
                width: (this.canvas.offsetWidth) / this.zoomfactor,
                height: (this.canvas.offsetHeight) / this.zoomfactor }
            
            newPaperPos.x = Math.min(viewBox.x + viewBox.width, 
                                Math.max(viewBox.x, this.draggedHalo.left - paperPadding / this.zoomfactor, newPaperPos.x));
            newPaperPos.y = Math.min(viewBox.y + viewBox.height,
                                Math.max(viewBox.y, this.draggedHalo.top - paperPadding / this.zoomfactor, newPaperPos.y));
    
            // Wijzig nu de positie van alle elementen en herteken
            const shift = {x: newPaperPos.x - sitPlanReferenceElement.posx, y: newPaperPos.y - sitPlanReferenceElement.posy};
            for (let selected of this.selected.getAllSelected()) {
                if (selected == null) continue;
                const sitPlanElement = (selected as any).sitPlanElementRef;
                if (sitPlanElement == null) continue;
                if (sitPlanElement.movable === false) continue;
                sitPlanElement.posx += shift.x;
                sitPlanElement.posy += shift.y;
                this.updateSymbolAndLabelPosition(sitPlanElement);
            }
        }
    } 

    /**
     * Selecteer een pagina.
     * 
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    selectPage(page: number) {
        this.sitplan.activePage = page;
        this.redraw();
    }

    /**
     * Toont enkel de elementen die op de pagina staan die als parameter wordt meegegeven.
     * 
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    showPage(page: number) {
        this.clearSelection();
        for (let element of this.sitplan.elements) {
            if (element.page != page) {
                element.boxref.classList.add('hidden');
                element.boxlabelref.classList.add('hidden');
            } else {
                element.boxref.classList.remove('hidden');
                element.boxlabelref.classList.remove('hidden');
            }
        }
        this.updateRibbon();
    }

    /**
     * Roteert de geselecteerde box met het opgegeven aantal graden.
     * De box wordt geroteerd rond zijn middelpunt.
     * De rotatie wordt cumulatief uitgevoerd, d.w.z. de nieuwe rotatie wordt toegevoegd aan de vorige.
     * De rotatie is beperkt tot het bereik [0, 360) graden.
     * Deze functie slaat de status op, zodat het aanroepen van undo() deze actie ongedaan maakt.
     * @param degrees - Het aantal graden waarmee de box moet worden gedraaid.
     */
    rotateSelectedBoxes(degrees: number, rotateLabelToo: boolean = false) {
        /**
         * Roteert het label.
         *
         * Het label can de volgende locaties hebben, 'boven', 'rechts','onder', 'links'.
         *
         * @param cycle - Het aantal keren dat het label met 90 graden moet worden gedraaid.
         *                1 is een draaing van 90 graden naar rechts, -1 is een draaing van 90 graden naar links.
         */
        function rotateLabel(pic, cycle) {
            const locations = ['boven','rechts','onder','links'];
            if (pic == null) return;
            const index = locations.indexOf(pic.getAdresLocation());
            pic.setAdresLocation(locations[(index + cycle + 4) % 4]);
        };

        for (let selected of this.selected.getAllSelected()) {
            let pic = (selected as any).sitPlanElementRef;
            if (pic == null) continue;
            if (pic.movable == false) continue;
            pic.rotate = (pic.rotate + degrees) % 360;
            if (rotateLabelToo) rotateLabel.bind(this)(pic, Math.round(degrees / 90));
            this.updateBoxContent(pic);
            this.updateSymbolAndLabelPosition(pic);
        }

        if (this.selected.length() > 0) globalThis.undostruct.store();
    }

    unattachArrowKeys() {
        this.event_manager.addEventListener(document, 'keydown', () => {} );
    }

    /**
     * Voegt eventlisteners toe om pijltjestoetsen te hanteren.
     * 
     * Wanneer een pijltjestoets wordt ingedrukt, en er is een box geselecteerd, dan wordt de positie van de box aangepast.
     * De positie van de box wordt aangepast door de posx of posy van het element in het situatieplan te veranderen.
     * Daarna wordt de functie updateSymbolAndLabelPosition aangeroepen om de positie van het symbool en het label van de box te updaten.
     */
    attachArrowKeys() {

        this.event_manager.addEventListener(document, 'keydown', (event) => {

            this.contextMenu.hide();
            if (document.getElementById('outerdiv').style.display == 'none') return; // Check if we are really in the situationplan, if not, the default scrolling action will be executed by the browser
            if (document.getElementById('popupOverlay') != null) return; // We need the keys when editing symbol properties.

            let selectedBoxes = this.selected.getAllSelected().filter(e => e != null);
            let selectedMovableBoxes = selectedBoxes.filter(e => (e as any).sitPlanElementRef != null && (e as any).sitPlanElementRef.movable);
            let selectedSitPlanElements = selectedBoxes.map(e => (e as any).sitPlanElementRef).filter(e => e != null);
            let selectedMovableSitPlanElements = selectedSitPlanElements.filter(e => e.movable);

            const paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));
            
            // Loop enkel voor undo-redo, andere acties beneden
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'z':
                        event.preventDefault();
                        globalThis.undostruct.undo();
                        return;
                    case 'y':
                        event.preventDefault();
                        globalThis.undostruct.redo();
                        return;
                    case 'r':
                        event.preventDefault();
                        const helperTip = new HelperTip(globalThis.appDocStorage);
                        helperTip.show('sitplan.Ctrl_r_key',
                        `<h3>Ctrl-r genegeerd</h3>
                        <p>Om te vermijden dat u per ongeluk de pagina ververst en uw werk verliest is de refresh sneltoets uitgeschakeld in het situatieschema.</p>`,true);
                        return;
                    default:
                        //do nothing as we also have ctrl + arrow keys here below.
                } 
            }

            // Loop indien box geselecteerd
            if (this.selected.length() > 0) { // Check if we have a selected box, if not, the default scrolling action will be executed by the browser
                event.preventDefault();
                const sitPlanElement = (this.selected.getLastSelected() as any).sitPlanElementRef;
                if (!sitPlanElement) return;

                const draggedHalo = this.getDraggedHaloAroundElement(sitPlanElement);

                if (event.ctrlKey) {
                    switch (event.key) {
                        case 'ArrowLeft':
                            this.rotateSelectedBoxes(-90, true);
                            return;
                        case 'ArrowRight':
                            this.rotateSelectedBoxes(90, true);
                            return;
                        case 'l':
                        case 'L':
                            this.toggleSelectedBoxesMovable();
                            return;
                        default:
                            return;
                    }  
                } else {
                    switch (event.key) {
                        case 'ArrowLeft': {          
                            const shiftx = Math.max(draggedHalo.left - paperPadding / this.zoomfactor, sitPlanElement.posx - 1) - sitPlanElement.posx;
                            for (let element of selectedMovableSitPlanElements) element.posx += shiftx;
                            globalThis.undostruct.store('arrowMove' + sitPlanElement.id); // technically this is not correct and should contain the list of all moved objects
                            break; }
                        case 'ArrowRight':
                            const shiftx = 1;    
                            for (let element of selectedMovableSitPlanElements) element.posx += shiftx;
                            globalThis.undostruct.store('arrowMove' + sitPlanElement.id); // technically this is not correct and should contain the list of all moved objects
                            break;
                        case 'ArrowUp': {
                            const shifty = Math.max(draggedHalo.top - paperPadding / this.zoomfactor, sitPlanElement.posy - 1) - sitPlanElement.posy;
                            for (let element of selectedMovableSitPlanElements) element.posy += shifty;   
                            globalThis.undostruct.store('arrowMove' + sitPlanElement.id); // technically this is not correct and should contain the list of all moved objects
                            break; }
                        case 'ArrowDown':
                            const shifty = 1;    
                            for (let element of selectedMovableSitPlanElements) element.posy += shifty;   
                            globalThis.undostruct.store('arrowMove' + sitPlanElement.id); // technically this is not correct and should contain the list of all moved objects
                            break;
                        case 'PageDown':
                            {
                                let oldPage = sitPlanElement.page;
                                let newPage = (sitPlanElement.page + 1);
                                if (newPage > this.sitplan.numPages) newPage = 1;

                                if (newPage == oldPage) return;

                                for (let element of selectedMovableSitPlanElements) element.changePage(newPage);
                                this.selectPage(newPage); // Naar de nieuwe pagina gaan, dit wist ook de selectie

                                for (let box of selectedMovableBoxes) this.selectBox(box); // De geselecteerde elementen terug selecteren
                                this.bringToFront(false); // Indien de pagina is gewijzigd, breng de nog geselecteerde elementen naar voren
                                
                                globalThis.undostruct.store();
                            }
                            break;
                        case 'PageUp':
                            {
                                let oldPage = sitPlanElement.page;
                                let newPage = (sitPlanElement.page - 1);
                                if (newPage < 1) newPage = this.sitplan.numPages;

                                if (newPage == oldPage) return;

                                const boxarray = this.selected.getAllSelected(); // eerst bestaande selectie bewaren

                                for (let element of selectedMovableSitPlanElements) element.changePage(newPage);       
                                this.selectPage(newPage); // Naar de nieuwe pagina gaan, dit wist ook de selectie

                                for (let box of selectedMovableBoxes) this.selectBox(box); // De geselecteerde elementen terug selecteren
                                this.bringToFront(false); // Indien de pagina is gewijzigd, breng de nog geselecteerde elementen naar voren
                                
                                globalThis.undostruct.store();
                            } 
                            break;
                        case 'Escape':
                            this.clearSelection();
                            break;
                        case 'Enter':
                            this.editSelectedBox();
                            return;
                        case 'Delete':
                            if (this.selected.length() > 0) {    
                                this.deleteSelectedBoxes();
                                globalThis.undostruct.store();
                            }
                            break;
                        default:
                            return;
                    }
                }

                // We berekenen de selectie opnieuw want deze kan gewijzigd zijn, o.a. door de delete knop
                selectedBoxes = this.selected.getAllSelected().filter(e => e != null);
                selectedMovableBoxes = selectedBoxes.filter(e => (e as any).sitPlanElementRef != null && (e as any).sitPlanElementRef.movable);
                selectedSitPlanElements = selectedBoxes.map(e => (e as any).sitPlanElementRef).filter(e => e != null);
                selectedMovableSitPlanElements = selectedSitPlanElements.filter(e => e.movable);
                
                for (let element of selectedMovableSitPlanElements) this.updateSymbolAndLabelPosition(element);

            // Loop indien geen box geselecteerd
            } else {
                switch (event.key) {
                    case 'PageDown':
                        {   
                            let oldPage = this.sitplan.activePage;
                            let newPage = (oldPage + 1);
                            if (newPage > this.sitplan.numPages) newPage = 1;
                            this.selectPage(newPage);
                            if (newPage != oldPage) globalThis.undostruct.store("changePage");
                        }
                        break;
                    case 'PageUp':
                        {
                            let oldPage = this.sitplan.activePage;
                            let newPage = (oldPage - 1);
                            if (newPage < 1) newPage = this.sitplan.numPages;
                            this.selectPage(newPage);
                            if (newPage != this.sitplan.activePage) globalThis.undostruct.store("changePage");
                        } 
                        break;
                }
            }
        });
    }

    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box te verwijderen.
     * 
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    attachDeleteButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { 
            this.contextMenu.hide();
            if (this.selected.length() > 0) {
                this.deleteSelectedBoxes(); 
                const helperTip = new HelperTip(globalThis.appDocStorage);
                helperTip.show('sitplan.deletekey',
                `<h3>Tip: Symbolen verwijderen</h3>
                <p>Bespaar tijd en gebruik de 'Delete' toets op het toetsenbord om symbolen te verwijderen.</p>`,true);
                globalThis.undostruct.store();
            }
        } );      
    };

    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box naar de achtergrond te sturen.
     * 
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    attachSendToBackButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.contextMenu.hide(); this.sendToBack(); } ); 
    };

    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box naar de voorgrond te brengen.
     * 
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    attachBringToFrontButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.contextMenu.hide(); this.bringToFront(); } ); 
    };

    /**
     * Hangt een klik event listener aan het gegeven element met als doel de zoomfactor aan te passen.
     * 
     * @param elem - Het html element waar de listener wordt aan gehangen.
     * @param increment - De waarde waarmee de zoomfactor wordt aangepast. Een positieve waarde vergroot de zoom,
     *                    terwijl een negatieve waarde de zoom verkleint.
     */
    attachZoomButton(elem: HTMLElement, increment: number) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.contextMenu.hide(); this.zoomIncrement(increment); } ); 
    };

    /**
     * Hangt een klik event listener aan het gegeven element met als doel het situatieplan
     * aan te passen aan de beschikbare ruimte in het browservenster.
     * 
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    attachZoomToFitButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.contextMenu.hide(); this.zoomToFit(); } ); 
    };

    /**
     * Hangt een klik event listener aan het gegeven element om een bestand te kiezen en een verandering event listener aan het invoerelement
     * om een nieuw element vanuit een bestand aan het situatieplan toe te voegen.
     * 
     * @param elem - Het HTML-element dat bij een klik een bestand moet openen.
     * @param fileinput - Het invoerelement voor bestanden dat het bestand uploadt wanneer het verandert.
     */
    attachAddElementFromFileButton(elem: HTMLElement, fileinput: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => { this.contextMenu.hide(); fileinput.click(); } );
        this.event_manager.addEventListener(fileinput, 'change', (event) => { 
            let element = this.sitplan.addElementFromFile(event, this.sitplan.activePage, this.paper.offsetWidth/2, this.paper.offsetHeight/2, 
                (() => {

                    this.syncToSitPlan();
                    this.clearSelection();
                    element.needsViewUpdate = true; // for an external SVG this is needed, for an electroItem it is automatically set (see next function)

                    const lastscale = element.scale;
                    element.scaleSelectedBoxToPaperIfNeeded(this.paper.offsetWidth*0.995,this.paper.offsetHeight*0.995,this.sitplan.defaults.scale);

                    this.redraw();
                    this.selectOneBox(element.boxref); // We moeten dit na redraw doen anders bestaat de box mogelijk nog niet
                    
                    (fileinput as HTMLInputElement).value = ''; // Zorgt ervoor dat hetzelfde bestand twee keer kan worden gekozen en dit nog steeds een change triggert

                    if ( (element.sizex == 0) || (element.sizey == 0) ) {
                        //Use the built in help top to display a text that the image is invalid and remove it again
                        this.deleteSelectedBoxes();
                        const dialog = new Dialog('Ongeldige afmetingen', 
                            '<p>Dit bestand wordt door de browser herkend als een afbeelding met hoogte of breedte gelijk aan 0.</p>'+
                            '<p>Dit bestand kan bijgevolg niet geladen worden.</p>');
                        dialog.show();
                        return;
                    }

                    if (element.svg && element.svg.length > 5000000) {
                        //Use the built in help top to display a text that the image is rather large
                        const dialog = new Dialog('Zeer groot bestand', 
                            '<p>Dit bestand is met ' + (element.svg.length / 1000000 * 6 / 8).toFixed(0) + 'MB behoorlijk groot en kan uw browser vertragen '+
                            'of tot moeilijkheden leiden bij het opslaan en/of printen.</p><p>We raden aan het bestand te verkleinen tot beneden 5MB, bijvoorbeeld '+
                            'door het gebruik van het jpeg-bestandsformaat en/of verlagen van de resolutie.</p>'
                        );
                        dialog.show();
                    }

                    this.bringToFront(); // Deze slaat ook automatisch undo informatie op dus we moeten geen globalThis.undostruct.store() meer doen.
                                         // We voeren deze om dezelfde reden pas uit na het checken dat het bestand geldig is.

                    if (element.scale != lastscale) {
                        //Use the built in help top to display a text that the image was scaled
                        const helperTip = new HelperTip(globalThis.appDocStorage);
                        helperTip.show('sitplan.scaledImageToFit',
                        '<h3>Mededeling</h3>'+
                        '<p>Deze afbeelding werd automatisch verkleind om binnen de tekenzone te blijven.</p>'+
                        '<p>Kies "Bewerk" in het menu om de schaalfactor verder aan te passen indien gewenst.</p>',true);
                    }
                    
                }).bind(this)
            );
        });
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
                      options: any = { undoStore: true } ) => {

        if (options.undoStore == undefined) options.undoStore = true; // default is to store the action in the undo stack
        
        let paperPos = this.canvasPosToPaperPos(50, 50);

        if (posx == null) posx = paperPos.x;
        if (posy == null) posy = paperPos.y;

        if (id != null) {
            let element = this.sitplan.addElementFromElectroItem(id, this.sitplan.activePage, posx, posy, 
                                                      adrestype, adres, adreslocation, labelfontsize,
                                                      scale, rotate);
            if (element != null) {
                this.syncToSitPlan();
                this.clearSelection();
                this.redraw();
                this.selectOneBox(element.boxref); // We moeten dit na redraw doen anders bestaat de box mogelijk nog niet
                this.bringToFront(options.undoStore); // Deze slaat ook automatisch undo informatie op dus we moeten geen globalThis.undostruct.store() meer doen.
            }
        } else {
            alert('Geen geldig ID ingegeven!');
        }
    }

    /**
     * Hangt een klik event listener aan het gegeven element om een nieuw Electro_Item aan het situatieplan toe te voegen.
     * 
     * @param elem - Het HTML-element dat bij een klik een nieuw element toevoegt.
     */
    attachAddElectroItemButton(elem: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => {
            this.contextMenu.hide();
            this.unattachArrowKeys();
            SituationPlanView_ElementPropertiesPopup(
                /* no element selected */
                null,
                /* OK button callback */
                (electroid, adrestype, adres, adreslocation, labelfontsize, scale, rotate) => {
                    this.attachArrowKeys();
                    this.addElectroItem(electroid, adrestype as AdresType, adres, adreslocation as AdresLocation, labelfontsize, scale, rotate);
                },
                /* Cancel button callback */
                () => {
                    this.attachArrowKeys();
                });
        });
    }

    /**
     * Toont een popup met de eigenschappen van het geselecteerde element en maakt het mogelijk om deze te bewerken.
     */
    editSelectedBox = (cancelCallback?: () => void) => {
        this.contextMenu.hide();
        this.unattachArrowKeys();
        if (this.selected.length() == 1) {
            const sitPlanElement = (this.selected.getLastSelected() as any).sitPlanElementRef;
            if (!sitPlanElement) return;

            SituationPlanView_ElementPropertiesPopup(sitPlanElement,
                /* OK button callback */
                (electroid, adrestype, adres, adreslocation, labelfontsize, scale, rotate) => {
                    this.attachArrowKeys();
                    if (electroid != null) {
                        sitPlanElement.setElectroItemId(electroid);
                        sitPlanElement.setAdres(adrestype,adres,adreslocation);
                    }
                    sitPlanElement.labelfontsize = labelfontsize;
                    sitPlanElement.setscale(scale);
                    sitPlanElement.rotate = rotate;
                    
                    this.updateBoxContent(sitPlanElement); //content needs to be updated first to know the size of the box
                    this.updateSymbolAndLabelPosition(sitPlanElement);
                    globalThis.undostruct.store();
                }, 
                /* Cancel button callback */
                () => {
                    this.attachArrowKeys();
                    if (cancelCallback) cancelCallback(); },  
                /* Opties */
                { toonElementZoeker: false } // opties
            );
        } else if (this.selected.length() > 1) {
            const elements: SituationPlanElement[] = [];
            for (let selected of this.selected.getAllSelected()) {
                const sitPlanElement = (selected as any).sitPlanElementRef;
                if (sitPlanElement == null) continue;
                elements.push(sitPlanElement);
            }
            SituationPlanView_MultiElementPropertiesPopup(elements,
                /* OK button callback */
                (labelfontsize, scale, rotate) => {
                    this.attachArrowKeys();
                    for (let sitPlanElement of elements) {
                        if (labelfontsize != null) sitPlanElement.labelfontsize = labelfontsize;
                        if (scale != null) sitPlanElement.setscale(scale);
                        if (rotate != null) sitPlanElement.rotate = rotate;
                        this.updateBoxContent(sitPlanElement); //content needs to be updated first to know the size of the box
                        this.updateSymbolAndLabelPosition(sitPlanElement);
                    }
                    globalThis.undostruct.store();
                }, 
                /* Cancel button callback */
                () => {
                    this.attachArrowKeys();
                    if (cancelCallback) cancelCallback(); }
            );    
        }
    }

    /**
     * Hangt een klik event listener aan het gegeven element om een bestaand element in het situatieplan te bewerken.
     * 
     * @param elem - Het HTML-element dat bij een klik een bestaand element in het situatieplan bewerkt.
     */
    attachEditButton(elem: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => {this.editSelectedBox()} );
    }


    /**
     * Verwijdert alle elementen van de pagina met het gegeven nummer.
     * 
     * @param page - Het nummer van de pagina die leeg gemaakt moet worden.
     */
    wipePage(page: number) {
        let ElementsToWipe = this.sitplan.elements.filter((element) => element.page == page);

        for (let element of ElementsToWipe) {
            if (element == null) continue;
            if (element.boxref != null) element.boxref.remove();
            if (element.boxlabelref != null) element.boxlabelref.remove();
            this.sitplan.removeElement(element);
        }  
    }

    /**
     * Maakt de knoppen in de ribbon aan om onder andere pagina's te selecteren, elementen te laden of verwijderen en pagina's te zoomen.
     * Deze functie wordt aangeroepen telkens er iets in de toestand verandert die mogelijk kan leiden tot aanpassingen in de ribbon.
     * 
     * Deze functie hangt ook onclick events aan interne functies in deze class.
     * 
     * TODO: Er zijn efficientiewinsten mogelijk door niet telkens de hele ribbon te hertekenen.
     */
    updateRibbon() {
        if (globalThis.structure.properties.currentView != "draw") return;

        let outputleft: string = "";
        let outputright: string = "";

        // -- Undo/redo buttons --

        outputleft += `
            <div class="icon" ${(globalThis.undostruct.undoStackSize() > 0 ? 'onclick="undoClicked()"' : 'style="filter: opacity(45%)"')}>
                <img src="gif/undo.png" alt="Ongedaan maken" class="icon-image">
                <span class="icon-text">Ongedaan maken</span>
            </div>
            <div class="icon"  ${(globalThis.undostruct.redoStackSize() > 0 ? 'onclick="redoClicked()"' : 'style=\"filter: opacity(45%)\"')}>
                <img src="gif/redo.png" alt="Opnieuw" class="icon-image">
                <span class="icon-text">Opnieuw</span>
            </div>`

        // -- Visuals om items te laden of verwijderen --

        outputleft += `
            <span style="display: inline-block; width: 30px;"></span>
            <div class="icon" id="button_Add">
                <span class="icon-image" style="font-size:24px">➕</span>
                <span class="icon-text">Uit bestand</span>
            </div>
            <div class="icon" id="button_Add_electroItem">
                <span class="icon-image" style="font-size:24px">➕</span>
                <span class="icon-text">Uit schema</span>
            </div>
            <div class="icon" id="button_Delete">
                <span class="icon-image" style="font-size:24px">🗑</span>
                <span class="icon-text">Verwijder</span>
            </div>`;

        // -- Visuals om items te bewerken --

        outputleft += `
            <span style="display: inline-block; width: 10px;"></span>
            <div class="icon" id="button_edit">
                <span class="icon-image" style="font-size:24px">&#x2699;</span>
                <span class="icon-text">Bewerk</span>
            </div>`;

        // -- Visuals om naar achteren of voren te sturen --

        outputleft += `
            <span style="display: inline-block; width: 10px;"></span>
            <div class="icon" id="sendBack">
                <span class="icon-image" style="font-size:24px">⬇⬇</span>
                <span class="icon-text">Naar achter</span>
            </div>
            <div class="icon" id="bringFront">
                <span class="icon-image" style="font-size:24px">⬆⬆</span>
                <span class="icon-text">Naar voor</span>
            </div>`

        // -- Add an icon of a floppy (save symbol) like the icons above --

        if (globalThis.autoSaver && globalThis.autoSaver.hasChangesSinceLastManualSave()) {
            outputleft += `
                <span style="display: inline-block; width: 10px;"></span>
                <div class="highlight-warning-big" style="width: 64px; display: inline-block; vertical-align: middle; text-align: center;" id="button_save" onclick="exportjson(false)" onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'">
                    <span class="icon-image" style="font-size:24px">💾</span>
                    <span class="icon-text" style="display: inline-block; width: 100%;">Opslaan</span>
                </div>`
        } else {
            outputleft += `
                <span style="display: inline-block; width: 10px;"></span>
                <div class="highlight-ok-big" id="button_save" style="width: 64px; display: inline-block; vertical-align: middle; text-align: center;" onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'" onclick="topMenu.selectMenuItemByName('Bestand')">
                    <span class="icon-image" style="font-size:24px; filter: grayscale(100%); opacity: 0.5;">💾</span>
                    <span class="icon-text" style="display: inline-block; width: 100%;">Bestand</span>
                </div>`
        }

        // -- Visuals om pagina te selecteren --

        outputleft  += `
            <span style="display: inline-block; width: 50px;"></span>
            <div>
                <center>
                    <span style="display: inline-block; white-space: nowrap;">Pagina
                        <select id="id_sitplanpage">`;
                            for (let i=1; i<= this.sitplan.numPages; i++) {
                                outputleft += '<option value="' + i + '"' + (i == this.sitplan.activePage ? ' selected' : '') + '>' + i + '</option>';
                            }

        outputleft +=  `
                        </select>
                    </span><br><span style="display: inline-block; white-space: nowrap;">
                        <button id="btn_sitplan_addpage" ${(this.sitplan.activePage != this.sitplan.numPages ? ' disabled' : '')}>Nieuw</button>
                        <button id="btn_sitplan_delpage" style="background-color:red;" ${(this.sitplan.numPages <= 1 ? ' disabled' : '')}>&#9851;</button>
                    </span>
                </center>
            </div>`;

        // -- Visuals om pagina te zoomen --

        outputright += `
            <span style="display: inline-block; width: 10px;"></span>
            <div class="icon" id="button_zoomin">
                <span class="icon-image" style="font-size: 24px;">🔍</span>
                <span class="icon-text">In</span>
            </div>
            <div class="icon" id="button_zoomout">
                <span class="icon-image" style="font-size: 24px;">🌍</span>
                <span class="icon-text">Uit</span>
            </div>
            <div class="icon" id="button_zoomToFit">
                <span class="icon-image" style="font-size: 24px;">🖥️</span>
                <!--<img src="gif/scaleup.png" alt="Schermvullend" class="icon-image">-->
                <span class="icon-text">Schermvullend</span>
            </div>
            <span style="display: inline-block; width: 10px;"></span>`;
        
        // -- Put everything in the ribbon --

        document.getElementById("ribbon").innerHTML = `<div id="left-icons">${outputleft}</div><div id="right-icons">${outputright}</div>`;

        // -- Actions om pagina te selecteren --

        document.getElementById('id_sitplanpage')!.onchange = (event: Event) => {
            this.contextMenu.hide();
            const target = event.target as HTMLSelectElement;
            this.selectPage(Number(target.value));
            globalThis.undostruct.store("changePage");
        };
        
        document.getElementById('btn_sitplan_addpage')!.onclick = () => {
            this.contextMenu.hide();
            this.sitplan.numPages++;
            this.selectPage(this.sitplan.numPages);
            globalThis.undostruct.store();
        };

        document.getElementById('btn_sitplan_delpage')!.onclick = () => {
            this.contextMenu.hide();
            const dialog = new Dialog('Pagina verwijderen', `Pagina ${this.sitplan.activePage} volledig verwijderen?`,
                [
                    { text: 'OK', callback: (() => 
                        {
                            this.wipePage(this.sitplan.activePage);
                            //set page of all sitplan.elements with page>page one lower
                            this.sitplan.elements.forEach(element => {
                                if (element.page > this.sitplan.activePage) {
                                    element.page--;
                                }
                            });
                            if (this.sitplan.numPages>1) this.sitplan.numPages--;
                            this.selectPage(Math.min(this.sitplan.activePage,this.sitplan.numPages))
                            globalThis.undostruct.store();
                        }).bind(this) },
                    { text: 'Annuleren', callback: () => {} }

                ]);
            dialog.show();
        };

        // -- Actions om elementen toe te voegen of verwijderen --

        this.attachAddElementFromFileButton(document.getElementById('button_Add'), document.getElementById('fileInput'));
        this.attachAddElectroItemButton(document.getElementById('button_Add_electroItem'));
        this.attachDeleteButton(document.getElementById('button_Delete'));

        // -- Actions om visuals te bewerken --

        this.attachEditButton(document.getElementById('button_edit'));

        // -- Actions om naar achteren te sturen --

        this.attachSendToBackButton(document.getElementById('sendBack'));
        this.attachBringToFrontButton(document.getElementById('bringFront'));

        // -- Actions om pagina te zoomen --

        this.attachZoomButton(document.getElementById('button_zoomin'), 0.1);
        this.attachZoomButton(document.getElementById('button_zoomout'), -0.1);
        this.attachZoomToFitButton(document.getElementById('button_zoomToFit'));
        
    }
} // *** END CLASS ***

/**
 * Toon de pagina voor het situatieplan
 */
export function showSituationPlanPage() {
    globalThis.toggleAppView('draw');

    if (!(globalThis.structure.sitplan)) { globalThis.structure.sitplan = new SituationPlan() };

    if (!(globalThis.structure.sitplanview)) {
        //Verwijder eerst alle elementen op de DOM met id beginnend met "SP_" om eventuele wezen
        //uit eerdere oefeningen te voorkomen
        let elements = document.querySelectorAll('[id^="SP_"]');
        elements.forEach(e => e.remove());
        //Maak dan de SituationPlanView
        globalThis.structure.sitplanview = new SituationPlanView(
            document.getElementById('canvas'), 
            document.getElementById('paper'), 
            globalThis.structure.sitplan);

        globalThis.structure.sitplanview.zoomToFit();
    };
    if (globalThis.structure.properties.legacySchakelaars == null) {
        if (globalThis.structure.sitplan.heeftEenzameSchakelaars()) {
            let askLegacySchakelaar = new AskLegacySchakelaar();
            askLegacySchakelaar.show().then(() => {
                globalThis.structure.sitplanview.redraw();
            });
            return;
        } else {
            globalThis.structure.properties.legacySchakelaars = false; // We gaan dadelijk naar de nieuwe situatie
        }
    }

    globalThis.structure.sitplanview.redraw();
    const helperTip = new HelperTip(globalThis.appDocStorage);
    helperTip.show('sitplan.introductie',
    `<h3>Situatieschema tekenen</h3>
    <p>Op deze pagina kan u een situatieschema tekenen.</p>
    <p>Laad een plattegrond met de knop "Uit bestand" en voeg symbolen toe met de knop "Uit schema".</p>
    <p>Klik <a href="Documentation/sitplandoc.pdf" target="_blank" rel="noopener noreferrer">hier</a> om in een nieuw venster de documentatie te bekijken.</p>
    <p>We werken elke dag om dit programma beter te maken. Opmerkingen en ideeën zijn welkom in het "contact"-formulier.</p>`);
}