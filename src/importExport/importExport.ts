import { Hierarchical_List } from "../Hierarchical_List";
import { SituationPlan } from "../sitplan/SituationPlan";
import { Electro_Item } from "../List_Item/Electro_Item";

declare var pako: any;

export class importExportUsingFileAPI {

    saveNeeded: boolean;
    fileHandle: any;
    filename: string;
    lastsaved: string;

    constructor() {
        this.clear();
        //this.updateButtons();
    }

    clear() {
        this.saveNeeded = false;
        this.fileHandle = null;
        this.filename = null;
    }

    updateLastSaved() {
        var currentdate = new Date();
        this.lastsaved = currentdate.getHours().toString().padStart(2, '0') + ":" +
                         currentdate.getMinutes().toString().padStart(2, '0') + ":" +
                         currentdate.getSeconds().toString().padStart(2, '0');;

        //If there is an object on the screen that needs updating, do it
        if (document.getElementById('exportscreen') as HTMLInputElement) {
            showFilePage(); // Update the export screen if we are actually on the export screen
        }
    }

    setSaveNeeded(input) {
        let lastSaveNeeded = this.saveNeeded;
        this.saveNeeded = input;
        //if (input !== lastSaveNeeded) this.updateButtons();
    }

    async readFile() {
        
        [this.fileHandle] = await (window as any).showOpenFilePicker({
            types: [{
                description: 'Eendraadschema (.eds)',
                accept: {'application/eds': ['.eds']},
            }],
        });

        const file = await (this.fileHandle as any).getFile();
        const contents = await file.text();

        this.filename = file.name;
        globalThis.structure.properties.filename = file.name;

        this.setSaveNeeded(false);

        this.updateLastSaved(); // Needed because EDStoStructure whipes everything   

        return contents;
    }

    async saveAs(content: string) {
        const options = {
            suggestedName: globalThis.structure.properties.filename,
            types: [{
                description: 'Eendraadschema (.eds)',
                accept: {'application/eds': ['.eds']},
            }],
            startIn: 'documents' // Suggests the Documents folder
        };

        this.fileHandle = await (window as any).showSaveFilePicker(options);
        await this.saveFile(content, this.fileHandle);      
    };

    async saveFile(content: any, handle: any) {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();

        this.filename = handle.name;
        globalThis.structure.properties.filename = handle.name;

        this.setSaveNeeded(false);

        this.updateLastSaved();
    };

    async save(content: string) {
        await this.saveFile(content, this.fileHandle);
    };
}

/**
 * Callback functie voor de legacy filepicker als de file API niet beschikbaar is in de browser.
 * @param event filepicker click event
 */
globalThis.importjson = (event) => {
    var input = event.target;
    var reader = new FileReader();
    var text:string = "";

    reader.onload = function(){
        EDStoStructure(reader.result.toString());
        if (globalThis.structure.sitplan) globalThis.structure.sitplan.activePage = 1;
    };

    reader.readAsText(input.files[0]);
};

/**
 * Callback functie voor de legacy filepicker om een schema toe te voegen aan een reeds bestaand schema.
 * Dit doen we altijd via de legacy filepicker, aangezien dit toch een read-only situatie is.
 * @param event filepicker click event
 */
globalThis.appendjson = function(event) {
    var input = event.target;
    var reader = new FileReader();
    var text:string = "";

    reader.onload = function(){
        importToAppend(reader.result.toString());
    };

    reader.readAsText(input.files[0]);
};

/**
 * Wordt aangeroepen wanneer een gebruiker een bestand wil openen. Controleert of de fileAPI beschikbaar is in de browser.
 * Indien ja, wordt de fileAPI gebruikt. Indien niet, wordt de legacy functie importjson aangeroepen.
 * 
 * @returns {Promise<void>} Een promise die wordt opgelost wanneer het bestand is geladen en verwerkt.
 */
globalThis.loadClicked = async () => {
    if ((window as any).showOpenFilePicker) { // Use fileAPI
        let data = await globalThis.fileAPIobj.readFile();
        EDStoStructure(data);
        if (globalThis.structure.sitplan) globalThis.structure.sitplan.activePage = 1;
    } else { // Legacy
        document.getElementById('importfile').click();
        (document.getElementById('importfile') as HTMLInputElement).value = "";
    }
}


