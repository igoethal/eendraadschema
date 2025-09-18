import { SituationPlanElement } from "./SituationPlanElement";
import { ElectroItemZoeker } from "./ElectroItemZoeker";
import { Electro_Item } from "../List_Item/Electro_Item";
import { EventManager } from "../EventManager";
import { formatFloat, htmlspecialchars, trimString } from "../general";

/** 
 * Een serie functies om een formulier te tonen met edit-functionaliteiten voor symbolen in het situatieplan
 *
 * De volgorde van code en functies in deze file volgt de structuur van de popup.
 *                   
 * popupWindow
 *  selectKringContainer
 *      selectKring -- Keuze kringnaam, gedraagt zich als een filter.
 *  selectElectroItemContainer
 *      selectElectroItemBox -- Keuze electroItem.
 *  electroItemIdContainer
 *      electroItemIdInput -- Hier wordt het electroItemId ingevuld, ofwel door de gebruiker, ofwel door het programma
 *      electroItemType -- Hier wordt weergegeven over welk soort item het gaat, bvb "Contactdoos"
 *  selectContainer
 *      selectAdresType -- Hier kan gekozen wat voor soort tekstlabel gebruikt wordt, automatisch of handmatig.
 *  adresContainer
 *      adresInput -- Het eigenlijke tekstlabel, kan automatisch ingevuld zijn ("automatisch") of handmatig door de gebruiker
 *      selectAdresLocation -- Locatie van het label, boven, onder, links of rechts.
 *  fontsizeContainer
 *      fontsizeInput -- De fontsize van het label, kan automatisch ingevuld zijn ("automatisch") of handmatig door de gebruiker
 *  Andere elementen
 *      scale -- Schaalfactor van het symbool
 *      rotation -- Eventuele rotatie van het symbool
 *  buttons
 *      OK, Cancel -- OK en Cancel knoppen
 * 
 * @param {SituationPlanElement} sitplanElement Het element waarvoor de eigenschappen getoond moeten worden.
 *                                              Indien null fungeert deze functie als Add in plaats van Edit.
 * @param {function} callbackOK Een referentie naar de functie die moet worden uitgevoerd als op OK wordt geklikt.
 * @param {function} callbackCancel Een referentie naar de functie die moet worden uitgevoerd als op Cancel wordt geklikt.
 * @param {object} options Een object met opties die worden gebruikt door de popup.
 *                         Mogelijke opties zijn:
 *                             - toonTekenGrootteStandaardVoorNieuweObjecten: boolean (laat in de checkbox onderaan ook toe de tekengrootte als standaard in te stellen voor alle toekomstige objecten )
 *                             - toonElementZoeker: boolean (laat toe een ander electroElement te zoeken dan hetgeen reeds eerder gekozen werd) 
 */

