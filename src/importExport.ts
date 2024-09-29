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

}

/* FUNCTION json_to_structure

   Takes a string in pure json and puts the content in the javascript structure called "structure".
   Will redraw everything if the redraw flag is set.
   Will perform a version upgrade in case the json is from an earlier version of the eendraadschema tool but this version upgrade will not be performed
   if version is set to 0.  If version is not set to 0 it should be set to the verson of the json.
    
*/

function json_to_structure(text: string, version = 0, redraw = true) {

    /* Read all data from disk in a javascript structure mystructure.
        * Afterwards we will gradually copy elements from this one into the official structure
        */
    let mystructure = JSON.parse(text);

    // upgrade if needed
    if (version != 0) upgrade_version(mystructure, version);

    /* We starten met het kopieren van data naar de eigenlijke structure.
    * Ook hier houden we er rekening mee dat in oude saves mogelijk niet alle info voorhanden was */

    structure = new Hierarchical_List();

    // Kopieren van hoofd-eigenschappen

    if (typeof mystructure.properties != 'undefined') {
        if (typeof mystructure.properties.filename != "undefined") structure.properties.filename = mystructure.properties.filename;
        if (typeof mystructure.properties.owner != "undefined") structure.properties.owner = mystructure.properties.owner;
        if (typeof mystructure.properties.installer != "undefined") structure.properties.installer = mystructure.properties.installer;
        if (typeof mystructure.properties.info != "undefined") structure.properties.info = mystructure.properties.info;
    }    

    // Kopieren van de paginatie voor printen

    if (typeof mystructure.print_table != "undefined") {
        structure.print_table.setHeight(mystructure.print_table.height);
        structure.print_table.setMaxWidth(mystructure.print_table.maxwidth);
        structure.print_table.setPaperSize(mystructure.print_table.papersize);
        structure.print_table.setModeVertical(mystructure.print_table.modevertical);
        structure.print_table.setstarty(mystructure.print_table.starty);
        structure.print_table.setstopy(mystructure.print_table.stopy);

        for (let i=0; i<mystructure.print_table.pages.length; i++) {
            if (i != 0) this.structure.print_table.addPage();
            this.structure.print_table.pages[i].height = mystructure.print_table.pages[i].height;
            this.structure.print_table.pages[i].start = mystructure.print_table.pages[i].start;
            this.structure.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
        }
    }

    /* Kopieren van de eigenschappen van elk element.
    * Keys voor versies 1 en 2 en props voor versie 3
    */

    for (let i = 0; i < mystructure.length; i++) {
        if ( (version != 0) && (version < 3) ) {
            structure.addItem(mystructure.data[i].keys[0][2]);
            (structure.data[i] as Electro_Item).convertLegacyKeys(mystructure.data[i].keys);
        } else {
            structure.addItem(mystructure.data[i].props.type);
            (Object as any).assign(structure.data[i].props,mystructure.data[i].props);
        }
        structure.data[i].parent = mystructure.data[i].parent;
        structure.active[i] = mystructure.active[i];
        structure.id[i] = mystructure.id[i];
        structure.data[i].id = mystructure.data[i].id;
        structure.data[i].indent = mystructure.data[i].indent;
        structure.data[i].collapsed = mystructure.data[i].collapsed;
    }

    // As we re-read the structure and it might be shorter then it once was (due to deletions) but we might still have the old high ID's, always take over the curid from the file
    structure.curid = mystructure.curid;

    // Sort the entire new structure
    structure.reSort();

    // Draw the structure
    if (redraw == true) HLRedrawTree();
}

/* FUNCTION import_to_structure
   
   Starts from a string that can be loaded from disk or from a file and is in EDS-format.
   puts the content in the javascript structure called "structure".
   Will redraw everything if the redraw flag is set.

*/

function import_to_structure(mystring: string, redraw = true) {

    var text:string = "";
    var version;

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

    // Dump the json in into the structure and redraw if needed
    json_to_structure(text, version, redraw);

    // Clear the undo stack and push this one on top
    undostruct.clear();
    undostruct.store();
}

function structure_to_json() {

    // Remove some unneeded data members that would only inflate the size of the output file
    for (let listitem of structure.data) {
        listitem.sourcelist = null;
    }
    
    // Create the output structure in uncompressed form
    var text:string = JSON.stringify(structure);

    // Put the removed data members back
    for (let listitem of structure.data) {
        listitem.sourcelist = structure;
    }

    return(text);

}