/**
 * function importToAppendClicked() 
 * 
 * Vraagt om een EDS bestand op de machine te kiezen en voegt de inhoud toe aan het reeds geopende schema.
 * We gebruiken hier bewust niet de fileAPI aangezien die reeds gebruikt wordt voor het reeds geopende schema.
 */
globalThis.importToAppendClicked = async () => {
    document.getElementById('appendfile').click();
    (document.getElementById('appendfile') as HTMLInputElement).value = "";
}


/* FUNCTION upgrade_version

   Takes a structure, usually imported from json into javascript object, and performs a version upgrade if needed.
   as mystructure is passed by reference, all upgrades are done in-line.

*/

function upgrade_version(mystructure, version) {

    // At a certain moment (2023-01-11 to 2023-01-13) there was a bug in the systen so that files where accidentally outputed with props, without keys, but with version 1.
    // We correct for this below. If there are props and not keys but it still reads version 1, it should be interpreted as version 3.

    if ((version == 1) && (mystructure.length > 0) && (typeof(mystructure.data[0].keys) == 'undefined') && (typeof(mystructure.data[0].props) != 'undefined') ) {
        version = 3
    }

    /* Indien versie 1 moeten we vrije tekst elementen die niet leeg zijn 30 pixels breder maken.
    * Merk ook op dat versie 1 nog een key based systeem had met keys[0][2] het type
    * en keys[16][2] die aangeeft of vrije tekst al dan niet een kader bevat (verbruiker) of niet (zonder kader)
    */
    if (version < 2) {
        for (let i = 0; i < mystructure.length; i++) {
            // Breedte van Vrije tekst velden zonder kader met 30 verhogen sinds 16/12/2023
            if ( (mystructure.data[i].keys[0][2] === "Vrije tekst") && (mystructure.data[i].keys[16][2] != "verbruiker") ) {
                if (Number(mystructure.data[i].keys[22][2])>0) mystructure.data[i].keys[22][2] = String(Number(mystructure.data[i].keys[22][2]) + 30);
                    else mystructure.data[i].keys[18][2] = "automatisch";
                if (mystructure.data[i].keys[16][2] != "zonder kader") mystructure.data[i].keys[16][2] = "verbruiker";
            }
    } 
    }   

    // In versie 2 heetten Contactdozen altijd nog Stopcontacten

    if (version < 3) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].keys[0][2] === "Stopcontact") mystructure.data[i].keys[0][2] = "Contactdoos";
            if (mystructure.data[i].keys[0][2] === "Leeg") mystructure.data[i].keys[0][2] = "Aansluitpunt";
        }
    }

    // In versie 3 heetten Contactdozen ook soms nog Stopcontacten, maar niet altijd
    if (version == 3) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Stopcontact") mystructure.data[i].props.type = "Contactdoos";
        }
    }

    //Vanaf versie 4 staan niet automatisch meer haakjes <> rond de benaming van borden. Indien kleiner dan versie 4 moeten we deze toevoegen
    if (version < 4) {
        if (version < 3) {
            for (let i = 0; i < mystructure.length; i++) {
                if ( (mystructure.data[i].keys[0][2] === "Bord") && (mystructure.data[i].keys[10][2] !== "") ) mystructure.data[i].keys[10][2] = '<' + mystructure.data[i].keys[10][2] + '>';
            }
        } else {
            for (let i = 0; i < mystructure.length; i++) {
                if ( (mystructure.data[i].props.type === "Bord") && (mystructure.data[i].props.naam !== "") ) mystructure.data[i].props.naam = '<' + mystructure.data[i].props.naam + '>';
            }
        }    
    }

    //Algemene upgrade voor versies 3 tot en met 4

    if ( (version >= 3) && (version <= 4) ) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Leeg") mystructure.data[i].props.type = "Aansluitpunt";
        }
    }

}

/**
 * Exporteert de huidige structuur naar een bestand in het EDS-formaat.
 * @param {boolean} saveAs - Indien true, wordt de gebruiker gevraagd waar het bestand moet worden opgeslagen; anders wordt het bestand opgeslagen onder de bekende bestandsnaam.
 */