export function SituationPlanView_ElementPropertiesPopup(sitplanElement: SituationPlanElement, 
                         callbackOK: (id: number|null, adresType: string, adres: string, selectAdresLocation: string,
                                      labelfontsize: number, scale: number, rotation: number) => void,
                         callbackCancel: () => void = () => {},
                         options: any = {} ) {

    // Interne variabelen voor alle subfuncties                                    

    let adressen = new ElectroItemZoeker();
    let kringnamen = adressen.getUniqueKringnaam();

    /**
     * Vul het select element voor de kringen met alle gekende info rond kringnamen
     */
    function rePopulateKringSelect() {
        selectKring.innerHTML = ''; // Alles wissen

        for (let kringnaam of kringnamen) {
            const option = document.createElement('option');
            option.value = kringnaam;
            option.text = kringnaam;
            selectKring.appendChild(option);
        }
    }

    /**
     * Initialiseer het select element voor de kringen.
     * 
     * @param electroItemId Optioneel argument indien men wenst te initialiseren met een reeds gekozen electroItemId,
     *                      zo-niet wordt sitplanElement gebruikt als initialisatie.
     * 
     * Gebruikte variabelen: sitplanElement uit de hoofdfunctie is het element waarvoor we de eigenschappen wijzigen
     */
    function initKringSelect(electroItemId: number|null = null) {
        rePopulateKringSelect();
        if ( (electroItemId==null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null) ) {
            electroItemId = sitplanElement.getElectroItemId();
        }
        if (electroItemId!=null) selectKring.value = globalThis.structure.findKringName(electroItemId);
        selectKring.onchange = KringSelectChanged;
    }

    /**
     * Functies uit te voeren wanneer de kring gewijzigd is.
     * - rePopulateElectroItemBox: laat toe alle electro-items te kiezen binnen een kring
     * - selectElectroItemBoxChanged: selecteert de eerste electro-item in de lijst in past de andere velden in het formulier aan
     */
    function KringSelectChanged() {
        rePopulateElectroItemBox();
        selectElectroItemBoxChanged();
    }

    /**
     * Vul het select element voor electro-items met alle electro-items binnen de gekozen kring
     */
    function rePopulateElectroItemBox() {
        let electroItems = adressen.getElectroItemsByKring(selectKring.value);
        selectElectroItemBox.innerHTML = ''; //Clear all options

        for (let i=0; i<electroItems.length; ++i) {
            const electroItem = electroItems[i];
            const option = document.createElement('option');
            option.value = String(i);
            option.text = (trimString(electroItem.adres) !== '' ? htmlspecialchars(electroItem.adres) + ' | ' : '') + electroItem.type;
            selectElectroItemBox.appendChild(option);
        }
    }

    /**
     * Initialiseer het select element voor de electro-items.
     * 
     * @param electroItemId Optioneel argument indien men wenst te initialiseren met een reeds gekozen electroItemId,
     *                      zo-niet wordt sitplanElement gebruikt als initialisatie.
     * 
     * Gebruikte variabelen: sitplanElement uit de hoofdfunctie is het element waarvoor we de eigenschappen wijzigen
     */
    function initElectroItemBox(electroItemId: number|null = null) {
        rePopulateElectroItemBox();
        let electroItems = adressen.getElectroItemsByKring(selectKring.value);
        if ( (electroItemId==null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null) ) {
            electroItemId = sitplanElement.getElectroItemId();         
        }
        if (electroItemId != 0 ) {
            for (let i=0; i<electroItems.length; ++i) {
                if (electroItems[i].id == electroItemId) selectElectroItemBox.value = String(i);
            }
        }
        selectElectroItemBox.onchange = selectElectroItemBoxChanged;
    }

    /**
     * Functies uit te voeren wanneer het electroItem gewijzigd is.
     * - rePopulateIdField: geef de id van het gekozen electro-item weer, alsook het type
     * - zet het adrestype op "auto" telkens het electroItem wordt gewijzigd
     * - Pas de rest van het formulier aan aan het feit dat het electroItem werd gewijzigd en het electroType op "auto" werd gezet
     */
    function selectElectroItemBoxChanged() {
        rePopulateIdField();
        selectAdresType.value = 'auto';
        selectAdresTypeChanged();
    }

    /**
     * Vul het Id-veld met de id van het gekozen electro-item in de bovenstaande twee velden (select-kring en select electro-item)
     */   
    function rePopulateIdField() {
        let str = '';
        let electroItems = adressen.getElectroItemsByKring(selectKring.value);
        let idx = Number(selectElectroItemBox.value);
        if (!isNaN(idx)) {
            let item = electroItems[idx];
            if (item != null) str = electroItems[idx].id.toString();
        }
        electroItemIdInput.value = str;
    }

    /**
     * Initialiseer het Id-veld, ofwel met de id van het sitplanElement, ofwel met de id van het gekozen electro-item
     * 
     * Gebruikte variabelen: sitplanElement uit de hoofdfunctie.
     */
    function initIdField() {
        if (sitplanElement != null) {
            if (sitplanElement.getElectroItemId() != null) electroItemIdInput.value = String(sitplanElement.getElectroItemId());
        } else
            rePopulateIdField();
        electroItemIdInput.oninput = IdFieldChanged;
    }

    /**
     * Wanneer het Id-veld gewijzigd wordt, wordt de rest van het formulier bijgewerkt.
     * We verwijderen alle niet-cijfers uit de Id, en passen het volgende aan
     * - veld waarin het type van het electroItem wordt gegeven
     * - select element met te kiezen kringen, voorgeselecteerd op de kring waarin het element met id=id zich bevindt
     * - idem als hierboven voor de selectie van het electroItem 
     */
    function IdFieldChanged() {
        if (electroItemIdInput.value != null) {
            electroItemIdInput.value = electroItemIdInput.value.replace(/[^0-9]/g, '');
            let electroItemId = Number(electroItemIdInput.value);
            updateElectroType();
            if (globalThis.structure.getElectroItemById(electroItemId) != null) {
                initKringSelect(electroItemId);
                initElectroItemBox(electroItemId);
                selectAdresType.value = 'auto';
                selectAdresTypeChanged();
            }       
        }; 
    }

    function handleExpandButton(electroItemId: number|null = null) {
        if (electroItemId == null) return;

        let element = globalThis.structure.getElectroItemById(electroItemId);
        if (element == null) return;

        element.expand();

        adressen.reCalculate();
        kringnamen = adressen.getUniqueKringnaam();

        IdFieldChanged();

        globalThis.structure.sitplanview.redraw();
    }  

    /**
     * Toon het type verbruiker van het gekozen electro-item
     */
    function updateElectroType() {
        if (electroItemIdInput.value == null || trimString(electroItemIdInput.value) == '') {
            electroItemType.innerHTML = '<span style="color: red;">Geen ID ingegeven</span>';
            expandButton.style.display = 'none';
        } else {
            let electroItemId = Number(electroItemIdInput.value);
            let element = globalThis.structure.getElectroItemById(electroItemId) as Electro_Item;
            if (element != null) {
                electroItemType.innerHTML = '<span style="color:green;">' + element.getType() + '</span>';
                if (element.isExpandable()) {
                    expandButton.style.display = 'block';
                    electroItemType.innerHTML += '<br><span style="color: black;">Klik op uitpakken indien u de onderliggende elementen in het situatieschema wil kunnen plaatsen.</span>';
                    expandButton.onclick = () => { handleExpandButton(electroItemId) };
                } else expandButton.style.display = 'none';
            } else {
                electroItemType.innerHTML = '<span style="color: red;">Element niet gevonden</span>';
                expandButton.style.display = 'none';
            }
        }
    }

    /**
     * Wanneer het type adres gewijzigd wordt, wordt ook het adresveld zelf aangepast
     */ 
    function selectAdresTypeChanged() {
        let id = Number(electroItemIdInput.value);
        updateElectroType();
        let element = globalThis.structure.getElectroItemById(id) as Electro_Item;
        if (element == null) {
            adresInput.value = '';
            adresInput.readOnly = true;
            return;
        }
        switch (selectAdresType.value) {
            case 'manueel':
                adresInput.value = (element != null ? adresInput.value : '');
                adresInput.readOnly = false;
                break;
            case 'auto':
            default:
                adresInput.value = (element != null ? element.getReadableAdres() : ''); 
                adresInput.readOnly = true;
                break;
        }
    }

    /**
     * Toont de popup met alle opties voor het bewerken van een element
     */
    function showPopup() {
        popupOverlay.style.visibility = 'visible';
        document.body.style.pointerEvents = 'none'; // Disable interactions with the background
        popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    }

    /**
     * Sluit de popup, meestal omdat op OK of Cancel werd geklikt of Enter op het toetsenbord.
     * Ter waarschuwing, er wordt geen verdere actie ondernomen zoals het plaatsen van het gekozen symbool
     * in het situatieplan. Dit dient de gebruiker van deze set functies zelf nog te doen.
     */
    function closePopup() {
        event_manager.dispose();
        popupOverlay.style.visibility = 'hidden';
        document.body.style.pointerEvents = 'auto'; // Re-enable interactions with the background
        div.remove();
    }

    /**
     * We stellen het tikken van Enter in een veld gelijk aan het klikken op OK in het formulier
     * 
     * @param event 
     */

    const handleEnterKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            okButton.click();
        }
    };

    //--- HOOFDFUNCTIE ------------------------------------------------------------------------------------

    // options verwerken

    if (options.toonTekenGrootteStandaardVoorNieuweObjecten == null) {
        if (sitplanElement == null) /* nieuw element */ options.toonTekenGrootteStandaardVoorNieuweObjecten = true;
        else options.toonTekenGrootteStandaardVoorNieuweObjecten = (sitplanElement.getElectroItemId() != null); /* tonen als het een electroItem is */
    }

    // Pop-up maken

    const div = document.createElement('div');

    div.innerHTML = `
        <div id="popupOverlay" class="popup-overlay">
            <div id="popupWindow" class="popup">
                <h3>Element toevoegen/bewerken</h3>
                <div style="position: absolute; top: 5px; right: 5px; display: flex; align-items: center; justify-content: center;">
                    <button id="closeButton" style="background-color: #e00; border-radius: 4px; width: 20px; height: 20px; font-size: 16px; color: white; border: none; outline: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0px; vertical-align: middle;">&#10006;</button>
                </div>
                <div id="selectKringContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label for="selectKring" style="margin-right: 10px; display: inline-block;">Kring:</label>
                    <select id="selectKring"></select>
                </div>
                <div id="selectElectroItemContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label for="selectElectroItemBox" style="margin-right: 10px; display: inline-block;">Element:</label>
                    <select id="selectElectroItemBox"></select><span style="display: inline-block; width: 10px;"></span>
                    <button id="expandButton" title="Omzetten in indivuele elementen" style="background-color:lightblue;">Uitpakken</button>
                </div>
                <div id="electroItemIdContainer" style="display: flex; margin-bottom: 30px; align-items: center;">
                    <label for="electroItemIdInput" style="margin-right: 10px; display: inline-block;">ID:</label>
                    <input id="electroItemIdInput" style="width: 100px;" type="number" min="0" step="1" value="">
                    <div id="electroItemType" style="margin-left: 10px; width: 100%; font-size: 12px"></div>
                </div>
                <div id="selectContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label for="selectAdresType" style="margin-right: 10px; display: inline-block; white-space: nowrap;">Label type:</label>
                    <select id="selectAdresType">
                        <option value="auto">Automatisch</option>
                        <option value="manueel">Handmatig</option>
                    </select>
                </div>
                <div id="adresContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label for="adresInput" style="margin-right: 10px; display: inline-block; white-space: nowrap;">Label tekst:</label>
                    <input id="adresInput" style="width: 100%;" type="text" value="">
                    <select id="selectAdresLocation" style="margin-left: 10px; display: inline-block;">
                        <option value="links">Links</option>
                        <option value="rechts">Rechts</option>
                        <option value="boven">Boven</option>
                        <option value="onder">Onder</option>
                    </select>
                </div>
                <div id="fontSizeContainer" style="display: flex; margin-bottom: 30px; align-items: center;">
                    <label for="fontSizeInput" style="margin-right: 10px; display: inline-block; white-space: nowrap;">Tekengrootte (px):</label>
                    <input id="fontSizeInput" style="width: 100px;" type="number" min="1" max="72" step="11" value="11">
                </div> 
                <div style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label for="scaleInput" style="margin-right: 10px; display: inline-block;">Schaal (%):</label>
                    <input id="scaleInput" style="width: 100px;" type="number" min="10" max="400" step="10" value="${String(globalThis.SITPLANVIEW_DEFAULT_SCALE*100)}">
                </div>
                <div style="display: flex; margin-bottom: 20px; align-items: center;">
                    <label for="rotationInput" style="margin-right: 10px; display: inline-block;">Rotatie (°):</label>
                    <input id="rotationInput" style="width: 100px;" type="number" min="0" max="360" step="10" value="0">
                </div>
                <div id="setDefaultContainer" style="display: flex; margin-bottom: 20px; align-items: flex-start;">
                    <input type="checkbox" id="setDefaultCheckbox">
                    ${ (options.toonTekenGrootteStandaardVoorNieuweObjecten)
                        ? `<label for="setDefaultCheckbox" style="margin-left: 10px; flex-grow: 1; flex-wrap: wrap;">Zet tekengrootte en schaal als standaard voor alle toekomstige nieuwe symbolen.</label>`
                        : `<label for="setDefaultCheckbox" style="margin-left: 10px; flex-grow: 1; flex-wrap: wrap;">Zet schaal als standaard voor alle toekomstige nieuwe symbolen.</label>`
                    }            
                </div>
                <div style="display: flex; justify-content: center; gap: 0px;">
                    <button id="okButton" class="rounded-button">OK</button>
                    <button id="cancelButton" class="rounded-button">Annuleren</button>
                </div>
            </div>
        </div>`;

    const popupOverlay = div.querySelector('#popupOverlay') as HTMLDivElement;
        const popupWindow = popupOverlay.querySelector('#popupWindow') as HTMLDivElement;
            const closeButton = popupWindow.querySelector('#closeButton') as HTMLButtonElement;
            const selectKringContainer = popupWindow.querySelector('#selectKringContainer') as HTMLSelectElement;
                const selectKring = popupWindow.querySelector('#selectKring') as HTMLSelectElement;
            const selectElectroItemContainer = popupWindow.querySelector('#selectElectroItemContainer') as HTMLSelectElement;
                const selectElectroItemBox = popupWindow.querySelector('#selectElectroItemBox') as HTMLSelectElement;
                const expandButton = popupWindow.querySelector('#expandButton') as HTMLButtonElement;
            const electroItemIdContainer = popupWindow.querySelector('#electroItemIdContainer') as HTMLElement;
                const electroItemIdInput = popupWindow.querySelector('#electroItemIdInput') as HTMLInputElement;
                const electroItemType = popupWindow.querySelector('#electroItemType') as HTMLElement;
            const selectContainer = popupWindow.querySelector('#selectContainer') as HTMLSelectElement;
                const selectAdresType = popupWindow.querySelector('#selectAdresType') as HTMLSelectElement;
            const adresContainer = popupWindow.querySelector('#adresContainer') as HTMLElement;
                const adresInput = popupWindow.querySelector('#adresInput') as HTMLInputElement;
                const selectAdresLocation = popupWindow.querySelector('#selectAdresLocation') as HTMLSelectElement;
            const fontSizeContainer = popupWindow.querySelector('#fontSizeContainer') as HTMLElement;
                const fontSizeInput = popupWindow.querySelector('#fontSizeInput') as HTMLInputElement;           
            const scaleInput = popupWindow.querySelector('#scaleInput') as HTMLInputElement;
            const rotationInput = popupWindow.querySelector('#rotationInput') as HTMLInputElement;
            const setDefaultCheckbox = popupWindow.querySelector('#setDefaultCheckbox') as HTMLInputElement;
            const okButton = popupWindow.querySelector('#okButton') as HTMLButtonElement;
            const cancelButton = popupWindow.querySelector('#cancelButton') as HTMLButtonElement;

    /* 
     * Dan zoeken we de nodige informatie over de symbolen in het ééndraadschema.
     * Indien sitPlanElement werd opgegeven worden de eigenschappen van dit element getoond.
     * Zo-niet worden default waarden getoond.
     */

    initKringSelect();
    initElectroItemBox();
    initIdField();

    if (sitplanElement != null) { // Form werd aangeroepen om een reeds bestaand element te editeren
        if (sitplanElement.getElectroItemId() != null) { // Het gaat over een bestaand Electro-item
            let electroItem = globalThis.structure.getElectroItemById(sitplanElement.getElectroItemId());
            if ( (electroItem != null) && (electroItem.getType() == 'Bord') ) {
                if (options.toonElementZoeker == null) options.toonElementZoeker = false;
            }
            selectAdresType.value = sitplanElement.getAdresType();
            adresInput.value = sitplanElement.getAdres();
            fontSizeInput.value = String(sitplanElement.labelfontsize);
            selectAdresLocation.value = sitplanElement.getAdresLocation();
            selectAdresTypeChanged();
        } else { // Het gaat over een geimporteerde CSV
            if (options.toonElementZoeker == null) options.toonElementZoeker = false;
            selectContainer.style.display = 'none';
            fontSizeContainer.style.display = 'none';
            adresContainer.style.display = 'none';
        }
        scaleInput.value = formatFloat(sitplanElement.getscale()*100,6);
        rotationInput.value = formatFloat(sitplanElement.rotate,2);
    } else { // Form werd aangeroepen om een nieuw element te creëren
        selectAdresTypeChanged();
        fontSizeInput.value = formatFloat(globalThis.structure.sitplan.defaults.fontsize,2);
        scaleInput.value = formatFloat(globalThis.structure.sitplan.defaults.scale*100,6);
        selectAdresLocation.value = 'rechts';
    }

    if (options.toonElementZoeker == null) options.toonElementZoeker = true;

    if (!options.toonElementZoeker) {
        selectKringContainer.style.display = 'none';
        selectElectroItemContainer.style.display = 'none';    
        electroItemIdContainer.style.display = 'none';
    }

    /*
     * Eventhandlers, enter op de tekst velden staat gelijk aan OK klikken
     */

    // handle enter and escape key
    let event_manager = new EventManager();
    event_manager.addEventListener(document as any, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleEnterKey(event);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancelButton.click();
        }
    });

    /*
     * Eventhandlers, adres-text aanpassen triggert aanpassingen van adres-type
     */

    electroItemIdInput.onblur = selectAdresTypeChanged;
    selectAdresType.onchange = selectAdresTypeChanged; 

    adresInput.onclick = () => {
        Array.from(selectAdresType.options).forEach(option => {
            if (option.text === "Handmatig") {
                option.selected = true;
            }
        });
        adresInput.readOnly = false;
    }

    /*
     * Eventhandlers, OK en Cancel knoppen
     */

    okButton.onclick = () => {
        function isNumeric(value: any) {
            return /^-?\d+(\.\d+)?$/.test(value);
        }
        let returnId = (trimString(electroItemIdInput.value) == '' ? null : Number(electroItemIdInput.value));
        if (!(isNumeric(scaleInput.value)) || (Number(scaleInput.value) <= 0)) scaleInput.value = String(globalThis.structure.sitplan.defaults.scale*100);
        if (!(isNumeric(rotationInput.value))) rotationInput.value = String(0);
        
        if (setDefaultCheckbox.checked) {
            if ( (sitplanElement == null) || ( (sitplanElement != null) && (sitplanElement.getElectroItemId() != null) ) )
                globalThis.structure.sitplan.defaults.fontsize = Number(fontSizeInput.value);
            globalThis.structure.sitplan.defaults.scale = Number(scaleInput.value)/100;
        }
        closePopup(); // We close the popup first to avoid that an error somewhere leaves it open
        callbackOK(returnId, selectAdresType.value, adresInput.value, selectAdresLocation.value, Number(fontSizeInput.value), Number(scaleInput.value)/100, Number(rotationInput.value));
    };

    cancelButton.onclick = () => {
        closePopup();
        callbackCancel();
    };

    closeButton.onclick = cancelButton.onclick;

    /*
     * Het volledige formulier aan de body toevoegen en tonen
     */
    
    document.body.appendChild(div);   
    showPopup();
}