    import { SituationPlanElement } from "./SituationPlanElement";
    
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
     *  textContainer
     *      textInput -- Hier wordt het electroItemId ingevuld, ofwel door de gebruiker, ofwel door het programma
     *      feedback -- Hier wordt weergegeven over welk soort item het gaat, bvb "Contactdoos"
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
     */

export function SituationPlanView_MultiElementPropertiesPopup(sitplanElements: SituationPlanElement[], 
                         callbackOK: (labelfontsize: number|null, scale: number|null, rotation: number|null) => void,
                         callbackCancel: () => void = () => {}) {

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

    /* 
     * Eerst maken we de pop-up
     */

    const div = document.createElement('div');

    div.innerHTML = `
        <div id="popupOverlay" class="popup-overlay">
            <div id="popupWindow" class="popup">
                <h3>Meerdere elementen bewerken</h3>
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
                    <label for="setDefaultCheckbox" style="margin-left: 10px; flex-grow: 1; flex-wrap: wrap;">Zet tekengrootte en schaal als standaard voor alle toekomstige nieuwe symbolen.</label>
                </div>
                <div style="display: flex; justify-content: center; gap: 0px;">
                    <button id="okButton" class="rounded-button">OK</button>
                    <button id="cancelButton" class="rounded-button">Annuleren</button>
                </div>
            </div>
        </div>`;

    const popupOverlay = div.querySelector('#popupOverlay') as HTMLDivElement;
        const popupWindow = popupOverlay.querySelector('#popupWindow') as HTMLDivElement;
            const fontSizeInput = popupWindow.querySelector('#fontSizeInput') as HTMLInputElement;           
            const scaleInput = popupWindow.querySelector('#scaleInput') as HTMLInputElement;
            const rotationInput = popupWindow.querySelector('#rotationInput') as HTMLInputElement;
            const setDefaultCheckbox = popupWindow.querySelector('#setDefaultCheckbox') as HTMLInputElement;
            const okButton = popupWindow.querySelector('#okButton') as HTMLButtonElement;
            const cancelButton = popupWindow.querySelector('#cancelButton') as HTMLButtonElement;

    /* 
     * Dan zetten we default waarden in de velden op basis van wat we weten van de elementen
     */

    let fontSize = null;
    let scale = null;
    let rotation = null;

    for (let element of sitplanElements) {
        if (element.labelfontsize != null) {
            if (fontSize == null) fontSize = element.labelfontsize;
            else if (fontSize != element.labelfontsize) fontSize = 'multiple';
        }
        if (element.getscale() != null) {
            if (scale == null) scale = element.getscale();
            else if (scale != element.getscale()) scale = 'multiple';
        }
        if (element.rotate != null) {
            if (rotation == null) rotation = element.rotate;
            else if (rotation != element.rotate) rotation = 'multiple';
        }
    }
    
    fontSizeInput.value = (fontSize != 'multiple') ? String(fontSize) : String(''); 
    scaleInput.value = ( (scale != 'multiple') && (scale != null) ) ? String((scale as number)*100) : String('');
    rotationInput.value = (rotation != 'multiple') ? String(rotation) : String(''); 

    /*
     * Eventhandlers, enter op de tekst velden staat gelijk aan OK klikken
     */
   
    fontSizeInput.onkeydown = handleEnterKey;
    scaleInput.onkeydown = handleEnterKey;
    rotationInput.onkeydown = handleEnterKey;

    /*
     * Eventhandlers, OK en Cancel knoppen
     */

    okButton.onclick = () => {
        function isNumeric(value: any) {
            return /^-?\d+(\.\d+)?$/.test(value);
        }

        let fontSize = null;
        let scale = null;
        let rotation = null;
        
        if (isNumeric(fontSizeInput.value)) fontSize = Number(fontSizeInput.value);
        if (isNumeric(scaleInput.value)) scale = Number(scaleInput.value)/100;
        if (isNumeric(rotationInput.value)) rotation = Number(rotationInput.value);
        
        if (setDefaultCheckbox.checked) {
            if (fontSize != null) globalThis.structure.sitplan.defaults.fontsize = Number(fontSizeInput.value);
            if (scale != null) globalThis.structure.sitplan.defaults.scale = Number(scaleInput.value)/100;
        }

        closePopup(); // We close the popup first to avoid that an error somewhere leaves it open
        callbackOK(fontSize, scale, rotation);
    };

    cancelButton.onclick = () => {
        closePopup();
        callbackCancel();
    };

    /*
     * Het volledige formulier aan de body toevoegen en tonen
     */
    
    document.body.appendChild(div);   
    showPopup();
}