globalThis.exportjson = (saveAs: boolean = true) => { // Indien de boolean false is en de file API is geïnstalleerd, wordt een normale opslag uitgevoerd (bekende bestandsnaam)

    /**
     * Converteert een Uint8Array naar een Base64-gecodeerde string.
     * @param {Uint8Array} uint8Array - De array die moet worden geconverteerd.
     * @returns {string} De Base64-gecodeerde string.
     */
    function uint8ArrayToBase64(uint8Array: Uint8Array): string {
        const CHUNK_SIZE = 0x8000; // Verwerk 32KB chunks
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
            binaryString += String.fromCharCode.apply(
                null,
                uint8Array.subarray(i, i + CHUNK_SIZE)
            );
        }
        return btoa(binaryString);
    }

    var filename: string;

    /* We gebruiken de Pako-bibliotheek om de data te entropycoderen
     * Einddata leest "EDSXXX0000" met XXX een versie en daarna een 64base-encodering van de gedecomprimeerde uitvoer van Pako
     * filename = "eendraadschema.eds";
     */
    filename = globalThis.structure.properties.filename;

    let origtext: string = globalThis.structure.toJsonObject(true);
    let text: string = '';

    // Comprimeer de uitvoerstructuur en bied deze aan als download aan de gebruiker. We zijn momenteel bij versie 004
    try {
        if (globalThis.structure.properties.disableEDSCompression == true) throw new Error("Compression is disabled");
        let encoder = new TextEncoder();
        let pako_inflated = new Uint8Array(encoder.encode(origtext));
        let pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
        text = "EDS0040000" + uint8ArrayToBase64(pako_deflated);
    } catch (error) {
        console.log("Terugvallen naar TXT-uitvoer vanwege compressiefout: " + error);
        text = "TXT0040000" + origtext;
    } finally {
        if ((window as any).showOpenFilePicker) { // Gebruik fileAPI    
            if ( (globalThis.fileAPIobj.filename == null) && (saveAs == false) ) saveAs = true; // Default to SaveAs if we have no file name
            if (saveAs) {
                globalThis.fileAPIobj.saveAs(text).then(() => {globalThis.autoSaver.saveManually("TXT0040000" + origtext);}) 
            } else { 
                globalThis.fileAPIobj.save(text).then(() => {globalThis.autoSaver.saveManually("TXT0040000" + origtext);});
            }          
        } else { // legacy
          download_by_blob(text, filename, 'data:text/eds;charset=utf-8');
          globalThis.autoSaver.saveManually("TXT0040000" + origtext); // Needs to be as TXT to be able to check with last autosave
        }
    }

    globalThis.propUpload(text);
}

/* FUNCTION json_to_structure

   Takes a string in pure json and puts the content in a hierarchical list that is returned.
   The function can take an old structure that is to be cleaned as input (optional)
    
   Will perform a version upgrade in case the json is from an earlier version of the eendraadschema tool but this version upgrade will not be performed
   if version is set to 0.  If version is not set to 0 it should be set to the verson of the json.
    
*/

