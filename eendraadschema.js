//=========================================================================//
//
//  Eendraadschema tekenen (https://eendraadschema.goethals-jacobs.be/)
//  Copyright (C) 2019-2023 Ivan Goethals
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
//=========================================================================//

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function deepClone(obj) {
    var _out = new obj.constructor;
    var getType = function (n) {
        return Object.prototype.toString.call(n).slice(8, -1);
    };
    for (var _key in obj) {
        if (obj.hasOwnProperty(_key)) {
            _out[_key] = getType(obj[_key]) === 'Object' || getType(obj[_key]) === 'Array' ? deepClone(obj[_key]) : obj[_key];
        }
    }
    return _out;
}
// Function for length of a string in 8 bit bytes
var byteSize = function (str) { return new Blob([str]).size; };
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
    var tryoutdiv;
    if (document.getElementById("configsection").style.display === 'block') {
        tryoutdiv = document.getElementById("configsection");
    }
    else {
        tryoutdiv = document.getElementById("right_col_inner");
    }
    tryoutdiv.appendChild(div);
    var width = div.children[0].children[0].getBBox().width;
    tryoutdiv.removeChild(div);
    return (Math.ceil(width));
}
function flattenSVG(SVGstruct, shiftx, shifty, node, overflowright) {
    if (overflowright === void 0) { overflowright = 0; }
    if (node == 0)
        structure.print_table.pagemarkers.clear();
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
            if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
                str = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" width="' + (parseInt(outstruct.attributes.getNamedItem("width").nodeValue) + overflowright) +
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
    structure.print_table.pagemarkers.addMarker(node, shiftx);
    return str;
}
function flattenSVGfromString(xmlstr, overflowright) {
    if (overflowright === void 0) { overflowright = 0; }
    var str = "";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
    str = flattenSVG(xmlDoc.childNodes[0], 0, 0, 0, overflowright);
    return str;
}
function htmlspecialchars(my_input) {
    var returnstr;
    if (typeof (my_input) == 'undefined')
        returnstr = "";
    else
        returnstr = my_input.toString();
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return returnstr.replace(/[&<>"']/g, function (m) { return map[m]; });
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
var Session = /** @class */ (function () {
    function Session() {
        this.sessionKey = 'SessionJS';
        this.newUser = false;
        var storedSessionId = localStorage.getItem(this.sessionKey);
        if (storedSessionId) {
            this.sessionId = storedSessionId;
        }
        else {
            this.sessionId = this.generateRandomBase64String(64);
            localStorage.setItem(this.sessionKey, this.sessionId);
            this.newUser = true;
        }
    }
    Session.prototype.generateRandomBase64String = function (length) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var result = '';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters[randomIndex];
        }
        return result;
    };
    Session.prototype.getSessionId = function () {
        return this.sessionId;
    };
    Session.prototype.isNewUser = function () {
        return this.newUser;
    };
    return Session;
}());
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
/**
 * A class to handle a list of potential page breaks or markers in the form {depth,xpos} with depth how nested
 * they are (lower depth is better to include a page break) and xpos the location in pixels in the SVG where
 * the break could be added
 */
var MarkerList = /** @class */ (function () {
    function MarkerList() {
        this.markers = [];
    }
    /**
     * Clear the list of markers
     */
    MarkerList.prototype.clear = function () {
        this.markers = [];
    };
    /**
     * Add a marker to the markerlist.
     * If the same marker already exists, no new one will be added.
     * @param depth - The depth of the marker, or how nested it is (lower depth is better for page breaks).
     * @param xpos - The x-coordinate position of the marker.
     */
    MarkerList.prototype.addMarker = function (depth, xpos) {
        // Check if the marker already exists
        var exists = this.markers.some(function (marker) { return marker.depth === depth && marker.xpos === xpos; });
        if (!exists) {
            this.markers.push({ depth: depth, xpos: xpos });
        }
    };
    /**
     * Sorts the markers by their x-coordinate position in ascending order.
     */
    MarkerList.prototype.sort = function () {
        this.markers.sort(function (a, b) { return a.xpos - b.xpos; });
    };
    /**
     * Looks for the marker in the half-open internal (minx, maxx] with the lowest possible depth.
     * If multiple markers exist with the same depth, the one with the highest xpos is returned.
     * If no suitable marker is found, a dummy {depth=null, xpos=maxx} is returned.
     * @param minx - Minimal x for any markers that will be considered.
     * @param maxx - Maximal x for any markers that will be considered.
     * @returns The marker with the lowest depth (and highest xpos if multiple exist) or a dummy marker if none are found.
     */
    MarkerList.prototype.findMinDepth = function (minx, maxx) {
        // Filter markers within the range
        var filteredMarkers = this.markers.filter(function (marker) { return marker.xpos > minx && marker.xpos <= maxx; });
        if (filteredMarkers.length === 0) {
            return { depth: null, xpos: maxx }; // No markers in the specified range so we just take the maximum
        }
        // Find the marker with the lowest depth, if multiple exist with the same depth, take the one with the highest xpos
        return filteredMarkers.reduce(function (minDepthMarker, marker) {
            if (marker.depth < minDepthMarker.depth ||
                (marker.depth === minDepthMarker.depth && marker.xpos > minDepthMarker.xpos)) {
                return marker;
            }
            return minDepthMarker;
        }, filteredMarkers[0]);
    };
    return MarkerList;
}());
/**
 * Store information on what part of the SVG lands on one specific page
 * The height is the final height in number of pixels
 * The start and stop are the x-locations in pixels of the part of the total SVG that needs to land on this particular page
 */
var Page_Info = /** @class */ (function () {
    function Page_Info() {
        this.height = 0;
        this.start = 0;
        this.stop = 0;
    }
    return Page_Info;
}());
/**
 * Stores all information about pagination and how pages will be printed.
 * Can perform automatic pagination or ask the user to paginate.
 *
 * We don't use private variables in this class as we want to serialize it (JSON)
 */
var Print_Table = /** @class */ (function () {
    /**
     * Initialize list of pages (foresee at least 1 page) and pagemarkers
     */
    function Print_Table() {
        this.height = 0; //How high is the SVG that will be printed in pixels
        this.maxwidth = 0; //What is the width of the SVG that will be printed in pixels and therefore the maximum printing width
        this.displaypage = 0;
        this.enableAutopage = true; //Flag to indicate if automatic pagination is used or not
        this.pages = new Array();
        this.pages.push(new Page_Info());
        this.pagemarkers = new MarkerList;
    }
    /**
     * Set papersize to either "A4" or "A3"
     * @param papersize - A string, if it is neither "A4" or "A3", the papersize will default to "A4".
     */
    Print_Table.prototype.setPaperSize = function (papersize) {
        this.papersize = (papersize === "A3" ? "A3" : "A4");
    };
    /**
     * Get papersize.  If papersize was not yet defined, it is forced to "A4"
     * @returns The papersize, either "A3" or "A4"
     */
    Print_Table.prototype.getPaperSize = function () {
        if (!this.papersize)
            this.papersize = "A4";
        return (this.papersize);
    };
    /**
     * Set displayheight of all pages to height
     * @param height - Height in pixels
     */
    Print_Table.prototype.setHeight = function (height) {
        this.height = height;
        this.pages.forEach(function (page) { page.height = height; });
    };
    /**
     * Get displayheight
     * @returns Height in pixels
     */
    Print_Table.prototype.getHeight = function () {
        return (this.height);
    };
    /**
     * Set modevertical to either "alles" (meaning we show the full height of the page) or "kies" meaning the user can choose
     * @param more - Either "alles" or "kies"
     */
    Print_Table.prototype.setModeVertical = function (mode) {
        this.modevertical = (mode === "kies" ? "kies" : "alles");
        this.forceCorrectFigures();
    };
    /**
     * Get modevertical
     * @returns either "alles" or "kies"
     */
    Print_Table.prototype.getModeVertical = function () {
        this.forceCorrectFigures();
        return (this.modevertical);
    };
    /**
     * Checks that all start and stop position of pages are valid
     * For instance, the startx position should never be higher than the stopx.
     * In addition, the SVG always goes from left to right over the pages so the startx
     * of a new page cannot be lower than the stopx of the page before.
     */
    Print_Table.prototype.forceCorrectFigures = function () {
        var _this = this;
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
        this.pages[this.pages.length - 1].stop = this.maxwidth;
        this.pages.forEach(function (page, index) {
            if (page.stop < 0)
                page.stop = 0;
            if (page.start < 0)
                page.start = 0;
            if (index > 0) {
                page.start = _this.pages[index - 1].stop;
            }
            if (page.stop > _this.maxwidth) {
                _this.pages[_this.pages.length - 1].stop = _this.maxwidth;
            }
            if (page.start > page.stop) {
                page.start = page.stop;
            }
        });
    };
    /**
     * Sets the maximum width of the SVG to be displayed.
     * As a general rule this equals the width of the SVG itself in pixels
     * @param maxwidth
     */
    Print_Table.prototype.setMaxWidth = function (maxwidth) {
        this.maxwidth = maxwidth;
        this.forceCorrectFigures();
    };
    /**
     * Gets the maximum width that can be displayed or printed
     * @returns maxwidth, as a general rule this equals the width of the SVG itsef in pixels
     */
    Print_Table.prototype.getMaxWidth = function () {
        return (this.maxwidth);
    };
    /**
     * Returns the starty position of the page that will be displayed or printed
     * @returns starty
     */
    Print_Table.prototype.getstarty = function () {
        this.forceCorrectFigures();
        return (this.starty);
    };
    /**
     * Returns the stopy position of the page that will be displayed or printed
     * @returns stopy
     */
    Print_Table.prototype.getstopy = function () {
        this.forceCorrectFigures();
        return (this.stopy);
    };
    /**
     * Sets the starty position of the page that will be displayed or printed
     * @param starty
     */
    Print_Table.prototype.setstarty = function (starty) {
        this.starty = starty;
        this.forceCorrectFigures;
    };
    /**
     * Sets the stopy position of the page that will be displayed or printed
     * @param starty
     */
    Print_Table.prototype.setstopy = function (stopy) {
        this.stopy = stopy;
        this.forceCorrectFigures;
    };
    /**
     * Sets the stopx position of one specific page to a desired value.
     * The function calls forceCorrectFigures() afterwards to ensure the natural flow of pages (left to right)
     * is respected.  Note that stopx in the underlying Page_Info object is called stop and we cannot change that
     * anymore as the classes are used for serialization.
     * @param page - page number for which we want to set the stopx (starts counting at zero)
     * @param stop - stopx position to set
     */
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
    /**
     * Automatically create pages based on pagemarkers
     */
    Print_Table.prototype.autopage = function () {
        /*  Autopage uses some ratio's determined by the useful SVG drawing size on the PDF.  This depends on the margins configured in print.js
            At present all of this is still hard-coded.  Should become a function of print.js
          
            A4

            Height: 210-20-30-5-5  --> 150
            Width: 297-20 --> 277
            Ratio: 1.8467
        
            A3
        
            Height: 297-20-30-5-5 --> 237
            Width: 420-20 --> 400
            Ratio: 1.6878
        */
        var _this = this;
        //First set all pages to maximum to avoid that we bump into boundaries
        this.pages.forEach(function (page, index) {
            page.stop = _this.maxwidth;
        });
        var height = this.getstopy() - this.getstarty();
        var maxsvgwidth = height * (this.getPaperSize() == "A3" ? 1.6878 : 1.8467);
        var minsvgwidth = 3 / 4 * maxsvgwidth;
        var page = 0;
        var pos = 0;
        while ((this.maxwidth - pos) > maxsvgwidth) { // The undivided part still does not fit on a page
            pos = this.pagemarkers.findMinDepth(pos + minsvgwidth, pos + maxsvgwidth).xpos;
            while (this.pages.length < page + 2)
                this.addPage();
            this.setStop(page, pos);
            page++;
        }
        // The last page stops at the maximum size of the SVG
        this.setStop(page, this.maxwidth);
        // Delete unneeded pages at the end
        for (var i = this.pages.length - 1; i > page; i--) {
            this.deletePage(i);
        }
    };
    /**
     * Add a page
     */
    Print_Table.prototype.addPage = function () {
        var page_info;
        page_info = new Page_Info();
        page_info.height = this.height;
        page_info.start = this.pages[this.pages.length - 1].stop;
        page_info.stop = this.maxwidth;
        this.pages.push(page_info);
    };
    /**
     * Remove a page
     * @param page - number of the page to be removed, starting at 0
     */
    Print_Table.prototype.deletePage = function (page) {
        if (page == 0) {
            this.pages[1].start = 0;
        }
        else {
            this.pages[page - 1].stop = this.pages[page].stop;
        }
        this.pages.splice(page, 1);
    };
    /**
     * Display a Select box to choose papersize (A3 or A4)
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLselectPaperSize = function (div, redrawCallBack) {
        var _this = this;
        var select = document.createElement('select');
        var optionA4 = document.createElement('option');
        optionA4.value = 'A4';
        optionA4.textContent = 'A4';
        var optionA3 = document.createElement('option');
        optionA3.value = 'A3';
        optionA3.textContent = 'A3';
        if (this.papersize == "A3")
            optionA3.selected = true;
        else
            optionA4.selected = true;
        select.appendChild(optionA4);
        select.appendChild(optionA3);
        select.onchange = function (event) {
            _this.setPaperSize(event.target.value);
            redrawCallBack();
        };
        div.appendChild(select);
    };
    /**
     * Display a Select box to choose dpi (300 or 600)
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLselectdpi = function (div, redrawCallBack) {
        var select = document.createElement('select');
        var option300 = document.createElement('option');
        option300.value = '300';
        option300.textContent = '300dpi (standaard)';
        var option600 = document.createElement('option');
        option600.value = '600';
        option600.textContent = '600dpi (beter maar trager)';
        if (typeof (structure.properties.dpi) == 'undefined')
            structure.properties.dpi = 300;
        if (structure.properties.dpi == 600)
            option600.selected = true;
        else
            option300.selected = true;
        select.appendChild(option300);
        select.appendChild(option600);
        select.onchange = function (event) {
            structure.properties.dpi = parseInt(event.target.value, 0);
        };
        div.appendChild(select);
    };
    /**
     * Display a Check box to decide if one wants to use autopage or not.
     * If autopage is enabled, we also recalculate the page boundaries
     * The checkbox is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLcheckAutopage = function (div, redrawCallBack) {
        var _this = this;
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autopage';
        checkbox.name = 'autopage';
        var label = document.createElement('label');
        label.htmlFor = 'autopage';
        label.textContent = "Handmatig over pagina's verdelen";
        if (this.enableAutopage) {
            this.setModeVertical("alles");
            this.autopage();
        }
        else {
            checkbox.checked = true;
        }
        div.append(checkbox);
        div.append(label);
        checkbox.onchange = function (event) {
            _this.enableAutopage = !event.target.checked;
            redrawCallBack();
        };
    };
    /**
     * Display a select box to choose the vertical mode.
     * If vertical mode is "kies", we also display input boxes to choose the starty and stopy positions.
     * The checkbox is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLchooseVerticals = function (div, redrawCallBack) {
        var _this = this;
        var outstr = "";
        switch (this.modevertical) {
            case "kies":
                outstr += 'Hoogte <select id="select_modeVertical"><option value="alles">Alles (standaard)</option><option value="kies" selected="Selected">Kies (expert)</option></select>';
                outstr += '&nbsp;&nbsp;StartY ';
                outstr += '<input size="4" id="input_starty" type="number" min="0" step="1" max="' + this.getHeight() + '" value="' + this.getstarty() + '">';
                outstr += '&nbsp;&nbsp;StopY ';
                outstr += '<input size="4" id="input_stopy" type="number" min="0" step="1" max="' + this.getHeight() + '" value="' + this.getstopy() + '">';
                break;
            case "alles":
            default:
                outstr += 'Hoogte <select id="select_modeVertical"><option value="alles">Alles (standaard)</option><option value="kies">Kies (expert)</option></select>';
        }
        div.insertAdjacentHTML('beforeend', outstr);
        document.getElementById('select_modeVertical').onchange = function (event) {
            _this.setModeVertical(event.target.value);
            redrawCallBack();
        };
        if (this.modevertical == "kies") {
            document.getElementById('input_starty').onchange = function (event) {
                var starty = parseInt(event.target.value);
                if (isNaN(starty))
                    starty = 0;
                _this.setstarty(starty);
                _this.forceCorrectFigures();
                redrawCallBack();
            };
            document.getElementById('input_stopy').onchange = function (event) {
                var stopy = parseInt(event.target.value);
                if (isNaN(stopy))
                    stopy = _this.getHeight();
                ;
                _this.setstopy(stopy);
                _this.forceCorrectFigures();
                redrawCallBack();
            };
        }
    };
    /**
     * Display a button to force auto-pagination even when in manual mode
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLsuggestXposButton = function (div, redrawCallBack) {
        var _this = this;
        var button = document.createElement('button');
        button.innerText = 'Suggereer X-posities';
        div.append(button);
        button.onclick = function () {
            _this.autopage();
            redrawCallBack();
        };
    };
    /**
     * Display a table where the user can choose start and stop positions for the x-coordinates in the SVG of each individual page
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */
    Print_Table.prototype.insertHTMLposxTable = function (div, redrawCallBack) {
        var _this = this;
        if (structure.print_table.enableAutopage)
            this.autopage();
        var outstr = "";
        var pagenum;
        outstr += '<table border="1" cellpadding="3">';
        outstr += '<tr><th align="center">Pagina</th><th align="center">Startx</th><th align"center">Stopx</th><th align"left">Acties</th></tr>';
        for (pagenum = 0; pagenum < this.pages.length; pagenum++) {
            outstr += '<tr><td align=center>' + (pagenum + 1) + '</td><td align=center>' + this.pages[pagenum].start + '</td><td align=center>';
            if (pagenum != this.pages.length - 1) {
                outstr += '<input size="5" id="input_stop_' + pagenum + '" type="number" min="' + this.pages[pagenum].start
                    + '" step="1" max="' + this.maxwidth + '" value="' + this.pages[pagenum].stop + '">';
            }
            else {
                outstr += this.pages[pagenum].stop.toString();
            }
            outstr += '</td><td align=left>';
            if (pagenum == this.pages.length - 1) {
                outstr += '<button style="background-color:green;" id="Btn_Addpage">&#9660;</button>';
            }
            if (this.pages.length > 1) {
                outstr += '<button style="background-color:red;" id="Btn_Deletepage_' + pagenum + '">&#9851;</button>';
            }
            outstr += '</td></tr>';
        }
        outstr += "</table>";
        div.insertAdjacentHTML('beforeend', outstr);
        document.getElementById('Btn_Addpage').onclick = function () {
            _this.addPage();
            redrawCallBack();
        };
        document.querySelectorAll('button[id^="Btn_Deletepage_"]').forEach(function (button) {
            var match = button.id.match(/Btn_Deletepage_(\d+)/);
            if (match) {
                var page_1 = parseInt(match[1]);
                button.onclick = function () {
                    _this.deletePage(page_1);
                    redrawCallBack();
                };
            }
        });
        document.querySelectorAll('input[id^="input_stop_"]').forEach(function (input) {
            input.addEventListener('change', function (event) {
                var match = event.target.id.match(/input_stop_(\d+)/);
                if (match) {
                    var page = parseInt(match[1]);
                    var stop_1 = parseInt(event.target.value);
                    _this.setStop(page, stop_1);
                    redrawCallBack();
                }
            });
        });
    };
    return Print_Table;
}());
function HLDisplayPage() {
    structure.print_table.displaypage = parseInt(document.getElementById("id_select_page").value) - 1;
    printsvg();
}
function dosvgdownload() {
    var prtContent = document.getElementById("printsvgarea").innerHTML;
    var filename = document.getElementById("dosvgname").value;
    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}
function getPrintSVGWithoutAddress(outSVG, page) {
    if (page === void 0) { page = structure.print_table.displaypage; }
    var scale = 1;
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
function printsvg() {
    function generatePdf() {
        if (typeof (structure.properties.dpi) == 'undefined')
            structure.properties.dpi = 300;
        var svg = flattenSVGfromString(structure.toSVG(0, "horizontal").data);
        var pages = Array.from({ length: structure.print_table.pages.length }, function (_, i) { return i + 1; });
        printPDF(svg, structure.print_table, structure.properties, pages, document.getElementById("dopdfname").value, //filename
        document.getElementById("progress_pdf") //HTML element where callback status can be given
        );
    }
    function renderPrintSVG(outSVG) {
        document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
            getPrintSVGWithoutAddress(outSVG) +
            '</div>';
    }
    // First we generate an SVG image. We do this first because we need the size
    // We will display it at the end of this function    
    var outSVG = new SVGelement();
    outSVG = structure.toSVG(0, "horizontal");
    var height = outSVG.yup + outSVG.ydown;
    var width = outSVG.xleft + outSVG.xright;
    structure.print_table.setHeight(height);
    structure.print_table.setMaxWidth(width + 10);
    // Then we display all the print options
    var outstr = "";
    var strleft = "";
    document.getElementById("configsection").innerHTML
        = '<div>'
            + '    <button id="button_pdfdownload">Genereer PDF</button>' // Generate PDF button comes here
            + '    <span id="select_papersize"></span>' // Selector to choose "A3" and "A4" comes here
            + '    <span id="select_dpi"></span>' // Selector for dpi 300 or 600 comes here
            + '    <input id="dopdfname" size="20" value="eendraadschema_print.pdf">&nbsp;' // Input box for filename of pdf document
            + '    <span id="progress_pdf"></span>' // Area where status of pdf generation can be displayed
            + '</div>';
    document.getElementById('button_pdfdownload').onclick = generatePdf;
    structure.print_table.insertHTMLselectPaperSize(document.getElementById('select_papersize'), printsvg);
    structure.print_table.insertHTMLselectdpi(document.getElementById('select_dpi'), printsvg);
    outstr
        = '<br>'
            + '<div>'
            + '    <span style="margin-right: 2em" id="check_autopage"></span>' // Checkbox to choose if we want to auto paginate or not comes here
            + '    <span style="margin-right: 2em" id="id_verticals"></span>' // An optional area to choose what part of the y-space of the image is shown
            + '    <span id="id_suggest_xpos_button"></span>' // A button to force auto pagination comes here
            + '</div>';
    document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);
    structure.print_table.insertHTMLcheckAutopage(document.getElementById('check_autopage'), printsvg);
    if (!structure.print_table.enableAutopage) {
        structure.print_table.insertHTMLchooseVerticals(document.getElementById('id_verticals'), printsvg);
        structure.print_table.insertHTMLsuggestXposButton(document.getElementById('id_suggest_xpos_button'), printsvg);
    }
    if (!structure.print_table.enableAutopage) {
        outstr
            = '<br>'
                + '<table border="0">'
                + '    <tr>'
                + '        <td style="vertical-align:top;">'
                + '            <div id="id_print_table"></div>' // Table with all startx and stopx comes here
                + '        </td>'
                + '        <td style="vertical-align:top;padding:5px">'
                + '            <div>Klik op de groene pijl om het schema over meerdere pagina\'s te printen en kies voor elke pagina de start- en stop-positie in het schema (in pixels).</div>'
                + '            <div>Onderaan kan je bekijken welk deel van het schema op welke pagina belandt.</div>'
                + '        </td>'
                + '    </tr>'
                + '</table>'
                + '<br>';
        document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);
        structure.print_table.insertHTMLposxTable(document.getElementById('id_print_table'), printsvg);
    }
    strleft += '<hr>';
    strleft += '<b>Printvoorbeeld: </b>Pagina <select onchange="HLDisplayPage()" id="id_select_page">';
    for (var i = 0; i < structure.print_table.pages.length; i++) {
        if (i == structure.print_table.displaypage) {
            strleft += '<option value=' + (i + 1) + ' selected>' + (i + 1) + '</option>';
        }
        else {
            strleft += '<option value=' + (i + 1) + '>' + (i + 1) + '</option>';
        }
    }
    strleft += '</select>&nbsp;&nbsp;(Enkel tekening, kies "Genereer PDF" om ook de tekstuele gegevens te zien)';
    strleft += '<br><br>';
    strleft += '<table border="0"><tr><td style="vertical-align:top"><button onclick="dosvgdownload()">Zichtbare pagina als SVG opslaan</button></td><td>&nbsp;</td><td style="vertical-align:top"><input id="dosvgname" size="20" value="eendraadschema_print.svg"></td><td>&nbsp;&nbsp;</td><td>Sla tekening hieronder op als SVG en converteer met een ander programma naar PDF (bvb Inkscape).</td></tr></table><br>';
    strleft += displayButtonPrintToPdf(); // This is only for the online version
    strleft += '<div id="printarea"></div>';
    document.getElementById("configsection").insertAdjacentHTML('beforeend', strleft);
    // Finally we show the actual SVG
    renderPrintSVG(outSVG);
    hide2col();
}
var importExportUsingFileAPI = /** @class */ (function () {
    function importExportUsingFileAPI() {
        this.clear();
        //this.updateButtons();
    }
    importExportUsingFileAPI.prototype.clear = function () {
        this.saveNeeded = false;
        this.fileHandle = null;
        this.filename = null;
    };
    importExportUsingFileAPI.prototype.updateLastSaved = function () {
        var currentdate = new Date();
        this.lastsaved = currentdate.getHours().toString().padStart(2, '0') + ":" +
            currentdate.getMinutes().toString().padStart(2, '0') + ":" +
            currentdate.getSeconds().toString().padStart(2, '0');
        ;
        //If there is an object on the screen that needs updating, do it
        if (document.getElementById('exportscreen')) {
            exportscreen(); // Update the export screen if we are actually on the export screen
        }
    };
    importExportUsingFileAPI.prototype.setSaveNeeded = function (input) {
        var lastSaveNeeded = this.saveNeeded;
        this.saveNeeded = input;
        //if (input !== lastSaveNeeded) this.updateButtons();
    };
    importExportUsingFileAPI.prototype.readFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, file, contents;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, window.showOpenFilePicker({
                                types: [{
                                        description: 'Eendraadschema (.eds)',
                                        accept: { 'application/eds': ['.eds'] },
                                    }],
                            })];
                    case 1:
                        _a.fileHandle = (_b.sent())[0];
                        return [4 /*yield*/, this.fileHandle.getFile()];
                    case 2:
                        file = _b.sent();
                        return [4 /*yield*/, file.text()];
                    case 3:
                        contents = _b.sent();
                        this.filename = file.name;
                        structure.properties.filename = file.name;
                        this.setSaveNeeded(false);
                        this.updateLastSaved(); // Needed because import_to_structure whipes everything   
                        return [2 /*return*/, contents];
                }
            });
        });
    };
    importExportUsingFileAPI.prototype.saveAs = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = {
                            suggestedName: structure.properties.filename,
                            types: [{
                                    description: 'Eendraadschema (.eds)',
                                    accept: { 'application/eds': ['.eds'] },
                                }],
                            startIn: 'documents' // Suggests the Documents folder
                        };
                        _a = this;
                        return [4 /*yield*/, window.showSaveFilePicker(options)];
                    case 1:
                        _a.fileHandle = _b.sent();
                        return [4 /*yield*/, this.saveFile(content, this.fileHandle)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    importExportUsingFileAPI.prototype.saveFile = function (content, handle) {
        return __awaiter(this, void 0, void 0, function () {
            var writable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handle.createWritable()];
                    case 1:
                        writable = _a.sent();
                        return [4 /*yield*/, writable.write(content)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, writable.close()];
                    case 3:
                        _a.sent();
                        this.filename = handle.name;
                        structure.properties.filename = handle.name;
                        this.setSaveNeeded(false);
                        this.updateLastSaved();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    importExportUsingFileAPI.prototype.save = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveFile(content, this.fileHandle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return importExportUsingFileAPI;
}());
var fileAPIobj = new importExportUsingFileAPI();
/* FUNCTION importjson

   This is the callback function for the legacy filepicker if the file API is not available in the browser */
var importjson = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var text = "";
    reader.onload = function () {
        import_to_structure(reader.result.toString());
    };
    reader.readAsText(input.files[0]);
};
/* FUNCTION importclicked()

   Gets called when a user wants to open a file.  Checks if the fileAPI is available in the browser.
   If so, the fileAPI is used.  If not, the legacy function importjson is called */
function importclicked() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.showOpenFilePicker) return [3 /*break*/, 2];
                    return [4 /*yield*/, fileAPIobj.readFile()];
                case 1:
                    data = _a.sent();
                    import_to_structure(data);
                    return [3 /*break*/, 3];
                case 2:
                    document.getElementById('importfile').click();
                    document.getElementById('importfile').value = "";
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* FUNCTION upgrade_version

   Takes a structure, usually imported from json into javascript object, and performs a version upgrade if needed.
   as mystructure is passed by reference, all upgrades are done in-line.

