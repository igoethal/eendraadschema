//=========================================================================//
//
//  Eendraadschema tekenen (https://eendraadschema.goethals-jacobs.be/)
//  Copyright (C) 2019  Ivan Goethals
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//-------------------------------------------------------------------------//
//
//  Want to contribute?, use the contact-form on the website mentioned
//  above.
//
//=========================================================================//

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
function isInt(value) {
    return !isNaN(value) &&
        parseInt(value) == value &&
        !isNaN(parseInt(value, 10));
}
function svgTextWidth(input, fontsize, options) {
    if (fontsize === void 0) { fontsize = 10; }
    if (options === void 0) { options = ''; }
    var div = document.createElement('div');
    div.innerHTML = '<svg width="1000" height="20"><text x="0" y="10" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="' + Number(fontsize) + '" ' + options + '>' + input + '</text></svg>';
    document.getElementById("configsection").appendChild(div);
    var width = div.children[0].children[0].getBBox().width;
    document.getElementById("configsection").removeChild(div);
    return (Math.ceil(width));
}
function flattenSVG(SVGstruct, shiftx, shifty, node) {
    var str = "";
    var X = new XMLSerializer();
    var parser = new DOMParser();
    var outstruct = SVGstruct;
    if (SVGstruct.localName == "svg") {
        if (outstruct.attributes.getNamedItem("x")) { // make SVG a 0,0 element
            shiftx += parseFloat(outstruct.attributes.getNamedItem("x").nodeValue);
            outstruct.attributes.getNamedItem("x").nodeValue = 0;
        }
        if (outstruct.attributes.getNamedItem("y")) { // make SVG a 0,0 element
            shifty += parseFloat(outstruct.attributes.getNamedItem("y").nodeValue);
            outstruct.attributes.getNamedItem("y").nodeValue = 0;
        }
        for (var i = 0; i < SVGstruct.children.length; i++) {
            str = str.concat(flattenSVG(SVGstruct.children[i], shiftx, shifty, node + 1), "\n");
        }
        if (node <= 0) {
            //---output[0] = outstruct;
            if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
                str = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" width="' + (outstruct.attributes.getNamedItem("width").nodeValue) +
                    '" height="' + (outstruct.attributes.getNamedItem("height").nodeValue) + '">' + str + '</svg>';
            }
            else {
                str = '<svg>' + str + '</svg>';
            }
        }
    }
    else {
        if (SVGstruct.localName == "line") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x1").nodeValue) + shiftx;
                outstruct.attributes.getNamedItem("x2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x2").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y1").nodeValue) + shifty;
                outstruct.attributes.getNamedItem("y2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y2").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "use") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "rect") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "circle") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("cx").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cx").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("cy").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cy").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "text") {
            outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            if (outstruct.attributes.getNamedItem("transform")) {
                outstruct.attributes.getNamedItem("transform").value = "rotate(-90 " +
                    outstruct.attributes.getNamedItem("x").nodeValue + "," +
                    outstruct.attributes.getNamedItem("y").nodeValue + ")";
            }
        }
        if (SVGstruct.localName == "polygon") {
            var polystr_out = "";
            var polystr_in = outstruct.attributes.getNamedItem("points").nodeValue;
            var splitted_in = polystr_in.split(" ");
            for (var countstr = 0; countstr < splitted_in.length; countstr++) {
                var points_in = splitted_in[countstr].split(",");
                polystr_out += (points_in[0] * 1 + shiftx) + ',' + (points_in[1] * 1 + shifty);
                if (countstr < splitted_in.length - 1) {
                    polystr_out += ' ';
                }
            }
            outstruct.attributes.getNamedItem("points").nodeValue = polystr_out;
        }
        str = X.serializeToString(outstruct);
        //remove all the xmlns tags
        var regex = /xmlns="[^"]+"/g;
        str = str.replace(regex, '');
    }
    return str;
}
function flattenSVGfromString(xmlstr) {
    var str = "";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
    //str = flattenSVG(xmlDoc.children[0],0,0,0);
    str = flattenSVG(xmlDoc.childNodes[0], 0, 0, 0);
    return str;
}
function htmlspecialchars(my_input) {
    var str;
    if (isNaN(my_input))
        str = my_input;
    else
        str = my_input.toString();
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function (m) { return map[m]; });
}
function browser_ie_detected() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    if ((msie > 0) || (trident > 0))
        return true;
    else
        return false;
}
var SVGelement = /** @class */ (function () {
    function SVGelement() {
        this.data = "";
        this.xleft = 0;
        this.xright = 0;
        this.xrightmin = 0;
        this.yup = 0;
        this.ydown = 0;
    }
    return SVGelement;
}());
var List_Item = /** @class */ (function () {
    function List_Item(mylist) {
        this.id = 0; //undefined
        this.parent = 0; //no parent
        this.indent = 0; //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.keys = new Array();
        this.sourcelist = mylist;
    }
    List_Item.prototype.resetKeys = function () {
    };
    List_Item.prototype.getMaxNumChilds = function (Parent) {
        return (2 ^ 24);
    };
    List_Item.prototype.getNumChilds = function () {
        var numChilds = 0;
        if (this.sourcelist != null) {
            for (var i = 0; i < this.sourcelist.data.length; ++i) {
                if (this.sourcelist.data[i].parent === this.id)
                    numChilds++;
            }
        }
        return (numChilds);
    };
    List_Item.prototype.getNumActiveChilds = function () {
        var numChilds = 0;
        if (this.sourcelist != null) {
            for (var i = 0; i < this.sourcelist.data.length; ++i) {
                if ((this.sourcelist.data[i].parent === this.id) &&
                    (this.sourcelist.active[i]) && (this.sourcelist.data[i].keys[0][2] != ""))
                    numChilds++;
            }
        }
        return (numChilds);
    };
    List_Item.prototype.isActief = function () {
        if (this.sourcelist != null) {
            var ordinal = this.sourcelist.getOrdinalById(this.id);
            return (this.sourcelist.active[ordinal]);
        }
        else {
            return (false);
        }
    };
    List_Item.prototype.heeftActiefKind = function () {
        return (this.getNumActiveChilds() > 0);
    };
    List_Item.prototype.heeftVerbruikerAlsKind = function () {
        var parent = this.getParent();
        if ((parent != null) && (parent.keys[0][2] == "Meerdere verbruikers")) {
            var myOrdinal = this.sourcelist.getOrdinalById(this.id);
            var lastOrdinal = 0;
            for (var i = 0; i < this.sourcelist.data.length; ++i) {
                //empty tekst at the end does not count as a valid last child of meerdere verbruikers (zo vermijden we een streepje op het einde van het stopcontact)
                if (this.sourcelist.active[i] && (this.sourcelist.data[i].keys[16][2] != "zonder kader") && (this.sourcelist.data[i].parent == this.parent))
                    lastOrdinal = i;
            }
            if (lastOrdinal > myOrdinal)
                return true;
            else
                return false;
        }
        else {
            if (this.sourcelist != null) {
                for (var i = 0; i < this.sourcelist.data.length; ++i) {
                    if ((this.sourcelist.data[i].parent === this.id) &&
                        (this.sourcelist.active[i]) && (this.sourcelist.data[i].keys[16][2] != "zonder kader") &&
                        (this.sourcelist.data[i].keys[0][2] != ""))
                        return true;
                }
            }
        }
        return false;
    };
    List_Item.prototype.setKey = function (key, setvalue) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i][0] == key) {
                this.keys[i][2] = setvalue;
            }
        }
    };
    List_Item.prototype.getKey = function (key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i][0] == key) {
                return (this.keys[i][2]);
            }
        }
    };
    List_Item.prototype.getParent = function () {
        if ((this.sourcelist != null) && (this.parent != 0)) {
            return this.sourcelist.data[this.sourcelist.getOrdinalById(this.parent)];
        }
        else {
            return null;
        }
    };
    List_Item.prototype.stringToHTML = function (keyid, size) {
        var output = "";
        var sizestr = "";
        switch (size) {
            case null: break;
            default:
                sizestr = ' size="' + size + '" ';
        }
        output += "<input type=\"text\"" + sizestr + " id=\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] +
            "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" +
            this.keys[keyid][1] + "\",\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] +
            "\") value=\"" + this.keys[keyid][2] + "\">";
        return (output);
    };
    List_Item.prototype.checkboxToHTML = function (keyid) {
        var output = "";
        output += "<input type=\"checkbox\" id=\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] + "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" + this.keys[keyid][1] + "\",\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] + "\")" + (this.keys[keyid][2] ? ' checked' : '') + ">";
        return (output);
    };
    List_Item.prototype.selectToHTML = function (keyid, items) {
        var myId = "HL_edit_" + this.id + "_" + this.keys[keyid][0];
        var myType = this.keys[keyid][1];
        var output = "";
        var options = "";
        output += "<select id=\"" + myId + "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" + this.keys[keyid][1] + "\",\"" + myId + "\")>";
        for (var i = 0; i < items.length; i++) {
            options = "";
            if (this.keys[keyid][2] == items[i]) {
                options += " selected";
            }
            if (items[i] == "---") {
                options += " disabled";
                items[i] = "---------------------------";
            }
            if (items[i] == "-") {
                options += " disabled";
                items[i] = "---";
            }
            output += '<option value="' + items[i] + '" ' + options + '>' + items[i] + '</option>';
        }
        output += "</select>";
        return (output);
    };
    List_Item.prototype.toHTML = function (mode, Parent) {
        return ("toHTML() function not defined for base class List_Item. Extend class first.");
    };
    List_Item.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        return (mySVG);
    };
    List_Item.prototype.updateConsumers = function () {
    }; //Empty container class --> only in extended functions
    return List_Item;
}());
var Electro_Item = /** @class */ (function (_super) {
    __extends(Electro_Item, _super);
    //-- Constructor, can be invoked with the List_Item of the parent to know better what kind of
    //   elements are acceptable (e.g. not all parent can have all possible childs) --
    function Electro_Item(mylist) {
        var _this = _super.call(this, mylist) || this;
        _this.keys.push(["type", "SELECT", ""]); //0
        _this.keys.push(["geaard", "BOOLEAN", true]); //1
        _this.keys.push(["kinderveiligheid", "BOOLEAN", true]); //2
        _this.keys.push(["accumulatie", "BOOLEAN", false]); //3
        _this.keys.push(["aantal", "SELECT", "1"]); //4
        _this.keys.push(["lichtkring_poligheid", "SELECT", "enkelpolig"]); //5
        //Ook gebruikt voor schakelaar (type schakelaar)
        //Ook gebruikt voor externe sturing Domotica gestuurde verbruiker (type sturing)
        _this.keys.push(["ventilator", "BOOLEAN", false]); //6
        _this.keys.push(["zekering", "SELECT", "automatisch"]); //7
        _this.keys.push(["amperage", "STRING", "20"]); //8
        _this.keys.push(["kabel", "STRING", "XVB 3G2,5"]); //9
        _this.keys.push(["naam", "STRING", ""]); //10
        _this.keys.push(["differentieel_waarde", "STRING", "300"]); //11
        _this.keys.push(["kabel_aanwezig", "BOOLEAN", true]); //12, In eerste plaats om aan te geven of er een kabel achter een zekering zit.
        _this.keys.push(["aantal2", "SELECT", "1"]); //13, a.o. gebruikt voor aantal lampen of aantal knoppen op drukknop_armatuur
        _this.keys.push(["voltage", "STRING", "230V/24V"]); //14, a.o. gebruikt voor aantal lampen
        _this.keys.push(["commentaar", "STRING", ""]); //15, extra tekstveld
        _this.keys.push(["select1", "SELECT", "standaard"]); //16, algemeen veld
        //Indien lichtpunt, select1 is het type van licht (standaard, TL, ...)
        //Indien drukknop, select1 kan "standaard", "dimmer" of "rolluik" zijn
        //Indien vrije tekst, select1 kan "verbruiker" of "zonder kader" zijn
        //Indien ketel, type is het soort verwarming
        //Indien stopcontact, select1 is het aantal fasen
        _this.keys.push(["select2", "SELECT", "standaard"]); //17, algemeen veld
        //Indien lichtpunt, select2 is de selector voor het type noodverlichting (indien aanwezig)
        //Indien vrije tekst of verbruiker, kan "links", "centreer", "rechts" zijn
        //Indien differentieel of differentieelautomaat (in kring of aansluiting), kan type "", "A", of "B" zijn
        //Indien automaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn
        _this.keys.push(["select3", "SELECT", "standaard"]); //18, algemeen veld
        //Indien differentieelautomaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn.  Veld 17 is dan het Type.
        //Indien vrije tekst kan je hier kiezen tussen automatisch of handmatige breedte
        _this.keys.push(["bool1", "BOOLEAN", false]); //19, algemeen veld
        //Indien lichtpunt, bool1 is de selector voor wandverlichting of niet
        //Indien drukknop, bool1 is de selector voor afgeschermd of niet
        //Indien schakelaar/lichtcircuit, bool1 is de selector voor signalisatielamp of niet
        //Indien vrije tekst of verbruiker, bool1 is de selector voor vet
        //Indien stopcontact, bool1 is de selector voor ingebouwde schakelaar
        //Indien domotica gestuurde verbruiker, bool1 is de selector voor draadloos
        _this.keys.push(["bool2", "BOOLEAN", false]); //20, algemeen veld
        //Indien lichtpunt, schakelaar, drukknop of stopcontact, bool2 is de selector voor halfwaterdicht of niet
        //Indien vrije tekst of verbruiker, bool2 is de selector voor schuin
        //Indien ketel, bool2 is de selector voor energiebron
        //Indien kring, bool2 is de selector voor selectieve differentieel
        //Indien stopcontact, bool2 is de selector voor halfwaterdicht
        //Indien domotica gestuurde verbruiker, bool2 is de selector voor drukknop
        _this.keys.push(["bool3", "BOOLEAN", false]); //21, algemeen veld
        //Indien lichtpunt, bool3 is de selector voor ingebouwde schakelaar of niet
        //Indien schakelaar of drukknop, bool3 is de selector voor verklikkerlamp of niet
        //Indien ******, bool3 is de selector voor warmtefunctie
        //Indien stopcontact, bool3 is de selector voor meerfasig
        //Indien domotica gestuurde verbruiker, bool3 is de selector voor geprogrammeerd
        _this.keys.push(["string1", "STRING", ""]); //22, algemeen veld
        //Indien vrije tekst of verbruiker, breedte van het veld
        //Indien vrije ruimte, breede van de ruimte
        _this.keys.push(["string2", "STRING", ""]); //23, algemeen veld
        //Indien vrije tekst of verbruiker, het adres-veld (want reeds gebruikt voor de tekst zelf)
        //Indien aansluiting, hier kan ook een extra naam voor de aansluiting staan
        _this.keys.push(["string3", "STRING", ""]); //24, algemeen veld
        //Indien aansluiting, kabeltype vóór de teller
        _this.keys.push(["bool4", "BOOLEAN", false]); //25, algemeen veld
        //Indien schakelaar, indicatie trekschakelaar of niet
        //Indien stopcontact, bool4 is de selector voor nulgeleider of niet
        //Indien domotica gestuurde verbruiker, bool4 is de selector voor detectie
        _this.keys.push(["bool5", "BOOLEAN", false]); //26, algemeen veld
        //Indien domotica gestuurde verbruiker, bool5 is de selector voor uitbreiding van de sturing met drukknop
        //Indien stopcontact, geeft aan dat deze in een verdeelbord zit
        _this.updateConsumers();
        return _this;
    }
    //-- When called, this one ensures we cannot have a child that doesn't align with its parent --
    Electro_Item.prototype.getConsumers = function () {
        var Parent = this.getParent();
        var consumers = [];
        if (Parent == null) {
            consumers = ["", "Kring", "Aansluiting"];
        }
        else {
            switch (Parent.keys[0][2]) {
                case "Bord": {
                    consumers = ["", "Kring", "Vrije ruimte"];
                    break;
                }
                case "Splitsing":
                case "Domotica": {
                    consumers = ["", "Kring"];
                    break;
                }
                case "Kring": {
                    consumers = ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
                    break;
                }
                case "Meerdere verbruikers": {
                    consumers = ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
                    break;
                }
                case "Domotica gestuurde verbruiker": {
                    consumers = ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
                    break;
                }
                case "Aansluiting": {
                    consumers = ["", "Bord", "Kring", "Splitsing"];
                    break;
                }
                default: {
                    consumers = ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
                    break;
                }
            }
        }
        return consumers;
    };
    //-- Make the current item a copy of source_item --
    Electro_Item.prototype.clone = function (source_item) {
        this.parent = source_item.parent;
        this.indent = source_item.indent;
        this.collapsed = source_item.collapsed;
        this.sourcelist = source_item.sourcelist;
        for (var i = 0; i < this.keys.length; i++) {
            for (var j = 0; j < 3; j++) {
                this.keys[i][j] = source_item.keys[i][j];
            }
        }
    };
    //-- Clear all keys --
    Electro_Item.prototype.clearKeys = function () {
        //Whipe most keys; note how we don't reset keys[10][2] as usually we don't want the number to change
        for (var i = 1; i < 10; i++)
            this.keys[i][2] = "";
        for (var i = 11; i < this.keys.length; i++)
            this.keys[i][2] = "";
    };
    //-- When a new element is created, we will call resetKeys to set the keys to their default values --
    Electro_Item.prototype.resetKeys = function () { }; // Implemented in the derived classes
    //-- Algorithm to manually set a key, but most of the time, the keys-array is updated directly
    //   Note that getKey is defined in List_Item --
    Electro_Item.prototype.setKey = function (key, setvalue) {
        _super.prototype.setKey.call(this, key, setvalue);
        //If type of component changed, reset everything
        if (key == "type") {
            this.resetKeys();
        }
        //Some validation on the input. Do properties still make sense after update
        switch (this.keys[0][2]) {
            case "Lichtcircuit":
                if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
                    if (this.getKey("aantal") > 2) {
                        this.setKey("aantal", "2");
                    }
                }
                break;
            case "Verwarmingstoestel":
                if ((this.getKey("accumulatie") == false) && (this.getKey("ventilator") == true)) {
                    this.setKey("ventilator", false);
                }
                break;
            case "Kring":
                if ((this.getKey("aantal") < 1) || (this.getKey("aantal") > 4)) {
                    this.setKey("aantal", "2");
                }
                break;
        }
    };
    //-- Returns true if the Electro_Item can have childs in case it is or
    //   will become a child of Parent --
    Electro_Item.prototype.checkInsertChild = function (Parent) {
        var allow = false;
        switch (this.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Kring":
            case "Domotica":
            case "Domotica gestuurde verbruiker":
            case "Splitsing":
                allow = true;
                break;
            case "Bel":
            case "Lichtcircuit":
                allow = false;
                break;
            default:
                if (typeof Parent == 'undefined') {
                    allow = true;
                }
                else {
                    switch (Parent.keys[0][2]) {
                        case "Aansluiting":
                        case "Bord":
                        case "Domotica":
                        case "Splitsing":
                        case "Meerdere verbruikers":
                            allow = false;
                            break;
                        default:
                            allow = true;
                            break;
                    }
                }
        }
        return (allow);
    };
    //-- returns the maximum number of childs the current Electro_Item can have in case
    //   it is or will become a child of Parent --
    Electro_Item.prototype.getMaxNumChilds = function (Parent) {
        var maxchilds = 0;
        switch (this.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Kring":
            case "Domotica":
            case "Splitsing":
            case "Meerdere verbruikers":
                maxchilds = 256;
                break;
            case "Domotica gestuurde verbruiker":
                maxchilds = 1;
                break;
            case "Bel":
            case "Lichtcircuit":
            case "Vrije ruimte":
                maxchilds = 0;
                break;
            default:
                if (typeof Parent == 'undefined') {
                    maxchilds = 256;
                }
                else {
                    switch (Parent.keys[0][2]) {
                        case "Aansluiting":
                        case "Bord":
                        case "Domotica":
                        case "Splitsing":
                        case "Meerdere verbruikers":
                            maxchilds = 0;
                            break;
                        default:
                            maxchilds = 1;
                            break;
                    }
                }
        }
        return (maxchilds);
    };
    //-- Checks if the insert after button should be displayed or not in case the
    //   element is or will become a child of Parent --
    Electro_Item.prototype.checkInsertAfter = function (Parent) {
        var allow = false;
        if (typeof Parent == 'undefined') {
            allow = true;
        }
        else {
            //alert(Parent.keys[0][2]);
            switch (Parent.keys[0][2]) {
                case "Aansluiting":
                case "Bord":
                case "Kring":
                case "Domotica":
                case "Splitsing":
                case "Meerdere verbruikers":
                    allow = true;
                    break;
                default:
                    allow = false;
                    break;
            }
        }
        return (allow);
    };
    Electro_Item.prototype.toHTMLHeader = function (mode, Parent) {
        var output = "";
        if (mode == "move") {
            output += "<b>ID: " + this.id + "</b>, ";
            output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id + ")\">&#9650;</button>";
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id + ")\">&#9660;</button>";
            if (this.checkInsertAfter(Parent)) {
                output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id + ")\">Clone</button>";
            }
        }
        else {
            if (this.checkInsertAfter(Parent)) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id + ")\">&#9650;</button>";
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id + ")\">&#9660;</button>";
            }
            if (this.checkInsertChild(Parent)) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id + ")\">&#9654;</button>";
            }
        }
        ;
        output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id + ")\">&#9851;</button>";
        output += "&nbsp;";
        output += this.selectToHTML(0, this.getConsumers());
        return (output);
    };
    //-- Display the element in the editing grid at the left of the screen in case the
    //   element is or will become a child of Parent --
    Electro_Item.prototype.toHTML = function (mode, Parent) { return (this.toHTMLHeader(mode, Parent)); }; // Implemented in the derived classes
    //-- Add the addressline below --
    Electro_Item.prototype.addAddress = function (mySVG, starty, godown, shiftx, key) {
        if (starty === void 0) { starty = 60; }
        if (godown === void 0) { godown = 15; }
        if (shiftx === void 0) { shiftx = 0; }
        if (key === void 0) { key = 15; }
        var returnstr = "";
        if (!(/^\s*$/.test(this.keys[key][2]))) { //check if adres contains only white space
            returnstr = '<text x="' + ((mySVG.xright - 20) / 2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[key][2]) + '</text>';
            mySVG.ydown = mySVG.ydown + godown;
        }
        return returnstr;
    };
    //-- Make the SVG for the entire electro item --
    Electro_Item.prototype.toSVG = function () { return (new SVGelement()); }; //Placeholder for derived classes
    return Electro_Item;
}(List_Item));
var Schakelaar = /** @class */ (function () {
    function Schakelaar(type, halfwaterdicht, verklikkerlamp, signalisatielamp, trekschakelaar) {
        if (halfwaterdicht === void 0) { halfwaterdicht = false; }
        if (verklikkerlamp === void 0) { verklikkerlamp = false; }
        if (signalisatielamp === void 0) { signalisatielamp = false; }
        if (trekschakelaar === void 0) { trekschakelaar = false; }
        this.type = type;
        this.halfwaterdicht = halfwaterdicht;
        this.verklikkerlamp = verklikkerlamp;
        this.signalisatielamp = signalisatielamp;
        this.trekschakelaar = trekschakelaar;
    }
    Schakelaar.prototype.schakelaarAttributentoSVGString = function (endx, isdubbel) {
        if (isdubbel === void 0) { isdubbel = false; }
        var outputstr = "";
        if (this.signalisatielamp)
            outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
        if (this.halfwaterdicht)
            outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        if (this.verklikkerlamp)
            outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
        if (this.trekschakelaar) {
            switch (isdubbel) {
                case false:
                    outputstr += '<line x1="' + (endx + 10.5) + '" x2="' + (endx + 10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 12.5) + '" y1="15" y2="11" stroke="black" />';
                    break;
                case true:
                    outputstr += '<line x1="' + (endx + 8.5) + '" x2="' + (endx + 8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 10.5) + '" y1="19" y2="15" stroke="black" />';
                    break;
            }
        }
        return outputstr;
    };
    Schakelaar.prototype.enkeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dubbeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.driepoligtoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_trippel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dubbelaanstekingtoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.wissel_enkeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.wissel_dubbeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.kruis_enkeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dimschakelaartoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dimschakelaarWisseltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_dim" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.bewegingsschakelaartoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 20;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#relais" x="' + endx + '" y="16" />'
            + '<use xlink:href="#moving_man" x="' + (endx + 1.5) + '" y="11" />'
            + '<use xlink:href="#detectie_klein" x="' + (endx + 23) + '" y="13"></use>'
            + '<line x1="' + endx + '" x2="' + endx + '" y1="29" y2="43" fill="none" style="stroke:black" />'
            + '<line x1="' + (endx + 40) + '" x2="' + (endx + 40) + '" y1="29" y2="43" fill="none" style="stroke:black" />'
            + '<line x1="' + (endx) + '" x2="' + (endx + 40) + '" y1="43" y2="43" fill="none" style="stroke:black" />';
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.rolluikschakelaartoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';
        if (this.halfwaterdicht)
            outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.defaulttoDrawReturnObj = function (startx, symbol) {
        var outputstr = "";
        var endx = startx + 20;
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="' + symbol + '" x="' + endx + '" y="25" />';
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.extraPlaatsRechts = function () {
        if ((this.type == "enkel") || (this.type == "dubbel") || (this.type == "driepolig") || (this.type == "dubbelaansteking") ||
            (this.type == "wissel_enkel") || (this.type == "wissel_dubbel") || (this.type == "kruis_enkel") || (this.type == "dimschakelaar") ||
            (this.type == "dimschakelaar_wissel"))
            return 10;
        else if (this.type == "rolluikschakelaar")
            return 7;
        else
            return 0;
    };
    Schakelaar.prototype.toSVGString = function (startx, last) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var outputstr = "";
        var endx;
        var lowerbound = 20;
        switch (this.type) {
            case "enkel":
                (_a = (this.enkeltoDrawReturnObj(startx)), endx = _a.endx, outputstr = _a.str);
                endx += 5;
                break;
            case "dubbel":
                (_b = (this.dubbeltoDrawReturnObj(startx)), endx = _b.endx, outputstr = _b.str);
                endx += 5;
                break;
            case "driepolig":
                (_c = (this.driepoligtoDrawReturnObj(startx)), endx = _c.endx, outputstr = _c.str);
                endx += 5;
                break;
            case "dubbelaansteking":
                (_d = (this.dubbelaanstekingtoDrawReturnObj(startx)), endx = _d.endx, outputstr = _d.str);
                endx += 5;
                break;
            case "wissel_enkel":
                (_e = (this.wissel_enkeltoDrawReturnObj(startx)), endx = _e.endx, outputstr = _e.str);
                endx += 5;
                lowerbound = Math.max(lowerbound, 35);
                break;
            case "wissel_dubbel":
                (_f = (this.wissel_dubbeltoDrawReturnObj(startx)), endx = _f.endx, outputstr = _f.str);
                endx += 5;
                lowerbound = Math.max(lowerbound, 35);
                break;
            case "kruis_enkel":
                (_g = (this.kruis_enkeltoDrawReturnObj(startx)), endx = _g.endx, outputstr = _g.str);
                endx += 5;
                lowerbound = Math.max(lowerbound, 35);
                break;
            case "dimschakelaar":
                (_h = (this.dimschakelaartoDrawReturnObj(startx)), endx = _h.endx, outputstr = _h.str);
                endx += 5;
                break;
            case "dimschakelaar_wissel":
                (_j = (this.dimschakelaarWisseltoDrawReturnObj(startx)), endx = _j.endx, outputstr = _j.str);
                endx += 5;
                lowerbound = Math.max(lowerbound, 35);
                break;
            case "bewegingsschakelaar":
                (_k = (this.bewegingsschakelaartoDrawReturnObj(startx)), endx = _k.endx, outputstr = _k.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "rolluikschakelaar":
                (_l = (this.rolluikschakelaartoDrawReturnObj(startx)), endx = _l.endx, outputstr = _l.str);
                endx += 8;
                lowerbound = Math.max(lowerbound, 25);
                break;
            case "schakelaar":
                (_m = (this.defaulttoDrawReturnObj(startx, '#schakelaar')), endx = _m.endx, outputstr = _m.str);
                endx += 40;
                break;
            case "schemerschakelaar":
                (_o = (this.defaulttoDrawReturnObj(startx, '#schemerschakelaar')), endx = _o.endx, outputstr = _o.str);
                endx += 40;
                break;
            case "teleruptor":
                (_p = (this.defaulttoDrawReturnObj(startx, '#teleruptor')), endx = _p.endx, outputstr = _p.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "dimmer":
                (_q = (this.defaulttoDrawReturnObj(startx, '#dimmer')), endx = _q.endx, outputstr = _q.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "relais":
                (_r = (this.defaulttoDrawReturnObj(startx, '#relais')), endx = _r.endx, outputstr = _r.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "minuterie":
                (_s = (this.defaulttoDrawReturnObj(startx, '#minuterie')), endx = _s.endx, outputstr = _s.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "thermostaat":
                (_t = (this.defaulttoDrawReturnObj(startx, '#thermostaat')), endx = _t.endx, outputstr = _t.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "tijdschakelaar":
                (_u = (this.defaulttoDrawReturnObj(startx, '#tijdschakelaar')), endx = _u.endx, outputstr = _u.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            default:
                endx = 30; //Indien type niet herkend wordt minstens deze variabele definieren
        }
        return ({ endx: endx, str: outputstr, lowerbound: lowerbound });
    };
    return Schakelaar;
}());
var Schakelaars = /** @class */ (function (_super) {
    __extends(Schakelaars, _super);
    function Schakelaars(mylist) {
        var _this = _super.call(this, mylist) || this;
        _this.tekenKeten = [];
        return _this;
    }
    Schakelaars.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Schakelaars"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 schakelaar
        this.keys[5][2] = "enkelpolig"; // Per default enkelpolig
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
        this.keys[19][2] = false; // Per default geen signalisatielampje
        this.keys[20][2] = false; // Per default niet halfwaterdicht
        this.keys[21][2] = false; // Per default geen verklikkerslampje
        this.keys[25][2] = false; // Per default geen trekschakelaar
    };
    Schakelaars.prototype.kanHalfwaterdichtZijn = function () {
        return ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
            (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
            (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel") || (this.keys[5][2] == "rolluikschakelaar"));
    };
    Schakelaars.prototype.kanVerklikkerlampjeHebben = function () {
        return ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
            (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
            (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel"));
    };
    Schakelaars.prototype.kanSignalisatielampjeHebben = function () {
        return this.kanVerklikkerlampjeHebben();
    };
    Schakelaars.prototype.kanTrekschakelaarHebben = function () {
        return ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
            (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel"));
    };
    Schakelaars.prototype.overrideKeys = function () {
        switch (this.keys[5][2]) {
            case "enkelpolig":
                this.keys[4][2] = String(Math.min(Number(this.keys[4][2]), 5));
                break;
            case "dubbelpolig":
                this.keys[4][2] = String(Math.min(Number(this.keys[4][2]), 2));
                break;
            default:
                this.keys[4][2] = "1";
                break;
        }
        if (!this.kanHalfwaterdichtZijn)
            this.keys[20][2] = false;
        if (!this.kanVerklikkerlampjeHebben)
            this.keys[21][2] = false;
        if (!this.kanSignalisatielampjeHebben)
            this.keys[19][2] = false;
        if (!this.kanTrekschakelaarHebben)
            this.keys[25][2] = false;
    };
    Schakelaars.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", " + this.selectToHTML(5, ["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
        if (this.kanHalfwaterdichtZijn())
            output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        if (this.kanVerklikkerlampjeHebben())
            output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
        if (this.kanSignalisatielampjeHebben())
            output += ", Signalisatielampje: " + this.checkboxToHTML(19);
        if (this.kanTrekschakelaarHebben())
            output += ", Trekschakelaar: " + this.checkboxToHTML(25);
        switch (this.keys[5][2]) {
            case "enkelpolig":
                output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2", "3", "4", "5"]);
                break;
            case "dubbelpolig":
                output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2"]);
                break;
        }
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Schakelaars.prototype.bouwSchakelaarKeten = function () {
        this.tekenKeten = [];
        switch (this.keys[5][2]) {
            case "wissel_enkel":
                this.tekenKeten.push(new Schakelaar("wissel_enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                break;
            case "wissel_dubbel":
                this.tekenKeten.push(new Schakelaar("wissel_dubbel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                break;
            case "kruis_enkel":
                this.tekenKeten.push(new Schakelaar("kruis_enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                break;
            case "teleruptor":
                this.tekenKeten.push(new Schakelaar("teleruptor"));
                break;
            case "bewegingsschakelaar":
                this.tekenKeten.push(new Schakelaar("bewegingsschakelaar"));
                break;
            case "schemerschakelaar":
                this.tekenKeten.push(new Schakelaar("schemerschakelaar"));
                break;
            case "schakelaar":
                this.tekenKeten.push(new Schakelaar("schakelaar"));
                break;
            case "dimmer":
                this.tekenKeten.push(new Schakelaar("dimmer"));
                break;
            case "relais":
                this.tekenKeten.push(new Schakelaar("relais"));
                break;
            case "minuterie":
                this.tekenKeten.push(new Schakelaar("minuterie"));
                break;
            case "thermostaat":
                this.tekenKeten.push(new Schakelaar("thermostaat"));
                break;
            case "tijdschakelaar":
                this.tekenKeten.push(new Schakelaar("tijdschakelaar"));
                break;
            case "rolluikschakelaar":
                this.tekenKeten.push(new Schakelaar("rolluikschakelaar", this.keys[20][2]));
                break;
            case "dubbelaansteking":
                this.tekenKeten.push(new Schakelaar("dubbelaansteking", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                break;
            case "dimschakelaar":
                this.tekenKeten.push(new Schakelaar("dimschakelaar", this.keys[20][2], this.keys[21][2], this.keys[19][2], false));
                break;
            case "dimschakelaar wissel":
                this.tekenKeten.push(new Schakelaar("dimschakelaar_wissel", this.keys[20][2], this.keys[21][2], this.keys[19][2], false));
                break;
            case "enkelpolig":
                if (Number(this.keys[4][2]) == 1)
                    this.tekenKeten.push(new Schakelaar("enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                if (Number(this.keys[4][2]) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                    for (var i = 2; i < Number(this.keys[4][2]); ++i) {
                        this.tekenKeten.push(new Schakelaar("kruis_enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                    }
                    this.tekenKeten.push(new Schakelaar("wissel_enkel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                }
                break;
            case "dubbelpolig":
                if (Number(this.keys[4][2]) == 1)
                    this.tekenKeten.push(new Schakelaar("dubbel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                if (Number(this.keys[4][2]) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                }
                break;
            case "driepolig":
                this.tekenKeten.push(new Schakelaar("driepolig", this.keys[20][2], this.keys[21][2], this.keys[19][2], this.keys[25][2]));
                break;
        }
    };
    Schakelaars.prototype.toSVG = function () {
        var _a;
        var mySVG = new SVGelement();
        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten();
        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        var startx = 1;
        var endx;
        for (var i = 0; i < this.tekenKeten.length; i++) {
            var islast = ((i == this.tekenKeten.length - 1) && (!this.heeftVerbruikerAlsKind()));
            var str = void 0;
            (_a = this.tekenKeten[i].toSVGString(startx, islast), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if (!this.heeftVerbruikerAlsKind())
            startx += this.tekenKeten[this.tekenKeten.length - 1].extraPlaatsRechts();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += this.addAddress(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20));
        mySVG.data += "\n";
        return (mySVG);
    };
    return Schakelaars;
}(Electro_Item));
var Lichtcircuit = /** @class */ (function (_super) {
    __extends(Lichtcircuit, _super);
    function Lichtcircuit(mylist) {
        return _super.call(this, mylist) || this;
    }
    Lichtcircuit.prototype.resetKeys = function () {
        _super.prototype.resetKeys.call(this); //Schakelaars
        this.keys[0][2] = "Lichtcircuit"; // This is rather a formality as we should already have this at this stage
        this.keys[13][2] = "1"; // Per default 1 lichtpunt
    };
    Lichtcircuit.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", " + this.selectToHTML(5, ["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
        if (this.kanHalfwaterdichtZijn())
            output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        if (this.kanVerklikkerlampjeHebben())
            output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
        if (this.kanSignalisatielampjeHebben())
            output += ", Signalisatielampje: " + this.checkboxToHTML(19);
        if (this.kanTrekschakelaarHebben())
            output += ", Trekschakelaar: " + this.checkboxToHTML(25);
        switch (this.keys[5][2]) {
            case "enkelpolig":
                output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2", "3", "4", "5"]);
                break;
            case "dubbelpolig":
                output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2"]);
                break;
        }
        output += ", Aantal lichtpunten: " + this.selectToHTML(13, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Lichtcircuit.prototype.toSVG = function () {
        var _a;
        var mySVG = new SVGelement();
        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten();
        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        var startx = 1;
        var endx;
        // Teken de schakelaars
        for (var i = 0; i < this.tekenKeten.length; i++) {
            var islast = ((i == this.tekenKeten.length - 1) && (!this.heeftVerbruikerAlsKind()));
            var str = void 0;
            (_a = this.tekenKeten[i].toSVGString(startx, islast), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        if (this.keys[13][2] >= 1) { //1 of meerdere lampen
            // Teken de lamp
            endx = startx + 30;
            mySVG.data += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                + '<use xlink:href="#lamp" x="' + endx + '" y="25" />';
            // Teken aantal lampen en symbool 'h' voor halfwaterdicht
            var print_str_upper = ""; //string om bovenaan te plaatsen
            if (this.keys[20][2]) {
                print_str_upper = "h";
                if (parseInt(this.keys[13][2]) > 1)
                    print_str_upper += ", x" + this.keys[13][2]; // Meer dan 1 lamp
            }
            else if (parseInt(this.keys[13][2]) > 1) {
                print_str_upper = "x" + this.keys[13][2];
            }
            if (print_str_upper != "")
                mySVG.data += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
            // Teken een leiding achter de lamp indien er nog kinderen zijn
            if (this.heeftVerbruikerAlsKind())
                mySVG.data += '<line x1="' + endx + '" y1="25" x2="' + (endx + 10) + '" y2="25" stroke="black" />';
            // Bepaal finale Bounding Box om het geheel te tekenen
            startx = endx + 10;
            lowerbound = Math.max(lowerbound, 29);
        }
        else { //Geen lampen
            // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
            if (!this.heeftVerbruikerAlsKind())
                startx += this.tekenKeten[this.tekenKeten.length - 1].extraPlaatsRechts();
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += this.addAddress(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20));
        mySVG.data += "\n";
        return (mySVG);
    };
    return Lichtcircuit;
}(Schakelaars));
var Aansluiting = /** @class */ (function (_super) {
    __extends(Aansluiting, _super);
    function Aansluiting(mylist) {
        return _super.call(this, mylist) || this;
    }
    Aansluiting.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Aansluiting"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "2"; // Per default 2-polig
        this.keys[7][2] = "differentieel"; // Per default een differentieel
        this.keys[8][2] = "40"; // Per default 40A
        this.keys[9][2] = "2x16"; // Default kabeltype voor een aansluiting
        this.keys[11][2] = "300"; // Differentieel per default 300 mA
        this.keys[15][2] = ""; // Per default geen adres/tekst
        this.keys[17][2] = ""; // Per default geen type voor een aansluiting
        this.keys[18][2] = ""; // Curve differentieelautomaat per default niet gegeven
        this.keys[20][2] = false; // Per default niet selectief
        this.keys[22][2] = ""; // Per default geen kortsluitvermogen voor een aansluiting
        this.keys[23][2] = ""; // Per default geen naam
        this.keys[24][2] = ""; // Per default geen kabeltype vóór de aansluiting
    };
    Aansluiting.prototype.overrideKeys = function () {
        if ((this.keys[4][2] < 1) || (this.keys[4][2] > 4))
            this.keys[4][2] = "2"; //Test dat aantal polen bestaat
    };
    Aansluiting.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Naam: " + this.stringToHTML(23, 5) + "<br>";
        if (this.getParent() != null)
            output += "Nr: " + this.stringToHTML(10, 5) + ", ";
        output += "Zekering: " + this.selectToHTML(7, ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "schemer"])
            + this.selectToHTML(4, ["2", "3", "4"])
            + this.stringToHTML(8, 2) + "A";
        switch (this.keys[7][2]) {
            case "differentieel":
                output += ", \u0394 " + this.stringToHTML(11, 3) + "mA"
                    + ", Type:" + this.selectToHTML(17, ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA"
                    + ", Selectief: " + this.checkboxToHTML(20);
                break;
            case "automatisch":
                output += ", Curve:" + this.selectToHTML(17, ["", "B", "C", "D"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringToHTML(11, 3) + "mA"
                    + ", Curve:" + this.selectToHTML(18, ["", "B", "C", "D"])
                    + ", Type:" + this.selectToHTML(17, ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA"
                    + ", Selectief: " + this.checkboxToHTML(20);
                break;
        }
        output += ", Kabeltype na teller: " + this.stringToHTML(9, 10)
            + ", Kabeltype v&oacute;&oacute;r teller: " + this.stringToHTML(24, 10)
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Aansluiting.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Indien er een kabeltype vóór de teller is schuiven we alles op
        var extrashift = 0;
        if (this.keys[24][2] != "")
            extrashift += 50;
        // get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
        mySVG = this.sourcelist.toSVG(this.id, "vertical", 150 + extrashift); //shift 150 to the right
        // Lijntje met hoogte 20 plaatsen net boven differentieel of automaat
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 20) + '" stroke="black" />';
        mySVG.yup += 20;
        // Zekering, differentieel, of ander symbool onderaan plaatsen
        var numlines = 1; // Hier houden we het aantal lijnen tekst bij 
        switch (this.keys[7][2]) {
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.keys[17][2] == 'B') || (this.keys[17][2] == 'C') || (this.keys[17][2] == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieel":
                // Code als differentieel selectief is
                if (this.keys[20][2]) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                        + '<rect x="' + (mySVG.xleft + 7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                        + "<text x=\"" + (mySVG.xleft + 19) + "\" y=\"" + (mySVG.yup + 8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft + 19) + "," + (mySVG.yup + 8) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage en de sluitstroom       
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om het type toe te voegen
                if ((this.keys[17][2] == 'A') || (this.keys[17][2] == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieelautomaat":
                // Code als differentieel selectief is
                if (this.keys[20][2]) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                        + '<rect x="' + (mySVG.xleft + 7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                        + "<text x=\"" + (mySVG.xleft + 19) + "\" y=\"" + (mySVG.yup + 8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft + 19) + "," + (mySVG.yup + 8) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.keys[18][2] == 'B') || (this.keys[18][2] == 'C') || (this.keys[18][2] == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.keys[18][2]) + "</text>";
                }
                // Code om het type toe te voegen
                if ((this.keys[17][2] == 'A') || (this.keys[17][2] == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "schakelaar":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                break;
            case "schemer":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>"
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 15) + '" />'
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 12) + '" />';
                break;
            case "smelt":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                break;
            case "geen":
                mySVG.yup += 0;
                break;
        }
        // Leiding helemaal links onderaan vóór de teller
        mySVG.data += '<line x1="1" ' + 'y1="' + (mySVG.yup + 25) + '" x2="' + (21 + extrashift) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>';
        // Kabeltype en tekst links onderaan vóór de teller
        if (this.keys[24][2] != "") {
            mySVG.data += '<text x="55" y="' + (mySVG.yup + 40)
                + '" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                + htmlspecialchars(this.keys[24][2]) + '</text>';
        }
        // De teller
        mySVG.data += '<use xlink:href="#elektriciteitsmeter" x="' + (21 + extrashift) + '" y="' + (mySVG.yup + 25) + '"></use>';
        // Leiding rechts onderaan na de teller
        mySVG.data += '<line x1="' + (61 + extrashift) + '" ' + 'y1="' + (mySVG.yup + 25) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>'
            + '<line x1="' + (mySVG.xleft) + '" y1="' + (mySVG.yup) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>';
        // Kabeltype en tekst rechts onderaan na de teller
        mySVG.data += '<text x="' + (85 + extrashift) + '" y="' + (mySVG.yup + 40)
            + '" style="text-anchor:left" font-family="Arial, Helvetica, sans-serif" font-size="10">'
            + htmlspecialchars(this.keys[9][2]) + '</text>';
        // 25 extra pixels voorzien onderaan zodat de teller nooit in de tekening daaronder loopt
        mySVG.yup += 25;
        mySVG.ydown = 25;
        // Indien adres niet leeg is, plaats het onderaan
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
            mySVG.data += '<text x="' + (41 + extrashift) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">'
                + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 15;
        }
        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft + (-6)) + '" ' + 'y="' + (mySVG.yup - 10) + '" '
            + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.keys[23][2]) + '</text>';
        // rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
        mySVG.xright = mySVG.xright + mySVG.xleft - 1;
        mySVG.xleft = 1;
        return (mySVG);
    };
    return Aansluiting;
}(Electro_Item));
var Aansluitpunt = /** @class */ (function (_super) {
    __extends(Aansluitpunt, _super);
    function Aansluitpunt(mylist) {
        return _super.call(this, mylist) || this;
    }
    Aansluitpunt.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Aansluitpunt"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Aansluitpunt.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Aansluitpunt.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 29;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#aansluitpunt" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 45, 0);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Aansluitpunt;
}(Electro_Item));
var Aftakdoos = /** @class */ (function (_super) {
    __extends(Aftakdoos, _super);
    function Aftakdoos(mylist) {
        return _super.call(this, mylist) || this;
    }
    Aftakdoos.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Aftakdoos"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Aftakdoos.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Aftakdoos.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#aftakdoos" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Aftakdoos;
}(Electro_Item));
var Batterij = /** @class */ (function (_super) {
    __extends(Batterij, _super);
    function Batterij(mylist) {
        return _super.call(this, mylist) || this;
    }
    Batterij.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Batterij"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Batterij.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Batterij.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#batterij" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Batterij;
}(Electro_Item));
var Bel = /** @class */ (function (_super) {
    __extends(Bel, _super);
    function Bel(mylist) {
        return _super.call(this, mylist) || this;
    }
    Bel.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Bel"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Bel.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Bel.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 40;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#bel" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Bel;
}(Electro_Item));
var Boiler = /** @class */ (function (_super) {
    __extends(Boiler, _super);
    function Boiler(mylist) {
        return _super.call(this, mylist) || this;
    }
    Boiler.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Boiler"; // This is rather a formality as we should already have this at this stage
        this.keys[3][2] = false; // Per default geen accumulatie
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Boiler.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", ";
        output += "Accumulatie: " + this.checkboxToHTML(3);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Boiler.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.keys[3][2]) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
        }
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Boiler;
}(Electro_Item));
var Bord = /** @class */ (function (_super) {
    __extends(Bord, _super);
    function Bord(mylist) {
        return _super.call(this, mylist) || this;
    }
    Bord.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Bord"; // This is rather a formality as we should already have this at this stage
        this.keys[1][2] = true; // Per default geaard
        this.keys[10][2] = ""; // Bord heeft initieel geen naam
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Bord.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Naam: " + this.stringToHTML(10, 5) + ", "
            + "Geaard: " + this.checkboxToHTML(1);
        return (output);
    };
    Bord.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        // Voorzie 10 extra pixels rechts na de allerlaatste kring
        mySVG.xright += 10;
        // Schuif het geheel voldoende naar links om plaats te hebben voor label en eventuele aarding
        var mintextsize = Math.max(30, svgTextWidth('&lt' + htmlspecialchars(this.keys[10][2]) + '&gt', 10, 'font-weight="bold"') + 13);
        var minxleft = mintextsize + (this.keys[1][2] ? 70 : 0); //Indien geaard hebben we 70 meer nodig
        if (mySVG.xleft <= minxleft) { // Minstens 100 pixels indien aarding
            mySVG.xright = mySVG.xleft + mySVG.xright - minxleft;
            mySVG.xleft = minxleft;
        }
        // Indien door het schuiven er niets rechts over blijft, voorzie minstens 10 pixels
        if (mySVG.xright <= 10)
            mySVG.xright = 10;
        // Voorzie voldoende plaats voor de lijn onderaan
        mySVG.ydown = Math.max(mySVG.ydown, 1);
        // Teken de lijn onderaan
        mySVG.data += '<line x1="4" x2="' + (mySVG.xleft + mySVG.xright - 6) +
            '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" stroke-width="3" />';
        // Voeg naam van het bord toe
        if (this.keys[10][2] !== "")
            mySVG.data += '<text x="' + (5) + '" y="' + (mySVG.yup + 13) + '" '
                + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">&lt;'
                + htmlspecialchars(this.keys[10][2]) + '&gt;</text>';
        // Teken aarding onderaan
        if (this.keys[1][2])
            mySVG.data += '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 0) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 10) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 15) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 25) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 0) + '" y1="' + (mySVG.yup + 40) + '" x2="' + (mintextsize + 20) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 2.5) + '" y1="' + (mySVG.yup + 43) + '" x2="' + (mintextsize + 17.5) + '" y2="' + (mySVG.yup + 43) + '" stroke="black" />'
                + '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 46) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 46) + '" stroke="black" />';
        return (mySVG);
    };
    return Bord;
}(Electro_Item));
var Diepvriezer = /** @class */ (function (_super) {
    __extends(Diepvriezer, _super);
    function Diepvriezer(mylist) {
        return _super.call(this, mylist) || this;
    }
    Diepvriezer.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Diepvriezer"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Diepvriezer.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Diepvriezer.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 60;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#diepvriezer" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Diepvriezer;
}(Electro_Item));
var Domotica_gestuurde_verbruiker = /** @class */ (function (_super) {
    __extends(Domotica_gestuurde_verbruiker, _super);
    function Domotica_gestuurde_verbruiker(mylist) {
        return _super.call(this, mylist) || this;
    }
    Domotica_gestuurde_verbruiker.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Domotica gestuurde verbruiker"; // This is rather a formality as we should already have this at this stage
        this.keys[5][2] = "drukknop";
        this.keys[15][2] = "";
        this.keys[19][2] = true;
        this.keys[20][2] = true;
        this.keys[21][2] = true;
        this.keys[25][2] = false;
        this.keys[26][2] = false;
    };
    Domotica_gestuurde_verbruiker.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Draadloos: " + this.checkboxToHTML(19)
            + ", Lokale Drukknop: " + this.checkboxToHTML(20)
            + ", Geprogrammeerd: " + this.checkboxToHTML(21)
            + ", Detectie: " + this.checkboxToHTML(25)
            + ", Externe sturing: " + this.checkboxToHTML(26);
        if (this.keys[26][2])
            output += ", Externe sturing: " + this.selectToHTML(5, ["drukknop", "schakelaar"]);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Domotica_gestuurde_verbruiker.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Eerst de tekening van de aangestuurde verbruiker maken
        var childcounter = 0; // Variabele voor het aantal kinderen, op dit moment ondersteunt de tool slechts 1 kind
        // Kind 1 is het element dat effectief gestuurd wordt.                
        for (var i = 0; i < this.sourcelist.length; i++) {
            if (this.isActief() && (this.sourcelist.data[i].parent == this.id)) {
                childcounter++; // We hebben een kind gevonden
                switch (childcounter) {
                    case 1: // Het Kind is het eerste element, i.e. de aangestuurde verbruiker. We tekenen dit kind.
                        mySVG = this.sourcelist.toSVG(this.sourcelist.data[i].id, "horizontal", 35, true);
                        break;
                }
            }
        }
        // We maken het aangestuurde element altijd minstens 50 x 56 pixels groot
        if (mySVG.yup + mySVG.ydown < 50) {
            mySVG.yup = 25;
            mySVG.ydown = 25;
        }
        if (mySVG.xleft + mySVG.xright < 56) {
            mySVG.xleft = 1;
            mySVG.xright = 55;
        }
        // We plaatsen het aangestuurde element in een kader
        mySVG.data = '<svg x="' + (21 + 5) + '" y="25">' + mySVG.data + '</svg>';
        mySVG.data += '<rect x="' + (21) + '" y="' + (5) +
            '" width="' + (mySVG.xleft + mySVG.xright + 12) +
            '" height="' + (mySVG.yup + mySVG.ydown + 20) + '" stroke="black" fill="none" />';
        mySVG.data += '<line x1="' + (21) + '" x2="' + (21 + mySVG.xleft + mySVG.xright + 12) + '" y1="' + (25) + '" y2="' + (25) + '" stroke="black" />';
        mySVG.xright += (21 + 12); //We shifted the element by 21 and then added a margin of 5 left and 7 right
        mySVG.yup += 25;
        mySVG.ydown += 5;
        // We plaatsen de leiding links
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + (mySVG.xleft + 20) +
            '" y1="' + (mySVG.yup) + '" y2="' + (mySVG.yup) + '" stroke="black" />';
        // We plaatsen de symbolen bovenaan
        if (this.keys[19][2])
            mySVG.data += '<use xlink:href="#draadloos_klein" x="22" y="15"></use>';
        if (this.keys[20][2])
            mySVG.data += '<use xlink:href="#drukknop_klein" x="38" y="15"></use>';
        if (this.keys[21][2])
            mySVG.data += '<use xlink:href="#tijdschakelaar_klein" x="54" y="15"></use>';
        if (this.keys[25][2])
            mySVG.data += '<use xlink:href="#detectie_klein" x="70" y="15"></use>';
        if (this.keys[26][2]) {
            switch (this.keys[5][2]) {
                case "schakelaar":
                    mySVG.data = '<svg x="' + (0) + '" y="20">' + mySVG.data + '</svg>'
                        + '<use xlink:href="#schakelaar_klein" x="78" y="18"></use>'
                        + '<line x1="78" y1="21" x2="78" y2="25" stroke="black" />';
                    mySVG.yup += 20;
                    break;
                default:
                    mySVG.data = '<svg x="' + (0) + '" y="20">' + mySVG.data + '</svg>'
                        + '<use xlink:href="#drukknop_klein" x="70" y="14"></use>'
                        + '<line x1="78" y1="21" x2="78" y2="25" stroke="black" />';
                    mySVG.yup += 20;
            }
        }
        //Place text below if there is any
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21 + 0) + '" y="' + (mySVG.ydown + mySVG.yup + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">'
                + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Domotica_gestuurde_verbruiker;
}(Electro_Item));
var Domotica = /** @class */ (function (_super) {
    __extends(Domotica, _super);
    function Domotica(mylist) {
        return _super.call(this, mylist) || this;
    }
    Domotica.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Domotica"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "Domotica"; // Set Tekst to "Domotica" when the item is cleared
        this.keys[23][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Domotica.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15, 30)
            + ", Adres/tekst: " + this.stringToHTML(23, 5);
        return (output);
    };
    Domotica.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        // We voorzien altijd minimaal een kader van 80 en zeker genoeg voor de tekst in het Domotica-symbool
        var minwidth = 80;
        for (var _i = 0, strlines_1 = strlines; _i < strlines_1.length; _i++) {
            var str = strlines_1[_i];
            minwidth = Math.max(minwidth, svgTextWidth(htmlspecialchars(str), 10, 'font-weight="bold"') + 15);
        } //15 padding
        minwidth += 20; //Ruimte voor leiding links
        if ((mySVG.xright + mySVG.xleft) <= minwidth)
            mySVG.xright = (minwidth - mySVG.xleft);
        // We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
        var extraplace = 15 * Math.max(strlines.length - 2, 0);
        mySVG.yup = Math.max(mySVG.yup + 20, 25) + extraplace / 2.0;
        mySVG.ydown = Math.max(mySVG.ydown, 25) + extraplace / 2.0;
        // We tekenen kader en aansluitende lijn links
        var width = (mySVG.xleft + mySVG.xright - 20);
        mySVG.data += '<rect x="' + (20) + '" width="' + (width) +
            '" y="' + (mySVG.yup - 20 - extraplace / 2.0) + '" height="' + (40 + extraplace) + '" stroke="black" stroke-width="2" fill="white" />';
        mySVG.data += '<line x1="1" x2="20" y1="' + (mySVG.yup) + '" y2="' + (mySVG.yup) + '" stroke="black" />';
        // We plaatsen de tekst in het kader
        var outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold" ';
        for (var i = 0; i < strlines.length; i++) {
            var dispy = mySVG.yup + 3 - extraplace / 2.0 - (strlines.length > 1 ? 7.5 : 0) + 15 * i;
            mySVG.data += outputstr_common + ' x="' + (21 + width / 2) + '" y="' + (dispy) + '">' + strlines[i] + '</text>';
        }
        // Forceer 1 pixel links en de rest rechts
        mySVG.xright = mySVG.xleft + mySVG.xright - 1;
        mySVG.xleft = 1; //we leave one pixel for the bold kring-line at the left
        // Plaats adres onderaan indien niet leeg en indien er actieve kinderen zijn
        if (!(/^\s*$/.test(this.keys[23][2]))) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[23][2]) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Domotica;
}(Electro_Item));
var Droogkast = /** @class */ (function (_super) {
    __extends(Droogkast, _super);
    function Droogkast(mylist) {
        return _super.call(this, mylist) || this;
    }
    Droogkast.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Droogkast"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Droogkast.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Droogkast.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#droogkast" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Droogkast;
}(Electro_Item));
var Drukknop = /** @class */ (function (_super) {
    __extends(Drukknop, _super);
    function Drukknop(mylist) {
        return _super.call(this, mylist) || this;
    }
    Drukknop.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Drukknop"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 armatuur
        this.keys[13][2] = "1"; // Per default 1 knop per armatuur
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = "standaard"; // Per default een standaard drukknop
        this.keys[19][2] = false; // Per default niet afgeschermd
        this.keys[20][2] = false; // Per default niet halfwaterdicht
        this.keys[21][2] = false; // Per default geen verklikkerslampje
    };
    Drukknop.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Type: " + this.selectToHTML(16, ["standaard", "dimmer", "rolluik"])
            + ", Verklikkerlampje: " + this.checkboxToHTML(21)
            + ", Halfwaterdicht: " + this.checkboxToHTML(20)
            + ", Afgeschermd: " + this.checkboxToHTML(19)
            + ", Aantal armaturen: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"])
            + ", Aantal knoppen per armatuur: " + this.selectToHTML(13, ["1", "2", "3", "4", "5", "6", "7", "8"])
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Drukknop.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 43;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        var aantal_knoppen = this.keys[4][2];
        // Teken lijn links
        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#drukknop" x="21" y="25"></use>';
        // Teken verklikkerlampje indien van toepassing
        if (this.keys[21][2]) {
            mySVG.data += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>' // midden 33, 25, lengte 7
                + '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
        }
        // Teken afgeschermd indien van toepassing
        if (this.keys[19][2]) {
            mySVG.data += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>' // midden 33, 25 lengte 7
                + '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>'
                + '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>'
                + '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>'
                + '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
        }
        // Plaats tekst voor "h" en/of aantal armaturen onderaan
        var printstr = "";
        if (this.keys[20][2])
            printstr += 'h';
        if (aantal_knoppen > 1) {
            if (printstr != '') {
                printstr += ', ';
            }
            printstr += 'x' + aantal_knoppen;
        }
        if (printstr != '')
            mySVG.data += '<text x="33" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(printstr) + '</text>';
        // Plaats tekst voor aantal knoppen
        if (this.keys[13][2] > 1) {
            mySVG.data += '<text x="44" y="13" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[13][2]) + '</text>'
                + '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
        }
        // Plaats extra tekens voor rolluik of dimmer
        switch (this.keys[16][2]) {
            case "dimmer":
                mySVG.data += '<polygon points="18,20 18,13 28,20" fill="black" stroke="black" />';
                break;
            case "rolluik":
                mySVG.data += '<polygon points="18,12 22,12 20,9" fill="black" stroke="black" />'
                    + '<polygon points="18,15 22,15 20,18" fill="black" stroke="black" />';
                break;
            default:
        }
        // Plaats adres helemaal onderaan
        if (printstr != '') {
            mySVG.data += this.addAddress(mySVG, 65, 20);
        }
        else {
            mySVG.data += this.addAddress(mySVG, 49, 5);
        }
        return (mySVG);
    };
    return Drukknop;
}(Electro_Item));
var Elektriciteitsmeter = /** @class */ (function (_super) {
    __extends(Elektriciteitsmeter, _super);
    function Elektriciteitsmeter(mylist) {
        return _super.call(this, mylist) || this;
    }
    Elektriciteitsmeter.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Elektriciteitsmeter"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Elektriciteitsmeter.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Elektriciteitsmeter.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Elektriciteitsmeter;
}(Electro_Item));
var Elektrische_oven = /** @class */ (function (_super) {
    __extends(Elektrische_oven, _super);
    function Elektrische_oven(mylist) {
        return _super.call(this, mylist) || this;
    }
    Elektrische_oven.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Elektrische oven"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Elektrische_oven.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Elektrische_oven.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#oven" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Elektrische_oven;
}(Electro_Item));
var EV_lader = /** @class */ (function (_super) {
    __extends(EV_lader, _super);
    function EV_lader(mylist) {
        return _super.call(this, mylist) || this;
    }
    EV_lader.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "EV lader"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    EV_lader.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    EV_lader.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 60;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#EVlader" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return EV_lader;
}(Electro_Item));
var Ketel = /** @class */ (function (_super) {
    __extends(Ketel, _super);
    function Ketel(mylist) {
        return _super.call(this, mylist) || this;
    }
    Ketel.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Ketel"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 ketel
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Ketel.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Type: " + this.selectToHTML(16, ["", "Met boiler", "Met tapspiraal", "Warmtekrachtkoppeling", "Warmtewisselaar"]);
        output += ", Energiebron: " + this.selectToHTML(17, ["", "Elektriciteit", "Gas (atmosferisch)", "Gas (ventilator)", "Vaste brandstof", "Vloeibare brandstof"]);
        output += ", Warmte functie: " + this.selectToHTML(18, ["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
        output += ", Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Ketel.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.keys[4][2] > 1) {
            shifty = 15;
            mySVG.data += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>';
        }
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        // Leiding links
        mySVG.data += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>'
            + '<use xlink:href="#verbruiker" x="21" y="' + (shifty + 25) + '"></use>';
        // Type ketel
        switch (this.keys[16][2]) {
            case "Met tapspiraal":
                mySVG.data += '<line x1="21" y1="' + (shifty + 15) + '" x2="61" y2="' + (shifty + 7) + '" stroke="black" />'
                    + '<line x1="21" y1="' + (shifty + 15) + '" x2="61" y2="' + (shifty + 23) + '" stroke="black" />';
                break;
            case "Met boiler":
                mySVG.data += '<rect x="31" y="' + (shifty + 10) + '" width="20" height="10" stroke="black" fill="white" />';
                break;
            case "Warmtewisselaar":
                mySVG.data += '<line x1="26" y1="' + (shifty + 0) + '" x2="26" y2="' + (shifty + 5) + '" stroke="black" />'
                    + '<line x1="56" y1="' + (shifty + 0) + '" x2="56" y2="' + (shifty + 5) + '" stroke="black" />'
                    + '<line x1="26" y1="' + (shifty + 5) + '" x2="33.5" y2="' + (shifty + 23) + '" stroke="black" />'
                    + '<line x1="56" y1="' + (shifty + 5) + '" x2="48.5" y2="' + (shifty + 23) + '" stroke="black" />'
                    + '<line x1="33.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />'
                    + '<line x1="48.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />';
                break;
            case "Warmtekrachtkoppeling":
                mySVG.data += '<circle cx="41" cy="' + (shifty + 16) + '" r="7" style="stroke:black;fill:none" />'
                    + '<text x="41" y="' + (shifty + 17) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">G</text>';
                break;
        }
        // Waar gaan we de andere symbolen plaatsen, indien slechts 1, midden onderaan, zoniet links en rechts
        var shift_symbol_energiebron = 41;
        var shift_symbol_warmtefunctie = 41;
        if ((this.keys[17][2] != "") && (this.keys[18][2] != "")) {
            var shift_symbol_energiebron = 31;
            var shift_symbol_warmtefunctie = 51;
        }
        // Plaats de symbolen onderaan
        switch (this.keys[17][2]) {
            case "Gas (ventilator)":
                mySVG.data += '<use xlink:href="#gas_ventilator" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                break;
            case "Gas (atmosferisch)":
                mySVG.data += '<use xlink:href="#gas_atmosferisch" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                break;
            case "Elektriciteit":
                mySVG.data += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                break;
            case "Vaste brandstof":
                mySVG.data += '<rect x="' + (shift_symbol_energiebron - 6) + '" y="' + (shifty + 29) + '" width="12" height="12" style="stroke:black;fill:black" />';
                break;
            case "Vloeibare brandstof":
                mySVG.data += '<circle cx="' + (shift_symbol_energiebron) + '" cy="' + (shifty + 35) + '" r="6" style="stroke:black;fill:black" />';
                break;
        }
        switch (this.keys[18][2]) {
            case "Verwarmend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+</text>';
                break;
            case "Koelend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">-</text>';
                break;
            case "Verwarmend en koelend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+/-</text>';
                break;
        }
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG, 60 + shifty, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Ketel;
}(Electro_Item));
var Koelkast = /** @class */ (function (_super) {
    __extends(Koelkast, _super);
    function Koelkast(mylist) {
        return _super.call(this, mylist) || this;
    }
    Koelkast.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Koelkast"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Koelkast.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Koelkast.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#koelkast" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Koelkast;
}(Electro_Item));
var Kookfornuis = /** @class */ (function (_super) {
    __extends(Kookfornuis, _super);
    function Kookfornuis(mylist) {
        return _super.call(this, mylist) || this;
    }
    Kookfornuis.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Kookfornuis"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Kookfornuis.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Kookfornuis.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#kookfornuis" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Kookfornuis;
}(Electro_Item));
var Kring = /** @class */ (function (_super) {
    __extends(Kring, _super);
    function Kring(mylist) {
        return _super.call(this, mylist) || this;
    }
    Kring.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Kring"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "2"; // Per default 2-polige automaat
        this.keys[7][2] = "automatisch"; // Per default automatische zekering
        this.keys[8][2] = "20"; // Per deault 20 Ampère
        this.keys[9][2] = "XVB Cca 3G2,5"; // Default type kabel
        this.keys[11][2] = "300"; // Differentieel per default 300 mA
        this.keys[15][2] = ""; // Tekst naast de kabel
        this.keys[16][2] = "N/A"; // Per default, locatie kabel niet geweten
        this.keys[17][2] = ""; // Type differentieel, Type differentieelautomaat, of Curve automaat per default niet gegeven
        this.keys[18][2] = ""; // Curve differentieelautomaat per default niet gegeven
        this.keys[19][2] = false; // Per default kabel niet in buis
        this.keys[20][2] = false; // Per default niet selectief
        this.keys[22][2] = ""; // Kortsluitvermogen per default niet gegeven
        //Bepalen of er per default een kabel aanwezig is en of we zekeringen plaatsen
        var parent = this.getParent();
        if (parent == null) {
            this.keys[12][2] = true; // Kabel aanwezig
            this.keys[10][2] = ""; // We geven de kring geen naam als er geen parent is
        }
        else
            switch (parent.keys[0][2]) { // Selecteren op basis van parent
                case "Bord":
                    this.keys[7][2] = "automatisch"; // Wel een zekering na bord
                    this.keys[10][2] = "---"; // We zetten iets als default dat gebruikers niet vergeten een naam aan de kring te geven na een bord
                    this.keys[12][2] = true; // wel een kabel na bord
                    break;
                case "Splitsing":
                    this.keys[7][2] = "geen"; // geen zekering per default na splitsing
                    this.keys[10][2] = ""; // We geven de kring geen naam
                    this.keys[12][2] = false; // geen kabel per default na splitsing
                    break;
                case "Kring":
                    this.keys[9][2] = ""; // We geven geen kabeltype op
                    this.keys[10][2] = ""; // We geven de kring geen naam
                    this.keys[12][2] = true; // wel een kabel na domotica
                    break;
                case "Domotica":
                    this.keys[7][2] = "geen"; // geen zekering per default na domotica
                    this.keys[10][2] = ""; // We geven de kring geen naam
                    this.keys[12][2] = true; // wel een kabel na domotica
                    break;
                default:
                    this.keys[7][2] = "automatisch"; // wel een zekering na bord
                    this.keys[10][2] = ""; // We geven de kring geen naam
                    this.keys[12][2] = true; // wel een kabel na bord
                    break;
            }
    };
    Kring.prototype.overrideKeys = function () {
        if ((this.keys[4][2] < 1) || (this.keys[4][2] > 4))
            this.keys[4][2] = "2"; //Test dat aantal polen bestaat
        if (this.keys[16][2] == "Luchtleiding")
            this.keys[19][2] = false; //Indien luchtleiding nooit een buis tekenen
    };
    Kring.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Naam: " + this.stringToHTML(10, 5) + "<br>"
            + "Zekering: " + this.selectToHTML(7, ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "relais", "schemer", "overspanningsbeveiliging"]);
        // Aantal polen en Ampérage
        if ((this.keys[7][2] != "geen") && (this.keys[7][2] != "relais"))
            output += this.selectToHTML(4, ["2", "3", "4", "-", "1"]) + this.stringToHTML(8, 2) + "A";
        // Specifieke input voor differentielen en automaten
        switch (this.keys[7][2]) {
            case "differentieel":
                output += ", \u0394 " + this.stringToHTML(11, 3) + "mA"
                    + ", Type:" + this.selectToHTML(17, ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA"
                    + ", Selectief: " + this.checkboxToHTML(20);
                break;
            case "automatisch":
                output += ", Curve:" + this.selectToHTML(17, ["", "B", "C", "D"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringToHTML(11, 3) + "mA"
                    + ", Curve:" + this.selectToHTML(18, ["", "B", "C", "D"])
                    + ", Type:" + this.selectToHTML(17, ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringToHTML(22, 3) + "kA"
                    + ", Selectief: " + this.checkboxToHTML(20);
                break;
        }
        // Eigenschappen van de kabel
        output += ", Kabel: " + this.checkboxToHTML(12);
        if (this.keys[12][2]) { // Kabel aanwezig
            output += ", Type: " + this.stringToHTML(9, 10)
                + ", Plaatsing: " + this.selectToHTML(16, ["N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand"]);
            if (this.keys[16][2] != "Luchtleiding")
                output += ", In buis: " + this.checkboxToHTML(19);
        }
        output += ", Tekst: " + this.stringToHTML(15, 10);
        return (output);
    };
    Kring.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Bepalen of we de hele kring naar rechts moeten opschuiven om rekening te houden met symbooltjes qua kabel-locatie
        var cable_location_available = 0;
        if (this.keys[12][2] /* kabel aanwezig */ && (this.keys[19][2] /* kabel in buis */ || contains(["Ondergronds", "In wand", "Op wand"], this.keys[16][2]))) {
            cable_location_available = 1;
        }
        // Alle verbruikers van de kring tekenen
        mySVG = this.sourcelist.toSVG(this.id, "vertical", 35 + 20 * cable_location_available);
        // Kabel tekenen
        if (this.keys[12][2]) { // Kabel aanwezig
            // Kabel tekenen en naam van de kabel ernaast zetten
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 100) + '" stroke="black" />'
                + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup + 80) + "\""
                + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup + 80) + ")"
                + "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                + htmlspecialchars(this.keys[9][2]) + "</text>";
            // Luchtleiding tekenen indien van toepassing
            if (this.keys[16][2] == "Luchtleiding")
                mySVG.data += '<circle cx="' + (mySVG.xleft) + '" cy="' + (mySVG.yup + 20) + '" r="4" style="stroke:black;fill:none" />';
            // Symbolen naast de kabel zetten
            if (cable_location_available) {
                if ((this.keys[19][2]) && (this.keys[16][2] != "Luchtleiding")) // Rondje voor "in buis" tekenen
                    mySVG.data += '<circle cx="' + (mySVG.xleft - 10) + '" cy="' + (mySVG.yup + 40) + '" r="4" style="stroke:black;fill:none" />';
                switch (this.keys[16][2]) {
                    case "Ondergronds":
                        mySVG.data += '<line x1="' + (mySVG.xleft - 13) + '" x2="' + (mySVG.xleft - 13) + '" y1="' + (mySVG.yup + 60) + '" y2="' + (mySVG.yup + 80) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 10) + '" x2="' + (mySVG.xleft - 10) + '" y1="' + (mySVG.yup + 62) + '" y2="' + (mySVG.yup + 78) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 7) + '" x2="' + (mySVG.xleft - 7) + '" y1="' + (mySVG.yup + 64) + '" y2="' + (mySVG.yup + 76) + '" style="stroke:black" />';
                        break;
                    case "In wand":
                        mySVG.data += '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 15) + '" y1="' + (mySVG.yup + 10) + '" y2="' + (mySVG.yup + 30) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 10) + '" y2="' + (mySVG.yup + 10) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 20) + '" y2="' + (mySVG.yup + 20) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 30) + '" y2="' + (mySVG.yup + 30) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 15) + '" y1="' + (mySVG.yup + 65) + '" y2="' + (mySVG.yup + 85) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 85) + '" y2="' + (mySVG.yup + 85) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 65) + '" y2="' + (mySVG.yup + 65) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 75) + '" y2="' + (mySVG.yup + 75) + '" style="stroke:black" />';
                        break;
                    case "Op wand":
                        mySVG.data += '<line x1="' + (mySVG.xleft - 5) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 10) + '" y2="' + (mySVG.yup + 30) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 10) + '" y2="' + (mySVG.yup + 10) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 20) + '" y2="' + (mySVG.yup + 20) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 30) + '" y2="' + (mySVG.yup + 30) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 5) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 65) + '" y2="' + (mySVG.yup + 85) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 85) + '" y2="' + (mySVG.yup + 85) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 65) + '" y2="' + (mySVG.yup + 65) + '" style="stroke:black" />'
                            + '<line x1="' + (mySVG.xleft - 15) + '" x2="' + (mySVG.xleft - 5) + '" y1="' + (mySVG.yup + 75) + '" y2="' + (mySVG.yup + 75) + '" style="stroke:black" />';
                        break;
                }
            }
            mySVG.yup += 100;
        }
        else { // Kabel niet aanwezig, we tekenen gewoon een verticaal lijntje van 20 pixels
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 20) + '" stroke="black" />';
            mySVG.yup += 20;
        }
        // Selectief differentieel tekenen indien van toepassing
        if (this.keys[20][2]) { //Differentieel is selectief
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                + '<rect x="' + (mySVG.xleft + 7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                + "<text x=\"" + (mySVG.xleft + 19) + "\" y=\"" + (mySVG.yup + 8) + "\""
                + " transform=\"rotate(-90 " + (mySVG.xleft + 19) + "," + (mySVG.yup + 8) + ")"
                + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
            mySVG.yup += 23;
        }
        // Zekering, differentieel, of ander symbool onderaan plaatsen
        var nameshift = -6; // Deze geeft aan hoeveel de naam naar beneden geduwd kan worden
        var numlines = 1; // Hier houden we het aantal lijnen tekst bij
        switch (this.keys[7][2]) {
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.keys[17][2] == 'B') || (this.keys[17][2] == 'C') || (this.keys[17][2] == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieel":
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om het type toe te voegen
                if ((this.keys[17][2] == 'A') || (this.keys[17][2] == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieelautomaat":
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.keys[18][2] == 'B') || (this.keys[18][2] == 'C') || (this.keys[18][2] == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.keys[18][2]) + "</text>";
                }
                // Code om het type toe te voegen
                if ((this.keys[17][2] == 'A') || (this.keys[17][2] == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.keys[17][2]) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.keys[22][2] != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }
                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "schakelaar":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                break;
            case "overspanningsbeveiliging":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#overspanningsbeveiliging_inline" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 20) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 20) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                nameshift = -11; //
                break;
            case "schemer":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>"
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 15) + '" />'
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 12) + '" />';
                break;
            case "relais":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#relais_kring" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />';
                nameshift = -11;
                break;
            case "smelt":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                break;
            case "geen":
                mySVG.yup += 0; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                break;
        }
        // Tekst naast de kring
        var tekstlocatie = mySVG.yup - 40; //Standaard staat tekst boven de zekering
        if (this.keys[7][2] == "geen")
            tekstlocatie += 25; //Als er geen zekering is kan tekst naar beneden
        mySVG.data += '<text x="' + (mySVG.xleft - 6 - 20 * cable_location_available) + '" ' + 'y="' + (tekstlocatie) + '" '
            + 'transform="rotate(-90 ' + (mySVG.xleft - 6 - 20 * cable_location_available) + ',' + (tekstlocatie) + ')" '
            + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.keys[15][2]) + '</text>';
        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft + nameshift) + '" ' + 'y="' + (mySVG.yup + 3) + '" '
            + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.keys[10][2]) + '</text>';
        // Lijntje onder de zekering
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 15) + '" stroke="black" />';
        mySVG.yup += 15;
        // Als er helemaal niets getekend is voorzien we nog steeds een lege box
        if (mySVG.yup <= 0) {
            mySVG.xleft = 20;
            mySVG.xright = 20;
            mySVG.yup = 50;
            mySVG.ydown = 0;
        }
        return (mySVG);
    };
    return Kring;
}(Electro_Item));
var Lichtpunt = /** @class */ (function (_super) {
    __extends(Lichtpunt, _super);
    function Lichtpunt(mylist) {
        return _super.call(this, mylist) || this;
    }
    Lichtpunt.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Lichtpunt"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 Lamp
        this.keys[13][2] = "1"; // Per default 1 buis in een TL lamp
        this.keys[16][2] = "standaard"; // Per default standaard lamp
        this.keys[17][2] = "Geen"; // Per default geen noodverlichting
        this.keys[19][2] = false; // Per default geen wandlamp
        this.keys[20][2] = false; // Per default niet halfwaterdicht
        this.keys[21][2] = false; // Per default geen ingebouwde schakelaar
    };
    Lichtpunt.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", "
            + "Type: " + this.selectToHTML(16, ["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
        if (this.keys[16][2] == "TL") {
            output += "Aantal buizen: " + this.selectToHTML(13, ["1", "2", "3", "4"]) + ", ";
        }
        output += "Aantal lampen: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]) + ", "
            + "Wandlamp: " + this.checkboxToHTML(19) + ", "
            + "Halfwaterdicht: " + this.checkboxToHTML(20) + ", "
            + "Ingebouwde schakelaar: " + this.checkboxToHTML(21) + ", "
            + "Noodverlichting: " + this.selectToHTML(17, ["Geen", "Centraal", "Decentraal"])
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Lichtpunt.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;
        // Teken de leiding links
        mySVG.data = '<line x1="1" x2="30" y1="25" y2="25" stroke="black" />';
        // Indien halfwaterdicht en/of meerdere lampen, voorzie de tekst bovenaan
        var print_str_upper = "";
        if (this.keys[20][2]) {
            print_str_upper = "h";
            if (parseInt(this.keys[4][2]) > 1)
                print_str_upper += ", x" + this.keys[4][2]; //Meer dan 1 lamp
        }
        else if (parseInt(this.keys[4][2]) > 1)
            print_str_upper = "x" + this.keys[4][2];
        switch (this.keys[16][2]) {
            case "led":
                // Teken led
                mySVG.data += '<use xlink:href="#led" x="' + 30 + '" y="25" />';
                // Teken wandlamp indien van toepassing
                if (this.keys[19][2])
                    mySVG.data += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />'; //Wandlamp
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.keys[21][2]) {
                    mySVG.data += '<line x1="42" y1="25" x2="45.75" y2="17.5" stroke="black" />'
                        + '<line x1="45.75" y1="17.5" x2="48.25" y2="18.75" stroke="black" />';
                }
                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var textxpos;
                var noodypos = 6.5;
                if (print_str_upper == "") {
                    noodxpos = 36;
                    textxpos = 36;
                }
                else {
                    noodxpos = 20;
                    if ((print_str_upper.length > 2) && ((this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal")))
                        textxpos = 40;
                    else
                        textxpos = 36;
                }
                ;
                if (print_str_upper != "")
                    mySVG.data += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                switch (this.keys[17][2]) { // Type noodverlichting
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                            + '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                        +'<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        +'<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    default:
                        break;
                }
                // Verdere uitlijning en adres onderaan   
                mySVG.xright = 42;
                mySVG.data += this.addAddress(mySVG, 50, 5, 2);
                break;
            case "spot":
                // teken spot
                mySVG.data += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';
                // Teken wandlamp indien van toepassing
                if (this.keys[19][2])
                    mySVG.data += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.keys[21][2]) {
                    mySVG.data += '<line x1="46" y1="25" x2="49.75" y2="17.5" stroke="black" />'
                        + '<line x1="49.75" y1="17.5" x2="52.25" y2="18.75" stroke="black" />';
                }
                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var textxpos;
                var noodypos = 6.5;
                if (print_str_upper == "") {
                    noodxpos = 40;
                    textxpos = 40;
                }
                else {
                    noodxpos = 24;
                    if ((print_str_upper.length > 2) && ((this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal")))
                        textxpos = 44;
                    else
                        textxpos = 40;
                }
                if (print_str_upper != "")
                    mySVG.data += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                switch (this.keys[17][2]) {
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                            + '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    default:
                        break;
                }
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 45;
                mySVG.data += this.addAddress(mySVG, 52, 7, 4);
                break;
            case "TL":
                // Teken TL lampen
                var aantal_buizen = this.keys[13][2];
                var starty = 25 - (aantal_buizen) * 3.5;
                var endy = 25 + (aantal_buizen) * 3.5;
                mySVG.data += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />'
                    + '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';
                for (var i = 0; i < aantal_buizen; i++) {
                    mySVG.data += '<line x1="30" y1="' + (starty + (i * 7) + 3.5) + '" x2="90" y2="' + (starty + (i * 7) + 3.5) + '" stroke="black" stroke-width="2" />';
                }
                // Teken wandlamp indien van toepassing
                if (this.keys[19][2])
                    mySVG.data += '<line x1="50" y1="' + (27 + (aantal_buizen * 3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen * 3.5)) + '" stroke="black" />';
                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "")
                    mySVG.data += '<text x="60" y="' + (25 - (aantal_buizen * 3.5)) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.keys[21][2]) {
                    mySVG.data += '<line x1="77.5" y1="' + (29 - (aantal_buizen * 3.5)) + '" x2="85" y2="' + (14 - (aantal_buizen * 3.5)) + '" stroke="black" />'
                        + '<line x1="85" y1="' + (14 - (aantal_buizen * 3.5)) + '" x2="90" y2="' + (16.5 - (aantal_buizen * 3.5)) + '" stroke="black" />';
                }
                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var noodypos = (25 - (aantal_buizen * 3.5) - 5);
                if (print_str_upper == "")
                    noodxpos = 60;
                else
                    noodxpos = 39;
                switch (this.keys[17][2]) {
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                            + '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />'
                            + '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                        break;
                }
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 90;
                mySVG.data += this.addAddress(mySVG, endy + 13, Math.max(mySVG.ydown, endy + 18 - 25), 2);
                break;
            default: //Normaal lichtpunt (kruisje)
                switch (this.keys[17][2]) {
                    case "Centraal":
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />'
                            + '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                        if (this.heeftVerbruikerAlsKind())
                            mySVG.data += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 11) + '" y2="25" stroke="black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                        if (this.keys[21][2])
                            mySVG.data += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />'; //Ingebouwde schakelaar
                        break;
                    default:
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                        if (this.heeftVerbruikerAlsKind())
                            mySVG.data += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 11) + '" y2="25" stroke="black" />';
                        break;
                }
                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "")
                    mySVG.data += '<text x="30" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                // Teken wandlamp indien van toepassing
                if (this.keys[19][2])
                    mySVG.data += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.keys[21][2])
                    mySVG.data += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 39;
                mySVG.data += this.addAddress(mySVG, 54, 10, -1);
                break;
        }
        mySVG.data += "\n";
        return (mySVG);
    };
    return Lichtpunt;
}(Electro_Item));
var Meerdere_verbruikers = /** @class */ (function (_super) {
    __extends(Meerdere_verbruikers, _super);
    function Meerdere_verbruikers(mylist) {
        return _super.call(this, mylist) || this;
    }
    Meerdere_verbruikers.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Meerdere verbruikers"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Meerdere_verbruikers.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Meerdere_verbruikers.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        // We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
        mySVG.ydown = Math.max(mySVG.ydown, 25);
        mySVG.yup = Math.max(mySVG.yup, 25);
        mySVG.xleft = Math.max(mySVG.xleft, 1);
        // Plaats adres onderaan indien niet leeg en indien er actieve kinderen zijn
        if ((!(/^\s*$/.test(this.keys[15][2]))) && (this.heeftActiefKind())) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Meerdere_verbruikers;
}(Electro_Item));
var Microgolfoven = /** @class */ (function (_super) {
    __extends(Microgolfoven, _super);
    function Microgolfoven(mylist) {
        return _super.call(this, mylist) || this;
    }
    Microgolfoven.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Microgolfoven"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Microgolfoven.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Microgolfoven.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#microgolf" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Microgolfoven;
}(Electro_Item));
var Motor = /** @class */ (function (_super) {
    __extends(Motor, _super);
    function Motor(mylist) {
        return _super.call(this, mylist) || this;
    }
    Motor.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Motor"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Motor.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Motor.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#motor" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Motor;
}(Electro_Item));
var Omvormer = /** @class */ (function (_super) {
    __extends(Omvormer, _super);
    function Omvormer(mylist) {
        return _super.call(this, mylist) || this;
    }
    Omvormer.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Omvormer"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Omvormer.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Omvormer.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#omvormer" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Omvormer;
}(Electro_Item));
var Overspanningsbeveiliging = /** @class */ (function (_super) {
    __extends(Overspanningsbeveiliging, _super);
    function Overspanningsbeveiliging(mylist) {
        return _super.call(this, mylist) || this;
    }
    Overspanningsbeveiliging.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Overspanningsbeveiliging"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Overspanningsbeveiliging.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Overspanningsbeveiliging.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 34;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#overspanningsbeveiliging" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Overspanningsbeveiliging;
}(Electro_Item));
var Splitsing = /** @class */ (function (_super) {
    __extends(Splitsing, _super);
    function Splitsing(mylist) {
        return _super.call(this, mylist) || this;
    }
    Splitsing.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Splitsing"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Splitsing.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        return (output);
    };
    Splitsing.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        var parent = this.getParent();
        // Teken de lijn onderaan
        if ((parent.keys[0][2] == "Aansluiting") || (parent.keys[0][2] == "Kring")) {
            mySVG.data += '<line x1="' + (mySVG.xleft) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                + '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />';
        }
        else {
            if ((mySVG.xleft + mySVG.xright) <= 0)
                mySVG.xrightmin = 15; // We teken altijd minstens een lijntje van 15 pixels om duidelijk te maken dat er een splitsing is
            if (mySVG.yup < 25)
                mySVG.yup = 25;
            if (mySVG.ydown < 25)
                mySVG.ydown = 25;
            mySVG.data += '<line x1="' + (1) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                + '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />';
            mySVG.xright = mySVG.xright + mySVG.xleft;
            mySVG.xleft = 1; //we leave one pixel for the bold kring-line at the left
        }
        return (mySVG);
    };
    return Splitsing;
}(Electro_Item));
var Stoomoven = /** @class */ (function (_super) {
    __extends(Stoomoven, _super);
    function Stoomoven(mylist) {
        return _super.call(this, mylist) || this;
    }
    Stoomoven.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Stoomoven"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Stoomoven.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Stoomoven.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#stoomoven" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Stoomoven;
}(Electro_Item));
var Stopcontact = /** @class */ (function (_super) {
    __extends(Stopcontact, _super);
    function Stopcontact(mylist) {
        return _super.call(this, mylist) || this;
    }
    Stopcontact.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Stopcontact"; // This is rather a formality as we should already have this at this stage
        this.keys[1][2] = true; // Per default geaard
        this.keys[2][2] = true; // Per default kinderveilig
        this.keys[4][2] = "1"; // Per default 1 Stopcontact
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = "3"; // Indien meerfasig is de default 3 fasen
        this.keys[19][2] = false; // Per default niet met ingebouwde schakelaar
        this.keys[20][2] = false; // Per default niet halfwaterdicht
        this.keys[21][2] = false; // Per default niet meerfasig
        this.keys[25][2] = false; // Indien meerfasig, per default niet met nul
        this.keys[26][2] = false; // Per default niet in verdeelbord
    };
    Stopcontact.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", "
            + "Geaard: " + this.checkboxToHTML(1) + ", "
            + "Kinderveiligheid: " + this.checkboxToHTML(2) + " "
            + "Halfwaterdicht: " + this.checkboxToHTML(20) + ", "
            + "Meerfasig: " + this.checkboxToHTML(21) + ", ";
        if (this.keys[21][2]) {
            output += "Aantal fasen: " + this.selectToHTML(16, ["1", "2", "3"]) + ", "
                + "Met nul: " + this.checkboxToHTML(25) + ", ";
        }
        ;
        output += "Ingebouwde schakelaar: " + this.checkboxToHTML(19) + ", "
            + "Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6"]) + ", "
            + "In verdeelbord: " + this.checkboxToHTML(26)
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Stopcontact.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;
        var startx = 1; // Punt waar we aan het tekenen zijn. Schuift gaandeweg op
        // Teken lijnen voor meerfasig stopcontact
        if (this.keys[21][2]) {
            mySVG.data += '<line x1="1" y1="25" x2="35" y2="25" stroke="black" />';
            switch (this.keys[16][2]) { //faselijnen
                case "1":
                    mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                    break;
                case "2":
                    mySVG.data += '<line x1="16.5" y1="35" x2="22.5" y2="15" stroke="black" />'
                        + '<line x1="22.5" y1="35" x2="28.5" y2="15" stroke="black" />';
                    break;
                case "3":
                    mySVG.data += '<line x1="15" y1="35" x2="21" y2="15" stroke="black" />'
                        + '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />'
                        + '<line x1="27" y1="35" x2="33" y2="15" stroke="black" />';
                    break;
                default:
                    mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                    break;
            }
            if (this.keys[25][2]) { //nullijn
                mySVG.data += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />'
                    + '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
            }
            startx += 34;
            mySVG.xright += 34; //We schuiven alles 34 pixels op
        }
        // Teken ingebouwde schakelaar
        if (this.keys[19][2]) {
            mySVG.data += '<line x1="' + (startx + 0) + '" y1="25" x2="' + (startx + 11) + '" y2="25" stroke="black" />'
                + '<line x1="' + (startx + 30) + '" y1="25" x2="' + (startx + 20) + '" y2="5" stroke="black" />'
                + '<line x1="' + (startx + 20) + '" y1="5" x2="' + (startx + 15) + '" y2="7.5" stroke="black" />'
                + '<line x1="' + (startx + 22) + '" y1="9" x2="' + (startx + 17) + '" y2="11.5" stroke="black" />';
            startx += 10;
            mySVG.xright += 10; //We schuiven alles 10 pixels op
        }
        // Teken alle stopcontacten, inclusief aarding en kinderveiligheid indien van toepassing
        for (var i = 0; i < this.keys[4][2]; ++i) {
            mySVG.data += '<use xlink:href="#stopcontact" x="' + startx + '" y="25"></use>';
            if (this.keys[1][2])
                mySVG.data += '<use xlink:href="#stopcontact_aarding" x="' + startx + '" y="25"></use>';
            if (this.keys[2][2])
                mySVG.data += '<use xlink:href="#stopcontact_kinderveilig" x="' + startx + '" y="25"></use>';
            startx += 20;
            mySVG.xright += 20;
        }
        // Teken kader indien in verdeelbord
        if (this.keys[26][2]) {
            mySVG.data += '<rect x="' + (mySVG.xright - this.keys[4][2] * 20 - 3 - (this.keys[19][2]) * 12) + '" y="3" width="' + (this.keys[4][2] * 20 + 6 + (this.keys[19][2]) * 12) + '" height="44" fill="none" style="stroke:black" />';
            +'<line x1="' + (17 + (mySVG.xright - 20 + 3)) + '" y1="3" x2="' + (17 + (mySVG.xright - 20 + 3)) + '" y2="47" fill="none" style="stroke:black" />';
        }
        ;
        // Teken halfwaterdicht indien van toepassing
        if (this.keys[20][2])
            mySVG.data += '<rect x="' + (22 + (this.keys[19][2]) * 10 + (this.keys[21][2]) * 34) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" /><text x="' + (25 + (this.keys[19][2]) * 10 + (this.keys[21][2]) * 34) + '" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        // Indien het stopcontact een kind heeft, teken een streepje rechts
        if (this.heeftVerbruikerAlsKind()) {
            mySVG.data += '<line x1="' + startx + '" y1="25" x2="' + (startx + 21) + '" y2="25" stroke="black" />';
        }
        ;
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Stopcontact;
}(Electro_Item));
var Transformator = /** @class */ (function (_super) {
    __extends(Transformator, _super);
    function Transformator(mylist) {
        return _super.call(this, mylist) || this;
    }
    Transformator.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Transformator"; // This is rather a formality as we should already have this at this stage
        this.keys[14][2] = "230V/24V"; // Per default 24V
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Transformator.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Voltage: " + this.stringToHTML(14, 8)
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Transformator.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 47;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#transformator" x="21" y="25"></use>'
            + '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
            htmlspecialchars(this.keys[14][2]) + "</text>";
        mySVG.data += this.addAddress(mySVG, 58, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Transformator;
}(Electro_Item));
var USB_lader = /** @class */ (function (_super) {
    __extends(USB_lader, _super);
    function USB_lader(mylist) {
        return _super.call(this, mylist) || this;
    }
    USB_lader.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "USB lader"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 lader
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    USB_lader.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    USB_lader.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.keys[4][2] > 1) {
            shifty = 12;
            mySVG.data += '<text x="51" y="14" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>';
        }
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 79;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>'
            + '<use xlink:href="#usblader" x="21" y="' + (shifty + 25) + '"></use>';
        mySVG.data += this.addAddress(mySVG, 55 + shifty, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return USB_lader;
}(Electro_Item));
var Vaatwasmachine = /** @class */ (function (_super) {
    __extends(Vaatwasmachine, _super);
    function Vaatwasmachine(mylist) {
        return _super.call(this, mylist) || this;
    }
    Vaatwasmachine.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Vaatwasmachine"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Vaatwasmachine.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Vaatwasmachine.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#vaatwasmachine" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Vaatwasmachine;
}(Electro_Item));
var Ventilator = /** @class */ (function (_super) {
    __extends(Ventilator, _super);
    function Ventilator(mylist) {
        return _super.call(this, mylist) || this;
    }
    Ventilator.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Ventilator"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Ventilator.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Ventilator.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#ventilator" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Ventilator;
}(Electro_Item));
var Verbruiker = /** @class */ (function (_super) {
    __extends(Verbruiker, _super);
    function Verbruiker(mylist) {
        return _super.call(this, mylist) || this;
    }
    Verbruiker.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Verbruiker"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Tekst itself to "" when the item is cleared
        this.keys[17][2] = "centreer"; // Per default gecentreerd
        this.keys[18][2] = "automatisch"; // Per default automatische breedte
        this.keys[19][2] = false; // Per default niet vet
        this.keys[20][2] = false; // Per default niet schuin
        this.keys[23][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Verbruiker.prototype.overrideKeys = function () {
        if (this.keys[18][2] != "automatisch") {
            this.keys[18][2] = "handmatig";
        }
        this.adjustTextWidthIfAuto();
    };
    Verbruiker.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15, 30)
            + ", Breedte: " + this.selectToHTML(18, ["automatisch", "handmatig"]);
        if (this.keys[18][2] != "automatisch")
            output += " " + this.stringToHTML(22, 3);
        output += ", Vet: " + this.checkboxToHTML(19)
            + ", Schuin: " + this.checkboxToHTML(20)
            + ", Horizontale alignering: " + this.selectToHTML(17, ["links", "centreer", "rechts"])
            + ", Adres/tekst: " + this.stringToHTML(23, 2);
        return (output);
    };
    Verbruiker.prototype.adjustTextWidthIfAuto = function () {
        if (this.keys[18][2] === "automatisch") {
            var options = "";
            if (this.keys[19][2])
                options += ' font-weight="bold"';
            if (this.keys[20][2])
                options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.keys[15][2]).split("|");
            var width = 40;
            for (var i = 0; i < strlines.length; i++) {
                width = Math.round(Math.max(width, svgTextWidth(strlines[i], 10, options) + 10));
            }
            this.keys[22][2] = String(width);
        }
    };
    Verbruiker.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");
        // Voldoende ruimte voorzien voor alle elementen
        this.adjustTextWidthIfAuto();
        var width = (isNaN(Number(this.keys[22][2])) || (this.keys[22][2] === "") ? 40 : Math.max(Number(this.keys[22][2]) * 1, 1));
        // Breedte van de vrije tekst bepalen
        var extraplace = 15 * Math.max(strlines.length - 2, 0);
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20 + width;
        mySVG.yup = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        // Optionele parameters voor vet en italic uitlezen
        var options = "";
        if (this.keys[19][2])
            options += ' font-weight="bold"';
        if (this.keys[20][2])
            options += ' font-style="italic"';
        // Tekst plaatsen --
        var outputstr_common;
        switch (this.keys[17][2]) {
            case "links":
                outputstr_common = '<text style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + 5) + '" ';
                break;
            case "rechts":
                outputstr_common = '<text style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + width - 4) + '" ';
                break;
            default:
                outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + 1 + width / 2) + '" ';
                break;
        }
        for (var i = 0; i < strlines.length; i++) {
            var dispy = 28 - 7.5 * Math.min(1, strlines.length - 1) + 15 * i;
            mySVG.data += outputstr_common + ' y="' + dispy + '"' + options + '>' + strlines[i] + '</text>';
        }
        // Kader en adres tekenen --
        mySVG.data += '<line x1="1" y1="' + (25 + extraplace / 2.0) + '" x2="21" y2="' + (25 + extraplace / 2.0) + '" stroke="black" />'
            + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
            + this.addAddress(mySVG, 60 + extraplace, 15, width / 2 - (mySVG.xright - 20) / 2, 23);
        return (mySVG);
    };
    return Verbruiker;
}(Electro_Item));
var Verlenging = /** @class */ (function (_super) {
    __extends(Verlenging, _super);
    function Verlenging(mylist) {
        return _super.call(this, mylist) || this;
    }
    Verlenging.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Verlenging"; // This is rather a formality as we should already have this at this stage
        this.keys[22][2] = "40"; // This is rather a formality as we should already have this at this stage
    };
    Verlenging.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Breedte: " + this.stringToHTML(22, 3)
            + ", Adres/tekst: " + this.stringToHTML(23, 5);
        return (output);
    };
    Verlenging.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        var width;
        if (isNaN(Number(this.keys[22][2]))) {
            width = 40;
        }
        else {
            if (Number(this.keys[22][2] == "")) {
                width = 40;
            }
            else {
                width = Math.max(Number(this.keys[22][2]) * 1, 0);
            }
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width - 1;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="25" x2="' + (width + 1) + '" y2="25" stroke="black" />';
        mySVG.data += this.addAddress(mySVG, 40, 0, width / 2 - mySVG.xright / 2 - 10, 23);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Verlenging;
}(Electro_Item));
var Verwarmingstoestel = /** @class */ (function (_super) {
    __extends(Verwarmingstoestel, _super);
    function Verwarmingstoestel(mylist) {
        return _super.call(this, mylist) || this;
    }
    Verwarmingstoestel.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Verwarmingstoestel"; // This is rather a formality as we should already have this at this stage
        this.keys[3][2] = false; // Per default geen accumulatie
        this.keys[6][2] = false; // Per default geen ventilator
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Verwarmingstoestel.prototype.overrideKeys = function () {
        if (!this.keys[3][2])
            this.keys[6][2] = false; //Indien geen accumulatie kan er ook geen ventilator zijn
    };
    Verwarmingstoestel.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys;
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Accumulatie: " + this.checkboxToHTML(3)
            + (this.keys[3][2] ? ", Ventilator: " + this.checkboxToHTML(6) : "")
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Verwarmingstoestel.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 69;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.keys[3][2]) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                break;
            case true:
                switch (this.keys[6][2]) { //ventilator
                    case false:
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                        break;
                    case true:
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                        mySVG.xright = 89;
                        break;
                }
                break;
        }
        mySVG.data += this.addAddress(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Verwarmingstoestel;
}(Electro_Item));
var Vrije_ruimte = /** @class */ (function (_super) {
    __extends(Vrije_ruimte, _super);
    function Vrije_ruimte(mylist) {
        return _super.call(this, mylist) || this;
    }
    Vrije_ruimte.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Vrije ruimte"; // This is rather a formality as we should already have this at this stage
        this.keys[22][2] = 25; // Default breedte van de vrije ruimte
    };
    Vrije_ruimte.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Breedte: " + this.stringToHTML(22, 3);
        return (output);
    };
    Vrije_ruimte.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Bepaal breedte van het element
        var desiredwidth = Number(this.keys[22][2]);
        if (isNaN(desiredwidth)) {
            desiredwidth = 25;
        }
        // Creëer het element en return
        mySVG.yup = 0;
        mySVG.ydown = 0;
        mySVG.xleft = 0;
        mySVG.xright = desiredwidth;
        mySVG.data = "";
        return (mySVG);
    };
    return Vrije_ruimte;
}(Electro_Item));
var Vrije_tekst = /** @class */ (function (_super) {
    __extends(Vrije_tekst, _super);
    function Vrije_tekst(mylist) {
        return _super.call(this, mylist) || this;
    }
    Vrije_tekst.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Vrije tekst"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Tekst itself to "" when the item is cleared
        this.keys[16][2] = "zonder kader"; // Per default zonder kader, gebruik symbool "Verbruiker (tekst)" voor de default met kader
        this.keys[17][2] = "links"; // Per default gecentreerd
        this.keys[18][2] = "automatisch"; // Per default automatische breedte
        this.keys[19][2] = false; // Per default niet vet
        this.keys[20][2] = false; // Per default niet schuin
        this.keys[23][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Vrije_tekst.prototype.overrideKeys = function () {
        if (this.keys[16][2] != "verbruiker") {
            this.keys[16][2] = "zonder kader";
        }
        if (this.keys[18][2] != "automatisch") {
            this.keys[18][2] = "handmatig";
        }
        if (this.heeftVerbruikerAlsKind()) {
            this.keys[16][2] = "verbruiker";
        }
        this.adjustTextWidthIfAuto();
    };
    Vrije_tekst.prototype.toHTML = function (mode, Parent) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15, 30)
            + ", Breedte: " + this.selectToHTML(18, ["automatisch", "handmatig"]);
        if (this.keys[18][2] != "automatisch")
            output += " " + this.stringToHTML(22, 3);
        output += ", Vet: " + this.checkboxToHTML(19)
            + ", Schuin: " + this.checkboxToHTML(20)
            + ", Horizontale alignering: " + this.selectToHTML(17, ["links", "centreer", "rechts"])
            + ", Type: " + this.selectToHTML(16, (this.heeftVerbruikerAlsKind() ? ["verbruiker"] : ["verbruiker", "zonder kader"]));
        if (this.keys[16][2] != "zonder kader")
            output += ", Adres/tekst: " + this.stringToHTML(23, 5);
        return (output);
    };
    Vrije_tekst.prototype.adjustTextWidthIfAuto = function () {
        if (this.keys[18][2] === "automatisch") {
            var options = "";
            if (this.keys[19][2])
                options += ' font-weight="bold"';
            if (this.keys[20][2])
                options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.keys[15][2]).split("|");
            var width = 40;
            for (var i = 0; i < strlines.length; i++) {
                width = Math.round(Math.max(width, svgTextWidth(strlines[i], 10, options) + 10));
            }
            this.keys[22][2] = String(width);
        }
    };
    Vrije_tekst.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");
        // Breedte van de vrije tekst bepalen
        this.adjustTextWidthIfAuto();
        var width = (isNaN(Number(this.keys[22][2])) || (this.keys[22][2] === "") ? 40 : Math.max(Number(this.keys[22][2]) * 1, 1));
        // Voldoende ruimte voorzien voor alle elementen
        var extraplace = 15 * Math.max(strlines.length - 2, 0);
        var shiftx;
        if (this.keys[16][2] === "zonder kader") {
            if (this.getParent().keys[0][2] === "Kring")
                shiftx = 10;
            else if (this.getParent().keys[0][2] === "Stopcontact")
                shiftx = 0;
            else
                shiftx = 5;
        }
        else
            shiftx = 20;
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = shiftx + width;
        mySVG.yup = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        // Optionele parameters voor vet en italic uitlezen
        var options = "";
        if (this.keys[19][2])
            options += ' font-weight="bold"';
        if (this.keys[20][2])
            options += ' font-style="italic"';
        // Tekst plaatsen --
        var outputstr_common;
        switch (this.keys[17][2]) {
            case "links":
                outputstr_common = '<text style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 5) + '" ';
                break;
            case "rechts":
                outputstr_common = '<text style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + width - 4) + '" ';
                break;
            default:
                outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 1 + width / 2) + '" ';
                break;
        }
        for (var i = 0; i < strlines.length; i++) {
            var dispy = 28 - 7.5 * Math.min(1, strlines.length - 1) + 15 * i;
            mySVG.data += outputstr_common + ' y="' + dispy + '"' + options + '>' + strlines[i] + '</text>';
        }
        // Kader en adres tekenen --
        switch (this.keys[16][2]) {
            case "zonder kader": break;
            default: //Wegens compatibiliteit met oudere versies van de software is het ontbreken van eender welke parameter een "met kader"
                mySVG.data += '<line x1="1" y1="' + (25 + extraplace / 2.0) + '" x2="21" y2="' + (25 + extraplace / 2.0) + '" stroke="black" />'
                    + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
                    + this.addAddress(mySVG, 60 + extraplace, 15, width / 2 - (mySVG.xright - 20) / 2, 23);
                break;
        }
        return (mySVG);
    };
    return Vrije_tekst;
}(Electro_Item));
var Warmtepomp = /** @class */ (function (_super) {
    __extends(Warmtepomp, _super);
    function Warmtepomp(mylist) {
        return _super.call(this, mylist) || this;
    }
    Warmtepomp.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Warmtepomp/airco"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 warmtepomp
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
        this.keys[18][2] = "Koelend"; // Per default koelend
    };
    Warmtepomp.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Warmte functie: " + this.selectToHTML(18, ["", "Koelend", "Verwarmend", "Verwarmend en koelend"])
            + ", Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"])
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Warmtepomp.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.keys[4][2] > 1) {
            shifty = 15;
            mySVG.data += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>';
        }
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>'
            + '<use xlink:href="#verbruiker" x="21" y="' + (shifty + 25) + '"></use>'
            + '<line x1="26" y1="' + (shifty + 0) + '" x2="26" y2="' + (shifty + 5) + '" stroke="black" />'
            + '<line x1="56" y1="' + (shifty + 0) + '" x2="56" y2="' + (shifty + 5) + '" stroke="black" />'
            + '<line x1="26" y1="' + (shifty + 5) + '" x2="33.5" y2="' + (shifty + 23) + '" stroke="black" />'
            + '<line x1="56" y1="' + (shifty + 5) + '" x2="48.5" y2="' + (shifty + 23) + '" stroke="black" />'
            + '<line x1="33.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />'
            + '<line x1="48.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />';
        //Waar gaan we de andere symbolen plaatsen, indien slechts 1, midden onderaan, zoniet links en rechts
        var shift_symbol_energiebron = 41;
        var shift_symbol_warmtefunctie = 41;
        if (this.keys[18][2] != "") {
            var shift_symbol_energiebron = 31;
            var shift_symbol_warmtefunctie = 51;
        }
        mySVG.data += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
        switch (this.keys[18][2]) {
            case "Verwarmend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+</text>';
                break;
            case "Koelend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">-</text>';
                break;
            case "Verwarmend en koelend":
                mySVG.data += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+/-</text>';
                break;
        }
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG, 60 + shifty, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Warmtepomp;
}(Electro_Item));
var Wasmachine = /** @class */ (function (_super) {
    __extends(Wasmachine, _super);
    function Wasmachine(mylist) {
        return _super.call(this, mylist) || this;
    }
    Wasmachine.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Wasmachine"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Wasmachine.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
        output += ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Wasmachine.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#wasmachine" x="21" y="25"></use>';
        mySVG.data += this.addAddress(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Wasmachine;
}(Electro_Item));
var Zeldzame_symbolen = /** @class */ (function (_super) {
    __extends(Zeldzame_symbolen, _super);
    function Zeldzame_symbolen(mylist) {
        return _super.call(this, mylist) || this;
    }
    Zeldzame_symbolen.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Zeldzame symbolen"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = ""; // Per default, geen symbool
    };
    Zeldzame_symbolen.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5)
            + ", Symbool: " + this.selectToHTML(16, ["", "deurslot"])
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Zeldzame_symbolen.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        switch (this.keys[16][2]) {
            case "deurslot":
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                    + '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddress(mySVG, 55, 10, 2);
                break;
            default:
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                mySVG.xright = -1;
                break;
        }
        return (mySVG);
    };
    return Zeldzame_symbolen;
}(Electro_Item));
var Zonnepaneel = /** @class */ (function (_super) {
    __extends(Zonnepaneel, _super);
    function Zonnepaneel(mylist) {
        return _super.call(this, mylist) || this;
    }
    Zonnepaneel.prototype.resetKeys = function () {
        this.clearKeys();
        this.keys[0][2] = "Zonnepaneel"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1"; // Per default 1 zonnepaneel
        this.keys[15][2] = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Zonnepaneel.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode, Parent);
        output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", "
            + " Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"])
            + ", Adres/tekst: " + this.stringToHTML(15, 5);
        return (output);
    };
    Zonnepaneel.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 69;
        mySVG.yup = 35;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="35" x2="21" y2="35" stroke="black"></line>'
            + '<use xlink:href="#zonnepaneel" x="21" y="35"></use>'
            + '<text x="45" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[4][2]) + 'x</text>';
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG, 70, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Zonnepaneel;
}(Electro_Item));
0;
var Properties = /** @class */ (function () {
    function Properties() {
        this.filename = "eendraadschema.eds";
        this.owner = "Voornaam Achternaam<br>Straat 0<br>0000 gemeente<br>Tel: +32 00 00 00 00<br>GSM: +32 000 00 00 00<br>e-mail: voornaam.achternaam@domein.be";
        ;
        this.installer = "idem";
        this.info = "<br>EAN ...<br><br>getekend met<br>https://www.eendraadschema.goethals-jacobs.be";
    }
    ;
    Properties.prototype.setFilename = function (name) {
        this.filename = name;
    };
    return Properties;
}());
var SVGSymbols = /** @class */ (function () {
    function SVGSymbols() {
    }
    SVGSymbols.outputSVGSymbols = function () {
        var output = "\n    <defs>\n    <pattern id=\"VerticalStripe\"\n      x=\"5\" y=\"0\" width=\"5\" height=\"10\"\n      patternUnits=\"userSpaceOnUse\" >\n      <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"10\" stroke=\"black\" />\n    </pattern>\n    <g id=\"batterij\">\n      <rect x=\"0\" y=\"-12\" width=\"40\" height=\"27\" stroke=\"black\" fill=\"none\"/>\n      <rect x=\"5\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n      <rect x=\"25\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n      <line x1=\"8\" y1=\"-5\" x2=\"12\" y2=\"-5\" stroke=\"black\"/>\n      <line x1=\"10\" y1=\"-7\" x2=\"10\" y2=\"-3\" stroke=\"black\"/>\n      <line x1=\"28\" y1=\"-5\" x2=\"32\" y2=\"-5\" stroke=\"black\"/>\n    </g>\n    <g id=\"deurslot\">\n      <line x1=\"1\" y1=\"-15\" x2=\"31\" y2=\"-15\" stroke=\"black\"/>\n      <line x1=\"1\" y1=\"15\"  x2=\"46\" y2=\"15\" stroke=\"black\"/>\n      <line x1=\"1\" y1=\"-15\" x2=\"1\" y2=\"15\" stroke=\"black\"/>\n      <line x1=\"31\" y1=\"-15\" x2=\"46\" y2=\"15\" stroke=\"black\"/>\n      <path d=\"M 7 3 A 6 6 0 0 1 19 3 A 6 6 0 0 1 31 3\" stroke=\"black\" fill=\"none\" />\n    </g>\n    <g id=\"ster\">\n      <line x1=\"0\" y1=\"-5\" x2=\"0\" y2=\"5\" style=\"stroke:black\" />\n      <line x1=\"-4.33\" y1=\"-2.5\" x2=\"4.33\" y2=\"2.5\" style=\"stroke:black\" />\n      <line x1=\"-4.66\" y1=\"2.5\" x2=\"4.33\" y2=\"-2.5\" style=\"stroke:black\" />\n    </g>\n    <g id=\"EVlader\">\n      <rect x=\"0\" y=\"13\" width=\"40\" height=\"7\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"7\" y2=\"0\" style=\"stroke:black\" />\n      <line x1=\"7\" y1=\"-20\" x2=\"7\" y2=\"13\" style=\"stroke:black\" />\n      <line x1=\"33\" y1=\"-20\" x2=\"33\" y2=\"13\" style=\"stroke:black\" />\n      <line x1=\"7\" y1=\"-20\" x2=\"33\" y2=\"-20\" style=\"stroke:black\" />\n      <rect x=\"10\" y=\"-17\" width=\"20\" height=\"8\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"20\" y1=\"-6\" x2=\"20\" y2=\"10\" style=\"stroke:black\" />\n      <line x1=\"33\" y1=\"-6\" x2=\"36\" y2=\"-6\" style=\"stroke:black\" />\n      <line x1=\"36\" y1=\"-6\" x2=\"36\" y2=\"4\" style=\"stroke:black\" />\n      <line x1=\"36\" y1=\"4\" x2=\"39\" y2=\"4\" style=\"stroke:black\" />\n      <line x1=\"39\" y1=\"4\" x2=\"39\" y2=\"-15\" style=\"stroke:black\" />\n      <line x1=\"39\" y1=\"-6\" x2=\"39\" y2=\"-15\" style=\"stroke:black;stroke-width:2\" />\n      <text x=\"15\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n      <text x=\"25\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n      <text x=\"15\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n      <text x=\"25\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n    </g>\n    <g id=\"lamp\">\n      <line x1=\"-10.61\" y1=\"-10.61\" x2=\"10.61\" y2=\"10.61\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-10.61\" y1=\"10.61\" x2=\"10.61\" y2=\"-10.61\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"led\">\n      <line x1=\"0\" y1=\"-7\" x2=\"0\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"-7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"12\" y1=\"-7\" x2=\"12\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"6\" y1=\"-6\" x2=\"7\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"8.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"5.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"9\" y1=\"-6\" x2=\"10\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"11.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"8.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"sinus\">\n      <path d=\"M0,0 C2,-5 8,-5 10,0 S18,5 20,0\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"spot\">\n      <path d=\"M0 0 A10 10 0 0 1 10 -10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <path d=\"M0 0 A10 10 0 0 0 10 10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <circle cx=\"10\" cy=\"0\" r=\"6\" style=\"stroke:black;fill:white\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"-4.24\" y2=\"4.24\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"4.24\" y2=\"-4.24\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"noodlamp_decentraal\">\n      <rect x=\"-10.61\" y=\"-10.61\" width=\"21.22\" height=\"21.22\" fill=\"white\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:black\" />\n      <line x1=\"-7\" y1=\"-7\" x2=\"7\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-7\" y1=\"7\" x2=\"7\" y2=\"-7\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"signalisatielamp\">\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"-3\" x2=\"3\" y2=\"3\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"3\" x2=\"3\" y2=\"-3\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_klein\">\n      <line x1=\"0\" y1=\"0\" x2=\"6\" y2=\"-12\" stroke=\"black\" />\n      <line x1=\"6\" y1=\"-12\" x2=\"9\" y2=\"-10.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"3\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_trippel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <line x1=\"6\" y1=\"-12\" x2=\"11\" y2=\"-9.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_rolluik\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <rect x=\"-8\" y=\"-8\" width=\"16\" height=\"16\" fill=\"white\" stroke=\"black\" />\n      <text x=\"0\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">S</text>\n    </g>\n    <g id=\"schakelaar_enkel_dim\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_dim\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_kruis_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"20\" x2=\"15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbelaansteking\">\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"-8\" y1=\"16\" x2=\"-13\" y2=\"13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"aansluitpunt\">\n      <circle cx=\"5\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"aftakdoos\">\n      <circle cx=\"15\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"15\" cy=\"0\" r=\"7.5\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"bewegingsschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"10\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"10\" y=\"-13\" width=\"30\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"13\" x2=\"40\" y2=\"-13\"  stroke=\"black\" />\n      <line x1=\"15\" y1=\"-5\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"25\" y2=\"-10\"  stroke=\"black\" />\n      <text x=\"22\" y=\"11\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"10\">PIR</text>\n    </g>\n    <g id=\"schakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"schemerschakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n      <use xlink:href=\"#arrow\" x=\"14\" y=\"-17\" transform=\"rotate(90 14 -17)\" />\n      <use xlink:href=\"#arrow\" x=\"18\" y=\"-17\" transform=\"rotate(90 18 -17)\" />\n    </g>\n    <g id=\"stopcontact\">\n      <path d=\"M20 0 A15 15 0 0 1 35 -15\" stroke=\"black\" fill=\"white\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 35 15\" stroke=\"black\" fill=\"white\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"stoomoven\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <path d=\"M 6 -2 A 7 5 0 0 1 13 -7 A 7 5 0 0 1 27 -7 A 7 5 0 0 1 33 -2\" stroke=\"black\" fill=\"none\" />\n      <path d=\"M 6  5 A 7 5 0 0 1 13  0 A 7 5 0 0 1 27  0 A 7 5 0 0 1 33  5\" stroke=\"black\" fill=\"none\" />\n      <path d=\"M 6 12 A 7 5 0 0 1 13  7 A 7 5 0 0 1 27  7 A 7 5 0 0 1 33 12\" stroke=\"black\" fill=\"none\" />\n    </g>\n    <g id=\"stopcontact_aarding\">\n      <line x1=\"20\" y1=\"-15\" x2=\"20\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"stopcontact_kinderveilig\">\n      <line x1=\"35\" y1=\"-20\" x2=\"35\" y2=\"-15\"  stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"35\" y1=\"20\" x2=\"35\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"bel\">\n      <path d=\"M20 0 A15 15 0 0 1 0 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 0 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"15\" x2=\"0\" y2=\"-15\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"boiler\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"boiler_accu\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"motor\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">M</text>\n    </g>\n    <g id=\"elektriciteitsmeter\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-6\" x2=\"40\" y2=\"-6\" stroke=\"black\" stroke-width=\"1\" />\n      <text x=\"20\" y=\"10\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"12\">kWh</text>\n    </g>\n    <g id=\"diepvriezer\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"10\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"30\" y=\"0\" />\n    </g>\n    <g id=\"zonnepaneel\">\n      <rect x=\"0\" y=\"-20\" width=\"50\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"50\" y2=\"0\" stroke=\"black\" />\n      <use xlink:href=\"#arrow\" x=\"5\" y=\"-12\" transform=\"rotate(45 5 -10)\" />\n      <use xlink:href=\"#arrow\" x=\"10\" y=\"-14\" transform=\"rotate(45 10 -14)\" />\n    </g>\n    <g id=\"drukknop_klein\">\n      <circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"8\" cy=\"0\" r=\"4\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"draadloos_klein\">\n      <path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 7 -5 A 8 8 0 0 1 7 5\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 4 -3 A 6 6 0 0 1 4 3\" stroke=\"black\" fill=\"none\" /> \n    </g>\n    <g id=\"detectie_klein\">\n      <path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 5 -7 A 10 10 0 0 1 5 7\" stroke=\"black\" fill=\"none\" /> \n    </g>\n    <g id=\"drukknop\">\n      <circle cx=\"12\" cy=\"0\" r=\"12\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"12\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"teleruptor\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"6\" x2=\"32\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"16\" y1=\"-6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"-6\" x2=\"24\" y2=\"6\"  stroke=\"black\" />\n    </g>\n    <g id=\"dimmer\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"-5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n    </g>\n    <g id=\"relais\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"-13\" x2=\"30\" y2=\"13\"  stroke=\"black\" />\n    </g>\n    <g id=\"minuterie\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\">t</text>\n    </g>\n    <g id=\"thermostaat\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"12\" y1=\"0\" x2=\"28\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"tijdschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"11\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"10\" y1=\"0\"  x2=\"17\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"11\" y1=\"-6\" x2=\"11\" y2=\"1\"  stroke=\"black\" />\n      <line x1=\"21\" y1=\"0\"  x2=\"25\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"25\" y1=\"0\"  x2=\"31\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"31\" y1=\"0\"  x2=\"36\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"tijdschakelaar_klein\">\n      <circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n      <line x1=\"7\" y1=\"0\"  x2=\"13\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"8\" y1=\"-5\" x2=\"8\" y2=\"1\"  stroke=\"black\" />\n    </g>\n    <g id=\"droogkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"15\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"25\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"omvormer\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"20\" x2=\"40\" y2=\"-20\" stroke=\"black\" />\n      <use xlink:href=\"#sinus\" x=\"5\" y=\"-12\" />\"\n      <line x1=\"20\" y1=\"10\" x2=\"35\" y2=\"10\" stroke=\"black\" />\n      <line x1=\"20\" y1=\"13\" x2=\"35\" y2=\"13\" stroke=\"black\" stroke-dasharray=\"3\" />\n    </g>\n    <g id=\"overspanningsbeveiliging\">\n      <rect x=\"0\" y=\"-15\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"7.5\" y1=\"-18\" x2=\"7.5\" y2=\"-5\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"-5\" x2=\"4.5\" y2=\"-9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"-5\" x2=\"10.5\" y2=\"-9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"18\" x2=\"7.5\" y2=\"5\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"5\" x2=\"4.5\" y2=\"9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"5\" x2=\"10.5\" y2=\"9\" stroke=\"black\" />\n    </g>\n    <g id=\"koelkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\"\n    </g>\n    <g id=\"kookfornuis\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"-10\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"microgolf\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"-10\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"0\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"10\" />\"\n    </g>\n    <g id=\"oven\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-5\" x2=\"40\" y2=\"-5\" stroke=\"black\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"usblader\">\n      <rect x=\"0\" y=\"-15\" width=\"60\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"12\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"19\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <text x=\"15\" y=\"8\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"8\">AC/DC</text>\n      <text x=\"42\" y=\"4\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"11\">USB</text>\n    </g>\n    <g id=\"vaatwasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"40\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <line x1=\"40\" y1=\"-20\" x2=\"0\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:white\" />\n    </g>\n    <g id=\"ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"30\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"transformator\">\n      <circle cx=\"8\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verwarmingstoestel\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"40\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu_ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"70\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"35\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n      <circle cx=\"50\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"60\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verbruiker\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n    </g>\n    <g id=\"wasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_automatisch\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n      <rect x=\"-4\" y=\"-30\" width=\"4\" height=\"10\" style=\"fill:black\" />\n    </g>\n    <g id=\"zekering_smelt\">\n      <rect x=\"-4\" y=\"-30\" width=\"8\" height=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"relais_kring\">\n      <rect x=\"-8\" y=\"-30\" width=\"16\" height=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"8\" y1=\"-22.5\" x2=\"-8\" y2=\"-7.5\" stroke=\"black\" />\n    </g>\n    <g id=\"overspanningsbeveiliging_inline\">   -> shift x -7.5  y -15\n      <rect x=\"-7.5\" y=\"-30\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"-3\" y2=\"-24\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"3\" y2=\"-24\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-10\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-10\" x2=\"-3\" y2=\"-6\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-10\" x2=\"3\" y2=\"-6\" stroke=\"black\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_empty\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"arrow\">\n      <line x1=\"0\" y1=\"0\" x2=\"8\" y2=\"0\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"-1\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"1\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_ventilator\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_atmosferisch\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"bliksem\">\n      <line x1=\"0\" y1=\"-5.2\" x2=\"-3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"-3\" y1=\"0\" x2=\"3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"3\" y1=\"0\" x2=\"0\" y2=\"5.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"0\" y2=\"2.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"2.6\" y2=\"3.7\" stroke=\"black\"/>\n    </g>\n    <g id=\"moving_man\"\n       transform=\"matrix(0.0152987,0,0,0.01530866,0,0)\">\n       <path\n         d=\"M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z\"\n         id=\"path4\" stroke=\"black\" stroke-width=\"10\" />\n       <path\n         d=\"m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z\"\n         id=\"path6\" stroke=\"black\" stroke-width=\"10\" /></g>\n    </defs>\n    ";
        return (output);
    };
    return SVGSymbols;
}());
/*****************************************************************************
  CLASS Hierarchical_List

  Defines a list with a parent-child relationship.

  FUNCTIONS:
    Constructor()
      makes an empty list
    deleteInactive()
      remove all inactive members from the array. This saves memory
    reSort()
      Internal function. Usually does not need external calling.
      Make sure parent's are always earlier in the array than child.
      Re-arranges the array if needed. Always run reSort after
      having moved around stuff in the array. reSort will also
      remove inactive members from the array.
    getOrdinalById(my_id: number) : number
      Returns the element in the array for a given ID
    getNumChilds(parent_id: number) : number
      Returns the number of childs for a given parent ID
    getMaxNumChilds(parent_id: number) : number
      Returns the maximum number of permissible childs for a given parent ID
      Calls the getMaxNumChilds function of the underlying data element
    addItem(my_item: List_Item)
      Add an item to the end of the list with parent=0 (root)
    insertItemBeforeId(my_item: List_Item, my_id: number)
      Add an item before element with ID my_id having the same parent as my_id
    insertItemAfterId(my_item: List_Item, my_id: number)
      Add an item after element with ID my_id having the same parent as my_id
    insertChildAfterId(my_item: List_Item, my_id: number)
      Add an item after element with ID my_id and make it a child of
      this element.
    moveUp(my_id: number)
      Move element with ID my_id one place up but remain below the parent.
    moveDown(my_id: number)
      Move element with ID my_id one place down but remain below the parent.
    deleteById(my_id: number)
      Remove element with ID my_id and remove all its childs.
    toHTML()
      Outputs the hierarchical list in HTML format. Uses the toHTML function
      of the list item
    toSVG()
      Outputs the hierarchival list in SVG format. Uses the toSVG function
      of the list item

 VARIABLES:
   data: Array<List_Item>;
     Array of list items.
     Stores some standard elements such as parent
   active: Array<Boolean>;
     If an element is deleted, it is first made "inactive" and only then
     deleted when reSort() is called, usually at the end of functions
     that manipulate the array.
   id: Array<number>;
     Array with the official ID's
   properties: Properties;
     Specific properties of the item such as the filename
   length: number;
     Physical length of the array
   curid: number;
     When a new element is inserted, this is the ID it will get. This is NOT
     the same as the phsyical length of the array as the ID keeps on counting
     all once created and deleted members.
   mode: string;
     Mode can be "edit" or "move" depending on whether the interface is set
     to editing a hierarchival list of moving items around.

 *****************************************************************************/