function json_to_structure(text: string, oldstruct: Hierarchical_List = null, version = 0): Hierarchical_List {

    // If a structure exists, clear it
    if (oldstruct != null) oldstruct.dispose(); // Clear the structure

    /* Read all data from disk in a javascript structure mystructure.
        * Afterwards we will gradually copy elements from this one into the official outstruct
        */
    let mystructure = JSON.parse(text);

    // upgrade if needed
    if (version != 0) upgrade_version(mystructure, version);

    /* We starten met het kopieren van data naar de eigenlijke outstruct.
    * Ook hier houden we er rekening mee dat in oude saves mogelijk niet alle info voorhanden was */

    let outstruct = new Hierarchical_List();

    // Kopieren van hoofd-eigenschappen

    if (typeof mystructure.properties != 'undefined') {
        if (typeof mystructure.properties.filename != "undefined") outstruct.properties.filename = mystructure.properties.filename;
        if (typeof mystructure.properties.owner != "undefined") outstruct.properties.owner = mystructure.properties.owner;
        if (typeof mystructure.properties.control != "undefined") outstruct.properties.control = mystructure.properties.control;
        if (typeof mystructure.properties.installer != "undefined") outstruct.properties.installer = mystructure.properties.installer;
        if (typeof mystructure.properties.info != "undefined") outstruct.properties.info = mystructure.properties.info;
        if (typeof mystructure.properties.info != "undefined") outstruct.properties.dpi = mystructure.properties.dpi;
        if (typeof mystructure.properties.currentView != "undefined") outstruct.properties.currentView = mystructure.properties.currentView;
        if (typeof mystructure.properties.disableEDSCompression != "undefined") outstruct.properties.disableEDSCompression = mystructure.properties.disableEDSCompression;        
        if (typeof mystructure.properties.legacySchakelaars != "undefined") 
            outstruct.properties.legacySchakelaars = mystructure.properties.legacySchakelaars;
        else
            outstruct.properties.legacySchakelaars = null;
    }    

    // Kopieren van de paginatie voor printen

    if (typeof mystructure.print_table != "undefined") {
        outstruct.print_table.setHeight(mystructure.print_table.height);
        outstruct.print_table.setMaxWidth(mystructure.print_table.maxwidth);
        outstruct.print_table.setPaperSize(mystructure.print_table.papersize);
        outstruct.print_table.setModeVertical(mystructure.print_table.modevertical);
        outstruct.print_table.setstarty(mystructure.print_table.starty);
        outstruct.print_table.setstopy(mystructure.print_table.stopy);
        if (typeof mystructure.print_table.enableAutopage != "undefined") {
            outstruct.print_table.enableAutopage = mystructure.print_table.enableAutopage;
        } else {
            outstruct.print_table.enableAutopage = false;
        }

        for (let i=0; i<mystructure.print_table.pages.length; i++) {
            if (i != 0) outstruct.print_table.addPage();
            outstruct.print_table.pages[i].height = mystructure.print_table.pages[i].height;
            outstruct.print_table.pages[i].start = mystructure.print_table.pages[i].start;
            outstruct.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
        }
    }

    // Kopieren van de situatieplannen

    if (typeof mystructure.sitplanjson != "undefined") {
        outstruct.sitplan = new SituationPlan();
        outstruct.sitplan.fromJsonObject(mystructure.sitplanjson);
    }

    /* Kopieren van de eigenschappen van elk element.
     * Keys voor versies 1 en 2 en props voor versie 3
     */

    for (let i = 0; i < mystructure.length; i++) {
        if ( (version != 0) && (version < 3) ) {
            outstruct.addItem(mystructure.data[i].keys[0][2]);
            (outstruct.data[i] as Electro_Item).convertLegacyKeys(mystructure.data[i].keys);

            // In deze oude  versie bestonden autonummering nog niet dus we zetten deze af
            outstruct.data[i].props.autoKringNaam = "manueel";
            outstruct.data[i].props.autonr = "manueel";

        } else {
            outstruct.addItem(mystructure.data[i].props.type);
            (Object as any).assign(outstruct.data[i].props,mystructure.data[i].props);

            // Veel files uit versie 4 hadden nog geen autonummering (ingevoerd halfweg versie 4)
            // Indien we dit vastsellen zetten we de autonummering op "manueel"

            if ( (mystructure.data[i].props.type === "Kring") &&
                 (!mystructure.data[i].props.autoKringNaam) )
                        outstruct.data[i].props.autoKringNaam = "manueel"; 

            if ( (mystructure.data[i].props.nr !== undefined) && 
                 (mystructure.data[i].props.nr !== null) && 
                 (!mystructure.data[i].props.autonr) ) 
                        outstruct.data[i].props.autonr = "manueel"; 
        }

        outstruct.data[i].parent = mystructure.data[i].parent;
        outstruct.active[i] = mystructure.active[i];
        outstruct.id[i] = mystructure.id[i];
        outstruct.data[i].id = mystructure.data[i].id;
        outstruct.data[i].indent = mystructure.data[i].indent;
        outstruct.data[i].collapsed = mystructure.data[i].collapsed;
    }

    // As we re-read the structure and it might be shorter then it once was (due to deletions) but we might still have the old high ID's, always take over the curid from the file
    outstruct.curid = mystructure.curid;

    // Sort the entire new structure
    outstruct.voegAttributenToeAlsNodig();
    outstruct.reSort();

    // Return the result
    return outstruct;
}

export function loadFromText(text: string, version: number, redraw = true) {
    globalThis.structure = json_to_structure(text, globalThis.structure, version);
    if (redraw == true) globalThis.topMenu.selectMenuItemByName('Eéndraadschema'); // Ga naar het bewerken scherm, dat zal automatisch voor hertekenen zorgen.
}

