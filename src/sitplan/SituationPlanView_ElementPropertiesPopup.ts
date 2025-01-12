function SituationPlanView_ElementPropertiesPopup(sitplanElement: SituationPlanElement, 
                         callbackOK: (id: number, adresType: string, adres: string, selectAdresLocation: string,
                                      labelfontsize: number, scale: number, rotation: number) => void) {

    const div = document.createElement('div');

    div.innerHTML = `
        <div id="popupOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; visibility: hidden; z-index: 9999;">
            <div id="popupWindow" style="width: 400px; background-color: white; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; justify-content: space-between;">
                <div id="selectKringContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block;">Kring:</label>
                    <select id="KringSelect"></select>
                </div>
                <div id="selectElectroItemContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block;">Kring:</label>
                    <select id="selectElectroItemBox"></select>
                </div>
                <div id="textContainer" style="display: flex; margin-bottom: 30px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block;">ID:</label>
                    <input id="textInput" style="width: 100px;" type="number" min="0" step="1" value="">
                    <div id="feedback" style="margin-left: 10px; width: 100%; font-size: 12px"></div>
                </div>
                <div id="selectContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block; white-space: nowrap;">Label type:</label>
                    <select id="selectBox">
                        <option value="auto">Automatisch</option>
                        <!--<option value="adres">Uit schema: [Adres]</option>-->
                        <option value="manueel">Handmatig</option>
                    </select>
                </div>
                <div id="adresContainer" style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block; white-space: nowrap;">Label tekst:</label>
                    <input id="adresInput" style="width: 100%;" type="text" value="">
                    <select id="selectAdresLocation" style="margin-left: 10px; display: inline-block;">
                        <option value="links">Links</option>
                        <option value="rechts">Rechts</option>
                        <option value="boven">Boven</option>
                        <option value="onder">Onder</option>
                    </select>
                </div>
                <div id="fontSizeContainer" style="display: flex; margin-bottom: 30px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block; white-space: nowrap;">Font grootte (px):</label>
                    <input id="fontSizeInput" style="width: 100px;" type="number" min="1" max="72" step="11" value="11">
                </div> 
                <div style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block;">Schaal (%):</label>
                    <input id="scaleInput" style="width: 100px;" type="number" min="10" max="400" step="10" value="${String(SITPLANVIEW_DEFAULT_SCALE*100)}">
                </div>
                <div style="display: flex; margin-bottom: 10px; align-items: center;">
                    <label style="margin-right: 10px; display: inline-block;">Rotatie (°):</label>
                    <input id="rotationInput" style="width: 100px;" type="number" min="0" max="360" step="10" value="0">
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button id="okButton">OK</button>
                    <button id="cancelButton">Cancel</button>
                </div>
            </div>
        </div>`;

    const popupOverlay = div.querySelector('#popupOverlay') as HTMLDivElement;
    const popupWindow = popupOverlay.querySelector('#popupWindow') as HTMLDivElement;
    
    const selectKringContainer = popupWindow.querySelector('#selectKringContainer') as HTMLSelectElement;
    const selectElectroItemContainer = popupWindow.querySelector('#selectElectroItemContainer') as HTMLSelectElement;
    const textContainer = popupWindow.querySelector('#textContainer') as HTMLElement;
    const selectContainer = popupWindow.querySelector('#selectContainer') as HTMLSelectElement;
    const fontSizeContainer = popupWindow.querySelector('#fontSizeContainer') as HTMLElement;
    const adresContainer = popupWindow.querySelector('#adresContainer') as HTMLElement;

    const KringSelect = popupWindow.querySelector('#KringSelect') as HTMLSelectElement;
    const selectElectroItemBox = popupWindow.querySelector('#selectElectroItemBox') as HTMLSelectElement;
        
    const textInput = popupWindow.querySelector('#textInput') as HTMLInputElement;
    const feedback = popupWindow.querySelector('#feedback') as HTMLElement;
    const selectBox = popupWindow.querySelector('#selectBox') as HTMLSelectElement;
    const adresInput = popupWindow.querySelector('#adresInput') as HTMLInputElement;
    const fontSizeInput = popupWindow.querySelector('#fontSizeInput') as HTMLInputElement;
    const selectAdresLocation = popupWindow.querySelector('#selectAdresLocation') as HTMLSelectElement;
    const scaleInput = popupWindow.querySelector('#scaleInput') as HTMLInputElement;
    const rotationInput = popupWindow.querySelector('#rotationInput') as HTMLInputElement;
    const okButton = popupWindow.querySelector('#okButton') as HTMLButtonElement;
    const cancelButton = popupWindow.querySelector('#cancelButton') as HTMLButtonElement;  
    
    let adressen = new ElectroItemZoeker();
    let kringnamen = adressen.getUniqueKringnaam();
    
    function selectBoxChanged() {
        let id = Number(textInput.value);
        updateElectroType();
        let element = structure.data[structure.getOrdinalById(id)] as Electro_Item;
        switch (selectBox.value) {
            case 'auto':
                adresInput.value = (element != null ? element.getReadableAdres() : ''); 
                adresInput.disabled = true;
                break;
            case 'adres':        
                adresInput.value = (element != null ? (element.props.adres != null ? 'Adres' : '') : '');
                adresInput.disabled = true;
                break;
            case 'manueel':
                adresInput.value = (element != null ? adresInput.value : '');
                adresInput.disabled = false;
                break;
        }
    }

    //-- Select Kring --

    function rePopulateKringSelect() {
        KringSelect.innerHTML = ''; // Clear all options

        for (let kringnaam of kringnamen) {
            const option = document.createElement('option');
            option.value = kringnaam;
            option.text = kringnaam;
            KringSelect.appendChild(option);
        }
    }

    function initKringSelect(id: number = null) {
        rePopulateKringSelect();
        if ( (id==null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null) ) {
            id = sitplanElement.getElectroItemId();
        }
        if (id!=null) KringSelect.value = structure.findKringName(id);
        KringSelect.onchange = KringSelectChanged;
    }

    function KringSelectChanged() {
        rePopulateElectroItemBox();
        selectElectroItemBoxChanged();
    }

    //-- Select ElectroItem --

    function rePopulateElectroItemBox() {
        let electroItems = adressen.getElectroItemsByKring(KringSelect.value);
        selectElectroItemBox.innerHTML = ''; //Clear all options

        for (let i=0; i<electroItems.length; ++i) {
            const electroItem = electroItems[i];
            const option = document.createElement('option');
            option.value = String(i);
            option.text = electroItems[i].adres + ' | ' + electroItems[i].type;
            selectElectroItemBox.appendChild(option);
        }
    }

    function initElectroItemBox(id: number = null) {
        rePopulateElectroItemBox();
        let electroItems = adressen.getElectroItemsByKring(KringSelect.value);
        if ( (id==null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null) ) {
            id = sitplanElement.getElectroItemId();         
        }
        if (id != 0 ) {
            for (let i=0; i<electroItems.length; ++i) {
                if (electroItems[i].id == id) selectElectroItemBox.value = String(i);
            }
        }
        selectElectroItemBox.onchange = selectElectroItemBoxChanged;
    }

    function selectElectroItemBoxChanged() {
        rePopulateIdField();
        selectBox.value = 'auto';
        selectBoxChanged();
    }

    //-- ID field --

    function rePopulateIdField() {
        let str = '';
        let electroItems = adressen.getElectroItemsByKring(KringSelect.value);
        let idx = Number(selectElectroItemBox.value);
        if (!isNaN(idx)) {
            let item = electroItems[idx];
            if (item != null) str = electroItems[idx].id.toString();
        }
        textInput.value = str;
    }

    function initIdField() {
        if (sitplanElement != null) {
            if (sitplanElement.getElectroItemId() != null) textInput.value = String(sitplanElement.getElectroItemId());
        } else
            rePopulateIdField();
        textInput.oninput = IdFieldChanged;
    }

    function IdFieldChanged() {
        if (textInput.value != null) {
            textInput.value = textInput.value.replace(/[^0-9]/g, '');
            let id = Number(textInput.value);
            updateElectroType();
            if (structure.data[structure.getOrdinalById(id)] != null) {
                initKringSelect(id);
                initElectroItemBox(id);
                selectBox.value = 'auto';
                selectBoxChanged();
            }       
        }; 
    }

    // -- 

    function updateElectroType() {
        if (textInput.value == null || textInput.value.trim() == '') 
            feedback.innerHTML = '<span style="color: red;">Geen ID ingegeven</span>';
        else {
            let id = Number(textInput.value);
            let element = structure.data[structure.getOrdinalById(id)] as Electro_Item;
            if (element != null) {
                feedback.innerHTML = '<span style="color:green;">' + element.getType() + '</span>';
            } else {
                feedback.innerHTML = '<span style="color: red;">Element niet gevonden</span>';
            }
        }
    }

    // Function to show the popup
    function showPopup() {
        popupOverlay.style.visibility = 'visible';
        document.body.style.pointerEvents = 'none'; // Disable interactions with the background
        popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    }

    // Function to close the popup
    function closePopup() {
        popupOverlay.style.visibility = 'hidden';
        document.body.style.pointerEvents = 'auto'; // Re-enable interactions with the background
        div.remove();
    }

    const handleEnterKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter') okButton.click();
    };
  
    initKringSelect();
    initElectroItemBox();
    initIdField();

    if (sitplanElement != null) { // Form werd aangeroepen om een reeds bestaand element te editeren
        if (sitplanElement.getElectroItemId() != null) { // Het gaat over een bestaand Electro-item
            selectBox.value = sitplanElement.getAdresType();
            adresInput.value = sitplanElement.getAdres();
            fontSizeInput.value = String(sitplanElement.labelfontsize);
            selectAdresLocation.value = sitplanElement.getAdresLocation();
            selectBoxChanged();
        } else { // Het gaat over een geimporteerde CSV
            selectKringContainer.style.display = 'none';
            selectElectroItemContainer.style.display = 'none';
            textContainer.style.display = 'none';
            selectContainer.style.display = 'none';
            fontSizeContainer.style.display = 'none';
            adresContainer.style.display = 'none';
        }
        scaleInput.value = String(sitplanElement.getscale()*100);
        rotationInput.value = String(sitplanElement.rotate);
    } else { // Form werd aangeroepen om een nieuw element te creëren
        selectBoxChanged();
        fontSizeInput.value = '11';
        scaleInput.value = String(SITPLANVIEW_DEFAULT_SCALE*100);
        rotationInput.value = '0';
        selectAdresLocation.value = 'rechts';
    }
   
    textInput.onkeydown = handleEnterKey;
    adresInput.onkeydown = handleEnterKey;
    fontSizeInput.onkeydown = handleEnterKey;
    scaleInput.onkeydown = handleEnterKey;
    rotationInput.onkeydown = handleEnterKey;

    textInput.onblur = selectBoxChanged;
    selectBox.onchange = selectBoxChanged; 

    okButton.onclick = () => {
        let returnId = (textInput.value.trim() == '' ? null : Number(textInput.value));
        closePopup(); // We close the popup first to avoid that an error somewhere leaves it open
        callbackOK(returnId, selectBox.value, adresInput.value, selectAdresLocation.value, Number(fontSizeInput.value), Number(scaleInput.value)/100, Number(rotationInput.value));
    };

    cancelButton.onclick = () => {
        closePopup();
    };

    // Immediately invoke the select functions to set the initial state
    //selectBoxChanged(); 
    
    
    document.body.appendChild(div);   

    showPopup();
}