var Hierarchical_List = /** @class */ (function () {
    //-----------------------------------------------------
    function Hierarchical_List() {
        this.length = 0;
        this.data = new Array();
        this.active = new Array();
        this.id = new Array();
        this.print_table = new Print_Table();
        this.properties = new Properties();
        this.curid = 1;
        this.mode = "edit";
    }
    ;
    //-----------------------------------------------------
    Hierarchical_List.prototype.deleteInactive = function () {
        for (var i = 0; i < this.length; i++) { //Loop over all items
            while ((!this.active[i]) && (i < this.length)) {
                this.data.splice(i, 1);
                this.active.splice(i, 1);
                this.id.splice(i, 1);
                this.length--;
            }
        }
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.reSort = function () {
        this.deleteInactive();
        var continue_looping = true;
        while (continue_looping) {
            continue_looping = false;
            for (var i = 0; i < this.length; i++) { //Loop over all items
                if (this.active[i]) { //We only do something for active members
                    var parentOrdinal = this.getOrdinalById(this.data[i].parent);
                    if (parentOrdinal > i) { //This shouldn't happen
                        //We will need another pass to ensure we had them all
                        continue_looping = true;
                        //Repush data to the end
                        this.data.push(this.data[i]);
                        this.active.push(true);
                        this.id.push(this.id[i]);
                        this.length += 1;
                        //Set the original element to inactive
                        this.active[i] = false;
                    }
                }
            }
        }
        this.deleteInactive();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.getOrdinalById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                return (i);
            }
        }
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.getNumChilds = function (parent_id) {
        var returnval = 0;
        for (var i = 0; i < this.length; i++) {
            if ((this.data[i].parent == parent_id) && (this.active[i])) {
                returnval++;
            }
        }
        return (returnval);
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.getMaxNumChilds = function (parent_id) {
        var newparentitem = this.data[this.getOrdinalById(parent_id)];
        var newparentofparentid = this.data[this.getOrdinalById(parent_id)].parent;
        var newparentofparentitem = this.data[this.getOrdinalById(newparentofparentid)];
        var returnval = newparentitem.getMaxNumChilds(newparentofparentitem);
        return (returnval);
    };
    Hierarchical_List.prototype.createItem = function (electroType) {
        //Create the object
        var tempval;
        switch (electroType) {
            case 'Aansluiting':
                tempval = new Aansluiting(structure);
                break;
            case 'Aansluitpunt':
            case 'Leeg':
                tempval = new Aansluitpunt(structure);
                break;
            case 'Aftakdoos':
                tempval = new Aftakdoos(structure);
                break;
            case 'Batterij':
                tempval = new Batterij(structure);
                break;
            case 'Bel':
                tempval = new Bel(structure);
                break;
            case 'Boiler':
                tempval = new Boiler(structure);
                break;
            case 'Bord':
                tempval = new Bord(structure);
                break;
            case 'Diepvriezer':
                tempval = new Diepvriezer(structure);
                break;
            case 'Domotica':
                tempval = new Domotica(structure);
                break;
            case 'Domotica gestuurde verbruiker':
                tempval = new Domotica_gestuurde_verbruiker(structure);
                break;
            case 'Droogkast':
                tempval = new Droogkast(structure);
                break;
            case 'Drukknop':
                tempval = new Drukknop(structure);
                break;
            case 'Elektriciteitsmeter':
                tempval = new Elektriciteitsmeter(structure);
                break;
            case 'Elektrische oven':
                tempval = new Elektrische_oven(structure);
                break;
            case 'EV lader':
                tempval = new EV_lader(structure);
                break;
            case 'Ketel':
                tempval = new Ketel(structure);
                break;
            case 'Koelkast':
                tempval = new Koelkast(structure);
                break;
            case 'Kookfornuis':
                tempval = new Kookfornuis(structure);
                break;
            case 'Kring':
                tempval = new Kring(structure);
                break;
            case 'Lichtcircuit':
                tempval = new Lichtcircuit(structure);
                break;
            case 'Lichtpunt':
                tempval = new Lichtpunt(structure);
                break;
            case 'Meerdere verbruikers':
                tempval = new Meerdere_verbruikers(structure);
                break;
            case 'Microgolfoven':
                tempval = new Microgolfoven(structure);
                break;
            case 'Motor':
                tempval = new Motor(structure);
                break;
            case 'Omvormer':
                tempval = new Omvormer(structure);
                break;
            case 'Overspanningsbeveiliging':
                tempval = new Overspanningsbeveiliging(structure);
                break;
            case 'Schakelaars':
                tempval = new Schakelaars(structure);
                break;
            case 'Splitsing':
                tempval = new Splitsing(structure);
                break;
            case 'Stoomoven':
                tempval = new Stoomoven(structure);
                break;
            case 'Stopcontact':
                tempval = new Stopcontact(structure);
                break;
            case 'Transformator':
                tempval = new Transformator(structure);
                break;
            case 'USB lader':
                tempval = new USB_lader(structure);
                break;
            case 'Vaatwasmachine':
                tempval = new Vaatwasmachine(structure);
                break;
            case 'Ventilator':
                tempval = new Ventilator(structure);
                break;
            case 'Verbruiker':
                tempval = new Verbruiker(structure);
                break;
            case 'Verlenging':
                tempval = new Verlenging(structure);
                break;
            case 'Verwarmingstoestel':
                tempval = new Verwarmingstoestel(structure);
                break;
            case 'Vrije ruimte':
                tempval = new Vrije_ruimte(structure);
                break;
            case 'Vrije tekst':
                tempval = new Vrije_tekst(structure);
                break;
            case 'Warmtepomp/airco':
                tempval = new Warmtepomp(structure);
                break;
            case 'Wasmachine':
                tempval = new Wasmachine(structure);
                break;
            case 'Zeldzame symbolen':
                tempval = new Zeldzame_symbolen(structure);
                break;
            case 'Zonnepaneel':
                tempval = new Zonnepaneel(structure);
                break;
            default: tempval = new Electro_Item(structure);
        }
        tempval.keys[0][2] = electroType;
        //First set the correct identifyer
        tempval.id = this.curid;
        tempval.parent = 0;
        tempval.indent = 0;
        //Return the Object
        return (tempval);
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.addItem = function (electroType) {
        //First create the item
        var tempval = this.createItem(electroType);
        //Then push the item into the queue
        this.data.push(tempval);
        this.active.push(true);
        this.id.push(this.curid);
        //Adjust length of the queue and future identifyer
        this.curid += 1;
        this.length += 1;
        //Return the Object
        return (tempval);
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.insertItemBeforeId = function (my_item, my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                //First set the correct identifyer
                my_item.id = this.curid;
                my_item.parent = this.data[i].parent;
                my_item.indent = this.data[i].indent;
                my_item.collapsed = false;
                //Insert the data
                this.data.splice(i, 0, my_item);
                this.active.splice(i, 0, true);
                this.id.splice(i, 0, this.curid);
                //Adjust length of the queue and future identifyer
                this.curid += 1;
                this.length += 1;
                break;
            }
        }
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.insertItemAfterId = function (my_item, my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                //First set the correct identifyer
                my_item.id = this.curid;
                my_item.parent = this.data[i].parent;
                my_item.indent = this.data[i].indent;
                my_item.collapsed = false;
                //Insert the data
                this.data.splice(i + 1, 0, my_item);
                this.active.splice(i + 1, 0, true);
                this.id.splice(i + 1, 0, this.curid);
                //Adjust length of the queue and future identifyer
                this.curid += 1;
                this.length += 1;
                return (i + 1);
                break;
            }
        }
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.insertChildAfterId = function (my_item, my_id) {
        var numchilds = this.getNumChilds(my_id);
        var maxchilds = this.getMaxNumChilds(my_id);
        if (numchilds < maxchilds) {
            var ordinal = this.insertItemAfterId(my_item, my_id);
            this.data[ordinal].parent = my_id;
            this.data[ordinal].indent = this.data[ordinal - 1].indent + 1;
        }
        else {
            alert("Het maximum aantal kinderen van dit element is " + maxchilds);
        }
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.moveUp = function (my_id) {
        //-- First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal - 1; i >= 0; i--) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.moveDown = function (my_id) {
        //-- First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal + 1; i < this.length; i++) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.clone = function (my_id, parent_id) {
        //-- First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        //-- Then create a clone of the object and assign the correct parent_id
        if (arguments.length < 2) {
            parent_id = this.data[currentOrdinal].parent;
        }
        var parentOrdinal = this.getOrdinalById(parent_id);
        var my_item = this.createItem(this.data[currentOrdinal].keys[0][2]);
        my_item.clone(this.data[currentOrdinal]);
        //var original_length = this.length;
        //-- Now add the clone to the structure
        //   The clone will have id this.curid-1
        if (arguments.length < 2) {
            this.insertItemAfterId(my_item, my_id); //Cloning the top-element, this messes up the ordinals !!
        }
        else {
            this.insertChildAfterId(my_item, parent_id); //Cloning childs, this messes up the ordinals !!
        }
        var new_id = this.curid - 1;
        this.data[this.getOrdinalById(new_id)].collapsed = this.data[this.getOrdinalById(my_id)].collapsed;
        //-- Now loop over the childs of the original and also clone those
        var toClone = new Array(); //list of id's to clone
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                for (var j = this.length - 1; j >= 0; j--) { //We need to loop in opposite sense
                    if (this.data[j].parent == my_id)
                        toClone.push(this.id[j]);
                }
            }
        }
        for (var clone_id = 0; clone_id < toClone.length; clone_id++) {
            this.clone(toClone[clone_id], new_id);
        }
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.deleteById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                this.active[i] = false;
                for (var j = 0; j < this.length; j++) {
                    if (this.data[j].parent == my_id)
                        this.deleteById(this.id[j]);
                }
            }
        }
        this.reSort();
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.adjustTypeByOrdinal = function (ordinal, electroType, resetkeys) {
        //this.data[ordinal].keys[0][2] = electroType; //We call setKey to ensure that also resetKeys is called in the Electro_Item
        var tempval = this.createItem(electroType);
        Object.assign(tempval, this.data[ordinal]);
        tempval.keys[0][2] = electroType; //We need to do this again as we overwrote it with assign
        if (resetkeys)
            tempval.resetKeys();
        this.data[ordinal] = tempval;
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.adjustTypeById = function (my_id, electroType, resetkeys) {
        var ordinal = structure.getOrdinalById(my_id);
        this.adjustTypeByOrdinal(ordinal, electroType, resetkeys);
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.tekenVerticaleLijnIndienKindVanKring = function (item, mySVG) {
        // Eerst checken of het wel degelijk een kind van een kring is
        var parent = item.getParent();
        if (parent != null) {
            if (parent.keys[0][2] == "Kring") {
                // Bepaal hoogte van de lijn. Idien dit het laatste element van de kring is is het een halve lijn,
                // zoniet een hele lijn
                var y1 = void 0, y2 = void 0;
                var lastOrdinalInKring = 0;
                var myOrdinal = this.getOrdinalById(item.id);
                for (var i = 0; i < item.sourcelist.length; i++) {
                    if (this.active[i] && (this.data[i].parent == parent.id))
                        lastOrdinalInKring = i;
                }
                if (myOrdinal < lastOrdinalInKring) { // Teken een verticale lijn over de volledige hoogte
                    y1 = 0;
                    y2 = mySVG.yup + mySVG.ydown;
                }
                else { // Teken een verticale lijn over de halve hoogte
                    y1 = mySVG.yup;
                    y2 = mySVG.yup + mySVG.ydown;
                }
                // Teken de lijn
                mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />';
                // Plaats het nummer van het item naast de lijn
                mySVG.data +=
                    '<text x="' + (mySVG.xleft + 9) + '" y="' + (mySVG.yup - 5) + '" ' +
                        'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                        htmlspecialchars(item.keys[10][2]) + '</text>';
            }
        }
        ;
    };
    ;
    //-----------------------------------------------------
    Hierarchical_List.prototype.toHTML = function (myParent) {
        var output = "";
        var numberDrawn = 0;
        //-- bovenaan de switch van editeer-mode (teken of verplaats) --
        if (myParent == 0) {
            switch (this.mode) {
                case "edit":
                    output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen/Clone</option></select><br><br>';
                    break;
                case "move":
                    output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen/Clone</option></select>' +
                        '<span style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. ' +
                        'Gebruik het Moeder-veld om een component elders in het schema te hangen. Kies "clone" om een dubbel te maken van een element.</i></span><br><br>';
                    break;
            }
            //-- plaats input box voor naam van het schema bovenaan --
            //output += 'Bestandsnaam: <span id="settings"><code>' + this.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span><br><br>'
        }
        //--Teken het volledige schema in HTML--
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)) {
                numberDrawn++;
                if (this.data[i].collapsed) {
                    output += '<table class="html_edit_table"><tr><td bgcolor="#8AB2E4" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229E;</td><td width="100%">';
                }
                else {
                    output += '<table class="html_edit_table"><tr><td bgcolor="#C0C0C0" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229F;</td><td width="100%">';
                }
                switch (myParent) {
                    case 0: {
                        output += this.data[i].toHTML(structure.mode) + "<br>";
                        break;
                    }
                    default: {
                        output += this.data[i].toHTML(structure.mode, this.data[this.getOrdinalById(myParent)]) + "<br>";
                        break;
                    }
                }
                if (!this.data[i].collapsed) {
                    output += this.toHTML(this.id[i]);
                }
                output += "</td></tr></table>";
            }
        }
        if ((myParent == 0) && (numberDrawn < 1)) {
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>"; //no need for the add button if we have items
        }
        return (output);
    };
    //-----------------------------------------------------
    Hierarchical_List.prototype.toSVG = function (myParent, stack, minxleft, includeparent) {
        if (minxleft === void 0) { minxleft = 0; }
        if (includeparent === void 0) { includeparent = false; }
        // Eerst creëren we een array van SVGelements met alle kinderen van myParent en eventueel myParent zelf
        var inSVG = new Array(); //Results from nested calls will be added here
        var elementCounter = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && ((this.data[i].parent == myParent) || ((includeparent == true) && (this.id[i] == myParent)))) {
                switch (this.data[i].keys[0][2]) {
                    case "":
                        inSVG[elementCounter] = new SVGelement();
                        break;
                    case "Bord":
                        inSVG[elementCounter] = this.data[i].toSVG();
                        break;
                    case "Splitsing":
                        inSVG[elementCounter] = this.data[i].toSVG();
                        break;
                    case "Domotica":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening van Domotica
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
                        break;
                    case "Meerdere verbruikers":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening van meerdere verbruikers
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
                        break;
                    case "Vrije ruimte":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        break;
                    case "Domotica gestuurde verbruiker":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
                        break;
                    case "Kring":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        break;
                    case "Aansluiting":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
                        break;
                    default:
                        if ((this.data[this.getOrdinalById(myParent)]).keys[0][2] == "Meerdere verbruikers")
                            inSVG[elementCounter] = this.data[i].toSVG();
                        else if (stack == "vertical")
                            inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal", 0, true); //if we are still in vertical mode, switch to horizontal and take childs with us
                        else { //we are in horizontal mode and can start drawing
                            if (this.id[i] == myParent) { // Element is de parent en tekent zichzelf
                                inSVG[elementCounter] = this.data[i].toSVG();
                            }
                            else { // Element is niet de parent, we tekenen het element en al zijn kinderen
                                inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal", 0, true); //if we are still in vertical mode, switch to horizontal and take childs with us
                            }
                        }
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
                        break;
                }
                elementCounter++;
            }
        }
        // If there are no elements, make at least an empty one to avoid problems here below ---
        if (elementCounter == 0) {
            inSVG[0] = new SVGelement();
        }
        // Now create the output element ---
        var outSVG = new SVGelement;
        outSVG.xleft = 0;
        outSVG.xright = 0;
        outSVG.yup = 0;
        outSVG.ydown = 0;
        outSVG.data = "";
        var width = 0; //How wide is the structure?
        var height = 0; //How high is the structure?
        switch (stack) {
            case "horizontal":
                var max_yup = 0; //What is the maximal distance above the horizontal line?
                var max_ydown = 0; //What is the maximal distance below the horizontal line?
                // analyse the size of the structure. Build horizontally
                for (var i_1 = 0; i_1 < elementCounter; i_1++) {
                    width = width + inSVG[i_1].xleft + inSVG[i_1].xright;
                    max_yup = Math.max(max_yup, inSVG[i_1].yup);
                    max_ydown = Math.max(max_ydown, inSVG[i_1].ydown);
                }
                height = max_yup + max_ydown;
                // decide on the output structure
                if (elementCounter > 0) {
                    outSVG.xleft = inSVG[0].xleft; //Leave space of the first element at the left
                    outSVG.xright = width - outSVG.xleft;
                    outSVG.xrightmin = outSVG.xright - inSVG[elementCounter - 1].xright;
                }
                else {
                    outSVG.xleft = 0;
                    outSVG.xright = 0;
                    outSVG.xrightmin = 0;
                }
                ;
                outSVG.yup = max_yup;
                outSVG.ydown = max_ydown;
                // Create the output data
                var xpos = 0;
                for (var i = 0; i < elementCounter; i++) {
                    outSVG.data += '<svg x="' + xpos + '" y="' + (max_yup - inSVG[i].yup) + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    xpos += inSVG[i].xleft + inSVG[i].xright;
                }
                break;
            case "vertical":
                var max_xleft = 0; //What is the maximal distance left of the vertical line?
                var max_xright = 0; //What is the maximal distance right of the vertical line?
                // analyse the size of the structure. Build vertically
                for (var i_2 = 0; i_2 < elementCounter; i_2++) {
                    height = height + inSVG[i_2].yup + inSVG[i_2].ydown;
                    max_xleft = Math.max(max_xleft, inSVG[i_2].xleft);
                    max_xright = Math.max(max_xright, inSVG[i_2].xright);
                }
                max_xleft = Math.max(minxleft, max_xleft);
                width = max_xleft + max_xright;
                // decide on the output structure
                outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
                outSVG.ydown = 0;
                outSVG.xleft = Math.max(max_xleft, 35); // foresee at least 35 for text at the left
                outSVG.xright = Math.max(max_xright, 25); // foresee at least 25 at the right
                // create the output data
                var ypos = 0;
                for (var i = elementCounter - 1; i >= 0; i--) {
                    outSVG.data += '<svg x="' + (outSVG.xleft - inSVG[i].xleft) + '" y="' + ypos + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    ypos += inSVG[i].yup + inSVG[i].ydown;
                }
                break;
        }
        outSVG.data += "\n";
        if (myParent == 0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
            var header = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
            header += SVGSymbols.outputSVGSymbols();
            var footer = "</svg>";
            outSVG.data = header + outSVG.data + footer;
        }
        return (outSVG);
    };
    return Hierarchical_List;
}());
var Page_Info = /** @class */ (function () {
    function Page_Info() {
        this.height = 0;
        this.start = 0;
        this.stop = 0;
    }
    return Page_Info;
}());
var Print_Table = /** @class */ (function () {
    function Print_Table() {
        this.height = 0;
        this.maxwidth = 0;
        this.displaypage = 0;
        this.pages = new Array();
        var page_info;
        page_info = new Page_Info();
        this.pages.push(page_info);
    }
    Print_Table.prototype.setPaperSize = function (papersize) {
        this.papersize = papersize;
    };
    Print_Table.prototype.getPaperSize = function () {
        if (!this.papersize) {
            this.papersize = "A4";
        }
        return (this.papersize);
    };
    Print_Table.prototype.setHeight = function (height) {
        var pagenum;
        this.height = height;
        for (pagenum = 0; pagenum < this.pages.length; pagenum++) {
            this.pages[pagenum].height = height;
        }
    };
    Print_Table.prototype.getHeight = function () {
        return (this.height);
    };
    Print_Table.prototype.setModeVertical = function (mode) {
        this.modevertical = mode;
    };
    Print_Table.prototype.getModeVertical = function () {
        this.forceCorrectFigures();
        return (this.modevertical);
    };
    Print_Table.prototype.forceCorrectFigures = function () {
        if (!this.modevertical) {
            this.modevertical = "alles";
        }
        switch (this.modevertical) {
            case "kies":
                this.starty = Math.min(Math.max(0, this.starty), this.height);
                this.stopy = Math.min(Math.max(this.starty, this.stopy), this.height);
                break;
            default:
                this.starty = 0;
                this.stopy = this.height;
        }
        var pagenum;
        this.pages[this.pages.length - 1].stop = this.maxwidth;
        for (pagenum = 0; pagenum < this.pages.length; pagenum++) {
            if (pagenum > 0) {
                this.pages[pagenum].start = this.pages[pagenum - 1].stop;
            }
            if (this.pages[pagenum].stop > this.maxwidth) {
                this.pages[this.pages.length - 1].stop = this.maxwidth;
            }
            ;
            if (this.pages[pagenum].start > this.pages[pagenum].stop) {
                this.pages[pagenum].start = this.pages[pagenum].stop;
            }
            ;
        }
    };
    Print_Table.prototype.setMaxWidth = function (maxwidth) {
        this.maxwidth = maxwidth;
        this.forceCorrectFigures();
    };
    Print_Table.prototype.getMaxWidth = function () {
        return (this.maxwidth);
    };
    Print_Table.prototype.getstarty = function () {
        this.forceCorrectFigures();
        return (this.starty);
    };
    Print_Table.prototype.getstopy = function () {
        this.forceCorrectFigures();
        return (this.stopy);
    };
    Print_Table.prototype.setstarty = function (starty) {
        this.starty = starty;
        this.forceCorrectFigures;
    };
    Print_Table.prototype.setstopy = function (stopy) {
        this.stopy = stopy;
        this.forceCorrectFigures;
    };
    Print_Table.prototype.setStop = function (page, stop) {
        if (page > 0) {
            if (stop < this.pages[page - 1].stop)
                stop = this.pages[page - 1].stop;
        }
        if (page < this.pages.length - 1) {
            if (stop > this.pages[page + 1].stop)
                stop = this.pages[page + 1].stop;
        }
        if (stop > this.maxwidth)
            stop = this.maxwidth;
        this.pages[page].stop = stop;
        this.forceCorrectFigures();
    };
    Print_Table.prototype.addPage = function () {
        var page_info;
        page_info = new Page_Info();
        page_info.height = this.height;
        page_info.start = this.pages[this.pages.length - 1].stop;
        page_info.stop = this.maxwidth;
        this.pages.push(page_info);
    };
    Print_Table.prototype.deletePage = function (page) {
        if (page == 0) {
            this.pages[1].start = 0;
        }
        else {
            this.pages[page - 1].stop = this.pages[page].stop;
        }
        this.pages.splice(page, 1);
    };
    Print_Table.prototype.toHTML = function () {
        var outstr = "";
        var pagenum;
        outstr += '<table border="1" cellpadding="3">';
        outstr += '<tr><th align="center">Pagina</th><th align="center">Start</th><th align"center">Stop</th><th align"left">Acties</th></tr>';
        for (pagenum = 0; pagenum < this.pages.length; pagenum++) {
            outstr += '<tr><td align=center>' + (pagenum + 1) + '</td><td align=center>' + this.pages[pagenum].start + '</td><td align=center>';
            if (pagenum != this.pages.length - 1) {
                outstr += '<input size="4" id="id_stop_change_' + pagenum + '" type="number" min="' + this.pages[pagenum].start + '" step="1" max="' + this.maxwidth + '" onchange="HLChangePrintStop(' + pagenum + ')" value="' + this.pages[pagenum].stop + '">';
            }
            else {
                outstr += this.pages[pagenum].stop.toString();
            }
            outstr += '</td><td align=left>';
            if (pagenum == this.pages.length - 1) {
                outstr += '<button style="background-color:green;" onclick="HLAddPrintPage()">&#9660;</button>';
            }
            if (this.pages.length > 1) {
                outstr += '<button style="background-color:red;" onclick="HLDeletePrintPage(' + pagenum + ')">&#9851</button>';
            }
            outstr += '</td></tr>';
            //outstr += this.Pages[pagenum].height.toString();
        }
        outstr += "</table>";
        return (outstr);
    };
    return Print_Table;
}());
var CONFIGPAGE_LEFT = "\n    <center>\n        <p><font size=\"+2\">\n          <b>Eendraadschema ontwerpen: </b>\n          Kies &eacute;&eacute;n van onderstaande voorbeelden om van te starten (u kan zelf kringen toevoegen achteraf) of\n          start van een leeg schema met voorgekozen aantal kringen (optie 3).\n        </font></p>\n      <font size=\"+1\">\n        <i>\n          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te\n          bekijken alvorens van een leeg schema te vertrekken.\n        </i>\n      </font>\n    </center><br><br>\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 1</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 2</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Leeg schema</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Openen</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example000.svg\" height=\"300px\"><br><br>\n          Eenvoudig schema, enkel stopcontacten en lichtpunten.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example001.svg\" height=\"300px\"><br><br>\n          Iets complexer schema met teleruptoren, verbruikers achter stopcontacten en gesplitste kringen.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/gear.svg\" height=\"100px\"><br><br>\n";
var CONFIGPAGE_RIGHT = "\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/import_icon.svg\" height=\"100px\"><br><br>\n          Open een schema dat u eerder heeft opgeslagen op uw computer (EDS-bestand). Enkel bestanden aangemaakt na 12 juli 2019 worden herkend.\n          <br><br>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(0)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(1)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"read_settings()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"importclicked()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n      </tr>\n    </table>\n  ";
var CONFIGPRINTPAGE = "\n<div>\n</div>\n<br>\n";
var EXAMPLE0 = "EDS0020000eJztnG1P4zgQgP9Kla/nLYkTQK1Op4MeQqvldqUr6p2EEHKTaeqNE0eJQ3kR//3GhtJ0adjjZbe51hJCxmPPjMd5Mo4dcusIyGI1dfpejzgRU8zpn906PMIK4uSsgEw5fZc4PIvmxVAKwfISsM2EiRKIk8B1if3OHHWdg0Oc4dHJ0eAUCwcsK0XFFc9i55ycOTEwVkQoOPzy5eTo4LNDVFGBliTaQHEJXPB4CnxlGxaGVVoJpjjUxcYJI2eZYqJunxqrgodTlRToxEUuF/ofW0GWgDAS0/wSB8rRiixWWrmBBLSuuoaITyagY8UBhFHC0hwKFptonP718fMxFgLXiBI2BlGvp1fenpFkjKV1wR+o1giW9F/MdBCXNPtuTfUFxmEGNzxeGUMTI1p33rsftRTqG3+p7452aDAy8lCmKTqAputNjKgEAaHy6jpLxbLIzPWiwZLRg5rAb+45llJ4K6dBS2ijxF8pKZWeOG8pcs5CQJ+OzNT7T+q1iaDR+O5TyTkOTFZFCIKXSFFWCXFH7jmjC868BWfeizg7lA/x+tmAeT8JMFYpmaJfZThtxIs24PXP6LDjH1Oyu5KxDeVrVYN1crZ2zHR+m3NGF5zRF3H2qbCZ7LlM9jxqL0hn36Htm0CtHzebzh7TmVvLZ70FaP57JbRH32xGsxltmzPafi2huU0ZTc/iVie0t3I2GLBnWDtoN2yfoEoga0LuY9aZITJNwA1eCdp8LBuT0vYsaO8E2sM+xzOgeQ2gHbYbtBEUJsLzSba0vZo2v5bX9l+7fhwqmYcSpylUdl/kVatIr93A2WXke/EWUMtbC3ijlrct4c2zvLWAN9/ytiW8uZa3FvAWWN62gze/Z3lrAW+7lrft4C3wF7wFtZPt4EXAjQr+FToKktICt4nHbn8zBUUiMSBN5N1IPa+dhEVLbZY8CFFxAUvydbK3566dPuqtPhwI7OHAS7H7/uFAE3qDdrN3yKKEpc3k2ZOB/8habaeS1t6V3LVLS3s0YJeWPwC4wALXBuDs2cC2ANd7D+BO9KUe8iKseJuJi6rxuLXItfx4YJhziB9e0LbkvQN5Xu0lr73X7lpa8N4Onl1cbgtx+5tAXJs2UOzi0gL33MEc3QTg/v9Pcy1fWlrg3gwc1rFQ8UtAhMzW/w/7hZY02mceocTrEeqSfbJH/H0SUBJ4JHCJ3yOBT/BhklJCA4JPmLjUxdzrU+ybYxDUhWJjga7eOkhRPL3/yEPKrmY80h+GcPU/hZa5YNe5vpj65nWaGErzoYhaD5zdYl6SORbuzu+0BYnc4EVeagMTLiBjKWpx4AqJEuC6bheiEuMqZxkUKBhJWWhkOgeIOJjir+Pit6EqGFMdV5exk9uJIQW8ekFXnILod37xaQfr5z+6/nj457x+WQAfUsaxz+WDsS57NPZ7JFPgWXesweEZDksI4xiPIDVVE4l/xaDwrpFFnRSU1jhVKi/7Ozuz2ayLfkXobYT3DkhZN5agpnixfPjKQjkutWaMTFgV5vgWn+1TGZmQRHhPvfsXXgCWFw==";
var EXAMPLE1 = "EDS0020000eJztnftP2zoUx/+VKr9ej8VOWtbq6uoCm9i0l3SZuFdCE3KTQ+rViaPEoXuI//0eB0rdreFROhpaI1QZH8d2bH/yPX6E/vAkZIkeeYOAES/mmnuDkx+eiL0BJV7OC8i0N/CJJ7J4GoyUlDwvAdOccVkC8cbwrcTrTjz9LQePeEev3r06+ISBPZ6VshJaZIn3mZx4CXBexGjY//jx3au9Dx7RRQXGMjYFFOcgpEhGIBam4VFUpZXkWoBtritR23mmubTLZ3WpUkQjPS6wEqe5muV/nQqyMcjaUic/xxsVWIoqFpbyHcZg8rJziMXZGZi2EgCyzoSnORQ8qVvj0z9vPhxiIPRr05gPQdrx7Cvt1ZaM89Q2vMRsa8Nc/qcT04hzOQe+lfUptsMEvotkYRvWbcTsytPLu1ZS/1RfFvjHz1l4XNsjlaZYASzaTlKbSpAQaWrnWWqexXVfzxLMFbpnGYLmK4dKSbqwG4yFNVqChZZSm46jcy3nzQzs1zur44Nf4k0RYWPh3V8tn/HGVFVEIEWJFGWVlBfkkjM244zOOKP34mxfXbXXYwNGHwkwXmmVYr3KaNSIF2vA67/j/U5wyEh3IWMbyteiBOvkbO2Y0f6MMzbjjN2Ls7eFU7KblOxm1O4hZ7fQ9lNDrR83J2fXcuZbetafgRasStCu6+YUzSnaNivariVofpOimV7cakF7KGcHEb+Btb12w/aWp1B0aBNzb7LOBJlpIu5gSdKmN7M5mtazUAtnqPXupWn/8jLl0Uhk4KZqTticsDXi1nPCtiLOrtYVbxA22sDafrthuxQ25oTtgYsiFmq9prnaLaS9B8BRUUDnHIphUQkcqaUTuKUEjrYbOqdwq+LuxQy73WWXSI5yKXS5LpV7+rA51raDNUYXu5OhcyfvC9rt7mQTbAftpm2fx2PjUTp/8mGsWXtsL5pIc3tsCUDWTjFr3b6aU7OfZ2z+HRDbejFzhDnClvYXrQNZzDqR1b3f7EyrPFLYTZF28zO3GOKAawYu6Dvg2gAcc8BtB3BsJcC9M0M9EkVUiTYTF1fDYWuRCxxy24Ec3X34RtvagWvTUqSTOMfbTT4l2wDe7iZwGnu7qHIDWOt4c/q2JbyF3TvwdptH+VKlSouIdxIodVXhKLHOlLSYwDYr3oYCeDhd4H2UTbfpJa0kzzrCZShcbtOt1rq8ytosdA6zZTF7XUETaRJ+B2Mbp2/UOkTSd0uUbk/A+ZO/l7fA8dYC3tx6yZbwFobWW9vBsm+4vRdRoRIlz9T5levgkNssT9IRtzKFYxugcE9/R8CtUG4Jb0F4B97cq26PxV3ouNsO7qi1M0D9pyp0Tx+4rgNuS4ALHXBtAK7ngNsO4ELrlZygv+zayXEhvkBHw7h0wG3iyslrU5VCJc0vmX5Xpl87Yx7PpZmrQYQZFzBnXyd73e766bN25mhv2f3vo2jEcWRjy7V5Qtfqs8y/HT/fiV0LxI6tAjd33KTlrG3Dqa52cxY4zhxn7eOsWdBsAp8OZ4G1PBks/a9dnfvYftSc+9gG3Horwc0tTradNrc2uV7eMA7pEOeAANW72u39wKqaR8MJJYzQPmE+2SWsR3oE/d4XhFHSJ9QnjJEAjRjeJQEjYZeEmIISGpAwJBSt+NklNCShT0JKcKKKPjTKe9DDAnJsan2q+VBig/zwENVkdPltdin/OhGx+QY833z7TZlL/i03Q3ZQL+smUNbfiGddgWOomIZUjoGLzxemBIVwIkqlKeBMSMh4irl48BWxleD7dAfiEntPTTIo0HCsVGG47OzhcwTq4J/D4q8jXXCuO74J+/jTSSBFf02DifgEctD5I2AdjJ/+mvjDo/fT+HkDPEu5wGvOrwrb4deF/R2rFES2MzR4igxvS8q6YiKGtI46U/hXAhofTVncSUGbHEda5+Xg+fPJZLKD9YqxtjE+oCDlO4kCPcIh+ewLj9SwNDljy0RVUc9odrGxVVw3SSy0d/E/3N89ow==";
var EXAMPLE_DEFAULT = "EDS0020000eJztWutv2zYQ/1cEfp3i2FLSD8YwNFmDoMhraDJ3aFAEtHSWWfEhkJTdpMj/vjv6Jc92gGxr0IeMxCDvyHvxfnck4C9Mgi78mPUPYpZzz1n/9gsTOev3YlZxC9qzfjdmQueLYWak5JUDXDPi0kHMSrh3uO+W+fsKWMyuT85Pfr/BwRHXTtbCC12wj/EtK4BzmyPj+Orq/OToksXe1kCckhTYCQgpijGIrWt4ltWqltwLaLKDEYHPteeyoT8hqhTZ2JcWTbirzEr60kbQJcjACSZO0E2BOozdquMBSiBZTQm5GI2AIiUAZBDCVQWWFyEWN+/eXp6y+NVhcJMPQTaoLPncexW2aM5VkxGIa5LvphS8psy0210KvUPvp/AgiidCkzSt7s3cNdKvG8qStDvYTw4GgZ8ZpVA/at4wzoGEzPeaMtMGY01Zg5426c5znYecoAVDY2Rvq/3ESXZy0q0c5+mgept2B3qyg55u0EnDwU7dh5ucj4QR7WoFlmDBcMXZPGfWAPEYz5CWrJDWWyGt9yykHZt5DF8YYvM0+vog47U3Cu1y2XgXxFjSZVtB9tfgOEpPk/jwXyONIdTY01hbhvBloLaOnC2Q27bgp8DeHwFLd289KNZve1nby9pe9hK9bGNdaEmr5deVFN6tNb50BctkBcvkWbCciW8BuQ2Q/wGM3xYWL/ePnovGHwyEW5pae21sr43ttbG9Nn7vXaq9Nv6QePoa18YdQpcXyoMVYNMVYNP/qyUuvW57YtsTfwYMb+mJ7ZutfbO1b7b2zdb2p7Y/fYsIa99s7ZutfbN9F2+2DU5TzVLoG6OMFxlvDKMCnK9rzKpoAnZoa4HZ3dB/AYA82+S6NbNitrf7Q6q594iXTzQMiX9shAwq3gioJlbAw2xmjSlK7nwY12WpTYXDEwklnkomPKBCBT4snlOxq0FkEK9EGkSS5zPbcRVpOjMg5xLPjClHxupakPXnVBAyYTMM0GJa1ZrGFyKzpjByNBd7YWZ14EpNjFVB/BWGwlVca3TfDWFWseanlY051hJM5xAkbyo8F88zP5thzGdSbyweD9qj5lXmz+vjpfUDzv2UO8WzsdAEy0GzHg3A0q+MZupwMuVWkR3e4DkGrwcYbIg8lMHx98j3UBlV7XN02ARSQ/gHozWgMxD2Pn2Ui5yah+po5HmZGxMiCkAGfQCZP3AFkbtXQ4OGYm4iFjAAYgKYmVTH4/UvZFOvue3FSZzGBzitMPX8nedDCdSJsFoX41nfUfzzVOT0C6su1VxXSX5fUe2iOQ1c+MlVYwdWF7sYYT71u48ElsoarM5YUh0pGGE+ajSa9RmAzi3nOSWW4h3IyTcz1XgwfTYwmEBYo6MjTBcIw1+H9rdrjzt81KVxFz+IKIVyPBDhBmQ/+iVNIqQv/oh+en2xoK8zYE9xgXsmc2UdvlT2OjcKhO4M6dyERtekDIaJHFQgjQzOSAqWoqjT6dCQ/gsERImuRYgfmo+9r1x/f386nXb+4XJhwI+xhu194pkZOlJG1aW2dEiHeAQmD4HKETmPfwPoje90";
var VERSION = "git"; //can be "git" or "online"
var PROP_Contact_Text = "<html>\n  <head>\n    <title>Eendraadschema online</title>\n    <link rel=\"stylesheet\" href=\"css/about.css\">\n  </head>\n  <body>\n    <h2>Een &eacute;&eacute;ndraadschema tekenen.</h2>\n    <p class=\"ondertitel\">Een cr&eacute;atie van <a target=\"_blank\" href=\"https://ivan.goethals-jacobs.be\">Ivan Goethals</a></p>\n    <p>Dit is een standalone versie (development) waarbij enkele functionaliteiten zijn uitgeschakeld.</p>\n    <p>Gebruik de online versie op <a href=\"https://eendraadschema.goethals-jacobs.be\">https://eendraadschema.goethals-jacobs.be</a> om toegang te krijgen tot het contactformulier.</p>\n    <p>Kies <b>Bewerken</b> in het menu om verder te gaan met tekenen.</p>\n  </body>\n</html>";
function PROP_GDPR() {
    return ("");
}
function PROP_getCookieText() {
    return ("");
}
function exportjson() {
    var filename;
    //We use the Pako library to entropy code the data
    //Final data reads "EDS0010000" and thereafter a 64base encoding of the deflated output from Pako
    //filename = "eendraadschema.eds";
    filename = structure.properties.filename;
    //Remove some unneeded data members that would only inflate the size of the output file
    for (var _i = 0, _a = structure.data; _i < _a.length; _i++) {
        var listitem = _a[_i];
        listitem.sourcelist = null;
    }
    //Create the output structure in uncompressed form
    var text = JSON.stringify(structure);
    //Put the removed data members back
    for (var _b = 0, _c = structure.data; _b < _c.length; _b++) {
        var listitem = _c[_b];
        listitem.sourcelist = structure;
    }
    //Compress the output structure and download to the user
    try {
        var decoder = new TextDecoder("utf-8");
        var encoder = new TextEncoder();
        var pako_inflated = new Uint8Array(encoder.encode(text));
        var pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
        text = "EDS0020000" + btoa(String.fromCharCode.apply(null, pako_deflated));
    }
    catch (error) {
        //We keep the non encoded text and do nothing
    }
    finally {
        download_by_blob(text, filename, 'data:text/eds;charset=utf-8');
    }
}
function displayButtonPrintToPdf() {
    return ("");
    //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}
function handleButtonPrintToPdf() {
    return (0);
    //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}
function HLCollapseExpand(my_id, state) {
    var ordinal;
    ordinal = structure.getOrdinalById(my_id);
    if (state == undefined) {
        structure.data[ordinal].collapsed = !structure.data[ordinal].collapsed;
    }
    else {
        structure.data[ordinal].collapsed = state;
    }
    HLRedrawTree();
}
function HLDelete(my_id) {
    structure.deleteById(my_id);
    HLRedrawTree();
}
function HLAdd(my_id) {
    structure.addItem("");
    HLRedrawTree();
}
function HLInsertBefore(my_id) {
    structure.insertItemBeforeId(new Electro_Item(structure), my_id);
    HLRedrawTree();
}
function HLInsertAfter(my_id) {
    structure.insertItemAfterId(new Electro_Item(structure), my_id);
    HLRedrawTree();
}
function HLMoveDown(my_id) {
    structure.moveDown(my_id);
    HLRedrawTree();
}
function HLMoveUp(my_id) {
    structure.moveUp(my_id);
    HLRedrawTree();
}
function HLClone(my_id) {
    structure.clone(my_id);
    HLRedrawTree();
}
function HLInsertChild(my_id) {
    structure.insertChildAfterId(new Electro_Item(structure), my_id);
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}
function HLUpdate(my_id, key, type, docId) {
    switch (type) {
        case "SELECT":
            var setvalueselect = document.getElementById(docId).value;
            if (key == "type") {
                structure.adjustTypeById(my_id, setvalueselect, true);
            }
            else {
                structure.data[structure.getOrdinalById(my_id)].setKey(key, setvalueselect);
            }
            HLRedrawTreeHTML();
            break;
        case "STRING":
            var setvaluestr = document.getElementById(docId).value;
            structure.data[structure.getOrdinalById(my_id)].setKey(key, setvaluestr);
            break;
        case "BOOLEAN":
            var setvaluebool = document.getElementById(docId).checked;
            structure.data[structure.getOrdinalById(my_id)].setKey(key, setvaluebool);
            HLRedrawTreeHTML();
            break;
    }
    HLRedrawTreeSVG();
}
function HL_editmode() {
    structure.mode = document.getElementById("edit_mode").value;
    HLRedrawTreeHTML();
}
function HL_changeparent(my_id) {
    //-- See what the new parentid is --
    var str_newparentid = document.getElementById("id_parent_change_" + my_id).value;
    //-- Check that it is valid. It needs to be a number and the parent an active component --
    var error = 0;
    var parentOrdinal = 0;
    if (!isInt(str_newparentid)) {
        error = 1;
    }
    var int_newparentid = parseInt(str_newparentid);
    if (int_newparentid != 0) {
        parentOrdinal = structure.getOrdinalById(int_newparentid);
        if (typeof (parentOrdinal) == "undefined") {
            error = 1;
        }
        else {
            if ((!structure.active[parentOrdinal]) || (int_newparentid == my_id)) {
                error = 1;
            }
        }
    }
    if (error == 1) {
        alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    }
    else {
        structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;
    }
    structure.reSort();
    HLRedrawTree();
}
function HL_cancelFilename() {
    document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
}
function HL_changeFilename() {
    var regex = new RegExp('^[-_ A-Za-z0-9]{2,}\\.eds$');
    var filename = document.getElementById("filename").value;
    if (regex.test(filename)) {
        structure.properties.setFilename(document.getElementById("filename").value);
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
    }
    else {
        structure.properties.setFilename(document.getElementById("filename").value + '.eds');
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
    }
}
function HL_enterSettings() {
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + structure.properties.filename + '" pattern="^[-_ A-Za-z0-9]{2,}\\\.eds$">&nbsp;<i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}
function HLRedrawTreeHTML() {
    show2col();
    document.getElementById("configsection").innerHTML = "";
    var output = structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}
function HLRedrawTreeSVG() {
    //let scrolltop = document.getElementById("right_col").scrollTop;
    //let scrollleft = document.getElementById("right_col").scrollLeft;
    var str = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>'
        + flattenSVGfromString(structure.toSVG(0, "horizontal").data)
        + '<h2>Legende:</h2>'
        + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
        + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
        + '<i><br><small>Versie: ' + CONF_builddate
        + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">GPLv3</a></small></i><br><br>';
    document.getElementById("right_col_inner").innerHTML = str;
    //document.getElementById("right_col").scrollTop = scrolltop;
    //document.getElementById("right_col").scrollLeft = scrollleft;
    /*document.getElementById("right_col_inner").innerHTML = '<b>Tekening: </b><button onclick=download("html")>Download als html</button>';
      document.getElementById("right_col_inner").innerHTML += '&nbsp;<button onclick=download("svg")>Download als svg</button>';
      document.getElementById("right_col_inner").innerHTML += '&nbsp;<input type="checkbox" id="noGroup" checked></input><small>SVG elementen niet groeperen (aanbevolen voor meeste tekenprogramma\'s)</small>';
      document.getElementById("right_col_inner").innerHTML += '<br><small><i>Noot: De knoppen hierboven laden enkel de tekening. Wenst u het schema ook later te bewerken, gebruik dan "Opslaan" in het hoofdmenu.</i></small><br><br>';*/
}
function HLRedrawTree() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}
function HLAddPrintPage() {
    this.structure.print_table.addPage();
    printsvg();
}
function HLDeletePrintPage(mypage) {
    this.structure.print_table.deletePage(mypage);
    printsvg();
}
function HLChangePrintStop(page) {
    var str_newstop = document.getElementById("id_stop_change_" + page).value;
    var int_newstop = parseInt(str_newstop);
    structure.print_table.setStop(page, int_newstop);
    printsvg();
}
function HLDisplayPage() {
    structure.print_table.displaypage = parseInt(document.getElementById("id_select_page").value) - 1;
    printsvg();
}
function HLChangeModeVertical() {
    structure.print_table.setModeVertical(document.getElementById("id_modeVerticalSelect").value);
    printsvg();
}
function HLChangeStartY() {
    var starty = parseInt(document.getElementById("id_starty").value);
    if (isNaN(starty)) {
        starty = 0;
    }
    structure.print_table.setstarty(starty);
    structure.print_table.forceCorrectFigures();
    printsvg();
}
function HLChangeStopY() {
    var stopy = parseInt(document.getElementById("id_stopy").value);
    if (isNaN(stopy)) {
        stopy = structure.print_table.getHeight();
    }
    structure.print_table.setstopy(stopy);
    structure.print_table.forceCorrectFigures();
    printsvg();
}
function HLChangePaperSize() {
    structure.print_table.setPaperSize(document.getElementById("id_papersize").value);
}
function buildNewStructure(structure) {
    //Paremeterisation of the electro board
    var aantalDrogeKringen = CONF_aantal_droge_kringen;
    var aantalNatteKringen = CONF_aantal_natte_kringen;
    ;
    //Eerst het hoofddifferentieel maken
    var itemCounter = 0;
    structure.addItem("Aansluiting");
    structure.data[0].setKey("type", "Aansluiting");
    structure.data[0].setKey("naam", "");
    structure.data[0].setKey("zekering", "differentieel");
    structure.data[0].setKey("aantal", CONF_aantal_fazen_droog);
    structure.data[0].setKey("amperage", CONF_hoofdzekering);
    structure.data[0].setKey("kabel", CONF_aantal_fazen_droog + "x16");
    structure.data[0].setKey("kabel_aanwezig", false);
    structure.data[0].setKey("differentieel_waarde", CONF_differentieel_droog);
    itemCounter++;
    //Dan het hoofdbord maken
    structure.insertChildAfterId(new Bord(structure), itemCounter);
    structure.data[itemCounter].setKey("type", "Bord");
    itemCounter++;
    var droogBordCounter = itemCounter;
    //Nat bord voorzien
    structure.insertChildAfterId(new Kring(structure), itemCounter);
    structure.data[itemCounter].setKey("type", "Kring");
    structure.data[itemCounter].setKey("naam", "");
    structure.data[itemCounter].setKey("zekering", "differentieel");
    structure.data[itemCounter].setKey("aantal", CONF_aantal_fazen_nat);
    structure.data[itemCounter].setKey("amperage", CONF_hoofdzekering);
    structure.data[itemCounter].setKey("kabel", "");
    structure.data[itemCounter].setKey("kabel_aanwezig", false);
    structure.data[itemCounter].setKey("differentieel_waarde", CONF_differentieel_nat);
    itemCounter++;
    structure.insertChildAfterId(new Bord(structure), itemCounter);
    structure.data[itemCounter].setKey("type", "Bord");
    structure.data[itemCounter].setKey("geaard", false);
    itemCounter++;
}
function reset_all() {
    structure = new Hierarchical_List();
    buildNewStructure(structure);
    HLRedrawTree();
}
function doprint() {
    var prtContent = document.getElementById("printarea");
    var WinPrint = window.open();
    var prtStr = "\n  <html>\n    <head>\n    <style type=\"text/css\">\n    @media print {\n      .header, .hide { visibility: hidden }\n    }\n    @page\n    {\n\t    size: landscape;\n\t    margin: 0cm;\n      body { margin: 2cm; }\n    }\n    </style>\n    <style type=\"text/css\" media=\"print\">\n    @page\n    {\n\t    size: landscape;\n\t    margin: 0cm;\n      body { margin: 2cm; }\n    }\n    </style>\n    </head>\n    <body>"
        + prtContent.innerHTML + '</body></html>';
    WinPrint.document.write(prtStr);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
}
function dosvgdownload() {
    var prtContent = document.getElementById("printsvgarea").innerHTML;
    var filename = document.getElementById("dosvgname").value;
    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}
function renderAddress() {
    var outHTML = "";
    outHTML = '<div align="left">' +
        '<div style="display:inline-block; width:25px;"></div><div style="display:inline-block;"><table cols="3" rows="1" style="border-collapse: collapse;border-style: solid; border-width:medium;" cellpadding="5">' +
        '  <tr><th style="text-align: left;border-style: solid; border-width:thin;">Plaats van de elektrische installatie</th><th style="text-align: left;border-style: solid; border-width:thin;">Installateur</th><th style="text-align: left;border-style: solid; border-width:thin;">Info</th></tr>' +
        '  <tr>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td>' +
        '  </tr>' +
        '</table></div></div>';
    return outHTML;
}
function renderAddressStacked() {
    var outHTML = "";
    outHTML = 'Plaats van de elektrische installatie' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td></tr>' +
        '</table><br>' +
        'Installateur' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td></tr>' +
        '</table><br>' +
        'Info' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td></tr>' +
        '</table>';
    return outHTML;
}
function getPrintSVGWithoutAddress() {
    var outSVG = new SVGelement();
    outSVG = structure.toSVG(0, "horizontal");
    var scale = 1;
    //var height = outSVG.yup + outSVG.ydown;
    var page = structure.print_table.displaypage;
    var startx = structure.print_table.pages[page].start;
    var width = structure.print_table.pages[page].stop - startx;
    var starty = structure.print_table.getstarty();
    var height = structure.print_table.getstopy() - starty;
    var viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;
    var outstr = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
        'height="' + (height * scale) + '" width="' + (width * scale) + '" viewBox="' + viewbox + '">' +
        flattenSVGfromString(outSVG.data) + '</svg>';
    return (outstr);
}
function renderPrintSVG() {
    document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
        getPrintSVGWithoutAddress() +
        '</div>'; // + '<br><br>' + renderAddress();
}
function changePrintParams() {
    renderPrintSVG();
}
function changeAddressParams() {
    structure.properties.owner = document.getElementById("conf_owner").innerHTML;
    structure.properties.installer = document.getElementById("conf_installer").innerHTML;
    structure.properties.info = document.getElementById("conf_info").innerHTML;
}
function printsvg() {
    var strleft = "";
    var outSVG = new SVGelement();
    outSVG = structure.toSVG(0, "horizontal");
    var scale = 1;
    var startx = 0;
    var height = outSVG.yup + outSVG.ydown;
    var width = outSVG.xleft + outSVG.xright;
    structure.print_table.setHeight(height);
    structure.print_table.setMaxWidth(width);
    strleft += '<br><table border="0"><tr><td style="vertical-align:top;">';
    strleft += structure.print_table.toHTML() + '<br>';
    strleft += '</td><td style="vertical-align:top;padding:5px">';
    strleft += 'Klik op de groene pijl om het schema over meerdere pagina\'s te printen en kies voor elke pagina de start- en stop-positie in het schema (in pixels). '
        + '<br><br>Onderaan kan je bekijken welk deel van het schema op welke pagina belandt en de pagina exporteren en/of omzetten naar PDF. '
        + "Het exporteren of omzetten naar PDF dient voor elke pagina herhaald te worden.";
    strleft += '</td></tr></table>';
    strleft += '<hr>';
    strleft += 'Pagina <select onchange="HLDisplayPage()" id="id_select_page">';
    for (var i = 0; i < structure.print_table.pages.length; i++) {
        if (i == structure.print_table.displaypage) {
            strleft += '<option value=' + (i + 1) + ' selected>' + (i + 1) + '</option>';
        }
        else {
            strleft += '<option value=' + (i + 1) + '>' + (i + 1) + '</option>';
        }
    }
    strleft += '</select>&nbsp;&nbsp;';
    strleft += 'Layout ';
    switch (structure.print_table.getPaperSize()) {
        case "A3":
            strleft += '<select onchange="HLChangePaperSize()" id="id_papersize"><option value="A4">A4</option><option value="A3" selected="selected">A3</option></select>';
            break;
        case "A4":
            strleft += '<select onchange="HLChangePaperSize()" id="id_papersize"><option value="A4" selected="Selected">A4</option><option value="A3">A3</option></select>';
        default:
    }
    strleft += '&nbsp;&nbsp;';
    switch (structure.print_table.getModeVertical()) {
        case "kies":
            strleft += 'Hoogte <select onchange="HLChangeModeVertical()" id="id_modeVerticalSelect"><option value="alles">Alles (standaard)</option><option value="kies" selected="Selected">Kies (expert)</option></select>';
            strleft += '&nbsp;&nbsp;StartY ';
            strleft += '<input size="4" id="id_starty" type="number" min="0" step="1" max="' + structure.print_table.getHeight() + '" onchange="HLChangeStartY()" value="' + structure.print_table.getstarty() + '">';
            strleft += '&nbsp;&nbsp;StopY ';
            strleft += '<input size="4" id="id_stopy" type="number" min="0" step="1" max="' + structure.print_table.getHeight() + '" onchange="HLChangeStopY()" value="' + structure.print_table.getstopy() + '">';
            break;
        case "alles":
        default:
            strleft += 'Hoogte <select onchange="HLChangeModeVertical()" id="id_modeVerticalSelect"><option value="alles">Alles (standaard)</option><option value="kies">Kies (expert)</option></select>';
    }
    strleft += '<br><br>';
    strleft += '<table border="0"><tr><td style="vertical-align:top"><button onclick="dosvgdownload()">Download SVG</button></td><td>&nbsp;</td><td style="vertical-align:top"><input id="dosvgname" size="20" value="eendraadschema_print.svg"></td><td>&nbsp;&nbsp;</td><td>Sla tekening hieronder op als SVG en converteer met een ander programma naar PDF (bvb Inkscape).</td></tr></table><br>';
    strleft += displayButtonPrintToPdf();
    strleft += '<div id="printarea"></div>';
    document.getElementById("configsection").innerHTML = strleft;
    renderPrintSVG();
    hide2col();
}
function exportscreen() {
    var strleft = "";
    strleft += '<table border=0><tr><td width=500 style="vertical-align:top;padding:5px">';
    strleft += 'Bestandsnaam: <span id="settings"><code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span>';
    strleft += '</td><td style="vertical-align:top;padding:5px">';
    strleft += 'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
    strleft += 'Klik vervolgens op "opslaan" en volg de instructies van uw browser. ';
    strleft += 'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>';
    strleft += 'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.<br><br>';
    strleft += '</td></tr>';
    strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
    '</table>';
    //-- plaats input box voor naam van het schema bovenaan --
    strleft += '<br>';
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
    //renderPrintSVG();
}
function openContactForm() {
    var strleft = PROP_Contact_Text;
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
}
function restart_all() {
    var strleft = CONFIGPAGE_LEFT;
    strleft +=
        "\n    Hoofddifferentieel (in mA) <input id=\"differentieel_droog\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"300\"><br><br>\n    Hoofdzekering (in A) <input id=\"hoofdzekering\" type=\"text\" size=\"4\" maxlength=\"4\" value=\"65\"><br><br>\n    Aantal fazen:\n    <select id=\"aantal_fazen_droog\"><option value=\"2\">2p</option><option value=\"3\">3p</option><option value=\"4\">4p (3p+n)</option></select>";
    strleft += CONFIGPAGE_RIGHT;
    strleft += PROP_getCookieText(); //Will only be displayed in the online version
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
    if (browser_ie_detected()) {
        alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}
function hide2col() {
    var leftElement = document.getElementById("left_col_inner");
    var rightElement = document.getElementById("right_col_inner");
    if (typeof (leftElement) != 'undefined' && leftElement != null) {
        leftElement.innerHTML = "";
    }
    ;
    if (typeof (rightElement) != 'undefined' && rightElement != null) {
        rightElement.innerHTML = "";
    }
    ;
    document.getElementById("canvas_2col").innerHTML = "";
}
function show2col() {
    if (document.getElementById("canvas_2col").innerHTML == "") {
        document.getElementById("canvas_2col").innerHTML = '<div id="left_col"><div id="left_col_inner"></div></div><div id="right_col"><div id="right_col_inner"></div></div>';
    }
}
function import_to_structure(mystring, redraw) {
    if (redraw === void 0) { redraw = true; }
    var text = "";
    var version;
    //If first 3 bytes read "EDS", it is an entropy coded file
    //The first 3 bytes are EDS, the next 3 bytes indicate the version (currently only 001 implemented)
    //the next 4 bytes are decimal zeroes "0000"
    //thereafter is a base64 encoded data-structure
    if ((mystring.charCodeAt(0) == 69) && (mystring.charCodeAt(1) == 68) && (mystring.charCodeAt(2) == 83)) { //recognize as EDS
        // Determine versioning
        // < 16/12/2023: Version 1
        //   16/12/2023: Version 2 (Vrije tekst moet 20 pixels groter gemaakt worden om nog mooi in het schema te passen)
        version = Number(mystring.substring(3, 6));
        if (isNaN(version))
            version = 1;
        mystring = atob(mystring.substring(10, mystring.length));
        var buffer = new Uint8Array(mystring.length);
        for (var i = 0; i < mystring.length; i++) {
            buffer[i - 0] = mystring.charCodeAt(i);
        }
        try { //See if the text decoder works, if not, we will do it manually (slower)
            var decoder = new TextDecoder("utf-8");
            text = decoder.decode(pako.inflate(buffer));
        }
        catch (error) { //Continue without the text decoder (old browsers)
            var inflated = pako.inflate(buffer);
            text = "";
            for (i = 0; i < inflated.length; i++) {
                text += String.fromCharCode(inflated[i]);
            }
        }
    }
    //If first 3 bytes do not read "EDS", the file is in the old non encoded format and can be used as is
    else {
        text = mystring;
    }
    var mystructure = new Hierarchical_List();
    structure = new Hierarchical_List();
    var obj = JSON.parse(text);
    Object.assign(mystructure, obj);
    if (typeof mystructure.properties.filename != "undefined") {
        structure.properties.filename = mystructure.properties.filename;
    }
    if (typeof mystructure.properties.owner != "undefined") {
        structure.properties.owner = mystructure.properties.owner;
    }
    if (typeof mystructure.properties.installer != "undefined") {
        structure.properties.installer = mystructure.properties.installer;
    }
    if (typeof mystructure.properties.info != "undefined") {
        structure.properties.info = mystructure.properties.info;
    }
    if (typeof mystructure.print_table != "undefined") {
        structure.print_table.setHeight(mystructure.print_table.height);
        structure.print_table.setMaxWidth(mystructure.print_table.maxwidth);
        structure.print_table.setPaperSize(mystructure.print_table.papersize);
        structure.print_table.setModeVertical(mystructure.print_table.modevertical);
        structure.print_table.setstarty(mystructure.print_table.starty);
        structure.print_table.setstopy(mystructure.print_table.stopy);
        for (var i = 0; i < mystructure.print_table.pages.length; i++) {
            if (i != 0)
                this.structure.print_table.addPage();
            this.structure.print_table.pages[i].height = mystructure.print_table.pages[i].height;
            this.structure.print_table.pages[i].start = mystructure.print_table.pages[i].start;
            this.structure.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
        }
    }
    for (var i = 0; i < mystructure.length; i++) {
        structure.addItem(mystructure.data[i].keys[0][2]);
        structure.data[i].parent = mystructure.data[i].parent;
        structure.active[i] = mystructure.active[i];
        structure.id[i] = mystructure.id[i];
        for (var j = 0; j < mystructure.data[i].keys.length; j++) {
            structure.data[i].keys[j] = mystructure.data[i].keys[j];
        }
        structure.data[i].id = mystructure.data[i].id;
        structure.data[i].indent = mystructure.data[i].indent;
        structure.data[i].collapsed = mystructure.data[i].collapsed;
    }
    // Make some corrections if it is an old version
    if (version < 2) {
        for (var i = 0; i < mystructure.length; i++) {
            // Breedte van Vrije tekst velden zonder kader met 30 verhogen sinds 16/12/2023
            if ((structure.data[i].keys[0][2] === "Vrije tekst") && (structure.data[i].keys[16][2] != "verbruiker")) {
                if (Number(structure.data[i].keys[22][2]) > 0)
                    structure.data[i].keys[22][2] = String(Number(structure.data[i].keys[22][2]) + 30);
                else
                    structure.data[i].keys[18][2] = "automatisch";
                if (structure.data[i].keys[16][2] != "zonder kader")
                    structure.data[i].keys[16][2] = "verbruiker";
            }
        }
    }
    //As we re-read the structure and it might be shorter then it once was (due to deletions) but we might still have the old high ID's, always take over the curid from the file
    structure.curid = mystructure.curid;
    //Sort the entire new structure
    structure.reSort();
    //Draw the structure
    if (redraw == true) {
        HLRedrawTree();
    }
}
function load_example(nr) {
    switch (nr) {
        case 0:
            import_to_structure(EXAMPLE0);
            break;
        case 1:
            import_to_structure(EXAMPLE1);
            break;
    }
}
var importjson = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var text = "";
    reader.onload = function () {
        import_to_structure(reader.result.toString());
    };
    reader.readAsText(input.files[0]);
    //Scroll to top left for the SVG, this can only be done at the end because "right col" has to actually be visible
    document.getElementById("right_col").scrollTop = 0;
    document.getElementById("right_col").scrollLeft = 0;
};
function importclicked() {
    document.getElementById('importfile').click();
    document.getElementById('importfile').value = "";
}
function download_by_blob(text, filename, mimeType) {
    var element = document.createElement('a');
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([text], {
            type: mimeType
        }), filename);
    }
    else if (URL && 'download' in element) {
        var uriContent = URL.createObjectURL(new Blob([text], { type: mimeType }));
        element.setAttribute('href', uriContent);
        //element.setAttribute('href', mimeType + ',' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    else {
        this.location.go("".concat(mimeType, ",").concat(encodeURIComponent(text)));
    }
}
function download(type) {
    var filename;
    var mimeType;
    switch (type) {
        case "html": {
            filename = "eendraadschema.html";
            mimeType = 'data:image/svg+xml;charset=utf-8';
            break;
        }
        case "svg": {
            filename = "eendraadschema.svg";
            mimeType = 'data:text/html;charset=utf-8';
            break;
        }
    }
    var text = structure.toSVG(0, "horizontal").data;
    //Experimental, flatten everything
    if (document.getElementById("noGroup").checked == true) {
        text = flattenSVGfromString(text);
    }
    download_by_blob(text, filename, mimeType); //was text/plain
}
function read_settings() {
    //CONF_aantal_droge_kringen = parseInt((document.getElementById("aantal_droge_kringen") as HTMLInputElement).value);
    //CONF_aantal_natte_kringen = parseInt((document.getElementById("aantal_natte_kringen") as HTMLInputElement).value);
    CONF_aantal_fazen_droog = parseInt(document.getElementById("aantal_fazen_droog").value);
    CONF_aantal_fazen_nat = CONF_aantal_fazen_droog;
    CONF_hoofdzekering = parseInt(document.getElementById("hoofdzekering").value);
    CONF_differentieel_droog = parseInt(document.getElementById("differentieel_droog").value);
    //CONF_differentieel_nat = parseInt((document.getElementById("differentieel_nat") as HTMLInputElement).value);
    reset_all();
}
var CONF_aantal_droge_kringen = 7;
var CONF_aantal_natte_kringen = 3;
var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;
var CONF_upload_OK = "ask"; //can be "ask", "yes", "no"; //before uploading, we ask
var structure;
import_to_structure(EXAMPLE_DEFAULT, false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there
restart_all();