/**
 * Converteert een string in EDS formaat naar een json string.
 * De string kan eventueel eerst entropy gecodeerd en base64 encoded zijn.
 * De string kan ook een header hebben met een versie en een identificatie.
 * 
 * @param {string} mystring - De string die uit een bestand of een json string is geladen.
 * @returns {Object} - Een object met twee attributen: text en version. Text is de json string en version is de versie van de string.
 */
function EDStoJson(mystring: string) {

    let text:string = "";
    let version: number;

    /* If first 3 bytes read "EDS", it is an entropy coded file
        * The first 3 bytes are EDS, the next 3 bytes indicate the version
        * The next 4 bytes are decimal zeroes "0000"
        * thereafter is a base64 encoded data-structure 
        * 
        * If the first 3 bytes read "TXT", it is not entropy coded, nor base64
        * The next 7 bytes are the same as above.
        * 
        * If there is no identifier, it is treated as a version 1 TXT
        * */
        
    if ( (mystring.charCodeAt(0)==69) && (mystring.charCodeAt(1)==68) && (mystring.charCodeAt(2)==83) ) { //recognize as EDS

        /* Determine versioning
        * < 16/12/2023: Version 1, original key based implementation
        *   16/12/2023: Version 2, Introductie van automatische breedte voor bepaalde SVG-tekst
        *                          Vrije tekst van Version 1 moet 30 pixels groter gemaakt worden om nog mooi in het schema te passen
        *   XX/01/2024: Version 3, Overgang van key based implementation naar props based implementation
        *                          functies convertLegacyKeys ingevoerd om oude files nog te lezen.
        */

        version = Number(mystring.substring(3,6));
        if (isNaN(version)) version = 1; // Hele oude files bevatten geen versie, ze proberen ze te lezen als versie 1

        mystring = atob(mystring.substring(10,mystring.length))
        var buffer:Uint8Array = new Uint8Array(mystring.length);
        for (let i = 0; i < mystring.length; i++) {
            buffer[i-0] = mystring.charCodeAt(i);
        }

        try { //See if the text decoder works, if not, we will do it manually (slower)
            let decoder = new TextDecoder("utf-8");
            text = decoder.decode(pako.inflate(buffer));
        } catch (error) { //Continue without the text decoder (old browsers)
            var inflated:Uint8Array = pako.inflate(buffer);
            text = "";
            for (let i=0; i<inflated.length; i++) {
                text += String.fromCharCode(inflated[i])
            }
        }
    } else if ( (mystring.charCodeAt(0)==84) && (mystring.charCodeAt(1)==88) && (mystring.charCodeAt(2)==84) ) { //recognize as TXT

        version = Number(mystring.substring(3,6));
        if (isNaN(version)) version = 3;

        text = mystring.substring(10,mystring.length)

    } else { // Very old file without header

        text = mystring;
        version = 1;
    }

    //Return an object with the text and the version
    return {text:text, version:version};
}

/* FUNCTION EDStoStructure
   
   Starts from a string that can be loaded from disk or from a file and is in EDS-format.
   puts the content in the javascript structure called "structure".
   Will redraw everything if the redraw flag is set.

*/

export function EDStoStructure(mystring: string, redraw = true, askUserToSave = false) {

    if (globalThis.autoSaver) globalThis.autoSaver.reset();

    let JSONdata = EDStoJson(mystring);
    
    // Dump the json in into the structure and redraw if needed
    loadFromText(JSONdata.text, JSONdata.version, redraw);

    // Clear the undo stack and push this one on top
    globalThis.undostruct.clear();
    globalThis.undostruct.store();

    // Scroll to top left for the SVG and HTML, this can only be done at the end because "right col" has to actually be visible
    const leftelem = document.getElementById("left_col");
    if (leftelem != null) {
      leftelem.scrollTop = 0;
      leftelem.scrollLeft = 0;
    }
    
    const rightelem = document.getElementById("right_col");
    if (rightelem != null) {
      rightelem.scrollTop = 0;
      rightelem.scrollLeft = 0;
    }

    // Make a manual save in the autoSaver
    if (globalThis.autoSaver && !askUserToSave) globalThis.autoSaver.saveManually();
    if (askUserToSave) {
        globalThis.autoSaver.forceHasChangesSinceLastManualSave();
        globalThis.structure.updateRibbon();
    } 

}

