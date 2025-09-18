import { formatFloat } from "../general"
import { EventManager } from "../EventManager";

/**
 * Popup functionaliteit voor het kiezen van aangepaste elementtypes in de situatieplan weergave
 */

export class SituationPlanView_ChooseCustomElementPopup {

    /**
     * Toont een popup om het type item te selecteren dat toegevoegd moet worden.
     * @param callback - Functie die wordt aangeroepen met het geselecteerde itemtype, de schaling, en rotatie
     */
    static showItemTypeSelectionPopup(callback: (itemType: string, scale:number, rotate:number) => void): void {

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

        // Create popup container
        const div = document.createElement('div');
        
        div.innerHTML = `
            <div id="popupOverlay" class="popup-overlay">
                <div id="popupWindow" class="popup">
                    <h3>Los symbool (niet in ééndraadschema)</h3>
                    <div style="position: absolute; top: 5px; right: 5px; display: flex; align-items: center; justify-content: center;">
                        <button id="closeButton" style="background-color: #e00; border-radius: 4px; width: 20px; height: 20px; font-size: 16px; color: white; border: none; outline: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0px; vertical-align: middle;">&#10006;</button>
                    </div>
                    <div style="display: flex; margin-bottom: 20px; align-items: center;">
                        <label for="itemTypeSelect" style="margin-right: 10px; display: inline-block;">Type:</label>
                        <select id="itemTypeSelect" style="width: 200px;">
                            <option value="Aardingsonderbreker">Aardingsonderbreker</option>
                            <option value="Elektriciteitsmeter">Elektriciteitsmeter</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <i>Dit is een nieuwe functionaliteit om elementen in het situatieschema te
                           tekenen die niet voorkomen in het ééndraadschema.
                           Op dit moment ondersteunt deze functionaliteit slechts een beperkt
                           aantal symbolen. Dit zal verder uitgebreid worden naar de toekomst toe.</i>
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
                        <label for="setDefaultCheckbox" style="margin-left: 10px; flex-grow: 1; flex-wrap: wrap;">Zet schaal als standaard voor alle toekomstige nieuwe symbolen.</label>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 0px;">
                        <button id="okButton" class="rounded-button">OK</button>
                        <button id="cancelButton" class="rounded-button">Cancel</button>
                    </div>
                </div>
            </div>`;

        // Get references to elements using querySelector
        const popupOverlay = div.querySelector('#popupOverlay') as HTMLDivElement;
            const closeButton = div.querySelector('#closeButton') as HTMLButtonElement;
            const itemTypeSelect = div.querySelector('#itemTypeSelect') as HTMLSelectElement;
            const scaleInput = div.querySelector('#scaleInput') as HTMLInputElement;
            const rotationInput = div.querySelector('#rotationInput') as HTMLInputElement;
            const setDefaultCheckbox = div.querySelector('#setDefaultCheckbox') as HTMLInputElement;
            const okButton = div.querySelector('#okButton') as HTMLButtonElement;
            const cancelButton = div.querySelector('#cancelButton') as HTMLButtonElement;

        // Zet standaard schaal en rotatie
        scaleInput.value = formatFloat(globalThis.structure.sitplan.defaults.scale*100,6);
        rotationInput.value = formatFloat(0);

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

        //handle button clicks
        okButton.addEventListener('click', () => {
            function isNumeric(value: any) {
                return /^-?\d+(\.\d+)?$/.test(value);
            }
            if (!(isNumeric(scaleInput.value)) || (Number(scaleInput.value) <= 0)) scaleInput.value = String(globalThis.structure.sitplan.defaults.scale*100);
            if (!(isNumeric(rotationInput.value))) rotationInput.value = String(0);
            
            if (setDefaultCheckbox.checked) {
                globalThis.structure.sitplan.defaults.scale = Number(scaleInput.value)/100;
            }
            const selectedType = itemTypeSelect.value;
            closePopup();
            callback(selectedType, Number(scaleInput.value)/100, Number(rotationInput.value));
        } );

        const handleCancel = () => {
            closePopup();
        };

        cancelButton.addEventListener('click', handleCancel);
        closeButton.addEventListener('click', handleCancel);

        // Add to DOM and focus
        document.body.appendChild(div);
        showPopup();
    }
}