*/
function upgrade_version(mystructure, version) {
    // At a certain moment (2023-01-11 to 2023-01-13) there was a bug in the systen so that files where accidentally outputed with props, without keys, but with version 1.
    // We correct for this below. If there are props and not keys but it still reads version 1, it should be interpreted as version 3.
    if ((version == 1) && (mystructure.length > 0) && (typeof (mystructure.data[0].keys) == 'undefined') && (typeof (mystructure.data[0].props) != 'undefined')) {
        version = 3;
    }
    /* Indien versie 1 moeten we vrije tekst elementen die niet leeg zijn 30 pixels breder maken.
    * Merk ook op dat versie 1 nog een key based systeem had met keys[0][2] het type
    * en keys[16][2] die aangeeft of vrije tekst al dan niet een kader bevat (verbruiker) of niet (zonder kader)
    */
    if (version < 2) {
        for (var i = 0; i < mystructure.length; i++) {
            // Breedte van Vrije tekst velden zonder kader met 30 verhogen sinds 16/12/2023
            if ((mystructure.data[i].keys[0][2] === "Vrije tekst") && (mystructure.data[i].keys[16][2] != "verbruiker")) {
                if (Number(mystructure.data[i].keys[22][2]) > 0)
                    mystructure.data[i].keys[22][2] = String(Number(mystructure.data[i].keys[22][2]) + 30);
                else
                    mystructure.data[i].keys[18][2] = "automatisch";
                if (mystructure.data[i].keys[16][2] != "zonder kader")
                    mystructure.data[i].keys[16][2] = "verbruiker";
            }
        }
    }
    // In versie 2 heetten Contactdozen altijd nog Stopcontacten
    if (version < 3) {
        for (var i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].keys[0][2] === "Stopcontact")
                mystructure.data[i].keys[0][2] = "Contactdoos";
        }
    }
    // In versie 3 heetten Contactdozen ook soms nog Stopcontacten, maar niet altijd
    if (version == 3) {
        for (var i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Stopcontact")
                mystructure.data[i].props.type = "Contactdoos";
        }
    }
    //Vanaf versie 4 staan niet automatisch meer haakjes <> rond de benaming van borden. Indien kleiner dan versie 4 moeten we deze toevoegen
    if (version < 4) {
        if (version < 3) {
            for (var i = 0; i < mystructure.length; i++) {
                if ((mystructure.data[i].keys[0][2] === "Bord") && (mystructure.data[i].keys[10][2] !== ""))
                    mystructure.data[i].keys[10][2] = '<' + mystructure.data[i].keys[10][2] + '>';
            }
        }
        else {
            for (var i = 0; i < mystructure.length; i++) {
                if ((mystructure.data[i].props.type === "Bord") && (mystructure.data[i].props.naam !== ""))
                    mystructure.data[i].props.naam = '<' + mystructure.data[i].props.naam + '>';
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
function json_to_structure(text, version, redraw) {
    if (version === void 0) { version = 0; }
    if (redraw === void 0) { redraw = true; }
    /* Read all data from disk in a javascript structure mystructure.
        * Afterwards we will gradually copy elements from this one into the official structure
        */
    var mystructure = JSON.parse(text);
    // upgrade if needed
    if (version != 0)
        upgrade_version(mystructure, version);
    /* We starten met het kopieren van data naar de eigenlijke structure.
    * Ook hier houden we er rekening mee dat in oude saves mogelijk niet alle info voorhanden was */
    structure = new Hierarchical_List();
    // Kopieren van hoofd-eigenschappen
    if (typeof mystructure.properties != 'undefined') {
        if (typeof mystructure.properties.filename != "undefined")
            structure.properties.filename = mystructure.properties.filename;
        if (typeof mystructure.properties.owner != "undefined")
            structure.properties.owner = mystructure.properties.owner;
        if (typeof mystructure.properties.control != "undefined")
            structure.properties.control = mystructure.properties.control;
        if (typeof mystructure.properties.installer != "undefined")
            structure.properties.installer = mystructure.properties.installer;
        if (typeof mystructure.properties.info != "undefined")
            structure.properties.info = mystructure.properties.info;
        if (typeof mystructure.properties.info != "undefined")
            structure.properties.dpi = mystructure.properties.dpi;
    }
    // Kopieren van de paginatie voor printen
    if (typeof mystructure.print_table != "undefined") {
        structure.print_table.setHeight(mystructure.print_table.height);
        structure.print_table.setMaxWidth(mystructure.print_table.maxwidth);
        structure.print_table.setPaperSize(mystructure.print_table.papersize);
        structure.print_table.setModeVertical(mystructure.print_table.modevertical);
        structure.print_table.setstarty(mystructure.print_table.starty);
        structure.print_table.setstopy(mystructure.print_table.stopy);
        if (typeof mystructure.print_table.enableAutopage != "undefined") {
            structure.print_table.enableAutopage = mystructure.print_table.enableAutopage;
        }
        else {
            structure.print_table.enableAutopage = false;
        }
        for (var i = 0; i < mystructure.print_table.pages.length; i++) {
            if (i != 0)
                this.structure.print_table.addPage();
            this.structure.print_table.pages[i].height = mystructure.print_table.pages[i].height;
            this.structure.print_table.pages[i].start = mystructure.print_table.pages[i].start;
            this.structure.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
        }
    }
    /* Kopieren van de eigenschappen van elk element.
    * Keys voor versies 1 en 2 en props voor versie 3
    */
    for (var i = 0; i < mystructure.length; i++) {
        if ((version != 0) && (version < 3)) {
            structure.addItem(mystructure.data[i].keys[0][2]);
            structure.data[i].convertLegacyKeys(mystructure.data[i].keys);
        }
        else {
            structure.addItem(mystructure.data[i].props.type);
            Object.assign(structure.data[i].props, mystructure.data[i].props);
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
    if (redraw == true)
        HLRedrawTree();
}
/* FUNCTION import_to_structure
   
   Starts from a string that can be loaded from disk or from a file and is in EDS-format.
   puts the content in the javascript structure called "structure".
   Will redraw everything if the redraw flag is set.

*/
function import_to_structure(mystring, redraw) {
    if (redraw === void 0) { redraw = true; }
    var text = "";
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
    if ((mystring.charCodeAt(0) == 69) && (mystring.charCodeAt(1) == 68) && (mystring.charCodeAt(2) == 83)) { //recognize as EDS
        /* Determine versioning
        * < 16/12/2023: Version 1, original key based implementation
        *   16/12/2023: Version 2, Introductie van automatische breedte voor bepaalde SVG-tekst
        *                          Vrije tekst van Version 1 moet 30 pixels groter gemaakt worden om nog mooi in het schema te passen
        *   XX/01/2024: Version 3, Overgang van key based implementation naar props based implementation
        *                          functies convertLegacyKeys ingevoerd om oude files nog te lezen.
        */
        version = Number(mystring.substring(3, 6));
        if (isNaN(version))
            version = 1; // Hele oude files bevatten geen versie, ze proberen ze te lezen als versie 1
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
            for (var i = 0; i < inflated.length; i++) {
                text += String.fromCharCode(inflated[i]);
            }
        }
    }
    else if ((mystring.charCodeAt(0) == 84) && (mystring.charCodeAt(1) == 88) && (mystring.charCodeAt(2) == 84)) { //recognize as TXT
        version = Number(mystring.substring(3, 6));
        if (isNaN(version))
            version = 3;
        text = mystring.substring(10, mystring.length);
    }
    else { // Very old file without header
        text = mystring;
        version = 1;
    }
    // Dump the json in into the structure and redraw if needed
    json_to_structure(text, version, redraw);
    // Clear the undo stack and push this one on top
    undostruct.clear();
    undostruct.store();
    // Scroll to top left for the SVG and HTML, this can only be done at the end because "right col" has to actually be visible
    var leftelem = document.getElementById("left_col");
    if (leftelem != null) {
        leftelem.scrollTop = 0;
        leftelem.scrollLeft = 0;
    }
    var rightelem = document.getElementById("right_col");
    if (rightelem != null) {
        rightelem.scrollTop = 0;
        rightelem.scrollLeft = 0;
    }
}
function structure_to_json() {
    // Remove some unneeded data members that would only inflate the size of the output file
    for (var _i = 0, _a = structure.data; _i < _a.length; _i++) {
        var listitem = _a[_i];
        listitem.sourcelist = null;
    }
    var swap = structure.print_table.pagemarkers;
    structure.print_table.pagemarkers = null;
    // Create the output structure in uncompressed form
    var text = JSON.stringify(structure);
    // Put the removed data members back
    for (var _b = 0, _c = structure.data; _b < _c.length; _b++) {
        var listitem = _c[_b];
        listitem.sourcelist = structure;
    }
    structure.print_table.pagemarkers = swap;
    return (text);
}
/* FUNCTION download_by_blob

   Downloads an EDS file to the user's PC

*/
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
/* FUNCTION exportScreen
   
   Shows the exportscreen.  It will look different depending on whether the browser supports the file API or not

*/
function exportscreen() {
    var strleft = '<span id="exportscreen"></span>'; //We need the id to check elsewhere that the screen is open
    if (window.showOpenFilePicker) { // Use fileAPI
        if (fileAPIobj.filename != null) {
            strleft += 'Laatst geopend of opgeslagen om <b>' + fileAPIobj.lastsaved + '</b> met naam <b>' + fileAPIobj.filename + '</b><br><br>'
                + 'Klik hieronder om bij te werken<br><br>';
            strleft += '<button onclick="exportjson(saveAs = false)">Opslaan</button>&nbsp;';
            strleft += '<button onclick="exportjson(saveAs = true)">Opslaan als</button><br><br>';
        }
        else {
            strleft += 'Uw werk werd nog niet opgeslagen. Klik hieronder.<br><br>';
            strleft += '<button onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '<br><br>';
        }
        strleft += '<table border=0>';
        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
        strleft += '</table>';
    }
    else { // Legacy
        strleft += '<table border=0><tr><td width=500 style="vertical-align:top;padding:5px">';
        strleft += 'Bestandsnaam: <span id="settings"><code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span>';
        strleft += '</td><td style="vertical-align:top;padding:5px">';
        strleft += 'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
        strleft += 'Klik vervolgens op "opslaan" en volg de instructies van uw browser. ';
        strleft += 'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>';
        strleft += 'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.<br><br>';
        strleft += '</td></tr>';
        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
        strleft += '</table>';
        // Plaats input box voor naam van het schema bovenaan --
        strleft += '<br>';
    }
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
}
var jsonStore = /** @class */ (function () {
    function jsonStore(maxSteps) {
        if (maxSteps === void 0) { maxSteps = 100; }
        this.maxSteps = maxSteps;
        this.undoStack = [];
        this.redoStack = [];
    }
    jsonStore.prototype.store = function (text) {
        if (this.undoStack.length >= this.maxSteps) {
            this.undoStack.shift(); // Remove the oldest entry to maintain maxSteps
        }
        this.undoStack.push(text);
        this.redoStack = []; // Clear the redo stack whenever a new store is made
    };
    //Always call store before undo otherwise there is nothing to put on the redo stack !!
    jsonStore.prototype.undo = function () {
        if (this.undoStack.length <= 1) {
            return null;
        }
        var lastState = this.undoStack.pop();
        this.redoStack.push(lastState);
        return this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : null;
    };
    jsonStore.prototype.redo = function () {
        if (this.redoStack.length === 0) {
            return null;
        }
        var lastRedoState = this.redoStack.pop();
        this.undoStack.push(lastRedoState);
        return lastRedoState;
    };
    jsonStore.prototype.clear = function () {
        this.undoStack = [];
        this.redoStack = [];
    };
    jsonStore.prototype.undoStackSize = function () { return (Math.max(this.undoStack.length - 1, 0)); };
    jsonStore.prototype.redoStackSize = function () { return (Math.max(this.redoStack.length, 0)); };
    return jsonStore;
}());
var undoRedo = /** @class */ (function () {
    function undoRedo(maxSteps) {
        if (maxSteps === void 0) { maxSteps = 100; }
        this.history = new jsonStore(maxSteps);
    }
    undoRedo.prototype.store = function () { this.history.store(structure_to_json()); structure.updateRibbon(); };
    undoRedo.prototype.undo = function () {
        var lastmode = structure.mode;
        var text = this.history.undo();
        if (text != null)
            json_to_structure(text, 0, false);
        structure.mode = lastmode;
        HLRedrawTree();
    };
    undoRedo.prototype.redo = function () {
        var lastmode = structure.mode;
        var text = this.history.redo();
        if (text != null)
            json_to_structure(text, 0, false);
        structure.mode = lastmode;
        HLRedrawTree();
    };
    undoRedo.prototype.clear = function () {
        this.history.clear();
        structure.updateRibbon();
    };
    undoRedo.prototype.undoStackSize = function () { return (this.history.undoStackSize()); };
    undoRedo.prototype.redoStackSize = function () { return (this.history.redoStackSize()); };
    return undoRedo;
}());
var List_Item = /** @class */ (function () {
    // -- Constructor --
    function List_Item(mylist) {
        this.id = 0; //undefined
        this.parent = 0; //no parent
        this.indent = 0; //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.props = {}; // Lege properties
        this.sourcelist = mylist;
    }
    // -- Initialisatie van properties --
    List_Item.prototype.resetProps = function () { this.props = {}; };
    // -- Default maximum aantal kinderen ==
    List_Item.prototype.getMaxNumChilds = function () {
        return (2 ^ 16);
    };
    // -- Tel aantal kinderen --
    List_Item.prototype.getNumChilds = function () {
        var numChilds = 0;
        for (var i = 0; i < this.sourcelist.data.length; ++i) {
            if ((this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i]))
                numChilds++;
        }
        return (numChilds);
    };
    // -- Check of het item actief is --
    List_Item.prototype.isActief = function () {
        var ordinal = this.sourcelist.getOrdinalById(this.id);
        return (this.sourcelist.active[ordinal]);
    };
    // -- Retourneer ouder-item --
    List_Item.prototype.getParent = function () {
        return this.sourcelist.data[this.sourcelist.getOrdinalById(this.parent)];
    };
    // -- Editeren van een string --
    List_Item.prototype.stringPropToHTML = function (item, size) {
        var output = "";
        var sizestr = "";
        if (size != null)
            sizestr = ' size="' + size + '" ';
        output = '<input type="text"' + sizestr + ' id="' + 'HL_edit_' + this.id + '_' + item + '" value="' + this.props[item] + '">';
        return (output);
    };
    // -- Editeren van een checkbox --
    List_Item.prototype.checkboxPropToHTML = function (item) {
        var output;
        output = '<input type="checkbox" id="' + 'HL_edit_' + this.id + '_' + item + '" '
            + (this.props[item] ? ' checked' : '') + '>';
        return (output);
    };
    // -- Editeren van een select box --
    List_Item.prototype.selectPropToHTML = function (item, items) {
        var myId = "HL_edit_" + this.id + "_" + item;
        var output = "";
        var options = "";
        output = '<select id="' + myId + '">';
        for (var i = 0; i < items.length; i++) {
            options = "";
            if (this.props[item] == items[i]) {
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
    // -- Genereer HTML code voor de boom-editor --
    List_Item.prototype.toHTML = function (mode) {
        return ("toHTML() function not defined for base class List_Item. Extend class first.");
    };
    List_Item.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        return (mySVG);
    };
    return List_Item;
}());
var Electro_Item = /** @class */ (function (_super) {
    __extends(Electro_Item, _super);
    function Electro_Item(mylist) {
        var _this = _super.call(this, mylist) || this;
        _this.resetProps(); // In Javascript, this calls the derived classes
        return _this;
    }
    // -- Lees oude legacy keys (enkel voor EDS versies 001 en 002) --
    Electro_Item.prototype.getLegacyKey = function (mykeys, keyid) {
        if ((typeof (mykeys) != 'undefined') && (mykeys.length > keyid)) {
            return mykeys[keyid][2];
        }
        else {
            return null;
        }
    };
    // -- Converteer oud key-based systeem (EDS versies 1 en 2) --
    Electro_Item.prototype.convertLegacyKeys = function (mykeys) { }; // Do nothing if not defined in derived class
    // -- Na creatie van een item, zet alle props op default waarden --
    Electro_Item.prototype.resetProps = function () { _super.prototype.resetProps.call(this); }; // overriden in each derived class
    // -- Zoek vader van het Electro_Item --
    Electro_Item.prototype.getParent = function () {
        return _super.prototype.getParent.call(this);
    };
    // -- Lijst met toegestande kinderen van het Electro_item --
    Electro_Item.prototype.allowedChilds = function () {
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    };
    // -- Aantal actieve kinderen van het Electro_item --
    Electro_Item.prototype.getNumChildsWithKnownType = function () {
        var numChilds = 0;
        if (this.sourcelist != null) {
            for (var i = 0; i < this.sourcelist.data.length; ++i) {
                if ((this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i])
                    && (this.sourcelist.data[i].getType() != ""))
                    numChilds++;
            }
        }
        return (numChilds);
    };
    // -- Check of Electro_item een kind heeft --
    Electro_Item.prototype.heeftKindMetGekendType = function () {
        return (this.getNumChildsWithKnownType() > 0);
    };
    // -- Check of [item] een vrije tekst zonder kader is --
    Electro_Item.prototype.isVrijeTekstZonderKader = function () {
        if (this.getType() == "Vrije tekst") {
            if (this.props.vrije_tekst_type == "zonder kader")
                return true;
            else
                return false;
        }
        else
            return false;
    };
    // -- Check of er een streepje moet geplaatst worden achter bepaalde elementen zoals een contactdoos of lichtpunt --
    Electro_Item.prototype.heeftVerbruikerAlsKind = function () {
        var parent = this.getParent();
        if ((parent != null) && (parent.getType() == "Meerdere verbruikers")) {
            var myOrdinal = this.sourcelist.getOrdinalById(this.id);
            var lastOrdinal = 0;
            for (var i = 0; i < this.sourcelist.data.length; ++i) {
                if (this.sourcelist.active[i] && !(this.sourcelist.data[i].isVrijeTekstZonderKader()) && (this.sourcelist.data[i].parent == this.parent))
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
                        (this.sourcelist.active[i]) && !(this.sourcelist.data[i].isVrijeTekstZonderKader()) &&
                        (this.sourcelist.data[i].getType() != "") && (this.sourcelist.data[i].getType() != null))
                        return true;
                }
            }
        }
        return false;
    };
    // -- Maak het huidige Electro_item een copy van source_item --
    Electro_Item.prototype.clone = function (source_item) {
        this.parent = source_item.parent;
        this.indent = source_item.indent;
        this.collapsed = source_item.collapsed;
        this.sourcelist = source_item.sourcelist;
        this.props = deepClone(source_item.props);
    };
    // -- Type van het Electro_item teruggeven --
    Electro_Item.prototype.getType = function () { return this.props.type; };
    // -- Checken of parent een gevraagd type is --
    Electro_Item.prototype.isChildOf = function (typestr) {
        if (this.parent != 0)
            return (this.getParent().getType() == typestr);
        else
            return false;
    };
    //-- Clear all keys, met uitzondering van nr indien er een nummer is --
    Electro_Item.prototype.clearProps = function () {
        var oldnr;
        if (typeof (this.props.nr) != 'undefined')
            oldnr = this.props.nr;
        else
            oldnr = "";
        this.props = {};
        this.props.nr = oldnr;
    };
    // -- Returns the maximum number of childs the Electro_Item can have --
    Electro_Item.prototype.getMaxNumChilds = function () {
        var parent = this.getParent();
        if (parent == null)
            return 256; //This should never happen, all allowed childs of null have their own implementations of getMaxNumChilds() and will never call this.
        switch (parent.getType()) {
            case "Meerdere verbruikers":
                return 0;
                break; // Childs of "Meerdere verbruikers" cannot have childs
            default:
                return 1;
                break; // By default, most element can have 1 child unless overwritten by derived classes
        }
    };
    // -- Returns true if the Electro_Item can take an extra childs --
    Electro_Item.prototype.checkInsertChild = function () { return (this.getMaxNumChilds() > this.getNumChilds()); };
    // -- Returns true if the parent can take an extra child --
    Electro_Item.prototype.checkInsertSibling = function () {
        var parent = this.getParent();
        if (parent == null)
            return true;
        else
            return (parent.getMaxNumChilds() > parent.getNumChilds());
    };
    // -- Displays the navigation buttons for the Electro_Item, i.e. the green and blue arrows, and the selection of the Type (Bord, Kring, ...) --
    Electro_Item.prototype.toHTMLHeader = function (mode) {
        var output = "";
        if (mode == "move") {
            output += "<b>ID: " + this.id + "</b>, ";
            output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id + ")\">&#9650;</button>";
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id + ")\">&#9660;</button>";
            if (this.checkInsertSibling()) {
                output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id + ")\">Clone</button>";
            }
        }
        else {
            if (this.checkInsertSibling()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id + ")\">&#9650;</button>";
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id + ")\">&#9660;</button>";
            }
            if (this.checkInsertChild()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id + ")\">&#9654;</button>";
            }
        }
        ;
        output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id + ")\">&#9851;</button>";
        output += "&nbsp;";
        var parent = this.getParent();
        var consumerArray;
        if (parent == null)
            consumerArray = ["", "Aansluiting", "Zekering/differentieel", "Kring"];
        else
            consumerArray = this.getParent().allowedChilds();
        output += this.selectPropToHTML('type', consumerArray);
        return (output);
    };
    // -- This one will get called if the type of the Electro_Item has not yet been chosen --
    Electro_Item.prototype.toHTML = function (mode) { return (this.toHTMLHeader(mode)); }; // Implemented in the derived classes
    // -- Display the number in the html tree view, but only if it is displayable
    Electro_Item.prototype.nrToHtml = function () {
        var str = "";
        var parent = this.getParent();
        if (parent != null) {
            if ((parent.getType() == "Kring") || (parent.getType() == "Domotica module (verticaal)")) {
                str += "Nr: " + this.stringPropToHTML('nr', 5) + ", ";
            }
            else {
                this.props.nr = "";
            }
        }
        ;
        return (str);
    };
    ;
    // -- Code to add the addressline below when drawing SVG. This is called by most derived classes --
    Electro_Item.prototype.addAddressToSVG = function (mySVG, starty, godown, shiftx) {
        if (starty === void 0) { starty = 60; }
        if (godown === void 0) { godown = 15; }
        if (shiftx === void 0) { shiftx = 0; }
        var returnstr;
        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            returnstr = '<text x="' + ((mySVG.xright - 20) / 2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown = mySVG.ydown + godown;
        }
        return returnstr;
    };
    // -- Make the SVG for the electro item, placeholder for derived classes --
    Electro_Item.prototype.toSVG = function () { return (new SVGelement()); }; //Placeholder for derived classes
    return Electro_Item;
}(List_Item));
var Schakelaar = /** @class */ (function () {
    function Schakelaar(type, halfwaterdicht, verklikkerlamp, signalisatielamp, trekschakelaar, aantal) {
        if (halfwaterdicht === void 0) { halfwaterdicht = false; }
        if (verklikkerlamp === void 0) { verklikkerlamp = false; }
        if (signalisatielamp === void 0) { signalisatielamp = false; }
        if (trekschakelaar === void 0) { trekschakelaar = false; }
        if (aantal === void 0) { aantal = 1; }
        this.type = type;
        this.halfwaterdicht = halfwaterdicht;
        this.verklikkerlamp = verklikkerlamp;
        this.signalisatielamp = signalisatielamp;
        this.trekschakelaar = trekschakelaar;
        this.aantal = aantal;
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
    Schakelaar.prototype.magneetcontacttoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 20;
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        if (this.aantal > 1) {
            outputstr += '<text x="31" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.aantal) + '</text>';
        }
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#magneetcontact" x="' + endx + '" y="25" />';
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
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
            case "magneetcontact":
                (_m = (this.magneetcontacttoDrawReturnObj(startx)), endx = _m.endx, outputstr = _m.str);
                endx += 20;
                lowerbound = Math.max(lowerbound, 25);
                break;
            case "schakelaar":
                (_o = (this.defaulttoDrawReturnObj(startx, '#schakelaar')), endx = _o.endx, outputstr = _o.str);
                endx += 40;
                break;
            case "schemerschakelaar":
                (_p = (this.defaulttoDrawReturnObj(startx, '#schemerschakelaar')), endx = _p.endx, outputstr = _p.str);
                endx += 40;
                break;
            case "teleruptor":
                (_q = (this.defaulttoDrawReturnObj(startx, '#teleruptor')), endx = _q.endx, outputstr = _q.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "dimmer":
                (_r = (this.defaulttoDrawReturnObj(startx, '#dimmer')), endx = _r.endx, outputstr = _r.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "relais":
                (_s = (this.defaulttoDrawReturnObj(startx, '#relais')), endx = _s.endx, outputstr = _s.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "minuterie":
                (_t = (this.defaulttoDrawReturnObj(startx, '#minuterie')), endx = _t.endx, outputstr = _t.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "thermostaat":
                (_u = (this.defaulttoDrawReturnObj(startx, '#thermostaat')), endx = _u.endx, outputstr = _u.str);
                endx += 40;
                lowerbound = Math.max(lowerbound, 30);
                break;
            case "tijdschakelaar":
                (_v = (this.defaulttoDrawReturnObj(startx, '#tijdschakelaar')), endx = _v.endx, outputstr = _v.str);
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
        return _super.call(this, mylist) || this;
    }
    Schakelaars.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal_schakelaars = this.getLegacyKey(mykeys, 4);
        this.props.type_schakelaar = this.getLegacyKey(mykeys, 5);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.heeft_signalisatielampje = this.getLegacyKey(mykeys, 19);
        this.props.is_halfwaterdicht = this.getLegacyKey(mykeys, 20);
        this.props.heeft_verklikkerlampje = this.getLegacyKey(mykeys, 21);
        this.props.is_trekschakelaar = this.getLegacyKey(mykeys, 25);
    };
    Schakelaars.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Schakelaars"; // This is rather a formality as we should already have this at this stage
        this.props.aantal_schakelaars = "1"; // Per default 1 schakelaar
        this.props.type_schakelaar = "enkelpolig"; // Per default enkelpolig
        this.props.adres = ""; // Set Adres/tekst to "" when the item is cleared
        this.props.heeft_signalisatielampje = false; // Per default geen signalisatielampje
        this.props.is_halfwaterdicht = false; // Per default niet halfwaterdicht
        this.props.heeft_verklikkerlampje = false; // Per default geen verklikkerslampje
        this.props.is_trekschakelaar = false; // Per default geen trekschakelaar
    };
    Schakelaars.prototype.kanHalfwaterdichtZijn = function () {
        return ((this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
            (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel") ||
            (this.props.type_schakelaar == "dimschakelaar") || (this.props.type_schakelaar == "dimschakelaar wissel") || (this.props.type_schakelaar == "rolluikschakelaar"));
    };
    Schakelaars.prototype.kanVerklikkerlampjeHebben = function () {
        return ((this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
            (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel") ||
            (this.props.type_schakelaar == "dimschakelaar") || (this.props.type_schakelaar == "dimschakelaar wissel"));
    };
    Schakelaars.prototype.kanSignalisatielampjeHebben = function () {
        return this.kanVerklikkerlampjeHebben();
    };
    Schakelaars.prototype.kanTrekschakelaarHebben = function () {
        return ((this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
            (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel"));
    };
    Schakelaars.prototype.overrideKeys = function () {
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
                this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars), 5));
                break;
            case "dubbelpolig":
                this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars), 2));
                break;
            case "magneetcontact":
                this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars), 20));
                break;
            default:
                this.props.aantal_schakelaars = "1";
                break;
        }
        if (!this.kanHalfwaterdichtZijn)
            this.props.is_halfwaterdicht = false;
        if (!this.kanVerklikkerlampjeHebben)
            this.props.heeft_verklikkerlampje = false;
        if (!this.kanSignalisatielampjeHebben)
            this.props.heeft_signalisatielampje = false;
        if (!this.kanTrekschakelaarHebben)
            this.props.is_trekschakelaar = false;
    };
    Schakelaars.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += this.selectPropToHTML('type_schakelaar', ["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar", "---", "magneetcontact"]);
        if (this.kanHalfwaterdichtZijn())
            output += ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht');
        if (this.kanVerklikkerlampjeHebben())
            output += ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje');
        if (this.kanSignalisatielampjeHebben())
            output += ", Signalisatielampje: " + this.checkboxPropToHTML('heeft_signalisatielampje');
        if (this.kanTrekschakelaarHebben())
            output += ", Trekschakelaar: " + this.checkboxPropToHTML('is_trekschakelaar');
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
                output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["1", "2", "3", "4", "5"]);
                break;
            case "dubbelpolig":
                output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["1", "2"]);
                break;
            case "magneetcontact":
                output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
                break;
        }
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Schakelaars.prototype.bouwSchakelaarKeten = function (tekenKeten) {
        switch (this.props.type_schakelaar) {
            case "wissel_enkel":
                tekenKeten.push(new Schakelaar("wissel_enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                break;
            case "wissel_dubbel":
                tekenKeten.push(new Schakelaar("wissel_dubbel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                break;
            case "kruis_enkel":
                tekenKeten.push(new Schakelaar("kruis_enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                break;
            case "teleruptor":
                tekenKeten.push(new Schakelaar("teleruptor"));
                break;
            case "bewegingsschakelaar":
                tekenKeten.push(new Schakelaar("bewegingsschakelaar"));
                break;
            case "schemerschakelaar":
                tekenKeten.push(new Schakelaar("schemerschakelaar"));
                break;
            case "schakelaar":
                tekenKeten.push(new Schakelaar("schakelaar"));
                break;
            case "dimmer":
                tekenKeten.push(new Schakelaar("dimmer"));
                break;
            case "relais":
                tekenKeten.push(new Schakelaar("relais"));
                break;
            case "minuterie":
                tekenKeten.push(new Schakelaar("minuterie"));
                break;
            case "thermostaat":
                tekenKeten.push(new Schakelaar("thermostaat"));
                break;
            case "tijdschakelaar":
                tekenKeten.push(new Schakelaar("tijdschakelaar"));
                break;
            case "magneetcontact":
                tekenKeten.push(new Schakelaar("magneetcontact", false, false, false, false, this.props.aantal_schakelaars));
                break;
            case "rolluikschakelaar":
                tekenKeten.push(new Schakelaar("rolluikschakelaar", this.props.is_halfwaterdicht));
                break;
            case "dubbelaansteking":
                tekenKeten.push(new Schakelaar("dubbelaansteking", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                break;
            case "dimschakelaar":
                tekenKeten.push(new Schakelaar("dimschakelaar", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, false));
                break;
            case "dimschakelaar wissel":
                tekenKeten.push(new Schakelaar("dimschakelaar_wissel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, false));
                break;
            case "enkelpolig":
                if (Number(this.props.aantal_schakelaars) == 1)
                    tekenKeten.push(new Schakelaar("enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    tekenKeten.push(new Schakelaar("wissel_enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                    for (var i = 2; i < Number(this.props.aantal_schakelaars); ++i) {
                        tekenKeten.push(new Schakelaar("kruis_enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                    }
                    tekenKeten.push(new Schakelaar("wissel_enkel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                }
                break;
            case "dubbelpolig":
                if (Number(this.props.aantal_schakelaars) == 1)
                    tekenKeten.push(new Schakelaar("dubbel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    tekenKeten.push(new Schakelaar("wissel_dubbel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                    tekenKeten.push(new Schakelaar("wissel_dubbel", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                }
                break;
            case "driepolig":
                tekenKeten.push(new Schakelaar("driepolig", this.props.is_halfwaterdicht, this.props.heeft_verklikkerlampje, this.props.heeft_signalisatielampje, this.props.is_trekschakelaar));
                break;
        }
    };
    Schakelaars.prototype.toSVG = function () {
        var _a;
        var mySVG = new SVGelement();
        var tekenKeten = [];
        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten(tekenKeten);
        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        var startx = 1;
        var endx;
        for (var i = 0; i < tekenKeten.length; i++) {
            var islast = ((i == tekenKeten.length - 1) && (!this.heeftVerbruikerAlsKind()));
            var str = void 0;
            (_a = tekenKeten[i].toSVGString(startx, islast), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if (!this.heeftVerbruikerAlsKind())
            startx += tekenKeten[tekenKeten.length - 1].extraPlaatsRechts();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += this.addAddressToSVG(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20));
        mySVG.data += "\n";
        return (mySVG);
    };
    return Schakelaars;
}(Electro_Item));
var Lichtcircuit = /** @class */ (function (_super) {
    __extends(Lichtcircuit, _super);
    function Lichtcircuit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lichtcircuit.prototype.resetProps = function () {
        _super.prototype.resetProps.call(this); //Schakelaars
        this.props.type = "Lichtcircuit"; // This is rather a formality as we should already have this at this stage
        this.props.aantal_lichtpunten = "1"; // Per default 1 lichtpunt
    };
    Lichtcircuit.prototype.convertLegacyKeys = function (mykeys) {
        _super.prototype.convertLegacyKeys.call(this, mykeys);
        this.props.aantal_lichtpunten = this.getLegacyKey(mykeys, 13);
    };
    Lichtcircuit.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += this.selectPropToHTML('type_schakelaar', ["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
        if (this.kanHalfwaterdichtZijn())
            output += ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht');
        if (this.kanVerklikkerlampjeHebben())
            output += ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje');
        if (this.kanSignalisatielampjeHebben())
            output += ", Signalisatielampje: " + this.checkboxPropToHTML('heeft_signalisatielampje');
        if (this.kanTrekschakelaarHebben())
            output += ", Trekschakelaar: " + this.checkboxPropToHTML('is_trekschakelaar');
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
                if (this.props.aantal_schakelaars == 0) {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["0", "1", "2", "3", "4", "5"])
                        + '<span style="color: red;"> Compatibiliteitsmodus, kies aantal schakelaars verschillend van 0 of gebruik element lichtpunt</span>';
                }
                else {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["1", "2", "3", "4", "5"]);
                }
                break;
            case "dubbelpolig":
                if (this.props.aantal_schakelaars == 0) {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["0", "1", "2"])
                        + '<span style="color: red;"> Compatibiliteitsmodus, kies aantal schakelaars verschillend van 0 of gebruik element lichtpunt</span>';
                }
                else {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars', ["1", "2"]);
                }
                break;
        }
        output += ", Aantal lichtpunten: " + this.selectPropToHTML('aantal_lichtpunten', ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Lichtcircuit.prototype.toSVG = function () {
        var _a;
        var mySVG = new SVGelement();
        var tekenKeten = [];
        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten(tekenKeten);
        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        var startx = 1;
        var endx;
        // Teken de schakelaars
        for (var i = 0; i < tekenKeten.length; i++) {
            var islast = ((i == tekenKeten.length - 1) && (!this.heeftVerbruikerAlsKind()));
            var str = void 0;
            (_a = tekenKeten[i].toSVGString(startx, islast), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        if (this.props.aantal_lichtpunten >= 1) { //1 of meerdere lampen
            // Teken de lamp
            endx = startx + 30;
            mySVG.data += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                + '<use xlink:href="#lamp" x="' + endx + '" y="25" />';
            // Teken aantal lampen en symbool 'h' voor halfwaterdicht
            var print_str_upper = ""; //string om bovenaan te plaatsen
            if (this.props.is_halfwaterdicht) {
                print_str_upper = "h";
                if (parseInt(this.props.aantal_lichtpunten) > 1)
                    print_str_upper += ", x" + this.props.aantal_lichtpunten; // Meer dan 1 lamp
            }
            else if (parseInt(this.props.aantal_lichtpunten) > 1) {
                print_str_upper = "x" + this.props.aantal_lichtpunten;
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
            if ((!this.heeftVerbruikerAlsKind()) && (tekenKeten.length > 0))
                startx += tekenKeten[tekenKeten.length - 1].extraPlaatsRechts();
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += this.addAddressToSVG(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20));
        mySVG.data += "\n";
        return (mySVG);
    };
    return Lichtcircuit;
}(Schakelaars));
var Aansluiting = /** @class */ (function (_super) {
    __extends(Aansluiting, _super);
    function Aansluiting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aansluiting.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal_polen = this.getLegacyKey(mykeys, 4);
        this.props.bescherming = this.getLegacyKey(mykeys, 7);
        this.props.amperage = this.getLegacyKey(mykeys, 8);
        this.props.type_kabel_na_teller = this.getLegacyKey(mykeys, 9);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.differentieel_delta_amperage = this.getLegacyKey(mykeys, 11);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.differentieel_is_selectief = this.getLegacyKey(mykeys, 20);
        this.props.kortsluitvermogen = this.getLegacyKey(mykeys, 22);
        this.props.naam = this.getLegacyKey(mykeys, 23);
        this.props.type_kabel_voor_teller = this.getLegacyKey(mykeys, 24);
        switch (this.props.bescherming) {
            case "differentieel":
                this.props.type_differentieel = this.getLegacyKey(mykeys, 17);
                break;
            case "automatisch":
                this.props.curve_automaat = this.getLegacyKey(mykeys, 17);
                break;
            case "differentieelautomaat":
                this.props.type_differentieel = this.getLegacyKey(mykeys, 17);
                this.props.curve_automaat = this.getLegacyKey(mykeys, 18);
                break;
        }
    };
    Aansluiting.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Aansluiting";
        this.props.aantal_polen = "2";
        this.props.bescherming = "differentieel";
        this.props.amperage = "40";
        this.props.type_kabel_na_teller = "2x16";
        this.props.differentieel_delta_amperage = "300";
        this.props.adres = "";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
        this.props.naam = "";
        this.props.type_kabel_voor_teller = "";
    };
    Aansluiting.prototype.allowedChilds = function () {
        return ["", "Bord", "Kring", "Splitsing"];
    };
    Aansluiting.prototype.getMaxNumChilds = function () {
        return 256;
        // Dit kan vreemd lijken omdat in principe een aansluiting maar 1 kind heeft.
        // Echter, in het verleden was 256 wel toegelaten en het is niet uit te sluiten dat gebruikers meerdere kringen onder een aansluiting gehangen hebben
        // om deze kringen verticaal te kunnen stapelen. Om het programma backward compatibel te houden behouden we dus 256 tot grandfathering code kan worden ontwikkeld.
        // Ook laat dit toe om tijdelijk een elementje onder aansluiting te hangen alvorens het met move elders onder te brengen
    };
    Aansluiting.prototype.overrideKeys = function () {
        if ((this.props.aantal_polen < 1) || (this.props.aantal_polen > 4))
            this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
    };
    Aansluiting.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;Naam: " + this.stringPropToHTML('naam', 5) + "<br>";
        if (this.getParent() != null)
            output += "Nr: " + this.stringPropToHTML('nr', 5) + ", ";
        output += "Zekering: " + this.selectPropToHTML('bescherming', ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "schemer"])
            + this.selectPropToHTML('aantal_polen', ["2", "3", "4"])
            + this.stringPropToHTML('amperage', 2) + "A";
        switch (this.props.bescherming) {
            case "differentieel":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
        }
        output += ", Kabeltype na teller: " + this.stringPropToHTML('type_kabel_na_teller', 10)
            + ", Kabeltype v&oacute;&oacute;r teller: " + this.stringPropToHTML('type_kabel_voor_teller', 10)
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Aansluiting.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Indien er een kabeltype vóór de teller is schuiven we alles op
        var extrashift = 0;
        if (this.props.type_kabel_voor_teller != "")
            extrashift += 50;
        // get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
        mySVG = this.sourcelist.toSVG(this.id, "vertical", 150 + extrashift); //shift 150 to the right
        // Lijntje met hoogte 20 plaatsen net boven differentieel of automaat
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 20) + '" stroke="black" />';
        mySVG.yup += 20;
        // Zekering, differentieel, of ander symbool onderaan plaatsen
        var numlines = 1; // Hier houden we het aantal lijnen tekst bij 
        switch (this.props.bescherming) {
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
                }
                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieel":
                // Code als differentieel selectief is
                if (this.props.differentieel_is_selectief) {
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
                    + "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
                }
                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright, 20 + 11 * (numlines - 1));
                break;
            case "differentieelautomaat":
                // Code als differentieel selectief is
                if (this.props.differentieel_is_selectief) {
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
                    + "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
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
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                break;
            case "schemer":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>"
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 15) + '" />'
                    + '<use xlink:href="#arrow" x=\"' + (mySVG.xleft - 18) + '" y="' + (mySVG.yup - 12) + '" />';
                break;
            case "smelt":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                break;
            case "geen":
                mySVG.yup += 0;
                break;
        }
        // Leiding helemaal links onderaan vóór de teller
        mySVG.data += '<line x1="1" ' + 'y1="' + (mySVG.yup + 25) + '" x2="' + (21 + extrashift) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>';
        // Kabeltype en tekst links onderaan vóór de teller
        if (this.props.type_kabel_voor_teller != "") {
            mySVG.data += '<text x="55" y="' + (mySVG.yup + 40)
                + '" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                + htmlspecialchars(this.props.type_kabel_voor_teller) + '</text>';
        }
        // De teller
        mySVG.data += '<use xlink:href="#elektriciteitsmeter" x="' + (21 + extrashift) + '" y="' + (mySVG.yup + 25) + '"></use>';
        // Leiding rechts onderaan na de teller
        mySVG.data += '<line x1="' + (61 + extrashift) + '" ' + 'y1="' + (mySVG.yup + 25) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>'
            + '<line x1="' + (mySVG.xleft) + '" y1="' + (mySVG.yup) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup + 25) + '" stroke="black"></line>';
        // Kabeltype en tekst rechts onderaan na de teller
        mySVG.data += '<text x="' + (85 + extrashift) + '" y="' + (mySVG.yup + 40)
            + '" style="text-anchor:left" font-family="Arial, Helvetica, sans-serif" font-size="10">'
            + htmlspecialchars(this.props.type_kabel_na_teller) + '</text>';
        // 25 extra pixels voorzien onderaan zodat de teller nooit in de tekening daaronder loopt
        mySVG.yup += 25;
        mySVG.ydown = 25;
        // Indien adres niet leeg is, plaats het onderaan
        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            mySVG.data += '<text x="' + (41 + extrashift) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">'
                + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
        }
        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft + (-6)) + '" ' + 'y="' + (mySVG.yup - 10) + '" '
            + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.props.naam) + '</text>';
        // rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
        mySVG.xright = mySVG.xright + mySVG.xleft - 1;
        mySVG.xleft = 1;
        return (mySVG);
    };
    return Aansluiting;
}(Electro_Item));
var Aansluitpunt = /** @class */ (function (_super) {
    __extends(Aansluitpunt, _super);
    function Aansluitpunt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aansluitpunt.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Aansluitpunt.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Aansluitpunt";
        this.props.adres = "";
    };
    Aansluitpunt.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 45, 0);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Aansluitpunt;
}(Electro_Item));
var Aftakdoos = /** @class */ (function (_super) {
    __extends(Aftakdoos, _super);
    function Aftakdoos() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aftakdoos.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Aftakdoos.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Aftakdoos";
        this.props.adres = "";
    };
    Aftakdoos.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Aftakdoos;
}(Electro_Item));
var Batterij = /** @class */ (function (_super) {
    __extends(Batterij, _super);
    function Batterij() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Batterij.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Batterij.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Batterij";
        this.props.adres = "";
    };
    Batterij.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Batterij;
}(Electro_Item));
var Bel = /** @class */ (function (_super) {
    __extends(Bel, _super);
    function Bel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bel.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Bel.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Bel";
        this.props.adres = "";
    };
    Bel.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Bel;
}(Electro_Item));
var Boiler = /** @class */ (function (_super) {
    __extends(Boiler, _super);
    function Boiler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boiler.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.heeft_accumulatie = this.getLegacyKey(mykeys, 3);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Boiler.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Boiler";
        this.props.heeft_accumulatie = false;
        this.props.adres = "";
    };
    Boiler.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Accumulatie: " + this.checkboxPropToHTML('heeft_accumulatie');
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
        }
        mySVG.data += this.addAddressToSVG(mySVG, 60);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Boiler;
}(Electro_Item));
var Bord = /** @class */ (function (_super) {
    __extends(Bord, _super);
    function Bord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bord.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.is_geaard = this.getLegacyKey(mykeys, 1);
        this.props.naam = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Bord.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Bord";
        this.props.is_geaard = true;
        this.props.naam = "";
        this.props.adres = "";
    };
    Bord.prototype.allowedChilds = function () {
        return ["", "Kring", "Vrije ruimte"];
    };
    Bord.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Bord.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;Naam: " + this.stringPropToHTML('naam', 5) + ", "
            + "Geaard: " + this.checkboxPropToHTML('is_geaard');
        return (output);
    };
    Bord.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        if (mySVG.yup == 0)
            mySVG.yup = 2; // Om zeker te zijn dat de vette lijn netjes wordt getekend.
        // Voorzie 10 extra pixels rechts na de allerlaatste kring
        mySVG.xright += 10;
        // Schuif het geheel voldoende naar links om plaats te hebben voor label en eventuele aarding
        var mintextsize = Math.max(30, svgTextWidth(htmlspecialchars(this.props.naam), 10, 'font-weight="bold"') + 13);
        var minxleft = mintextsize + (this.props.is_geaard ? 70 : 0); //Indien geaard hebben we 70 meer nodig
        if (this.isChildOf("Aansluiting")) {
            var maxTotalSize = 145;
            if (this.getParent().props.type_kabel_voor_teller != "")
                maxTotalSize = maxTotalSize + 50;
            var lengthToAdd = Math.max(0, (maxTotalSize - minxleft));
            mintextsize = mintextsize + lengthToAdd;
            minxleft = minxleft + lengthToAdd;
        }
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
        if (this.props.naam !== "")
            mySVG.data += '<text x="' + (5) + '" y="' + (mySVG.yup + 13) + '" '
                + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">'
                + htmlspecialchars(this.props.naam) + '</text>';
        // Teken aarding onderaan
        if (this.props.is_geaard)
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
var Contactdoos = /** @class */ (function (_super) {
    __extends(Contactdoos, _super);
    function Contactdoos() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Contactdoos.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.is_geaard = this.getLegacyKey(mykeys, 1);
        this.props.is_kinderveilig = this.getLegacyKey(mykeys, 2);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.aantal_fases_indien_meerfasig = this.getLegacyKey(mykeys, 16);
        this.props.heeft_ingebouwde_schakelaar = this.getLegacyKey(mykeys, 19);
        this.props.is_halfwaterdicht = this.getLegacyKey(mykeys, 20);
        this.props.is_meerfasig = this.getLegacyKey(mykeys, 21);
        this.props.heeft_nul_indien_meerfasig = this.getLegacyKey(mykeys, 25);
        this.props.in_verdeelbord = this.getLegacyKey(mykeys, 26);
    };
    Contactdoos.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Contactdoos";
        this.props.is_geaard = true;
        this.props.is_kinderveilig = true;
        this.props.aantal = "1";
        this.props.adres = "";
        this.props.aantal_fases_indien_meerfasig = "3";
        this.props.heeft_ingebouwde_schakelaar = false;
        this.props.is_halfwaterdicht = false;
        this.props.is_meerfasig = false;
        this.props.heeft_nul_indien_meerfasig = false;
        this.props.in_verdeelbord = false;
    };
    Contactdoos.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Geaard: " + this.checkboxPropToHTML('is_geaard') + ", "
            + "Kinderveiligheid: " + this.checkboxPropToHTML('is_kinderveilig') + " "
            + "Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht') + ", "
            + "Meerfasig: " + this.checkboxPropToHTML('is_meerfasig') + ", ";
        if (this.props.is_meerfasig) {
            output += "Aantal fasen: " + this.selectPropToHTML('aantal_fases_indien_meerfasig', ["1", "2", "3"]) + ", "
                + "Met nul: " + this.checkboxPropToHTML('heeft_nul_indien_meerfasig') + ", ";
        }
        ;
        output += "Ingebouwde schakelaar: " + this.checkboxPropToHTML('heeft_ingebouwde_schakelaar') + ", "
            + "Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6"]) + ", "
            + "In verdeelbord: " + this.checkboxPropToHTML('in_verdeelbord')
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Contactdoos.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;
        var startx = 1; // Punt waar we aan het tekenen zijn. Schuift gaandeweg op
        // Teken lijnen voor meerfasige contactdoos
        if (this.props.is_meerfasig) {
            mySVG.data += '<line x1="1" y1="25" x2="35" y2="25" stroke="black" />';
            switch (this.props.aantal_fases_indien_meerfasig) { //faselijnen
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
            if (this.props.heeft_nul_indien_meerfasig) { //nullijn
                mySVG.data += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />'
                    + '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
            }
            startx += 34;
            mySVG.xright += 34; //We schuiven alles 34 pixels op
        }
        // Teken ingebouwde schakelaar
        if (this.props.heeft_ingebouwde_schakelaar) {
            mySVG.data += '<line x1="' + (startx + 0) + '" y1="25" x2="' + (startx + 11) + '" y2="25" stroke="black" />'
                + '<line x1="' + (startx + 30) + '" y1="25" x2="' + (startx + 20) + '" y2="5" stroke="black" />'
                + '<line x1="' + (startx + 20) + '" y1="5" x2="' + (startx + 15) + '" y2="7.5" stroke="black" />'
                + '<line x1="' + (startx + 22) + '" y1="9" x2="' + (startx + 17) + '" y2="11.5" stroke="black" />';
            startx += 10;
            mySVG.xright += 10; //We schuiven alles 10 pixels op
        }
        // Teken alle contactdozen, inclusief aarding en kinderveiligheid indien van toepassing
        for (var i = 0; i < this.props.aantal; ++i) {
            mySVG.data += '<use xlink:href="#contactdoos" x="' + startx + '" y="25"></use>';
            if (this.props.is_geaard)
                mySVG.data += '<use xlink:href="#contactdoos_aarding" x="' + startx + '" y="25"></use>';
            if (this.props.is_kinderveilig)
                mySVG.data += '<use xlink:href="#contactdoos_kinderveilig" x="' + startx + '" y="25"></use>';
            startx += 20;
            mySVG.xright += 20;
        }
        // Teken kader indien in verdeelbord
        if (this.props.in_verdeelbord) {
            mySVG.data += '<rect x="' + (mySVG.xright - this.props.aantal * 20 - 3 - (this.props.heeft_ingebouwde_schakelaar) * 12) + '" y="3" width="' + (this.props.aantal * 20 + 6 + (this.props.heeft_ingebouwde_schakelaar) * 12) + '" height="44" fill="none" style="stroke:black" />';
            +'<line x1="' + (17 + (mySVG.xright - 20 + 3)) + '" y1="3" x2="' + (17 + (mySVG.xright - 20 + 3)) + '" y2="47" fill="none" style="stroke:black" />';
        }
        ;
        // Teken halfwaterdicht indien van toepassing
        if (this.props.is_halfwaterdicht)
            mySVG.data += '<rect x="' + (22 + (this.props.heeft_ingebouwde_schakelaar) * 10 + (this.props.is_meerfasig) * 34) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" /><text x="' + (25 + (this.props.heeft_ingebouwde_schakelaar) * 10 + (this.props.is_meerfasig) * 34) + '" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        // Indien de contactdoos een kind heeft, teken een streepje rechts
        if (this.heeftVerbruikerAlsKind()) {
            mySVG.data += '<line x1="' + startx + '" y1="25" x2="' + (startx + 21) + '" y2="25" stroke="black" />';
        }
        ;
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Contactdoos;
}(Electro_Item));
var Diepvriezer = /** @class */ (function (_super) {
    __extends(Diepvriezer, _super);
    function Diepvriezer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Diepvriezer.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Diepvriezer.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Diepvriezer";
        this.props.adres = "";
    };
    Diepvriezer.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Diepvriezer;
}(Electro_Item));
var Domotica = /** @class */ (function (_super) {
    __extends(Domotica, _super);
    function Domotica() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Domotica.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.tekst = this.getLegacyKey(mykeys, 15);
        this.props.adres = this.getLegacyKey(mykeys, 23);
    };
    Domotica.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Domotica";
        this.props.tekst = "Domotica";
        this.props.adres = "";
        this.props.nr = "";
    };
    Domotica.prototype.allowedChilds = function () {
        return ["", "Kring"];
    };
    Domotica.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Domotica.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Tekst (nieuwe lijn = \"|\"): " + this.stringPropToHTML('tekst', 30)
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Domotica.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        var strlines = htmlspecialchars(this.props.tekst).split("|");
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
        if (!(/^\s*$/.test(this.props.adres))) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Domotica;
}(Electro_Item));
var Domotica_gestuurde_verbruiker = /** @class */ (function (_super) {
    __extends(Domotica_gestuurde_verbruiker, _super);
    function Domotica_gestuurde_verbruiker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Domotica_gestuurde_verbruiker.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.type_externe_sturing = this.getLegacyKey(mykeys, 5);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.is_draadloos = this.getLegacyKey(mykeys, 19);
        this.props.heeft_lokale_drukknop = this.getLegacyKey(mykeys, 20);
        this.props.is_geprogrammeerd = this.getLegacyKey(mykeys, 21);
        this.props.heeft_detectie = this.getLegacyKey(mykeys, 25);
        this.props.heeft_externe_sturing = this.getLegacyKey(mykeys, 26);
    };
    Domotica_gestuurde_verbruiker.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Domotica gestuurde verbruiker";
        this.props.type_externe_sturing = "drukknop";
        this.props.adres = "";
        this.props.is_draadloos = true;
        this.props.heeft_lokale_drukknop = true;
        this.props.is_geprogrammeerd = true;
        this.props.heeft_detectie = false;
        this.props.heeft_externe_sturing = false;
    };
    Domotica_gestuurde_verbruiker.prototype.allowedChilds = function () {
        return ["", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    };
    Domotica_gestuurde_verbruiker.prototype.getMaxNumChilds = function () {
        return 1;
    };
    Domotica_gestuurde_verbruiker.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Draadloos: " + this.checkboxPropToHTML('is_draadloos')
            + ", Lokale Drukknop: " + this.checkboxPropToHTML('heeft_lokale_drukknop')
            + ", Geprogrammeerd: " + this.checkboxPropToHTML('is_geprogrammeerd')
            + ", Detectie: " + this.checkboxPropToHTML('heeft_detectie')
            + ", Externe sturing: " + this.checkboxPropToHTML('heeft_externe_sturing');
        if (this.props.heeft_externe_sturing)
            output += ", Externe sturing: " + this.selectPropToHTML('type_externe_sturing', ["drukknop", "schakelaar"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        if (this.props.is_draadloos)
            mySVG.data += '<use xlink:href="#draadloos_klein" x="22" y="15"></use>';
        if (this.props.heeft_lokale_drukknop)
            mySVG.data += '<use xlink:href="#drukknop_klein" x="38" y="15"></use>';
        if (this.props.is_geprogrammeerd)
            mySVG.data += '<use xlink:href="#tijdschakelaar_klein" x="54" y="15"></use>';
        if (this.props.heeft_detectie)
            mySVG.data += '<use xlink:href="#detectie_klein" x="70" y="15"></use>';
        if (this.props.heeft_externe_sturing) {
            switch (this.props.type_externe_sturing) {
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
        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21 + 0) + '" y="' + (mySVG.ydown + mySVG.yup + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">'
                + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Domotica_gestuurde_verbruiker;
}(Electro_Item));
var Domotica_verticaal = /** @class */ (function (_super) {
    __extends(Domotica_verticaal, _super);
    function Domotica_verticaal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Domotica_verticaal.prototype.convertLegacyKeys = function (mykeys) {
        //Niet nodig, bestond niet toen we nog Keys gebruikten
    };
    Domotica_verticaal.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Domotica module (verticaal)";
        this.props.nr = "";
        this.props.tekst = "Domotica";
    };
    Domotica_verticaal.prototype.allowedChilds = function () {
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    };
    Domotica_verticaal.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Domotica_verticaal.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Tekst: " + this.stringPropToHTML('tekst', 10);
        return (output);
    };
    Domotica_verticaal.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Eerst vragen we een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "vertical");
        // Dan bepalen we de hoogte van het object en zorgen ervoor dat de tekst past
        var heightunaltered = mySVG.yup + mySVG.ydown;
        var height = heightunaltered;
        if (height < 50)
            height = 50;
        height = Math.max(height, svgTextWidth(htmlspecialchars(this.props.tekst), 10, 'font-weight="bold"') + 25);
        mySVG.yup = height / 2;
        mySVG.ydown = mySVG.yup;
        // Nu zetten we detekening effectief op de goede plaats in het schema
        mySVG.data = '<svg x="60" y="' + (height - heightunaltered) + '">' + mySVG.data + '</svg>';
        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += 60;
        mySVG.data += '<rect x="' + (21) + '" width="' + (40) +
            '" y="' + (5) + '" height="' + (height - 10) + '" stroke="black" stroke-width="2" fill="white" />';
        mySVG.data += '<line x1="1" x2="21" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />';
        mySVG.data += '<text x="' + (44) + '" ' + 'y="' + (mySVG.yup) + '" '
            + 'transform="rotate(90 ' + (44) + ',' + (mySVG.yup) + ')" '
            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10"' + '>'
            + htmlspecialchars(this.props.tekst) + '</text>';
        return (mySVG);
    };
    return Domotica_verticaal;
}(Electro_Item));
var Droogkast = /** @class */ (function (_super) {
    __extends(Droogkast, _super);
    function Droogkast() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Droogkast.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Droogkast.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Droogkast";
        this.props.adres = "";
    };
    Droogkast.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Droogkast;
}(Electro_Item));
var Drukknop = /** @class */ (function (_super) {
    __extends(Drukknop, _super);
    function Drukknop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drukknop.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.aantal_knoppen_per_armatuur = this.getLegacyKey(mykeys, 13);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.type_knop = this.getLegacyKey(mykeys, 16);
        this.props.is_afgeschermd = this.getLegacyKey(mykeys, 19);
        this.props.is_halfwaterdicht = this.getLegacyKey(mykeys, 20);
        this.props.heeft_verklikkerlampje = this.getLegacyKey(mykeys, 21);
    };
    Drukknop.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Drukknop";
        this.props.aantal = "1";
        this.props.aantal_knoppen_per_armatuur = "1";
        this.props.adres = "";
        this.props.type_knop = "standaard";
        this.props.is_afgeschermd = false;
        this.props.is_halfwaterdicht = false;
        this.props.heeft_verklikkerlampje = false;
    };
    Drukknop.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Type: " + this.selectPropToHTML('type_knop', ["standaard", "dimmer", "rolluik"])
            + ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje')
            + ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht')
            + ", Afgeschermd: " + this.checkboxPropToHTML('is_afgeschermd')
            + ", Aantal armaturen: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"])
            + ", Aantal knoppen per armatuur: " + this.selectPropToHTML('aantal_knoppen_per_armatuur', ["1", "2", "3", "4", "5", "6", "7", "8"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Drukknop.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 43;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        var aantal_knoppen = this.props.aantal;
        // Teken lijn links
        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#drukknop" x="21" y="25"></use>';
        // Teken verklikkerlampje indien van toepassing
        if (this.props.heeft_verklikkerlampje) {
            mySVG.data += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>' // midden 33, 25, lengte 7
                + '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
        }
        // Teken afgeschermd indien van toepassing
        if (this.props.is_afgeschermd) {
            mySVG.data += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>' // midden 33, 25 lengte 7
                + '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>'
                + '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>'
                + '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>'
                + '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
        }
        // Plaats tekst voor "h" en/of aantal armaturen onderaan
        var printstr = "";
        if (this.props.is_halfwaterdicht)
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
        if (this.props.aantal_knoppen_per_armatuur > 1) {
            mySVG.data += '<text x="44" y="13" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.props.aantal_knoppen_per_armatuur) + '</text>'
                + '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
        }
        // Plaats extra tekens voor rolluik of dimmer
        switch (this.props.type_knop) {
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
            mySVG.data += this.addAddressToSVG(mySVG, 65, 20);
        }
        else {
            mySVG.data += this.addAddressToSVG(mySVG, 49, 5);
        }
        return (mySVG);
    };
    return Drukknop;
}(Electro_Item));
var EV_lader = /** @class */ (function (_super) {
    __extends(EV_lader, _super);
    function EV_lader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EV_lader.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    EV_lader.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "EV lader";
        this.props.adres = "";
    };
    EV_lader.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return EV_lader;
}(Electro_Item));
var Elektriciteitsmeter = /** @class */ (function (_super) {
    __extends(Elektriciteitsmeter, _super);
    function Elektriciteitsmeter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Elektriciteitsmeter.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Elektriciteitsmeter.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Elektriciteitsmeter";
        this.props.adres = "";
    };
    Elektriciteitsmeter.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Elektriciteitsmeter;
}(Electro_Item));
var Elektrische_oven = /** @class */ (function (_super) {
    __extends(Elektrische_oven, _super);
    function Elektrische_oven() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Elektrische_oven.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Elektrische_oven.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Elektrische oven";
        this.props.adres = "";
    };
    Elektrische_oven.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Elektrische_oven;
}(Electro_Item));
var Ketel = /** @class */ (function (_super) {
    __extends(Ketel, _super);
    function Ketel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ketel.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.keteltype = this.getLegacyKey(mykeys, 16);
        this.props.energiebron = this.getLegacyKey(mykeys, 17);
        this.props.warmtefunctie = this.getLegacyKey(mykeys, 18);
    };
    Ketel.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Ketel";
        this.props.aantal = "1";
        this.props.adres = "";
        this.props.keteltype = "";
        this.props.energiebron = "";
        this.props.warmtefunctie = "";
    };
    Ketel.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Type: " + this.selectPropToHTML('keteltype', ["", "Met boiler", "Met tapspiraal", "Warmtekrachtkoppeling", "Warmtewisselaar"]);
        output += ", Energiebron: " + this.selectPropToHTML('energiebron', ["", "Elektriciteit", "Gas (atmosferisch)", "Gas (ventilator)", "Vaste brandstof", "Vloeibare brandstof"]);
        output += ", Warmte functie: " + this.selectPropToHTML('warmtefunctie', ["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
        output += ", Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Ketel.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal > 1) {
            shifty = 15;
            mySVG.data += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
        }
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        // Leiding links
        mySVG.data += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>'
            + '<use xlink:href="#verbruiker" x="21" y="' + (shifty + 25) + '"></use>';
        // Type ketel
        switch (this.props.keteltype) {
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
        if ((this.props.energiebron != "") && (this.props.warmtefunctie != "")) {
            var shift_symbol_energiebron = 31;
            var shift_symbol_warmtefunctie = 51;
        }
        // Plaats de symbolen onderaan
        switch (this.props.energiebron) {
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
        switch (this.props.warmtefunctie) {
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
        mySVG.data += this.addAddressToSVG(mySVG, 60 + shifty, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Ketel;
}(Electro_Item));
var Koelkast = /** @class */ (function (_super) {
    __extends(Koelkast, _super);
    function Koelkast() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Koelkast.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Koelkast.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Koelkast";
        this.props.adres = "";
    };
    Koelkast.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Koelkast;
}(Electro_Item));
var Kookfornuis = /** @class */ (function (_super) {
    __extends(Kookfornuis, _super);
    function Kookfornuis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Kookfornuis.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Kookfornuis.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Kookfornuis";
        this.props.adres = "";
    };
    Kookfornuis.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Kookfornuis;
}(Electro_Item));
var Kring = /** @class */ (function (_super) {
    __extends(Kring, _super);
    function Kring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Kring.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal_polen = this.getLegacyKey(mykeys, 4);
        this.props.bescherming = this.getLegacyKey(mykeys, 7);
        this.props.amperage = this.getLegacyKey(mykeys, 8);
        this.props.type_kabel = this.getLegacyKey(mykeys, 9);
        this.props.naam = this.getLegacyKey(mykeys, 10);
        this.props.differentieel_delta_amperage = this.getLegacyKey(mykeys, 11);
        this.props.kabel_is_aanwezig = this.getLegacyKey(mykeys, 12);
        this.props.tekst = this.getLegacyKey(mykeys, 15);
        this.props.kabel_locatie = this.getLegacyKey(mykeys, 16);
        this.props.kabel_is_in_buis = this.getLegacyKey(mykeys, 19);
        this.props.differentieel_is_selectief = this.getLegacyKey(mykeys, 20);
        this.props.kortsluitvermogen = this.getLegacyKey(mykeys, 22);
        switch (this.props.bescherming) {
            case "differentieel":
                this.props.type_differentieel = this.getLegacyKey(mykeys, 17);
                break;
            case "automatisch":
                this.props.curve_automaat = this.getLegacyKey(mykeys, 17);
                break;
            case "differentieelautomaat":
                this.props.type_differentieel = this.getLegacyKey(mykeys, 17);
                this.props.curve_automaat = this.getLegacyKey(mykeys, 18);
                break;
        }
    };
    Kring.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Kring";
        this.props.nr = "";
        this.props.aantal_polen = "2";
        this.props.bescherming = "automatisch";
        this.props.amperage = "20";
        this.props.type_kabel = "XVB Cca 3G2,5";
        this.props.differentieel_delta_amperage = "300";
        this.props.tekst = "";
        this.props.kabel_locatie = "N/A";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.kabel_is_in_buis = false;
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
        //Bepalen of er per default een kabel aanwezig is en of we zekeringen plaatsen
        var parent = this.getParent();
        if (parent == null) {
            this.props.kabel_is_aanwezig = true; // Kabel aanwezig
            this.props.naam = ""; // We geven de kring geen naam als er geen parent is
        }
        else
            switch (parent.getType()) { // Selecteren op basis van parent
                case "Bord":
                    this.props.bescherming = "automatisch"; // Wel een zekering na bord
                    this.props.naam = "---"; // We zetten iets als default dat gebruikers niet vergeten een naam aan de kring te geven na een bord
                    this.props.kabel_is_aanwezig = true; // wel een kabel na bord
                    break;
                case "Splitsing":
                    this.props.bescherming = "geen"; // geen zekering per default na splitsing
                    this.props.naam = ""; // We geven de kring geen naam
                    this.props.kabel_is_aanwezig = false; // geen kabel per default na splitsing
                    break;
                case "Kring":
                    this.props.type_kabel = ""; // We geven geen kabeltype op
                    this.props.naam = ""; // We geven de kring geen naam
                    this.props.kabel_is_aanwezig = true; // wel een kabel na domotica
                    break;
                case "Domotica":
                    this.props.bescherming = "geen"; // geen zekering per default na domotica
                    this.props.naam = ""; // We geven de kring geen naam
                    this.props.kabel_is_aanwezig = true; // wel een kabel na domotica
                    break;
                default:
                    this.props.bescherming = "automatisch"; // wel een zekering na bord
                    this.props.naam = ""; // We geven de kring geen naam
                    this.props.kabel_is_aanwezig = true; // wel een kabel na bord
                    break;
            }
    };
    Kring.prototype.allowedChilds = function () {
        return ["", "Aansluiting", "Bord", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    };
    Kring.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Kring.prototype.overrideKeys = function () {
        if ((this.props.aantal_polen < 1) || (this.props.aantal_polen > 4))
            this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
        if (this.props.kabel_locatie == "Luchtleiding")
            this.props.kabel_is_in_buis = false; //Indien luchtleiding nooit een buis tekenen
        if ((this.props.bescherming != "differentieel") && (this.props.bescherming != "differentieelautomaat"))
            this.props.differentieel_is_selectief = false;
    };
    Kring.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;Naam: " + this.stringPropToHTML('naam', 5) + "<br>"
            + "Zekering: " + this.selectPropToHTML('bescherming', ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "relais", "schemer", "overspanningsbeveiliging"]);
        // Aantal polen en Ampérage
        if ((this.props.bescherming != "geen") && (this.props.bescherming != "relais"))
            output += this.selectPropToHTML('aantal_polen', ["2", "3", "4", "-", "1"]) + this.stringPropToHTML('amperage', 2) + "A";
        // Specifieke input voor differentielen en automaten
        switch (this.props.bescherming) {
            case "differentieel":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
        }
        // Eigenschappen van de kabel
        output += ", Kabel: " + this.checkboxPropToHTML('kabel_is_aanwezig');
        if (this.props.kabel_is_aanwezig) { // Kabel aanwezig
            output += ", Type: " + this.stringPropToHTML('type_kabel', 10)
                + ", Plaatsing: " + this.selectPropToHTML('kabel_locatie', ["N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand"]);
            if (this.props.kabel_locatie != "Luchtleiding")
                output += ", In buis: " + this.checkboxPropToHTML('kabel_is_in_buis');
        }
        output += ", Tekst: " + this.stringPropToHTML('tekst', 10);
        return (output);
    };
    Kring.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Bepalen of we de hele kring naar rechts moeten opschuiven om rekening te houden met symbooltjes qua kabel-locatie
        var cable_location_available = 0;
        if (this.props.kabel_is_aanwezig /* kabel aanwezig */ && (this.props.kabel_is_in_buis /* kabel in buis */ || contains(["Ondergronds", "In wand", "Op wand"], this.props.kabel_locatie))) {
            cable_location_available = 1;
        }
        // Determine how much everything needs to be shifted right
        var shiftright = /*35*/ 25 + 20 * cable_location_available;
        if (this.props.naam.length > 2) {
            shiftright = Math.max(shiftright, svgTextWidth(htmlspecialchars(this.props.naam), 12, 'font-weight="bold"') + 20);
        }
        // Alle verbruikers van de kring tekenen
        mySVG = this.sourcelist.toSVG(this.id, "vertical", shiftright);
        // Kabel tekenen
        if (this.props.kabel_is_aanwezig) { // Kabel aanwezig
            // Kabel tekenen en naam van de kabel ernaast zetten
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup + 100) + '" stroke="black" />'
                + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup + 80) + "\""
                + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup + 80) + ")"
                + "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                + htmlspecialchars(this.props.type_kabel) + "</text>";
            // Luchtleiding tekenen indien van toepassing
            if (this.props.kabel_locatie == "Luchtleiding")
                mySVG.data += '<circle cx="' + (mySVG.xleft) + '" cy="' + (mySVG.yup + 20) + '" r="4" style="stroke:black;fill:none" />';
            // Symbolen naast de kabel zetten
            if (cable_location_available) {
                if ((this.props.kabel_is_in_buis) && (this.props.kabel_locatie != "Luchtleiding")) // Rondje voor "in buis" tekenen
                    mySVG.data += '<circle cx="' + (mySVG.xleft - 10) + '" cy="' + (mySVG.yup + 40) + '" r="4" style="stroke:black;fill:none" />';
                switch (this.props.kabel_locatie) {
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
        if (this.props.differentieel_is_selectief) { //Differentieel is selectief
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
        switch (this.props.bescherming) {
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
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
                    + "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
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
                    + "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                    + "<text x=\"" + (mySVG.xleft + 26) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 26) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                        + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                        + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + "kA</text>";
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
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                break;
            case "overspanningsbeveiliging":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#overspanningsbeveiliging_inline" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 20) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 20) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                nameshift = -11; //
                break;
            case "schemer":
                mySVG.yup += 30; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                    + "<text x=\"" + (mySVG.xleft + 15) + "\" y=\"" + (mySVG.yup - 10) + "\""
                    + " transform=\"rotate(-90 " + (mySVG.xleft + 15) + "," + (mySVG.yup - 10) + ")"
                    + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>"
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
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                break;
            case "geen":
                mySVG.yup += 0; // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                break;
        }
        // Tekst naast de kring
        var tekstlocatie = mySVG.yup - 40; //Standaard staat tekst boven de zekering
        if (this.props.bescherming == "geen")
            tekstlocatie += 25; //Als er geen zekering is kan tekst naar beneden
        mySVG.data += '<text x="' + (mySVG.xleft - 6 - 20 * cable_location_available) + '" ' + 'y="' + (tekstlocatie) + '" '
            + 'transform="rotate(-90 ' + (mySVG.xleft - 6 - 20 * cable_location_available) + ',' + (tekstlocatie) + ')" '
            + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.props.tekst) + '</text>';
        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft + nameshift) + '" ' + 'y="' + (mySVG.yup + 3) + '" '
            + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
            + htmlspecialchars(this.props.naam) + '</text>';
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
var Leiding = /** @class */ (function (_super) {
    __extends(Leiding, _super);
    function Leiding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Leiding.prototype.convertLegacyKeys = function (mykeys) {
        // Niet van toepassing, element bestond nog niet toen we met legacy keys werkten
    };
    Leiding.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Leiding";
        this.props.type_kabel = "XVB Cca 3G2,5";
        this.props.kabel_locatie = "N/A";
        this.props.kabel_is_in_buis = false;
        this.props.adres = "";
    };
    Leiding.prototype.overrideKeys = function () {
        if (this.props.kabel_locatie == "Luchtleiding")
            this.props.kabel_is_in_buis = false; //Indien luchtleiding nooit een buis tekenen
    };
    Leiding.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Type: " + this.stringPropToHTML('type_kabel', 10)
            + ", Plaatsing: " + this.selectPropToHTML('kabel_locatie', ["N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand"]);
        if (this.props.kabel_locatie != "Luchtleiding")
            output += ", In buis: " + this.checkboxPropToHTML('kabel_is_in_buis');
        return (output);
    };
    Leiding.prototype.toSVG = function () {
        this.overrideKeys();
        var mySVG = new SVGelement();
        var outputstr = "";
        var width = 100;
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width - 1;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="25" x2="' + (width + 1) + '" y2="25" stroke="black" />';
        // Luchtleiding tekenen indien van toepassing
        if (this.props.kabel_locatie == "Luchtleiding")
            mySVG.data += '<circle cx="' + (80) + '" cy="' + (25) + '" r="4" style="stroke:black;fill:none" />';
        // Symbolen naast de kabel zetten
        if ((this.props.kabel_is_in_buis) && (this.props.kabel_locatie != "Luchtleiding")) // Rondje voor "in buis" tekenen
            mySVG.data += '<circle cx="' + (65) + '" cy="' + (15) + '" r="4" style="stroke:black;fill:none" />';
        switch (this.props.kabel_locatie) {
            case "Ondergronds":
                mySVG.data += '<line y1="' + (25 - 13) + '" y2="' + (25 - 13) + '" x1="' + (100 - 60 + 5) + '" x2="' + (100 - 80 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 10) + '" y2="' + (25 - 10) + '" x1="' + (100 - 62 + 5) + '" x2="' + (100 - 78 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 7) + '" y2="' + (25 - 7) + '" x1="' + (100 - 64 + 5) + '" x2="' + (100 - 76 + 5) + '" style="stroke:black" />';
                break;
            case "In wand":
                mySVG.data += '<line y1="' + (25 - 15) + '" y2="' + (25 - 15) + '" x1="' + (100 - 10 + 5) + '" x2="' + (100 - 30 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 10 + 5) + '" x2="' + (100 - 10 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 20 + 5) + '" x2="' + (100 - 20 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 30 + 5) + '" x2="' + (100 - 30 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 15) + '" x1="' + (100 - 65 + 5) + '" x2="' + (100 - 85 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 85 + 5) + '" x2="' + (100 - 85 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 65 + 5) + '" x2="' + (100 - 65 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 75 + 5) + '" x2="' + (100 - 75 + 5) + '" style="stroke:black" />';
                break;
            case "Op wand":
                mySVG.data += '<line y1="' + (25 - 5) + '" y2="' + (25 - 5) + '" x1="' + (100 - 10 + 5) + '" x2="' + (100 - 30 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 10 + 5) + '" x2="' + (100 - 10 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 20 + 5) + '" x2="' + (100 - 20 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 30 + 5) + '" x2="' + (100 - 30 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 5) + '" y2="' + (25 - 5) + '" x1="' + (100 - 65 + 5) + '" x2="' + (100 - 85 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 85 + 5) + '" x2="' + (100 - 85 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 65 + 5) + '" x2="' + (100 - 65 + 5) + '" style="stroke:black" />'
                    + '<line y1="' + (25 - 15) + '" y2="' + (25 - 5) + '" x1="' + (100 - 75 + 5) + '" x2="' + (100 - 75 + 5) + '" style="stroke:black" />';
                break;
        }
        mySVG.data += '<text x="' + (15) + '" y="' + (39) + '" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">'
            + htmlspecialchars(this.props.type_kabel) + '</text>';
        mySVG.data += "\n";
        return (mySVG);
    };
    return Leiding;
}(Electro_Item));
var Lichtpunt = /** @class */ (function (_super) {
    __extends(Lichtpunt, _super);
    function Lichtpunt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lichtpunt.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.aantal_buizen_indien_TL = this.getLegacyKey(mykeys, 13);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.type_lamp = this.getLegacyKey(mykeys, 16);
        this.props.type_noodverlichting = this.getLegacyKey(mykeys, 17);
        this.props.is_wandlamp = this.getLegacyKey(mykeys, 19);
        this.props.is_halfwaterdicht = this.getLegacyKey(mykeys, 20);
        this.props.heeft_ingebouwde_schakelaar = this.getLegacyKey(mykeys, 21);
    };
    Lichtpunt.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Lichtpunt";
        this.props.aantal = "1";
        this.props.aantal_buizen_indien_TL = "1";
        this.props.adres = "";
        this.props.type_lamp = "standaard";
        this.props.type_noodverlichting = "Geen";
        this.props.is_wandlamp = false;
        this.props.is_halfwaterdicht = false;
        this.props.heeft_ingebouwde_schakelaar = false;
    };
    Lichtpunt.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Type: " + this.selectPropToHTML('type_lamp', ["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
        if (this.props.type_lamp == "TL") {
            output += "Aantal buizen: " + this.selectPropToHTML('aantal_buizen_indien_TL', ["1", "2", "3", "4"]) + ", ";
        }
        output += "Aantal lampen: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]) + ", "
            + "Wandlamp: " + this.checkboxPropToHTML('is_wandlamp') + ", "
            + "Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht') + ", "
            + "Ingebouwde schakelaar: " + this.checkboxPropToHTML('heeft_ingebouwde_schakelaar') + ", "
            + "Noodverlichting: " + this.selectPropToHTML('type_noodverlichting', ["Geen", "Centraal", "Decentraal"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        if (this.props.is_halfwaterdicht) {
            print_str_upper = "h";
            if (parseInt(this.props.aantal) > 1)
                print_str_upper += ", x" + this.props.aantal; //Meer dan 1 lamp
        }
        else if (parseInt(this.props.aantal) > 1)
            print_str_upper = "x" + this.props.aantal;
        switch (this.props.type_lamp) {
            case "led":
                // Teken led
                mySVG.data += '<use xlink:href="#led" x="' + 30 + '" y="25" />';
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp)
                    mySVG.data += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />'; //Wandlamp
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
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
                    if ((print_str_upper.length > 2) && ((this.props.type_noodverlichting == "Centraal") || (this.props.type_noodverlichting == "Decentraal")))
                        textxpos = 40;
                    else
                        textxpos = 36;
                }
                ;
                if (print_str_upper != "")
                    mySVG.data += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                switch (this.props.type_noodverlichting) { // Type noodverlichting
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
                mySVG.data += this.addAddressToSVG(mySVG, 50, 5, 2);
                break;
            case "spot":
                // teken spot
                mySVG.data += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp)
                    mySVG.data += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
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
                    if ((print_str_upper.length > 2) && ((this.props.type_noodverlichting == "Centraal") || (this.props.type_noodverlichting == "Decentraal")))
                        textxpos = 44;
                    else
                        textxpos = 40;
                }
                if (print_str_upper != "")
                    mySVG.data += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                switch (this.props.type_noodverlichting) {
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
                mySVG.data += this.addAddressToSVG(mySVG, 52, 7, 4);
                break;
            case "TL":
                // Teken TL lampen
                var aantal_buizen = this.props.aantal_buizen_indien_TL;
                var starty = 25 - (aantal_buizen) * 3.5;
                var endy = 25 + (aantal_buizen) * 3.5;
                mySVG.data += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />'
                    + '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';
                for (var i = 0; i < aantal_buizen; i++) {
                    mySVG.data += '<line x1="30" y1="' + (starty + (i * 7) + 3.5) + '" x2="90" y2="' + (starty + (i * 7) + 3.5) + '" stroke="black" stroke-width="2" />';
                }
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp)
                    mySVG.data += '<line x1="50" y1="' + (27 + (aantal_buizen * 3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen * 3.5)) + '" stroke="black" />';
                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "")
                    mySVG.data += '<text x="60" y="' + (25 - (aantal_buizen * 3.5)) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
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
                switch (this.props.type_noodverlichting) {
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
                mySVG.data += this.addAddressToSVG(mySVG, endy + 13, Math.max(mySVG.ydown, endy + 18 - 25), 2);
                break;
            default: //Normaal lichtpunt (kruisje)
                switch (this.props.type_noodverlichting) {
                    case "Centraal":
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />'
                            + '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                        if (this.heeftVerbruikerAlsKind())
                            mySVG.data += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 11) + '" y2="25" stroke="black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                        if (this.props.heeft_ingebouwde_schakelaar)
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
                if (this.props.is_wandlamp)
                    mySVG.data += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar)
                    mySVG.data += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 39;
                mySVG.data += this.addAddressToSVG(mySVG, 54, 10, -1);
                break;
        }
        mySVG.data += "\n";
        return (mySVG);
    };
    return Lichtpunt;
}(Electro_Item));
var Media = /** @class */ (function (_super) {
    __extends(Media, _super);
    function Media() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Media.prototype.convertLegacyKeys = function (mykeys) {
        //Nothing to do since Media did not exist when Legacy Keys where still a thing
    };
    Media.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Media";
        this.props.adres = "";
        this.props.aantal = 1;
        this.props.symbool = "";
    };
    Media.prototype.overrideKeys = function () {
        if (this.props.symbool == 'luidspreker') {
            if (this.props.aantal < 1)
                this.props.aantal = 1;
            if (this.props.aantal > 20)
                this.props.aantal = 20;
        }
        else {
            this.props.aantal = 1;
        }
    };
    Media.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Symbool: " + this.selectPropToHTML('symbool', ["", "luidspreker"]);
        if (this.props.symbool == 'luidspreker') {
            output += ", Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        }
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Media.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal > 1) {
            shifty = 15;
            mySVG.data += '<text x="31" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        switch (this.props.symbool) {
            case "luidspreker":
                mySVG.data += '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black"></line>'
                    + '<use xlink:href="#luidspreker" x="21" y="' + (25 + shifty) + '"></use>';
                mySVG.xright = 36;
                mySVG.data += this.addAddressToSVG(mySVG, 60 + shifty, 15, 0);
                break;
            default:
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                mySVG.xright = 19;
                break;
        }
        return (mySVG);
    };
    return Media;
}(Electro_Item));
var Meerdere_verbruikers = /** @class */ (function (_super) {
    __extends(Meerdere_verbruikers, _super);
    function Meerdere_verbruikers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Meerdere_verbruikers.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Meerdere_verbruikers.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Meerdere verbruikers"; // This is rather a formality as we should already have this at this stage
        this.props.adres = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Meerdere_verbruikers.prototype.allowedChilds = function () {
        return ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Media", "Microgolfoven", "Motor", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    };
    Meerdere_verbruikers.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Meerdere_verbruikers.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        if ((!(/^\s*$/.test(this.props.adres))) && (this.heeftKindMetGekendType())) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (mySVG.yup + mySVG.ydown + 10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
        }
        return (mySVG);
    };
    return Meerdere_verbruikers;
}(Electro_Item));
var Microgolfoven = /** @class */ (function (_super) {
    __extends(Microgolfoven, _super);
    function Microgolfoven() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Microgolfoven.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Microgolfoven.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Microgolfoven";
        this.props.adres = "";
    };
    Microgolfoven.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Microgolfoven;
}(Electro_Item));
var Motor = /** @class */ (function (_super) {
    __extends(Motor, _super);
    function Motor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Motor.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Motor.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Motor";
        this.props.adres = "";
    };
    Motor.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Motor;
}(Electro_Item));
var Omvormer = /** @class */ (function (_super) {
    __extends(Omvormer, _super);
    function Omvormer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Omvormer.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Omvormer.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Omvormer";
        this.props.adres = "";
    };
    Omvormer.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Omvormer;
}(Electro_Item));
var Overspanningsbeveiliging = /** @class */ (function (_super) {
    __extends(Overspanningsbeveiliging, _super);
    function Overspanningsbeveiliging() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Overspanningsbeveiliging.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Overspanningsbeveiliging.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Overspanningsbeveiliging";
        this.props.adres = "";
    };
    Overspanningsbeveiliging.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Overspanningsbeveiliging;
}(Electro_Item));
var Splitsing = /** @class */ (function (_super) {
    __extends(Splitsing, _super);
    function Splitsing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Splitsing.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Splitsing.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Splitsing"; // This is rather a formality as we should already have this at this stage
        this.props.adres = ""; // Set Adres/tekst to "" when the item is cleared
    };
    Splitsing.prototype.allowedChilds = function () {
        return ["", "Kring"];
    };
    Splitsing.prototype.getMaxNumChilds = function () {
        return 256;
    };
    Splitsing.prototype.toHTML = function (mode, Parent) {
        var output = this.toHTMLHeader(mode);
        return (output);
    };
    Splitsing.prototype.toSVG = function () {
        var mySVG; // = new SVGelement();
        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id, "horizontal");
        var parent = this.getParent();
        // Teken de lijn onderaan
        if ((parent.getType() == "Aansluiting") || (parent.getType() == "Kring")) {
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
    function Stoomoven() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stoomoven.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Stoomoven.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Stoomoven";
        this.props.adres = "";
    };
    Stoomoven.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Stoomoven;
}(Electro_Item));
var Transformator = /** @class */ (function (_super) {
    __extends(Transformator, _super);
    function Transformator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transformator.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.voltage = this.getLegacyKey(mykeys, 14);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Transformator.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Transformator";
        this.props.voltage = "230V/24V";
        this.props.adres = "";
    };
    Transformator.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Voltage: " + this.stringPropToHTML('voltage', 8)
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
            htmlspecialchars(this.props.voltage) + "</text>";
        mySVG.data += this.addAddressToSVG(mySVG, 58, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Transformator;
}(Electro_Item));
var USB_lader = /** @class */ (function (_super) {
    __extends(USB_lader, _super);
    function USB_lader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    USB_lader.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    USB_lader.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "USB lader"; // This is rather a formality as we should already have this at this stage
        this.props.aantal = "1"; // Per default 1 lader
        this.props.adres = ""; // Set Adres/tekst to "" when the item is cleared
    };
    USB_lader.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    USB_lader.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal > 1) {
            shifty = 12;
            mySVG.data += '<text x="51" y="14" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
        }
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 79;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>'
            + '<use xlink:href="#usblader" x="21" y="' + (shifty + 25) + '"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 55 + shifty, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return USB_lader;
}(Electro_Item));
var Vaatwasmachine = /** @class */ (function (_super) {
    __extends(Vaatwasmachine, _super);
    function Vaatwasmachine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vaatwasmachine.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Vaatwasmachine.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Vaatwasmachine";
        this.props.adres = "";
    };
    Vaatwasmachine.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Vaatwasmachine;
}(Electro_Item));
var Ventilator = /** @class */ (function (_super) {
    __extends(Ventilator, _super);
    function Ventilator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ventilator.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Ventilator.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Ventilator";
        this.props.adres = "";
    };
    Ventilator.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Ventilator;
}(Electro_Item));
var Verbruiker = /** @class */ (function (_super) {
    __extends(Verbruiker, _super);
    function Verbruiker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verbruiker.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.tekst = this.getLegacyKey(mykeys, 15);
        this.props.horizontale_uitlijning = this.getLegacyKey(mykeys, 17);
        this.props.heeft_automatische_breedte = this.getLegacyKey(mykeys, 18);
        this.props.is_vet = this.getLegacyKey(mykeys, 19);
        this.props.is_cursief = this.getLegacyKey(mykeys, 20);
        this.props.breedte = this.getLegacyKey(mykeys, 22);
        this.props.adres = this.getLegacyKey(mykeys, 23);
    };
    Verbruiker.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Verbruiker";
        this.props.tekst = "";
        this.props.horizontale_uitlijning = "centreer";
        this.props.heeft_automatische_breedte = "automatisch";
        this.props.breedte = "";
        this.props.is_vet = false;
        this.props.is_cursief = false;
        this.props.adres = "";
    };
    Verbruiker.prototype.overrideKeys = function () {
        if (this.props.heeft_automatische_breedte != "automatisch") {
            this.props.heeft_automatische_breedte = "handmatig";
        }
        this.adjustTextWidthIfAuto();
    };
    Verbruiker.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Tekst (nieuwe lijn = \"|\"): " + this.stringPropToHTML('tekst', 30)
            + ", Breedte: " + this.selectPropToHTML('heeft_automatische_breedte', ["automatisch", "handmatig"]);
        if (this.props.heeft_automatische_breedte != "automatisch")
            output += " " + this.stringPropToHTML('breedte', 3);
        output += ", Vet: " + this.checkboxPropToHTML('is_vet')
            + ", Cursief: " + this.checkboxPropToHTML('is_cursief')
            + ", Horizontale alignering: " + this.selectPropToHTML('horizontale_uitlijning', ["links", "centreer", "rechts"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 2);
        return (output);
    };
    Verbruiker.prototype.adjustTextWidthIfAuto = function () {
        if (this.props.heeft_automatische_breedte === "automatisch") {
            var options = "";
            if (this.props.is_vet)
                options += ' font-weight="bold"';
            if (this.props.is_cursief)
                options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.props.tekst).split("|");
            var width = 40;
            for (var i = 0; i < strlines.length; i++) {
                width = Math.round(Math.max(width, svgTextWidth(strlines[i], 10, options) + 10));
            }
            this.props.breedte = String(width);
        }
    };
    Verbruiker.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var strlines = htmlspecialchars(this.props.tekst).split("|");
        // Voldoende ruimte voorzien voor alle elementen
        this.adjustTextWidthIfAuto();
        var width = (isNaN(Number(this.props.breedte)) || (this.props.breedte === "") ? 40 : Math.max(Number(this.props.breedte) * 1, 1));
        // Breedte van de vrije tekst bepalen
        var extraplace = 15 * Math.max(strlines.length - 2, 0);
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20 + width;
        mySVG.yup = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0; // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        // Optionele parameters voor vet en italic uitlezen
        var options = "";
        if (this.props.is_vet)
            options += ' font-weight="bold"';
        if (this.props.is_cursief)
            options += ' font-style="italic"';
        // Tekst plaatsen --
        var outputstr_common;
        switch (this.props.horizontale_uitlijning) {
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
            + this.addAddressToSVG(mySVG, 60 + extraplace, 15, width / 2 - (mySVG.xright - 20) / 2);
        return (mySVG);
    };
    return Verbruiker;
}(Electro_Item));
var Verlenging = /** @class */ (function (_super) {
    __extends(Verlenging, _super);
    function Verlenging() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verlenging.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.breedte = this.getLegacyKey(mykeys, 22);
        this.props.adres = this.getLegacyKey(mykeys, 23);
    };
    Verlenging.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Verlenging";
        this.props.breedte = "40";
        this.props.adres = "";
    };
    Verlenging.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Breedte: " + this.stringPropToHTML('breedte', 3)
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Verlenging.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        var width;
        if (isNaN(Number(this.props.breedte))) {
            width = 40;
        }
        else {
            if (Number(this.props.breedte == "")) {
                width = 40;
            }
            else {
                width = Math.max(Number(this.props.breedte) * 1, 0);
            }
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width - 1;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="25" x2="' + (width + 1) + '" y2="25" stroke="black" />';
        mySVG.data += this.addAddressToSVG(mySVG, 40, 0, width / 2 - mySVG.xright / 2 - 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Verlenging;
}(Electro_Item));
var Verwarmingstoestel = /** @class */ (function (_super) {
    __extends(Verwarmingstoestel, _super);
    function Verwarmingstoestel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verwarmingstoestel.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.heeft_accumulatie = this.getLegacyKey(mykeys, 3);
        this.props.heeft_ventilator = this.getLegacyKey(mykeys, 6);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Verwarmingstoestel.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Verwarmingstoestel";
        this.props.heeft_accumulatie = false;
        this.props.heeft_ventilator = false;
        this.props.adres = "";
    };
    Verwarmingstoestel.prototype.overrideKeys = function () {
        if (!this.props.heeft_accumulatie)
            this.props.heeft_ventilator = false; //Indien geen accumulatie kan er ook geen ventilator zijn
    };
    Verwarmingstoestel.prototype.toHTML = function (mode) {
        this.overrideKeys;
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Accumulatie: " + this.checkboxPropToHTML('heeft_accumulatie')
            + (this.props.heeft_accumulatie ? ", Ventilator: " + this.checkboxPropToHTML('heeft_ventilator') : "")
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                break;
            case true:
                switch (this.props.heeft_ventilator) { //ventilator
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
        mySVG.data += this.addAddressToSVG(mySVG, 55, 10);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Verwarmingstoestel;
}(Electro_Item));
var Vrije_ruimte = /** @class */ (function (_super) {
    __extends(Vrije_ruimte, _super);
    function Vrije_ruimte() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vrije_ruimte.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.breedte = this.getLegacyKey(mykeys, 22);
    };
    Vrije_ruimte.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Vrije ruimte"; // This is rather a formality as we should already have this at this stage
        this.props.breedte = 25; // Default breedte van de vrije ruimte
    };
    Vrije_ruimte.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;Breedte: " + this.stringPropToHTML('breedte', 3);
        return (output);
    };
    Vrije_ruimte.prototype.getMaxNumChilds = function () {
        return 0;
    };
    Vrije_ruimte.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Bepaal breedte van het element
        var desiredwidth = Number(this.props.breedte);
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
    function Vrije_tekst() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vrije_tekst.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.tekst = this.getLegacyKey(mykeys, 15);
        this.props.vrije_tekst_type = this.getLegacyKey(mykeys, 16);
        this.props.horizontale_uitlijning = this.getLegacyKey(mykeys, 17);
        this.props.heeft_automatische_breedte = this.getLegacyKey(mykeys, 18);
        this.props.is_vet = this.getLegacyKey(mykeys, 19);
        this.props.is_cursief = this.getLegacyKey(mykeys, 20);
        this.props.breedte = this.getLegacyKey(mykeys, 22);
        this.props.adres = this.getLegacyKey(mykeys, 23);
    };
    Vrije_tekst.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Vrije tekst";
        this.props.tekst = "";
        this.props.vrije_tekst_type = "zonder kader";
        this.props.horizontale_uitlijning = "links";
        this.props.heeft_automatische_breedte = "automatisch";
        this.props.breedte = "";
        this.props.is_vet = false;
        this.props.is_cursief = false;
        this.props.adres = "";
    };
    Vrije_tekst.prototype.overrideKeys = function () {
        if (this.props.vrije_tekst_type != "verbruiker") {
            this.props.vrije_tekst_type = "zonder kader";
        }
        if (this.props.heeft_automatische_breedte != "automatisch") {
            this.props.heeft_automatische_breedte = "handmatig";
        }
        if (this.heeftVerbruikerAlsKind()) {
            this.props.vrije_tekst_type = "verbruiker";
        }
        this.adjustTextWidthIfAuto();
    };
    Vrije_tekst.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Tekst (nieuwe lijn = \"|\"): " + this.stringPropToHTML('tekst', 30)
            + ", Breedte: " + this.selectPropToHTML('heeft_automatische_breedte', ["automatisch", "handmatig"]);
        if (this.props.heeft_automatische_breedte != "automatisch")
            output += " " + this.stringPropToHTML('breedte', 3);
        output += ", Vet: " + this.checkboxPropToHTML('is_vet')
            + ", Cursief: " + this.checkboxPropToHTML('is_cursief')
            + ", Horizontale alignering: " + this.selectPropToHTML('horizontale_uitlijning', ["links", "centreer", "rechts"])
            + ", Type: " + this.selectPropToHTML('vrije_tekst_type', (this.heeftVerbruikerAlsKind() ? ["verbruiker"] : ["verbruiker", "zonder kader"]));
        if (this.props.vrije_tekst_type != "zonder kader")
            output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Vrije_tekst.prototype.adjustTextWidthIfAuto = function () {
        if (this.props.heeft_automatische_breedte === "automatisch") {
            var options = "";
            if (this.props.is_vet)
                options += ' font-weight="bold"';
            if (this.props.is_cursief)
                options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.props.tekst).split("|");
            var width = 40;
            for (var i = 0; i < strlines.length; i++) {
                width = Math.round(Math.max(width, svgTextWidth(strlines[i], 10, options) + 10));
            }
            this.props.breedte = String(width);
        }
    };
    Vrije_tekst.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var strlines = htmlspecialchars(this.props.tekst).split("|");
        // Breedte van de vrije tekst bepalen
        this.adjustTextWidthIfAuto();
        var width = (isNaN(Number(this.props.breedte)) || (this.props.breedte === "") ? 40 : Math.max(Number(this.props.breedte) * 1, 1));
        // Voldoende ruimte voorzien voor alle elementen
        var extraplace = 15 * Math.max(strlines.length - 2, 0);
        var shiftx;
        if (this.props.vrije_tekst_type === "zonder kader") {
            if (this.getParent().getType() === "Kring")
                shiftx = 10;
            else if (this.getParent().getType() === "Contactdoos")
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
        if (this.props.is_vet)
            options += ' font-weight="bold"';
        if (this.props.is_cursief)
            options += ' font-style="italic"';
        // Tekst plaatsen --
        var outputstr_common;
        switch (this.props.horizontale_uitlijning) {
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
        switch (this.props.vrije_tekst_type) {
            case "zonder kader": break;
            default: //Wegens compatibiliteit met oudere versies van de software is het ontbreken van eender welke parameter een "met kader"
                mySVG.data += '<line x1="1" y1="' + (25 + extraplace / 2.0) + '" x2="21" y2="' + (25 + extraplace / 2.0) + '" stroke="black" />'
                    + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
                    + this.addAddressToSVG(mySVG, 60 + extraplace, 15, width / 2 - (mySVG.xright - 20) / 2);
                break;
        }
        return (mySVG);
    };
    return Vrije_tekst;
}(Electro_Item));
var Warmtepomp = /** @class */ (function (_super) {
    __extends(Warmtepomp, _super);
    function Warmtepomp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Warmtepomp.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.warmtefunctie = this.getLegacyKey(mykeys, 18);
    };
    Warmtepomp.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Warmtepomp/airco";
        this.props.aantal = "1";
        this.props.adres = "";
        this.props.warmtefunctie = "Koelend";
    };
    Warmtepomp.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Warmte functie: " + this.selectPropToHTML('warmtefunctie', ["", "Koelend", "Verwarmend", "Verwarmend en koelend"])
            + ", Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Warmtepomp.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal > 1) {
            shifty = 15;
            mySVG.data += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
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
        if (this.props.warmtefunctie != "") {
            var shift_symbol_energiebron = 31;
            var shift_symbol_warmtefunctie = 51;
        }
        mySVG.data += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
        switch (this.props.warmtefunctie) {
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
        mySVG.data += this.addAddressToSVG(mySVG, 60 + shifty, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Warmtepomp;
}(Electro_Item));
var Wasmachine = /** @class */ (function (_super) {
    __extends(Wasmachine, _super);
    function Wasmachine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wasmachine.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Wasmachine.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Wasmachine";
        this.props.adres = "";
    };
    Wasmachine.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
        mySVG.data += "\n";
        return (mySVG);
    };
    return Wasmachine;
}(Electro_Item));
var Zekering = /** @class */ (function (_super) {
    __extends(Zekering, _super);
    function Zekering() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zekering.prototype.convertLegacyKeys = function (mykeys) { }; // Not needed as this element didn't exist when we still had legacy keys
    Zekering.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Zekering/differentieel"; // This is rather a formality as we should already have this at this stage
        this.props.nr = "";
        this.props.aantal_polen = "2";
        this.props.bescherming = "automatisch";
        this.props.amperage = "20";
        this.props.differentieel_delta_amperage = "300";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
    };
    Zekering.prototype.overrideKeys = function () {
        if ((this.props.aantal_polen < 1) || (this.props.aantal_polen > 4))
            this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
        if ((this.props.bescherming != "differentieel") && (this.props.bescherming != "differentieelautomaat"))
            this.props.differentieel_is_selectief = false;
        if (!this.isChildOf("Kring"))
            this.props.nr = "";
    };
    Zekering.prototype.toHTML = function (mode) {
        this.overrideKeys();
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;";
        if (this.isChildOf("Kring"))
            output = output + this.nrToHtml();
        output = output + this.selectPropToHTML('bescherming', ["automatisch", "differentieel", "differentieelautomaat", "smelt"]);
        // Aantal polen en Ampérage
        if ((this.props.bescherming != "geen"))
            output += this.selectPropToHTML('aantal_polen', ["2", "3", "4", "-", "1"]) + this.stringPropToHTML('amperage', 2) + "A";
        // Specifieke input voor differentielen en automaten
        switch (this.props.bescherming) {
            case "differentieel":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitvermogen: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
        }
        return (output);
    };
    Zekering.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 50;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += '<line x1="1" y1="' + (25) + '" x2="21" y2="' + (25) + '" stroke="black"></line>';
        var numlines = 1; // Hier houden we het aantal lijnen tekst bij
        switch (this.props.bescherming) {
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                    + '<text x="' + (21 + 10) + '" y="' + (25 + 15) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + '</text>';
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + 'kA</text>';
                }
                break;
            case "differentieel":
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                    + '<text x="' + (21 + 10) + '" y="' + (25 + 15) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + '\u0394' + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + '</text>'
                    + '<text x="' + (21 + 10) + '" y="' + (25 + 15 + 11) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("Type " + this.props.type_differentieel) + '</text>';
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + 'kA</text>';
                }
                break;
            case "differentieelautomaat":
                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                    + '<text x="' + (21 + 10) + '" y="' + (25 + 15) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + '\u0394' + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + '</text>'
                    + '<text x="' + (21 + 10) + '" y="' + (25 + 15 + 11) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';
                // Code om de curve toe te voegen
                if ((this.props.curve_automaat == 'B') || (this.props.curve_automaat == 'C') || (this.props.curve_automaat == 'D')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("Curve " + this.props.curve_automaat) + '</text>';
                }
                // Code om het type toe te voegen
                if ((this.props.type_differentieel == 'A') || (this.props.type_differentieel == 'B')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("Type " + this.props.type_differentieel) + '</text>';
                }
                // Code om kortsluitvermogen toe te voegen
                if ((this.props.kortsluitvermogen != '')) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                        + htmlspecialchars("" + this.props.kortsluitvermogen) + 'kA</text>';
                }
                break;
            case "smelt":
                mySVG.data += '<use xlink:href="#zekering_smelt_horizontaal" x="21" y="25" />'
                    + '<text x="' + (21 + 14) + '" y="' + (25 + 20) + '" '
                    + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                    + htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';
                break;
        }
        mySVG.ydown = mySVG.ydown + 11 * (numlines - 1);
        // Selectief differentieel tekenen indien van toepassing
        if (this.props.differentieel_is_selectief) { //Differentieel is selectief
            mySVG.data += '<line x1="' + (mySVG.xright + 2) + '" x2="' + (mySVG.xright + 2 + 30) + '" y1="25" y2="25" stroke="black" />'
                + '<rect x="' + (mySVG.xright + 8) + '" y="32" width="16" height="16" stroke="black" fill="white" />'
                + '<text x="' + (mySVG.xright + 16) + '" y="' + (25 + 19) + '" '
                + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + 'S' + '</text>';
            mySVG.xright = mySVG.xright + 30;
        }
        mySVG.data += "\n";
        return (mySVG);
    };
    return Zekering;
}(Electro_Item));
var Zeldzame_symbolen = /** @class */ (function (_super) {
    __extends(Zeldzame_symbolen, _super);
    function Zeldzame_symbolen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zeldzame_symbolen.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
        this.props.symbool = this.getLegacyKey(mykeys, 16);
    };
    Zeldzame_symbolen.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Zeldzame symbolen";
        this.props.adres = "";
        this.props.symbool = "";
    };
    Zeldzame_symbolen.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + "Symbool: " + this.selectPropToHTML('symbool', ["", "deurslot"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Zeldzame_symbolen.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        switch (this.props.symbool) {
            case "deurslot":
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                    + '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddressToSVG(mySVG, 55, 10, 2);
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
    function Zonnepaneel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zonnepaneel.prototype.convertLegacyKeys = function (mykeys) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.aantal = this.getLegacyKey(mykeys, 4);
        this.props.nr = this.getLegacyKey(mykeys, 10);
        this.props.adres = this.getLegacyKey(mykeys, 15);
    };
    Zonnepaneel.prototype.resetProps = function () {
        this.clearProps();
        this.props.type = "Zonnepaneel";
        this.props.aantal = "1";
        this.props.adres = "";
    };
    Zonnepaneel.prototype.toHTML = function (mode) {
        var output = this.toHTMLHeader(mode);
        output += "&nbsp;" + this.nrToHtml()
            + " Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"])
            + ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
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
            + '<text x="45" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.props.aantal) + 'x</text>';
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddressToSVG(mySVG, 70, 15);
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
        this.control = "";
        this.dpi = 300;
        this.info = "1 x 230V + N ~50 Hz";
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
        var output = "\n    <defs>\n    <pattern id=\"VerticalStripe\"\n      x=\"5\" y=\"0\" width=\"5\" height=\"10\"\n      patternUnits=\"userSpaceOnUse\" >\n      <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"10\" stroke=\"black\" />\n    </pattern>\n    <g id=\"batterij\">\n      <rect x=\"0\" y=\"-12\" width=\"40\" height=\"27\" stroke=\"black\" fill=\"none\"/>\n      <rect x=\"5\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n      <rect x=\"25\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n      <line x1=\"8\" y1=\"-5\" x2=\"12\" y2=\"-5\" stroke=\"black\"/>\n      <line x1=\"10\" y1=\"-7\" x2=\"10\" y2=\"-3\" stroke=\"black\"/>\n      <line x1=\"28\" y1=\"-5\" x2=\"32\" y2=\"-5\" stroke=\"black\"/>\n    </g>\n    <g id=\"deurslot\">\n      <line x1=\"1\" y1=\"-15\" x2=\"31\" y2=\"-15\" stroke=\"black\"/>\n      <line x1=\"1\" y1=\"15\"  x2=\"46\" y2=\"15\" stroke=\"black\"/>\n      <line x1=\"1\" y1=\"-15\" x2=\"1\" y2=\"15\" stroke=\"black\"/>\n      <line x1=\"31\" y1=\"-15\" x2=\"46\" y2=\"15\" stroke=\"black\"/>\n      <path d=\"M 7 3 A 6 6 0 0 1 19 3 A 6 6 0 0 1 31 3\" stroke=\"black\" fill=\"none\" />\n    </g>\n    <g id=\"ster\">\n      <line x1=\"0\" y1=\"-5\" x2=\"0\" y2=\"5\" style=\"stroke:black\" />\n      <line x1=\"-4.33\" y1=\"-2.5\" x2=\"4.33\" y2=\"2.5\" style=\"stroke:black\" />\n      <line x1=\"-4.66\" y1=\"2.5\" x2=\"4.33\" y2=\"-2.5\" style=\"stroke:black\" />\n    </g>\n    <g id=\"EVlader\">\n      <rect x=\"0\" y=\"13\" width=\"40\" height=\"7\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"7\" y2=\"0\" style=\"stroke:black\" />\n      <line x1=\"7\" y1=\"-20\" x2=\"7\" y2=\"13\" style=\"stroke:black\" />\n      <line x1=\"33\" y1=\"-20\" x2=\"33\" y2=\"13\" style=\"stroke:black\" />\n      <line x1=\"7\" y1=\"-20\" x2=\"33\" y2=\"-20\" style=\"stroke:black\" />\n      <rect x=\"10\" y=\"-17\" width=\"20\" height=\"8\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"20\" y1=\"-6\" x2=\"20\" y2=\"10\" style=\"stroke:black\" />\n      <line x1=\"33\" y1=\"-6\" x2=\"36\" y2=\"-6\" style=\"stroke:black\" />\n      <line x1=\"36\" y1=\"-6\" x2=\"36\" y2=\"4\" style=\"stroke:black\" />\n      <line x1=\"36\" y1=\"4\" x2=\"39\" y2=\"4\" style=\"stroke:black\" />\n      <line x1=\"39\" y1=\"4\" x2=\"39\" y2=\"-15\" style=\"stroke:black\" />\n      <line x1=\"39\" y1=\"-6\" x2=\"39\" y2=\"-15\" style=\"stroke:black;stroke-width:2\" />\n      <text x=\"15\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n      <text x=\"25\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n      <text x=\"15\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n      <text x=\"25\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n    </g>\n    <g id=\"lamp\">\n      <line x1=\"-10.61\" y1=\"-10.61\" x2=\"10.61\" y2=\"10.61\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-10.61\" y1=\"10.61\" x2=\"10.61\" y2=\"-10.61\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"led\">\n      <line x1=\"0\" y1=\"-7\" x2=\"0\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"-7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"12\" y1=\"-7\" x2=\"12\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"6\" y1=\"-6\" x2=\"7\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"8.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"5.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"9\" y1=\"-6\" x2=\"10\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"11.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"8.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"luidspreker\">\n      <polygon points=\"0,-10 7,-10 17,-20 17,20 7,10 0,10\" fill=\"none\" stroke=\"black\"/>\n      <line x1=\"7\" y1=\"-10\" x2=\"7\" y2=\"10\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"magneetcontact\">\n      <rect x=\"0\" y=\"-10\" width=\"20\" height=\"20\" fill=\"black\" stroke=\"black\"/>\n    </g>\n    <g id=\"sinus\">\n      <path d=\"M0,0 C2,-5 8,-5 10,0 S18,5 20,0\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"spot\">\n      <path d=\"M0 0 A10 10 0 0 1 10 -10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <path d=\"M0 0 A10 10 0 0 0 10 10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <circle cx=\"10\" cy=\"0\" r=\"6\" style=\"stroke:black;fill:white\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"-4.24\" y2=\"4.24\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"4.24\" y2=\"-4.24\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"noodlamp_decentraal\">\n      <rect x=\"-10.61\" y=\"-10.61\" width=\"21.22\" height=\"21.22\" fill=\"white\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:black\" />\n      <line x1=\"-7\" y1=\"-7\" x2=\"7\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-7\" y1=\"7\" x2=\"7\" y2=\"-7\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"signalisatielamp\">\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"-3\" x2=\"3\" y2=\"3\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"3\" x2=\"3\" y2=\"-3\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_klein\">\n      <line x1=\"0\" y1=\"0\" x2=\"6\" y2=\"-12\" stroke=\"black\" />\n      <line x1=\"6\" y1=\"-12\" x2=\"9\" y2=\"-10.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"3\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_trippel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <line x1=\"6\" y1=\"-12\" x2=\"11\" y2=\"-9.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_rolluik\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <rect x=\"-8\" y=\"-8\" width=\"16\" height=\"16\" fill=\"white\" stroke=\"black\" />\n      <text x=\"0\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">S</text>\n    </g>\n    <g id=\"schakelaar_enkel_dim\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_dim\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_kruis_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"20\" x2=\"15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbelaansteking\">\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"-8\" y1=\"16\" x2=\"-13\" y2=\"13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"aansluitpunt\">\n      <circle cx=\"5\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"aftakdoos\">\n      <circle cx=\"15\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"15\" cy=\"0\" r=\"7.5\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"bewegingsschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"10\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"10\" y=\"-13\" width=\"30\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"13\" x2=\"40\" y2=\"-13\"  stroke=\"black\" />\n      <line x1=\"15\" y1=\"-5\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"25\" y2=\"-10\"  stroke=\"black\" />\n      <text x=\"22\" y=\"11\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"10\">PIR</text>\n    </g>\n    <g id=\"schakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"schemerschakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n      <use xlink:href=\"#arrow\" x=\"14\" y=\"-17\" transform=\"rotate(90 14 -17)\" />\n      <use xlink:href=\"#arrow\" x=\"18\" y=\"-17\" transform=\"rotate(90 18 -17)\" />\n    </g>\n    <g id=\"contactdoos\">\n      <path d=\"M20 0 A15 15 0 0 1 35 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 35 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"stoomoven\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <path d=\"M 6 -2 A 7 5 0 0 1 13 -7 A 7 5 0 0 1 27 -7 A 7 5 0 0 1 33 -2\" stroke=\"black\" fill=\"none\" />\n      <path d=\"M 6  5 A 7 5 0 0 1 13  0 A 7 5 0 0 1 27  0 A 7 5 0 0 1 33  5\" stroke=\"black\" fill=\"none\" />\n      <path d=\"M 6 12 A 7 5 0 0 1 13  7 A 7 5 0 0 1 27  7 A 7 5 0 0 1 33 12\" stroke=\"black\" fill=\"none\" />\n    </g>\n    <g id=\"contactdoos_aarding\">\n      <line x1=\"20\" y1=\"-15\" x2=\"20\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"contactdoos_kinderveilig\">\n      <line x1=\"35\" y1=\"-20\" x2=\"35\" y2=\"-14.1\"  stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"35\" y1=\"20\" x2=\"35\" y2=\"14.1\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"bel\">\n      <path d=\"M20 0 A15 15 0 0 1 0 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 0 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"15\" x2=\"0\" y2=\"-15\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"boiler\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"boiler_accu\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"motor\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">M</text>\n    </g>\n    <g id=\"elektriciteitsmeter\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-6\" x2=\"40\" y2=\"-6\" stroke=\"black\" stroke-width=\"1\" />\n      <text x=\"20\" y=\"10\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"12\">kWh</text>\n    </g>\n    <g id=\"diepvriezer\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"10\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"30\" y=\"0\" />\n    </g>\n    <g id=\"zonnepaneel\">\n      <rect x=\"0\" y=\"-20\" width=\"50\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"50\" y2=\"0\" stroke=\"black\" />\n      <use xlink:href=\"#arrow\" x=\"5\" y=\"-12\" transform=\"rotate(45 5 -10)\" />\n      <use xlink:href=\"#arrow\" x=\"10\" y=\"-14\" transform=\"rotate(45 10 -14)\" />\n    </g>\n    <g id=\"drukknop_klein\">\n      <circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"8\" cy=\"0\" r=\"4\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"draadloos_klein\">\n      <path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 7 -5 A 8 8 0 0 1 7 5\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 4 -3 A 6 6 0 0 1 4 3\" stroke=\"black\" fill=\"none\" /> \n    </g>\n    <g id=\"detectie_klein\">\n      <path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n      <path d=\"M 5 -7 A 10 10 0 0 1 5 7\" stroke=\"black\" fill=\"none\" /> \n    </g>\n    <g id=\"drukknop\">\n      <circle cx=\"12\" cy=\"0\" r=\"12\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"12\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"teleruptor\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"6\" x2=\"32\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"16\" y1=\"-6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"-6\" x2=\"24\" y2=\"6\"  stroke=\"black\" />\n    </g>\n    <g id=\"dimmer\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"-5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n    </g>\n    <g id=\"relais\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"-13\" x2=\"30\" y2=\"13\"  stroke=\"black\" />\n    </g>\n    <g id=\"minuterie\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\">t</text>\n    </g>\n    <g id=\"thermostaat\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"12\" y1=\"0\" x2=\"28\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"tijdschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"11\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"10\" y1=\"0\"  x2=\"17\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"11\" y1=\"-6\" x2=\"11\" y2=\"1\"  stroke=\"black\" />\n      <line x1=\"21\" y1=\"0\"  x2=\"25\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"25\" y1=\"0\"  x2=\"31\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"31\" y1=\"0\"  x2=\"36\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"tijdschakelaar_klein\">\n      <circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n      <line x1=\"7\" y1=\"0\"  x2=\"13\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"8\" y1=\"-5\" x2=\"8\" y2=\"1\"  stroke=\"black\" />\n    </g>\n    <g id=\"droogkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"15\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"25\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"omvormer\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"20\" x2=\"40\" y2=\"-20\" stroke=\"black\" />\n      <use xlink:href=\"#sinus\" x=\"5\" y=\"-12\" />\"\n      <line x1=\"20\" y1=\"10\" x2=\"35\" y2=\"10\" stroke=\"black\" />\n      <line x1=\"20\" y1=\"13\" x2=\"35\" y2=\"13\" stroke=\"black\" stroke-dasharray=\"3\" />\n    </g>\n    <g id=\"overspanningsbeveiliging\">\n      <rect x=\"0\" y=\"-15\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"7.5\" y1=\"-18\" x2=\"7.5\" y2=\"-5\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"-5\" x2=\"4.5\" y2=\"-9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"-5\" x2=\"10.5\" y2=\"-9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"18\" x2=\"7.5\" y2=\"5\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"5\" x2=\"4.5\" y2=\"9\" stroke=\"black\" />\n      <line x1=\"7.5\" y1=\"5\" x2=\"10.5\" y2=\"9\" stroke=\"black\" />\n    </g>\n    <g id=\"koelkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\"\n    </g>\n    <g id=\"kookfornuis\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"-10\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"microgolf\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"-10\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"0\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"10\" />\"\n    </g>\n    <g id=\"oven\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-5\" x2=\"40\" y2=\"-5\" stroke=\"black\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"usblader\">\n      <rect x=\"0\" y=\"-15\" width=\"60\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"12\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"19\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <text x=\"15\" y=\"8\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"8\">AC/DC</text>\n      <text x=\"42\" y=\"4\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"11\">USB</text>\n    </g>\n    <g id=\"vaatwasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"40\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <line x1=\"40\" y1=\"-20\" x2=\"0\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:white\" />\n    </g>\n    <g id=\"ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"30\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"transformator\">\n      <circle cx=\"8\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verwarmingstoestel\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"40\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu_ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"70\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"35\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n      <circle cx=\"50\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"60\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verbruiker\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n    </g>\n    <g id=\"wasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_automatisch\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n      <rect x=\"-4\" y=\"-30\" width=\"4\" height=\"10\" style=\"fill:black\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_automatisch_horizontaal\">\n      <line x1=\"0\" y1=\"0\" x2=\"30\" y2=\"0\"  stroke=\"black\" />\n      <rect x=\"20\" y=\"-4\" height=\"4\" width=\"10\" style=\"fill:black\" />\n    </g>\n    <g id=\"zekering_smelt\">\n      <rect x=\"-4\" y=\"-30\" width=\"8\" height=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"zekering_smelt_horizontaal\">\n      <rect x=\"0\" y=\"-4\" height=\"8\" width=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"0\" y1=\"0\" x2=\"30\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"relais_kring\">\n      <rect x=\"-8\" y=\"-30\" width=\"16\" height=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"8\" y1=\"-22.5\" x2=\"-8\" y2=\"-7.5\" stroke=\"black\" />\n    </g>\n    <g id=\"overspanningsbeveiliging_inline\">   -> shift x -7.5  y -15\n      <rect x=\"-7.5\" y=\"-30\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"-3\" y2=\"-24\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"3\" y2=\"-24\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-10\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-10\" x2=\"-3\" y2=\"-6\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"-10\" x2=\"3\" y2=\"-6\" stroke=\"black\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_empty\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"arrow\">\n      <line x1=\"0\" y1=\"0\" x2=\"8\" y2=\"0\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"-1\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"1\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_ventilator\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_atmosferisch\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"bliksem\">\n      <line x1=\"0\" y1=\"-5.2\" x2=\"-3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"-3\" y1=\"0\" x2=\"3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"3\" y1=\"0\" x2=\"0\" y2=\"5.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"0\" y2=\"2.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"2.6\" y2=\"3.7\" stroke=\"black\"/>\n    </g>\n    <g id=\"moving_man\"\n       transform=\"matrix(0.0152987,0,0,0.01530866,0,0)\">\n       <path\n         d=\"M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z\"\n         id=\"path4\" stroke=\"black\" stroke-width=\"10\" />\n       <path\n         d=\"m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z\"\n         id=\"path6\" stroke=\"black\" stroke-width=\"10\" /></g>\n    </defs>\n    ";
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
    // -- Constructor --
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
    // -- Definitief verwijderen van items die als inactief werden geflagged --
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
    // -- Opnieuw sorteren van de array na clone/verplaatsen van items, ouders moeten steeds vóór de kinderen in de array zitten --
    Hierarchical_List.prototype.reSort = function () {
        this.deleteInactive();
        var continue_looping = true;
        while (continue_looping) {
            continue_looping = false;
            for (var i = 0; i < this.length; i++) { //Loop over all items
                if (this.active[i]) { //We only do something for active members
                    var parentOrdinal = this.getOrdinalById(this.data[i].parent);
                    if (parentOrdinal > i) { //If this happens we perform a swap
                        //We will need another pass to ensure we had them all
                        continue_looping = true;
                        //Repush mis-placed item to the end
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
    // -- Plaats in de array zoeken op basis van de id --
    Hierarchical_List.prototype.getOrdinalById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id)
                return (i);
        }
        return null;
    };
    // -- Aantal actieve kinderen van id = parent_id --
    Hierarchical_List.prototype.getNumChilds = function (parent_id) {
        var returnval = 0;
        for (var i = 0; i < this.length; i++) {
            if ((this.data[i].parent == parent_id) && (this.active[i]))
                returnval++;
        }
        return (returnval);
    };
    // -- Maximum aantal actieve kinderen van id = parent_id --
    Hierarchical_List.prototype.getMaxNumChilds = function (parent_id) {
        var returnval = this.data[this.getOrdinalById(parent_id)].getMaxNumChilds();
        return (returnval);
    };
    // Creëer een nieuw Electro_Item --
    Hierarchical_List.prototype.createItem = function (electroType) {
        // First create the object
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
            case 'Domotica module (verticaal)':
                tempval = new Domotica_verticaal(structure);
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
            case 'Leiding':
                tempval = new Leiding(structure);
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
            case 'Media':
                tempval = new Media(structure);
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
            case 'Contactdoos':
                tempval = new Contactdoos(structure);
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
            case 'Zekering/differentieel':
                tempval = new Zekering(structure);
                break;
            case 'Zonnepaneel':
                tempval = new Zonnepaneel(structure);
                break;
            default: tempval = new Electro_Item(structure);
        }
        // Then set the correct identifyer
        tempval.id = this.curid;
        tempval.parent = 0;
        tempval.indent = 0;
        // Then return the Object
        return (tempval);
    };
    // -- Voeg item toe aan de Hierarchical list --
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
    // -- Item invoegen vóór bestaand item met id = my_id en op hetzelfde niveau --
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
    // -- Item invoegen na bestaand item met id = my_id en op hetzelfde niveau --
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
    // -- Item invoegen na bestaand item met id = my_id en één niveau dieper --
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
    // -- Item ééntje naar boven schuiven binnen hetzelfde niveau --
    Hierarchical_List.prototype.moveUp = function (my_id) {
        // First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal - 1; i >= 0; i--) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        // Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
        this.reSort();
    };
    // -- Item ééntje naar beneden schuiven binnen hetzelfde niveau --
    Hierarchical_List.prototype.moveDown = function (my_id) {
        // First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal + 1; i < this.length; i++) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        // Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
        this.reSort();
    };
    // -- Item clonen --
    Hierarchical_List.prototype.clone = function (my_id, parent_id) {
        // First find the ordinal number of the current location and the desired location
        var currentOrdinal = this.getOrdinalById(my_id);
        // Then create a clone of the object and assign the correct parent_id
        if (arguments.length < 2)
            parent_id = this.data[currentOrdinal].parent;
        var parentOrdinal = this.getOrdinalById(parent_id);
        var my_item = this.createItem(this.data[currentOrdinal].getType());
        my_item.clone(this.data[currentOrdinal]);
        // Now add the clone to the structure. The clone will have id this.curid-1
        if (arguments.length < 2)
            this.insertItemAfterId(my_item, my_id); //Cloning the top-element, this messes up the ordinals !!
        else
            this.insertChildAfterId(my_item, parent_id); //Cloning childs, this messes up the ordinals !!
        var new_id = this.curid - 1;
        this.data[this.getOrdinalById(new_id)].collapsed = this.data[this.getOrdinalById(my_id)].collapsed;
        // Now loop over the childs of the original and also clone those
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
    // -- Delete item with id = my_id --
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
    // -- Pas type aan van item op plaats ordinal in de array -- 
    Hierarchical_List.prototype.adjustTypeByOrdinal = function (ordinal, electroType) {
        var tempval = this.createItem(electroType);
        Object.assign(tempval, this.data[ordinal]);
        tempval.props.type = electroType; //We need to do this again as we overwrote it with assign
        tempval.resetProps(); //Already part of createItem but we need to run this again as the assign operation overwrote everything
        this.data[ordinal] = tempval;
    };
    // -- Pas type aan van item met id = my_id --
    Hierarchical_List.prototype.adjustTypeById = function (my_id, electroType) {
        var ordinal = structure.getOrdinalById(my_id);
        this.adjustTypeByOrdinal(ordinal, electroType);
    };
    //-- Verticale lijn tekenen (kring links van gebruiker) --
    Hierarchical_List.prototype.tekenVerticaleLijnIndienKindVanKring = function (item, mySVG) {
        // Eerst checken of het wel degelijk een kind van een kring is
        var parent = item.getParent();
        if (parent != null) {
            if (parent.getType() == "Kring") {
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
            }
            if ((parent.getType() == "Kring") || (parent.getType() == "Domotica module (verticaal)")) {
                // Plaats het nummer van het item naast de lijn
                var displaynr = void 0;
                displaynr = item.props.nr;
                mySVG.data +=
                    '<text x="' + (mySVG.xleft + 9) + '" y="' + (mySVG.yup - 5) + '" ' +
                        'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                        htmlspecialchars(displaynr) + '</text>';
            }
        }
        ;
    };
    ;
    Hierarchical_List.prototype.updateRibbon = function () {
        var output = "";
        // Plaats bovenaan de switch van editeer-mode (teken of verplaats) --
        output += '<p style="margin-top: 5px;margin-bottom: 5px;">';
        switch (this.mode) {
            case "edit":
                output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen/Clone</option></select>';
                output += '&nbsp;<button ' + (undostruct.undoStackSize() > 0 ? "" : "disabled ") + 'onclick="undoClicked()">Undo (' + undostruct.undoStackSize() + ')</button>&nbsp;'
                    + '<button ' + (undostruct.redoStackSize() > 0 ? "" : "disabled ") + 'onclick="redoClicked()">Redo (' + undostruct.redoStackSize() + ')</button>';
                break;
            case "move":
                output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen/Clone</option></select>';
                output += '&nbsp;<button ' + (undostruct.undoStackSize() > 0 ? "" : "disabled ") + 'onclick="undoClicked()">Undo (' + undostruct.undoStackSize() + ')</button>&nbsp;'
                    + '<button ' + (undostruct.redoStackSize() > 0 ? "" : "disabled ") + 'onclick="redoClicked()">Redo (' + undostruct.redoStackSize() + ')</button>';
                output += '<div style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. ' +
                    'Gebruik het Moeder-veld om een component elders in het schema te hangen. Kies "clone" om een dubbel te maken van een element.</i></div>';
                break;
        }
        output += '</p>';
        document.getElementById("ribbon").innerHTML = output;
    };
    // -- Functie om de tree links te tekenen te starten by node met id = myParent --
    Hierarchical_List.prototype.toHTMLinner = function (ordinal) {
        if (this.data[ordinal].collapsed) {
            return ("<tr>\n                        <td bgcolor=\"#8AB2E4\" onclick=\"HLCollapseExpand(".concat(this.data[ordinal].id, ")\" valign= \"top\">&#x229E;</td>\n                        <td width=\"100%\">").concat(this.data[ordinal].toHTML(structure.mode), "<br></td>\n                    </tr>"));
        }
        else {
            return ("<tr>\n                       <td bgcolor=\"C0C0C0\" onclick=\"HLCollapseExpand(".concat(this.data[ordinal].id, ")\" valign= \"top\">&#x229E;</td>\n                       <td width=\"100%\">").concat(this.data[ordinal].toHTML(structure.mode), "<br>").concat(this.toHTML(this.id[ordinal]), "</td>\n                    </tr>"));
        }
    };
    Hierarchical_List.prototype.updateHTMLinner = function (id) {
        var ordinal = this.getOrdinalById(id);
        document.getElementById('id_elem_' + id).innerHTML = this.toHTMLinner(ordinal);
    };
    Hierarchical_List.prototype.toHTML = function (myParent) {
        if (myParent == 0)
            this.updateRibbon();
        var output = "";
        var numberDrawn = 0;
        // Teken het volledige schema in HTML
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)) {
                numberDrawn++;
                output += '<table class="html_edit_table" id="id_elem_' + this.id[i] + '">';
                output += this.toHTMLinner(i);
                output += "</table>";
            }
        }
        if ((myParent == 0) && (numberDrawn < 1)) {
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>"; //no need for the add button if we have items
        }
        return (output);
    };
    // -- Functie om de tree links te tekenen te starten by node met id = myParent --
    Hierarchical_List.prototype.toSVG = function (myParent, stack, minxleft, includeparent) {
        if (minxleft === void 0) { minxleft = 0; }
        if (includeparent === void 0) { includeparent = false; }
        // Eerst creëren we een array van SVGelements met alle kinderen van myParent en eventueel myParent zelf
        var inSVG = new Array(); //Results from nested calls will be added here
        var elementCounter = 0;
        // Dan vullen we de array door doorheen de lijst van kinderen te gaan en een tekening van elk kind op te slaan
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && ((this.data[i].parent == myParent) || ((includeparent == true) && (this.id[i] == myParent)))) {
                var mytype = this.data[i].getType();
                /*if (typeof(this.data[i].keys) != 'undefined') mytype = this.data[i].keys[0][2]; else*/ mytype = this.data[i].props.type;
                switch (mytype) {
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
                    case "Domotica module (verticaal)":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i], inSVG[elementCounter]);
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
                        if ((myParent != 0) &&
                            (this.data[this.getOrdinalById(myParent)].getType() == "Meerdere verbruikers"))
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
                for (var i = 0; i < elementCounter; i++) {
                    width = width + inSVG[i].xleft + inSVG[i].xright;
                    max_yup = Math.max(max_yup, inSVG[i].yup);
                    max_ydown = Math.max(max_ydown, inSVG[i].ydown);
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
                for (var i = 0; i < elementCounter; i++) {
                    height = height + inSVG[i].yup + inSVG[i].ydown;
                    max_xleft = Math.max(max_xleft, inSVG[i].xleft);
                    max_xright = Math.max(max_xright, inSVG[i].xright);
                }
                max_xleft = Math.max(minxleft, max_xleft);
                width = max_xleft + max_xright;
                // decide on the output structure
                outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
                outSVG.ydown = 0;
                //outSVG.xleft = Math.max(max_xleft,35); // foresee at least 35 for text at the left
                outSVG.xleft = max_xleft;
                if (this.data[this.getOrdinalById(myParent)].getType() == "Kring")
                    max_xright += 10; // Altijd 10 extra rechts voorzien voor uitstekende tekst/adressen
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
var CONFIGPAGE_LEFT = "\n    <table border=\"1px\" style=\"border-collapse:collapse;\" align=\"center\" width=\"100%\"><tr><td style=\"padding-top: 0; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;\">\n        <p><font size=\"+2\">\n          <b>Welkom op \u00E9\u00E9ndraadschema</b>\n        </font></p>\n      <p><font size=\"+1\">  \n           Kies \u00E9\u00E9n van onderstaande voorbeelden om van te starten of start van een leeg schema (optie 3).\n      </font></p>\n      <font size=\"+1\">\n        <i>\n          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te\n          bekijken alvorens van een leeg schema te vertrekken.\n        </i>\n      </font>\n    </td></tr></table>\n    <br>\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 1</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 2</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Leeg schema</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Openen</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example000.svg\" height=\"300px\"><br><br>\n          Eenvoudig schema, enkel contactdozen en lichtpunten.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example001.svg\" height=\"300px\"><br><br>\n          Iets complexer schema met teleruptoren, verbruikers achter contactdozen en gesplitste kringen.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/gear.svg\" height=\"100px\"><br><br>\n";
var CONFIGPAGE_RIGHT = "\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/import_icon.svg\" height=\"100px\"><br><br>\n          Open een schema dat u eerder heeft opgeslagen op uw computer (EDS-bestand). Enkel bestanden aangemaakt na 12 juli 2019 worden herkend.\n          <br><br>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(0)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(1)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"read_settings()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"importclicked()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n      </tr>\n    </table>\n  ";
var CONFIGPRINTPAGE = "\n<div>\n</div>\n<br>\n";
var EXAMPLE0 = "EDS0040000eJztWe9r6zYU/VeMv84rjp2kaxhjbQdv422f3qMblIdRrBtHtSwF2Un6g+5v35HsxM5emiVpB68QKCWRda+uzjmSjuInX5LKqqk/6l0EPmcV80e3T77gaAj8GTOkKn8UBr5QfPUx1VKyWUnoM2GyJPQzelb6oydfGX/k/yImEz/wq4cZ4dslU6Wci0qoDI2MqYrJZKYxLB5GaBpTmU7JFLbDyOcIJjuqIJI2oJiRYZnN1A+brEnOxiQTxZKKpCQ7ZnTfG+LpRnTCSVYs6WSIQ5uCcUOo1l9l2xwSFeNBOjcLSti80gVjVd15M7kok5Ikpfg2WQORa1O52S4wIZ25OcYIVYwVnRHr+hdam3YG/nPgl3puUpKixIhqLuVzUFMRtVT0Wip6/01FS8OVNhzfUHVGjOHzqDJz6la2hmVHIVYkq0qitpLokEo+mjeXAlr+urny4g9RMNhHBTaY8rLhtWZD6pQhAE1lxRR3GB0okDoRIBYqGc9FuYbiFcpZ5wRcS3oU2TqiYc6ttl3aCTviuWg5i1+nns0i9pTPeUc94UvyqXX5avXU1FQCbZvaibZq5/qa7a+froA+0jxHCV/L6DflLSGkl0S0TUPXW0VUA/K2GtpY/Je7OBt+C5y5zf0FznqHc3ZDRop02pxJ75e4q13ExZ3Vdn7Quu+11F1rUJZWXOty2+mBhtwmBhxCtuXVRDeZOsdtI4AJK8nCxAWppCAyaLDBGzvvlGhSoVNGYz1fckogCpaTxON12Rh+yuRkySoy3BLafdJJ3DTWKYHRlrFXcSoBBxxMjfV6m9sBcj86FuToBPLeIPeOBTk+gbw3yOGxIPdPIO8LcnxxLMiDE8h7KzluQe53bin9QxzvjRF35NWGoTUOf9pZ5TrHjS3wF7ZL4h4lTdSjtsB7OeOux1Qb8WjZkpTgdJfiTtVGJ0VBhuo+DoCO86FkjEe8+vdVpG0dhjXvC9oAF66k7LqKfRx51Ntu7/rfjL07wpJfMZ6zwqH7fr3d9U7aOrYj6vwkMDiZuzfcSKL+0Sif3N3+KF8cjXLH3v1ua0+FSbHSWpjaCZcd6W/g4PP5GCsRu5bIOlB/mgnK3M9O9ZQxQ8VQvN1HJHaeO9oDwjoUaORS5Dg0vg7EKZBvYaUp311SZ3NVuV2jt/OXuc49fXjsbe+tQXw/6J0fi150GHrRVvRI5e8YvDg6Frw3Wb/vFLwv6A2nsEDaW7fl/2//MJKl6bYXREHvIoDNOw+GQXwewBzjao2LH64lMM3YfOErcOhhR8Z2gjURR18sZULB4LKxJEscKfvpEv5o5rxXfVxNSWQWwMEQYijY/VJw+1Kp/0PfmqRyJtlD3d3dMjPL0e3TZhROLlO/YCqR28VakGzvghmwUNbIIb/mBHIqkboTkklJ9mh1CR7WGR6avDMGm1iKR/cyqm+5sCK04eSUOBHwq7CLVkr3IFpSGIZnxG1KvVTu5cyN1sb6Mu8SxJL7+OPY/PSpMvCIXmg/Iyj0UCpB/GQbPpMced/FkYf21Z9t//Dpj1X75gP6vmACMYtmsDO2HuxnrgsS6mxM1kIozLR5ayQ4Fda0wmMYbcGwiVyfibbbjXfvRXF44/09CL1fH+3k4W/dJWlQ42hnzbHknv8BXkCfFg==";
var EXAMPLE1 = "EDS0040000eJztWm1v2zYQ/iuCvk4rJEp2amMYlqRAO6z9lCIbEBQCLZ1lVpQoUJTzhu637yjJFp3YjqK4Q1O4CAqZr8fneXh3pHRvc8gTtbCnPnHsmCpqT6/ubRbbU8+xCyohV/bUdWyWx6vHSHBOixKwzZzyErCdFEVpT+/tXNpT+x2bz23HVrcF4K9Tmpe8YorlCRZSmivKw0LgtFhJsGgGZbQAmekGUzvGzqBnZQBcd8gKkDTRIwVuO2qY0hnwMKehAs5Bz0luvDHWbvQOY+CKhsYIvquHoLEEtNZejbY5JVqMFVEllxDSSomMUtU03hyclWEJHCL8NV8DkQqp6tUucUEiqdfoY9ec0syYsbF/KYTsVmB/c+xSVDICzkqcMa84/+Y0VJCOCq+jwnuaio6GMyFj/IVWJ0ApPk+VrMC0bA3LHkO8SWcJ6Swhz7HkL3lwKWDJP5dnlv+eOKM+KtCdIS1bXhs2uIgodsCiUtE8rjF6pkCagRBiloezipVrKF6gnPWYCNc13LFk3aNlrt5t+7TjGuKZdJz5L1PPphE95XNiqMfdJZ9Gly9WT0ONYli2qR2yVTvnEe2vH1NAf9EMpOVt0dGfuXWNStqlom0iOt+qogaRw4poY/ef7hXQ2GAt6FgbP0dAf9Myo9GC5dBTKuMfQSp1TNkhFW+oVMirlsrZ3vBgsDbe5Wq2keZ1rH0CkDEab6FhM1mxFGTZUzNvu9lPBjq6i4IzVba66TEl8bbrNPhhdDrApZ3RONVSfdVCPd9Hm5HGvN1F2qHSmASwokcEGkTVkPTlf8pe+iQve52J24OkA+2sI0fDOCLGyYQYR5PR0zvJcPnnAumJVCxEue2IggWpHhjhYLzb5w2p7UjGma4le05L0DjFDPIww6CCBbrzBvYLgLnCRgnMRHUdQ4iioClwrF6bjdMvKJ9fU4WBiUULZdYYA7eFzZAI0pa5V/3ycKmDHPCZWOfSe1D2J4NRJkeU+6JMhqPsdyh/1LZHTEa40TqYugWXhvQ3cLDjaoY7EX0USzahbtaKS8spWq09CEdf8xV6YNd0RRhSzlLMpB53VBK91GM6Wru5Hq2oclV7C2+vuz4ZmPuR54FHtoIHefqKsfPJQOwOIjyFoUJWhRLyNWIXjHpg90Qu905kQjFMlxMoVVWh0zBOHyvM4AaXmSN2qpJN1rBLdLi8WFIac+1qW94aRLhIKcdoL6s0zUVhApIAWpdImmlPFm92i0HVwfwBvo8sesrFBcb5TOM2KPH9uOLGfhgdGu4wL7lDh9z65c8fH8SODxWsENWqwBIO6zQoFyJG5Gv6G4zfN5kZAqTPHU2PnvLbF3D2OTLjSDc5pjTfJ9h6/lCQjxlNb5CDwLj69Qfe3H1iEfolwedi2ZyR+rwmIEPZ9Q/GLvnZ2fWDHiBvSxqCg1y2eUbc9dxnkTw6buHefjIYjPL4iHJvR2lcNfmTgY7yUrKvYDWXPt3lzwcNBDrQOo9c6iZhXRW2ve6EBt5KaVy3WAjJ7jRbmCViIs/Z17zJgyI0SELTpgbAuAyGcIZVsXp4s9SVjkYN70vYADeqZGleEfXZ94GRHnlGwv2sHPLCOJa81kPyPozIATB6YZ79IMl+dOPYL9VeO4jvkWkH/s8C026Nmce4gTD5RqT1h76A/cl3nD8+AEbHMLkD5C+4mkixJYJ0VS/6x/0PTdV6uPIc4ngTh7jOiUPGzthBB/PWIZ4zcTCPIsTBOE/w+cTxiROMnABbeA6ekvDQhMcX1BAmuJh9YWqAEQ8dOjor3Ij++IvWD8sxgNMZB60iyPXTKcbjon79s9ryLNEcjYITx87ozTWL9Wd2o8lIv60pC05vm+Z17pFo1Vzdb/ZChcjmk7tS6csi7Kup0K0zKutcveYHxxcxIJX6DksrkXIOWsL1ALfrEW7bcQtaYF90i9j0NNDBXu8I3R3qbTFnHNeU6Wq4wa3JwXW9NxDrIcV1Xn+udimE1C+IrFNUItSPv83k7xdKUqosVz+7+M9CU9FfKtAFn4FPrV98YmH56k+Xv7/4tCrfrIBfM8qwz7Kd7A1dT/ZHLDJg+ZuZvk1iOa60/Y6OxZDpt2e4l6XQYOiB6jZzoY+F1o1FfPfS+nfkWh/u9OIxC6qj0UmDo151zJT97T8FxBHk";
var EXAMPLE_DEFAULT = "EDS0040000eJytVN9v00AM/leieyWM/GgniBCivICE4GVoL9MUuTk3PfVyF91dunbT+NuxkzZZAQ0VqKLq4rM/f/7s+EFoNHVYi2IWCwkBRHHzIJQURRqLFhyaIIokFsrI47GyWkPrkXxWoD2Sn7OtF8WDME4UQsQi7Fuk0wKM150KytRkBDABdNlayiiKLBZL9NUaXcPXhZBqtULOpxA1uzctOqgJ53I+IJYbWKIuDZQBtUbOle3SS/I9iS0l6gDlFJ8nxBqkQz+xK0/T9faqc1ssoQu2AQiD7RRZ+dKjxoreVmP1G+tCX+aWarE1F8eRBqB5km/gvrXWTezFYyy87VyFWnlKaDqtH+NB/mySP53kT8+R/4N1kt6IdI0AdC6C6/Aps1GUZ4jkE5FsIpKdQ+Sz+68T8LvO/NpzisCNP7RxUF/bCsidTF9fLc4chAGBtFSmXHbKj0X//YSMkKTLHd6regw4duiZtsymtuRTW/J/m4+f0v9hQG7pngrdEtZNP1mnf3TNRG/SOIvzeHbLRJQJZYClRqaDhk8LkrntezZM5xpVveZRv3wTiwZ2d0ryekpfp6y1bzXsB/eEFaiZHm2skygfwA27yhN2H8tk2bsBt0HnhwoI30qkpgRVAfce6MP04gCwHxH2B9wWaLy8uu9324w1YWk5HHt9V4oGGxq+RjTSAUie7wYuUDKsvTP9d39NW4A1jhbVOmB/fLt0764CRYQo4XNCv4joEk5ANnxDXUQv8iwi+/Fh+8erL0f76QW+bEBRzPaQ7ALGZO+lbVCZiyVy+w1Ve1hISmLD829NcJYFYaDeZ2V520a7KMuT6+j7PIk+3bMA9Klwk+eDlFy4VEE8/gDGURmI";
var VERSION = "git"; //can be "git" or "online"
var PROP_Contact_Text = "<html>\n  <head>\n    <title>Eendraadschema online</title>\n    <link rel=\"stylesheet\" href=\"css/about.css\">\n  </head>\n  <body>\n    <h2>Een &eacute;&eacute;ndraadschema tekenen.</h2>\n    <p class=\"ondertitel\">Een cr&eacute;atie van <a target=\"_blank\" href=\"https://ivan.goethals-jacobs.be\">Ivan Goethals</a></p>\n    <p>Dit is een standalone versie (development) waarbij enkele functionaliteiten zijn uitgeschakeld.</p>\n    <p>Gebruik de online versie op <a href=\"https://eendraadschema.goethals-jacobs.be\">https://eendraadschema.goethals-jacobs.be</a> om toegang te krijgen tot het contactformulier.</p>\n    <p>Kies <b>Bewerken</b> in het menu om verder te gaan met tekenen.</p>\n  </body>\n</html>";
function PROP_GDPR() {
    return ("");
}
function PROP_getCookieText() {
    return ("");
}
//--- START OF DEVELOPMENT OPTIONS ---
function PROP_development_options() {
    var outstr = '<br><h2>Expert ontwikkel opties, Gebruik enkel indien u weet wat u doet.</h2>'
        + '<textarea id="HL_loadfromtext" style="width: 80%; height: 8em;"></textarea><br>'
        + '<button onclick="loadFileFromText()">Load from input</button>';
    return outstr;
}
function loadFileFromText() {
    var str = document.getElementById('HL_loadfromtext').value;
    import_to_structure(str);
    fileAPIobj.clear();
}
/// --- END OF DEVELOPMENT OPTIONS ---
function exportjson(saveAs) {
    if (saveAs === void 0) { saveAs = true; }
    var filename;
    /* We use the Pako library to entropy code the data
     * Final data reads "EDSXXX0000" with XXX a version and thereafter a 64base encoding of the deflated output from Pako
     * filename = "eendraadschema.eds";
     */
    filename = structure.properties.filename;
    var text = structure_to_json();
    // Compress the output structure and offer as download to the user. We are at version 004
    try {
        var decoder = new TextDecoder("utf-8");
        var encoder = new TextEncoder();
        var pako_inflated = new Uint8Array(encoder.encode(text));
        var pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
        text = "EDS0040000" + btoa(String.fromCharCode.apply(null, pako_deflated));
    }
    catch (error) {
        text = "TXT0040000" + text;
    }
    finally {
        if (window.showOpenFilePicker) { // Use fileAPI     
            if (saveAs)
                this.fileAPIobj.saveAs(text);
            else
                this.fileAPIobj.save(text);
        }
        else { // legacy
            download_by_blob(text, filename, 'data:text/eds;charset=utf-8');
        }
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
function forceUndoStore() {
    undostruct.store();
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
    undostruct.store();
    structure.updateHTMLinner(my_id);
    HLRedrawTreeSVG();
}
function HLDelete(my_id) {
    structure.deleteById(my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLAdd(my_id) {
    structure.addItem("");
    undostruct.store();
    HLRedrawTree();
}
function HLInsertBefore(my_id) {
    structure.insertItemBeforeId(new Electro_Item(structure), my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLInsertAfter(my_id) {
    structure.insertItemAfterId(new Electro_Item(structure), my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLMoveDown(my_id) {
    structure.moveDown(my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLMoveUp(my_id) {
    structure.moveUp(my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLClone(my_id) {
    structure.clone(my_id);
    undostruct.store();
    HLRedrawTree();
}
function HLInsertChild(my_id) {
    structure.insertChildAfterId(new Electro_Item(structure), my_id);
    //undostruct.store();  We should not call this as the CollapseExpand already does that
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}
function HL_editmode() {
    structure.mode = document.getElementById("edit_mode").value;
    HLRedrawTreeHTML();
}
function HL_changeparent(my_id) {
    // See what the new parentid is
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
        if (typeof (parentOrdinal) == "undefined")
            error = 1;
        else if ((!structure.active[parentOrdinal]) || (int_newparentid == my_id))
            error = 1;
    }
    if (error == 1)
        alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    else
        structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;
    structure.reSort();
    undostruct.store();
    HLRedrawTree();
}
function HL_cancelFilename() {
    document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
}
function HL_changeFilename() {
    var regex = new RegExp('^.*\\.eds$');
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
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + structure.properties.filename + '" pattern="^.*\\.eds$">&nbsp;<i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}
function HLRedrawTreeHTML() {
    show2col();
    document.getElementById("configsection").innerHTML = "";
    var output = structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}
function HLRedrawTreeHTMLLight() {
    var output = structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}
function HLRedrawTreeSVG() {
    var str = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>'
        + flattenSVGfromString(structure.toSVG(0, "horizontal").data, 10)
        + '<h2>Legende:</h2>'
        + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
        + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
        + '<i><br><small>Versie: ' + CONF_builddate
        + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">GPLv3</a></small></i><br><br>';
    document.getElementById("right_col_inner").innerHTML = str;
}
function HLRedrawTree() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}
function buildNewStructure(structure) {
    // Paremeterisation of the electro board
    var aantalDrogeKringen = CONF_aantal_droge_kringen;
    var aantalNatteKringen = CONF_aantal_natte_kringen;
    ;
    // Eerst het hoofddifferentieel maken
    var itemCounter = 0;
    structure.addItem("Aansluiting");
    structure.data[0].props.type = "Aansluiting";
    structure.data[0].props.naam = "";
    structure.data[0].props.bescherming = "differentieel";
    structure.data[0].props.aantal_polen = CONF_aantal_fazen_droog;
    structure.data[0].props.amperage = CONF_hoofdzekering;
    structure.data[0].props.type_kabel_na_teller = CONF_aantal_fazen_droog + "x16";
    structure.data[0].props.differentieel_delta_amperage = CONF_differentieel_droog;
    itemCounter++;
    // Dan het hoofdbord maken
    structure.insertChildAfterId(new Bord(structure), itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    itemCounter++;
    var droogBordCounter = itemCounter;
    // Nat bord voorzien
    structure.insertChildAfterId(new Kring(structure), itemCounter);
    structure.data[itemCounter].props.type = "Kring";
    structure.data[itemCounter].props.bescherming = "differentieel";
    structure.data[itemCounter].props.aantal_polen = CONF_aantal_fazen_nat;
    structure.data[itemCounter].props.amperage = CONF_hoofdzekering;
    structure.data[itemCounter].props.kabel_is_aanwezig = false;
    structure.data[itemCounter].props.differentieel_delta_amperage = CONF_differentieel_nat;
    itemCounter++;
    structure.insertChildAfterId(new Bord(structure), itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    structure.data[itemCounter].props.is_geaard = false; // Geaard
    itemCounter++;
    // Pas info aan
    switch (CONF_aantal_fazen_droog) {
        case 2:
            structure.properties.info = '2 x 230V ~50 Hz';
            break;
        case 3:
            structure.properties.info = '3 x 230V ~50 Hz';
            break;
        case 4: structure.properties.info = '3 x 400V + N ~50 Hz';
    }
}
function reset_all() {
    structure = new Hierarchical_List();
    buildNewStructure(structure);
    HLRedrawTree();
}
function renderAddress() {
    var outHTML = "";
    outHTML = '<div align="left">' +
        '<div style="display:inline-block; width:25px;"></div><div style="display:inline-block;"><table cols="3" rows="1" style="border-collapse: collapse;border-style: solid; border-width:medium;" cellpadding="5">' +
        '  <tr><th style="text-align: left;border-style: solid; border-width:thin;">Plaats van de elektrische installatie</th><th style="text-align: left;border-style: solid; border-width:thin;">Installateur</th><th style="text-align: left;border-style: solid; border-width:thin;">Info</th></tr>' +
        '  <tr>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.control + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td>' +
        '  </tr>' +
        '</table></div></div>';
    return outHTML;
}
function renderAddressStacked() {
    var outHTML = "";
    if (!structure.properties.control)
        structure.properties.control = "<br>";
    outHTML = 'Plaats van de elektrische installatie' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td></tr>' +
        '</table><br>' +
        'Installateur' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td></tr>' +
        '</table><br>' +
        'Erkend organisme (keuring)' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.control + '</td></tr>' +
        '</table><br>' +
        'Info' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td></tr>' +
        '</table>';
    return outHTML;
}
function changeAddressParams() {
    structure.properties.owner = document.getElementById("conf_owner").innerHTML;
    structure.properties.installer = document.getElementById("conf_installer").innerHTML;
    structure.properties.control = document.getElementById("conf_control").innerHTML;
    structure.properties.info = document.getElementById("conf_info").innerHTML;
}
function openContactForm() {
    var strleft = PROP_Contact_Text;
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
}
function restart_all() {
    var strleft = CONFIGPAGE_LEFT;
    strleft +=
        "\n      Hoofddifferentieel (in mA) <input id=\"differentieel_droog\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"300\"><br><br>\n      Hoofdzekering (in A) <input id=\"hoofdzekering\" type=\"text\" size=\"4\" maxlength=\"4\" value=\"65\"><br><br>\n      Aantal fazen:\n      <select id=\"aantal_fazen_droog\"><option value=\"2\">2p</option><option value=\"3\">3p</option><option value=\"4\">4p (3p+n)</option></select>";
    strleft += CONFIGPAGE_RIGHT;
    strleft += PROP_getCookieText(); //Will only be displayed in the online version
    strleft += PROP_development_options();
    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
    if (browser_ie_detected()) {
        alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}
function hide2col() {
    document.getElementById("configsection").style.display = 'block';
    document.getElementById("ribbon").style.display = 'none';
    document.getElementById("canvas_2col").style.display = 'none';
}
function show2col() {
    document.getElementById("configsection").style.display = 'none';
    document.getElementById("ribbon").style.display = 'block';
    document.getElementById("canvas_2col").style.display = 'flex';
    structure.updateRibbon();
}
function load_example(nr) {
    switch (nr) {
        case 0:
            import_to_structure(EXAMPLE0);
            fileAPIobj.clear();
            break;
        case 1:
            import_to_structure(EXAMPLE1);
            fileAPIobj.clear();
            break;
    }
}
function undoClicked() {
    undostruct.undo();
}
function redoClicked() {
    undostruct.redo();
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
    if (document.getElementById("noGroup").checked == true)
        text = flattenSVGfromString(text);
    download_by_blob(text, filename, mimeType); //was text/plain
}
function read_settings() {
    CONF_aantal_fazen_droog = parseInt(document.getElementById("aantal_fazen_droog").value);
    CONF_aantal_fazen_nat = CONF_aantal_fazen_droog;
    CONF_hoofdzekering = parseInt(document.getElementById("hoofdzekering").value);
    CONF_differentieel_droog = parseInt(document.getElementById("differentieel_droog").value);
    fileAPIobj.clear();
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
var session = new Session();
var structure;
var undostruct = new undoRedo(100);
import_to_structure(EXAMPLE_DEFAULT, false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there
// Now add handlers for everything that changes in the left column
document.querySelector('#left_col_inner').addEventListener('change', function (event) {
    function propUpdate(my_id, item, type, value) {
        switch (type) {
            case "select-one":
                if (item == "type") { // Type changed
                    structure.adjustTypeById(my_id, value);
                }
                else {
                    structure.data[structure.getOrdinalById(my_id)].props[item] = value;
                }
                structure.updateHTMLinner(my_id);
                break;
            case "text":
                structure.data[structure.getOrdinalById(my_id)].props[item] = value;
                break;
            case "checkbox":
                structure.data[structure.getOrdinalById(my_id)].props[item] = value;
                structure.updateHTMLinner(my_id);
                break;
        }
        undostruct.store();
        HLRedrawTreeSVG();
    }
    var element = event.target;
    // Ensure the id starts with 'HL_edit_'
    if (!element.id.startsWith('HL_edit_'))
        return;
    var type = element.type, id = element.id;
    var value = type === 'checkbox' ? element.checked : element.value;
    // Extract id and key from id
    var match = id.match(/^HL_edit_(\d+)_(.+)$/);
    var idNumber = match ? match[1] : null;
    var key = match ? match[2] : null;
    propUpdate(parseInt(idNumber), key, type, value);
    // Perform your logic here with the extracted data
});
restart_all();