function importToAppend(mystring: string, redraw = true) {
    let JSONdata = EDStoJson(mystring);
    let structureToAppend = json_to_structure(JSONdata.text, null, JSONdata.version);

    //get the Maximal ID in array structure.id and call it maxID
    let maxID = 0;
    for (let i = 0; i < globalThis.structure.id.length; i++) {
        if (globalThis.structure.id[i] > maxID) maxID = globalThis.structure.id[i];
    }
    
    //then increase the ID's in structureToAppend accordingly
    for (let i = 0; i < structureToAppend.id.length; i++) {
        structureToAppend.id[i] += maxID;
        structureToAppend.data[i].id += maxID;
        if (structureToAppend.data[i].parent != 0) {
            structureToAppend.data[i].parent += maxID;
        }
    }
    globalThis.structure.curid += structureToAppend.curid;

    //then merge information for the eendraadschema
    globalThis.structure.length = globalThis.structure.length + structureToAppend.length;
    globalThis.structure.active = globalThis.structure.active.concat(structureToAppend.active);
    globalThis.structure.id = globalThis.structure.id.concat(structureToAppend.id);
    globalThis.structure.data = globalThis.structure.data.concat(structureToAppend.data);

    //update the sourcelist
    globalThis.structure.data.forEach((item) => {
        item.sourcelist = globalThis.structure;
    });

    //then set the printer to autopage
    globalThis.structure.print_table.enableAutopage = true;

    //then merge the situation plans but only if both exist
    if (globalThis.structure.sitplan != null) {
        if (structureToAppend.sitplan != null) {

            // Eerst oude situationplanview leeg maken, anders blijven oude div's hangen
            if (globalThis.structure.sitplanview != null) globalThis.structure.sitplanview.dispose(); 

            // dan nieuw situationplan maken en bij openen van het schema zal automatisch een nieuw situationplanview gecreëerd wordne
            globalThis.structure.sitplanjson = globalThis.structure.sitplan.toJsonObject();
            structureToAppend.sitplanjson = structureToAppend.sitplan.toJsonObject();
            
            for (let i = 0; i < structureToAppend.sitplanjson.elements.length; i++) {
                if (structureToAppend.sitplanjson.elements[i].electroItemId != null)
                    structureToAppend.sitplanjson.elements[i].electroItemId += maxID;
                structureToAppend.sitplanjson.elements[i].page += globalThis.structure.sitplanjson.numPages;
            }

            if ( (globalThis.structure.sitplanjson != null) && (structureToAppend.sitplanjson != null) ) {
                globalThis.structure.sitplanjson.numPages += structureToAppend.sitplanjson.numPages;
                globalThis.structure.sitplanjson.elements = globalThis.structure.sitplanjson.elements.concat(structureToAppend.sitplanjson.elements);
            }
            globalThis.structure.sitplan.fromJsonObject(globalThis.structure.sitplanjson);
            
            globalThis.structure.sitplanjson = null;
        }
    }
    
    globalThis.structure.reSort();
    
    //then remove the pointer from structureToAppend and let the garbage collector do its work
    structureToAppend = null;   

    //redraw if needed
    if (redraw) globalThis.topMenu.selectMenuItemByName('Eéndraadschema');

    // Store only after having redrawn, anders worden we naar de print-pagina gestuurd bij undo
    globalThis.undostruct.store();
}

/** FUNCTION download_by_blob
 *
 *  Downloads an EDS file to the user's PC
 *
 */

export function download_by_blob(text, filename, mimeType): void {
    
    var element = document.createElement('a');
    if ((navigator as any).msSaveBlob) {
        (navigator as any).msSaveBlob(new Blob([text], {
        type: mimeType
        }), filename);
    } else if (URL && 'download' in element) {
        let uriContent = URL.createObjectURL(new Blob([text], {type : mimeType}));
        element.setAttribute('href', uriContent);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        setTimeout(() => document.body.removeChild(element), 1000); // 1-second delay
    } else {
        this.location.go(`${mimeType},${encodeURIComponent(text)}`);
    }
    
}

/* FUNCTION showFilePage
   
   Shows the File-Page.  It will look different depending on whether the browser supports the file API or not

*/

export function showFilePage() {

    var strleft: string = '<span id="exportscreen"></span>'; //We need the id to check elsewhere that the screen is open

    // -- Openen uit bestand --
    strleft += `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Openen uit bestand</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
            <table border=0>
              <tr>
                <td width=350 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" onclick="loadClicked()">Openen</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Click op "openen" en selecteer een eerder opgeslagen EDS bestand.
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table><br>`;

    strleft += `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Opslaan</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
    `;

    // Bepaal of compressie uitgeschakeld moet worden (standaard: false)
    let disableEDSCompression = false;
    if (
        globalThis.structure &&
        globalThis.structure.properties &&
        typeof globalThis.structure.properties.disableEDSCompression !== "undefined"
    ) {
        disableEDSCompression = !!globalThis.structure.properties.disableEDSCompression;
    }

    // Toon de opslaan-knoppen en de laatste opgeslagen informatie

    if ((window as any).showOpenFilePicker) { // Use fileAPI
 
        strleft += '<table border=0><tr><td width=350 style="vertical-align:top;padding:5px">';
        if (globalThis.fileAPIobj.filename != null) { 
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = false)">Opslaan</button>&nbsp;';
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '</td><td style="vertical-align:top;padding:5px">'    
            strleft += 'Laatst geopend of opgeslagen om <b>' + globalThis.fileAPIobj.lastsaved + '</b> met naam <b>' + globalThis.fileAPIobj.filename + '</b><br><br>'
                    +  'Klik links op "Opslaan" om bij te werken'
        } else {
            strleft += 
                '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>' +
                '</td><td style="vertical-align:top;padding:7px">' +
                '<span class="highlight-warning">Uw werk werd nog niet opgeslagen tijdens deze sessie. Klik links op "Opslaan als".</span>';
        }
        strleft +=  '<br><br>' +
                    '<label>' +
                        '<input type="checkbox" id="saveUncompressedCheckbox" style="vertical-align:middle;margin-right:5px;" ' + (disableEDSCompression ? "checked" : "") + '>' +
                        'Opslaan zonder compressie (groter bestand)' +
                    '</label>';  

        strleft += '</td></tr>';
        strleft += '</table>';
        
    } else { // Legacy
        strleft +=  '<table border=0><tr><td width=350 style="vertical-align:top;padding:7px">';
        strleft +=  'Bestandsnaam: <span id="settings"><code>' + globalThis.structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button></span>';
        strleft +=  '</td><td style="vertical-align:top;padding:5px">'
        strleft +=  'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
        strleft +=  'Klik vervolgens op "opslaan" en volg de instructies van uw browser. '
        strleft +=  'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>'
        strleft +=  'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.'
        strleft +=  '<br><br>' +
                    '<label>' +
                        '<input type="checkbox" id="saveUncompressedCheckbox" style="vertical-align:middle;margin-right:5px;" ' + (disableEDSCompression ? "checked" : "") + '>' +
                        'Opslaan zonder compressie (groter bestand)' +
                    '</label>';   

        strleft += '</td></tr>';
        strleft += '</table>';
    }

    strleft += `
        </td>
      </tr>
    </table><br>    
    `;

    strleft += `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Samenvoegen</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
            <table border=0>
              <tr>
                <td width=350 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" onclick="importToAppendClicked()">Samenvoegen (Expert!)</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Open een tweede EDS bestand en voeg de inhoud toe aan het huidige EDS bestand.<br>
                  Voegt de ééndraadschema's samen en voegt eveneens pagina's toe aan het situatieschema als dat nodig is.<br><br>
                  <span style="color:red;font-weight:bold">Opgelet!</span> Het is aanbevolen uw werk op te slaan alvorens deze functie te gebruiken!
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table>`
    
    document.getElementById("configsection").innerHTML = strleft;

    let saveUncompressedCheckbox: HTMLInputElement = document.getElementById("saveUncompressedCheckbox") as HTMLInputElement;
    saveUncompressedCheckbox.onchange = function() {
        if (!globalThis.structure.properties) globalThis.structure.properties = {};
        globalThis.structure.properties.disableEDSCompression = saveUncompressedCheckbox.checked;
    }

    globalThis.toggleAppView('config');
}