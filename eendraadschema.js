/*** Eendraadschema ***

=== Community edition ===

Copyright (C) 2019-2025  Ivan Goethals GPLv3

This program is free software: you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by the 
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for 
more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

The source code of this community edition is hosted on Github at
https://github.com/igoethal/eendraadschema.

=== Exclusive license ===

Notwithstanding the above, the original and sole author of this edition, 
Ivan Goethals, reserves the exclusive right to create derivative works of 
this software and distribute them under different licensing terms, including
but not limited to proprietary licenses. This includes the ability to develop
and offer a hosted edition with additional features not available in the
community edition. This right does not extend to derivative works produced by
others based on this community edition.

=== Embedded content ===

== Pako.js ==

This program uses the Pako.js entropy coding library. Pako is released under 
an MIT license by Andrey Tupitsin and Vitaly Puzrin. For more information on 
Pako and the full license text, please visit https://github.com/nodeca/pako

== Zlib ==

Pako implements ZLib in javascript. Zlib is released under the ZLIB License.
See https://www.zlib.net/zlib_license.html

== jsPDF ==

This program uses the jsPDF library to transform SVG images into PDF files.
The jsPDF license is as follows

Copyright
(c) 2010-2021 James Hall, https://github.com/MrRio/jsPDF
(c) 2015-2021 yWorks GmbH, https://www.yworks.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
/**
 * Returns true if the current mode is a development mode.
 * This is determined by the presence of a 'dev' parameter in the URL.
 *
 * @returns {boolean} True if this is a development mode, false otherwise.
 */
function isDevMode() {
    try {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('dev');
    }
    catch (error) {
        console.error('Error checking for dev mode:', error);
        return false;
    }
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
    var tryoutdiv = document.body;
    /*if (document.getElementById("configsection").style.display === 'block') {
      tryoutdiv = document.getElementById("configsection") as HTMLElement;
    } else if (document.getElementById("outerdiv").style.display === 'block') {
      tryoutdiv = document.getElementById("outerdiv") as HTMLElement;
    } else {
      tryoutdiv = document.getElementById("right_col_inner") as HTMLElement;
    }*/
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
                str = '<svg id="EDSSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" width="' + (parseInt(outstruct.attributes.getNamedItem("width").nodeValue) + overflowright) +
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
                if (outstruct.attributes.getNamedItem("transform").value.includes('rotate')) {
                    outstruct.attributes.getNamedItem("transform").value = "rotate(-90 " +
                        outstruct.attributes.getNamedItem("x").nodeValue + "," +
                        outstruct.attributes.getNamedItem("y").nodeValue + ")";
                }
                else {
                    outstruct.attributes.getNamedItem("transform").value = "scale(-1,1) translate(-" +
                        outstruct.attributes.getNamedItem("x").nodeValue * 2 + ",0)";
                }
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
var randomId = (function () {
    var counters = {};
    return function (prefix) {
        if (prefix === void 0) { prefix = "Rnd_"; }
        if (!(prefix in counters)) {
            counters[prefix] = 0;
        }
        var value = counters[prefix];
        counters[prefix]++;
        return "".concat(prefix).concat(value.toString());
    };
})();
var Session = /** @class */ (function () {
    function Session() {
        this.sessionKey = 'SessionJS';
        this.newUser = false;
        var storedSessionId = localStorage.getItem(this.sessionKey);
        if (storedSessionId) {
            this.sessionId = storedSessionId;
        }
        else {
            this.sessionId = this.generateRandomBase64String(22);
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
 * Manages the addition and removal of event listeners on HTML elements.
 */
var EventManager = /** @class */ (function () {
    function EventManager() {
        this.listeners = [];
    }
    /**
     * Adds an event listener to a specified HTML element. If a listener of the same
     * type already exists on the element, it is removed before adding the new one.
     *
     * @param element - The HTML element to attach the event listener to.
     * @param type - The type of the event.
     * @param listener - The event listener function or object.
     */
    EventManager.prototype.addEventListener = function (element, type, listener) {
        var existingListenerIndex = this.listeners.findIndex(function (l) { return l.element === element && l.type === type; });
        if (existingListenerIndex !== -1) {
            var existingListener = this.listeners[existingListenerIndex];
            element.removeEventListener(type, existingListener.listener);
            this.listeners.splice(existingListenerIndex, 1);
        }
        this.listeners.push({ element: element, type: type, listener: listener });
        element.addEventListener(type, listener);
        this.cleanup(); // Before we proceed, remove all listeners for elements that no longer exist
    };
    /**
     * Removes all event listeners managed by this EventManager instance.
     */
    EventManager.prototype.removeAllEventListeners = function () {
        this.listeners.forEach(function (_a) {
            var element = _a.element, type = _a.type, listener = _a.listener;
            element.removeEventListener(type, listener);
        });
        this.listeners = [];
    };
    /**
     * Disposes of the EventManager by removing all event listeners.
     */
    EventManager.prototype.dispose = function () {
        this.removeAllEventListeners();
    };
    /**
     * Removes all listeners for which the HTML element no longer exists.
     */
    EventManager.prototype.cleanup = function () {
        this.listeners = this.listeners.filter(function (_a) {
            var element = _a.element, type = _a.type, listener = _a.listener;
            if (!document.contains(element)) {
                element.removeEventListener(type, listener);
                return false;
            }
            return true;
        });
    };
    return EventManager;
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
        if (maxsvgwidth > 0) {
            while ((this.maxwidth - pos) > maxsvgwidth) { // The undivided part still does not fit on a page
                pos = this.pagemarkers.findMinDepth(pos + minsvgwidth, pos + maxsvgwidth).xpos;
                while (this.pages.length < page + 2)
                    this.addPage();
                this.setStop(page, pos);
                page++;
            }
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
        select.id = 'select_papersize_input';
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
        select.id = "select_dpi_input";
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
        var sitplanprint = structure.sitplan.toSitPlanPrint();
        printPDF(svg, structure.print_table, structure.properties, pages, document.getElementById("dopdfname").value, //filename
        document.getElementById("progress_pdf"), //HTML element where callback status can be given
        sitplanprint);
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
    toggleAppView('config');
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
            showFilePage(); // Update the export screen if we are actually on the export screen
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
            if (mystructure.data[i].keys[0][2] === "Leeg")
                mystructure.data[i].keys[0][2] = "Aansluitpunt";
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
    //Algemene upgrade voor versies 3 tot en met 4
    if ((version >= 3) && (version <= 4)) {
        for (var i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Leeg")
                mystructure.data[i].props.type = "Aansluitpunt";
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
    // If a structure exists, clear it
    if (structure != null)
        structure.dispose(); // Clear the structure
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
        if (typeof mystructure.properties.currentView != "undefined")
            structure.properties.currentView = mystructure.properties.currentView;
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
    // Kopieren van de situatieplannen
    if (typeof mystructure.sitplanjson != "undefined") {
        structure.sitplan = new SituationPlan();
        structure.sitplan.fromJsonObject(mystructure.sitplanjson);
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
        topMenu.selectMenuItemByName('Eéndraadschema'); // Ga naar het bewerken scherm, dat zal automatisch voor hertekenen zorgen.
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
    var swap2 = structure.sitplan;
    var swap3 = structure.sitplanview;
    structure.print_table.pagemarkers = null;
    structure.sitplanjson = structure.sitplan.toJsonObject();
    structure.sitplan = null;
    structure.sitplanview = null;
    // Create the output structure in uncompressed form
    var text = JSON.stringify(structure);
    // Put the removed data members back
    for (var _b = 0, _c = structure.data; _b < _c.length; _b++) {
        var listitem = _c[_b];
        listitem.sourcelist = structure;
    }
    structure.print_table.pagemarkers = swap;
    structure.sitplan = swap2;
    structure.sitplanview = swap3;
    return (text);
}
/** FUNCTION download_by_blob
 *
 *  Downloads an EDS file to the user's PC
 *
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
        setTimeout(function () { return document.body.removeChild(element); }, 1000); // 1-second delay
    }
    else {
        this.location.go("".concat(mimeType, ",").concat(encodeURIComponent(text)));
    }
}
/* FUNCTION showFilePage
   
   Shows the File-Page.  It will look different depending on whether the browser supports the file API or not

*/
function showFilePage() {
    var strleft = '<span id="exportscreen"></span>'; //We need the id to check elsewhere that the screen is open
    strleft += "\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"100%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Openen</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"100%\" align=\"left\">\n            <table border=0>\n              <tr>\n                <td width=350 style=\"vertical-align:top;padding:5px\">\n                  <button style=\"font-size:14px\" onclick=\"importclicked()\">Openen</button>\n                </td>\n                <td style=\"vertical-align:top;padding:7px\">\n                  Click op \"openen\" en selecteer een eerder opgeslagen EDS bestand.\n                </td>\n              </tr>\n            </table>\n        </td>\n      </tr>\n    </table><br>\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"100%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Opslaan</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"100%\" align=\"left\">\n    ";
    if (window.showOpenFilePicker) { // Use fileAPI
        strleft += '<table border=0><tr><td width=350 style="vertical-align:top;padding:5px">';
        if (fileAPIobj.filename != null) {
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = false)">Opslaan</button>&nbsp;';
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '</td><td style="vertical-align:top;padding:5px">';
            strleft += 'Laatst geopend of opgeslagen om <b>' + fileAPIobj.lastsaved + '</b> met naam <b>' + fileAPIobj.filename + '</b><br><br>'
                + 'Klik links op "Opslaan" om bij te werken';
        }
        else {
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '</td><td style="vertical-align:top;padding:7px">';
            strleft += '<span class="highlight-warning">Uw werk werd nog niet opgeslagen. Klik links op "Opslaan als".</span>';
        }
        strleft += '</td></tr>';
        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
        strleft += '</table>';
    }
    else { // Legacy
        strleft += '<table border=0><tr><td width=350 style="vertical-align:top;padding:7px">';
        strleft += 'Bestandsnaam: <span id="settings"><code>' + structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button></span>';
        strleft += '</td><td style="vertical-align:top;padding:5px">';
        strleft += 'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
        strleft += 'Klik vervolgens op "opslaan" en volg de instructies van uw browser. ';
        strleft += 'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>';
        strleft += 'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.';
        strleft += '</td></tr>';
        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
        strleft += '</table>';
        // Plaats input box voor naam van het schema bovenaan --
        //strleft += '<br>';    
    }
    strleft += "\n        </td>\n      </tr>\n    </table>    \n    ";
    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
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
var LargeStringStore = /** @class */ (function () {
    function LargeStringStore() {
        this.data = [];
    }
    LargeStringStore.prototype.push = function (text) {
        this.data.push(text);
        return (this.data.length - 1);
    };
    LargeStringStore.prototype.pushIfNotExists = function (text) {
        var index = this.data.indexOf(text);
        if (index == -1) {
            this.data.push(text);
            return (this.data.length - 1);
        }
        else {
            return index;
        }
    };
    LargeStringStore.prototype.get = function (index) {
        return this.data[index];
    };
    LargeStringStore.prototype.clear = function () {
        this.data = [];
    };
    return LargeStringStore;
}());
var undoRedo = /** @class */ (function () {
    function undoRedo(maxSteps) {
        if (maxSteps === void 0) { maxSteps = 100; }
        this.largeStrings = new LargeStringStore();
        this.history = new jsonStore(maxSteps);
    }
    undoRedo.prototype.replaceSVGsByStringStore = function () {
        if (structure.sitplan != null) {
            for (var _i = 0, _a = structure.sitplan.getElements(); _i < _a.length; _i++) {
                var element = _a[_i];
                if (!element.isEendraadschemaSymbool())
                    element.svg = this.largeStrings.pushIfNotExists(element.getUnscaledSVGifNotElectroItem()).toString();
            }
        }
    };
    undoRedo.prototype.replaceStringStoreBySVGs = function () {
        if (structure.sitplan != null) {
            for (var _i = 0, _a = structure.sitplan.getElements(); _i < _a.length; _i++) {
                var element = _a[_i];
                if (!element.isEendraadschemaSymbool())
                    element.svg = this.largeStrings.get(parseInt(element.svg));
            }
        }
    };
    undoRedo.prototype.store = function () {
        // We store the current state of the structure in the history but we replace the SVGs by a reference to a large string store
        this.replaceSVGsByStringStore();
        this.history.store(structure_to_json());
        this.replaceStringStoreBySVGs();
        if ((structure.properties.currentView == 'draw') && (structure.sitplanview != null))
            structure.sitplanview.updateRibbon();
        else if (structure.properties.currentView == '2col')
            structure.updateRibbon();
    };
    undoRedo.prototype.undo = function () {
        var lastView = structure.properties.currentView;
        var lastmode = structure.mode;
        var text = this.history.undo();
        if (text != null)
            json_to_structure(text, 0, false);
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        structure.reSort();
        structure.mode = lastmode;
        if (structure.properties.currentView != lastView)
            toggleAppView(structure.properties.currentView);
        switch (structure.properties.currentView) {
            case 'draw':
                topMenu.selectMenuItemByOrdinal(3);
                showSituationPlanPage();
                break;
            case '2col':
                topMenu.selectMenuItemByOrdinal(2);
                HLRedrawTree();
                break;
            case 'config':
                topMenu.selectMenuItemByOrdinal(4);
                printsvg();
                break;
        }
    };
    undoRedo.prototype.redo = function () {
        var lastView = structure.properties.currentView;
        var lastmode = structure.mode;
        var text = this.history.redo();
        if (text != null)
            json_to_structure(text, 0, false);
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        structure.reSort();
        structure.mode = lastmode;
        if (structure.properties.currentView != lastView)
            toggleAppView(structure.properties.currentView);
        if (structure.properties.currentView == 'draw') {
            topMenu.selectMenuItemByOrdinal(3);
            showSituationPlanPage();
        }
        else if (structure.properties.currentView == '2col') {
            topMenu.selectMenuItemByOrdinal(2);
            HLRedrawTree();
        }
    };
    undoRedo.prototype.clear = function () {
        this.history.clear();
        this.largeStrings.clear();
        structure.updateRibbon();
    };
    undoRedo.prototype.undoStackSize = function () { return (this.history.undoStackSize()); };
    undoRedo.prototype.redoStackSize = function () { return (this.history.redoStackSize()); };
    return undoRedo;
}());
var TopMenu = /** @class */ (function () {
    function TopMenu(ulId, liClassName, menuItems) {
        this.ulElement = document.getElementById(ulId);
        this.liClassName = liClassName;
        this.menuItems = menuItems;
        this.renderMenu();
        this.resetToFirstItem(); // Ensure the first item is selected initially
    }
    TopMenu.prototype.renderMenu = function () {
        var _this = this;
        this.ulElement.innerHTML = ''; // Clear any existing content
        this.menuItems.forEach(function (item) {
            var liElement = document.createElement('li');
            var aElement = document.createElement('a');
            liElement.className = _this.liClassName;
            aElement.innerText = item.name;
            aElement.addEventListener('click', function () {
                _this.selectItem(aElement);
                item.callback();
            });
            liElement.appendChild(aElement);
            _this.ulElement.appendChild(liElement);
        });
    };
    TopMenu.prototype.selectItem = function (selectedElement) {
        // Remove 'current' ID from all <a> elements
        var items = this.ulElement.querySelectorAll('a');
        items.forEach(function (item) { return item.removeAttribute('id'); });
        // Add 'current' ID to the clicked <a> element
        selectedElement.id = 'current';
    };
    TopMenu.prototype.resetToFirstItem = function () {
        var firstItem = this.ulElement.querySelector('a');
        if (firstItem) {
            this.selectItem(firstItem);
        }
    };
    TopMenu.prototype.selectMenuItemByName = function (name) {
        var item = this.menuItems.find(function (menuItem) { return menuItem.name === name; });
        if (item) {
            var aElement = Array.from(this.ulElement.querySelectorAll('a')).find(function (a) { return a.innerText === name; });
            if (aElement) {
                this.selectItem(aElement);
                item.callback();
            }
        }
    };
    TopMenu.prototype.selectMenuItemByOrdinal = function (nr) {
        // Remove 'current' ID from all <a> elements
        var items = this.ulElement.querySelectorAll('a');
        items.forEach(function (item) { return item.removeAttribute('id'); });
        this.selectItem(items[nr]);
    };
    return TopMenu;
}());
var HelperTip = /** @class */ (function () {
    function HelperTip(storage, storagePrefix) {
        if (storagePrefix === void 0) { storagePrefix = 'helpertip'; }
        this.storage = storage;
        this.storagePrefix = storagePrefix;
    }
    // Show the helper tip if it hasn't been dismissed before
    HelperTip.prototype.show = function (key, htmlContent, checked) {
        var _this = this;
        if (checked === void 0) { checked = false; }
        var neverDisplayKey = "".concat(this.storagePrefix, ".").concat(key, ".neverDisplay");
        var displayedInThisSessionKey = "".concat(this.storagePrefix, ".").concat(key, ".displayedInThisSession");
        // Check if the tip was dismissed before
        if ((this.storage.get(neverDisplayKey) === true) || (this.storage.get(displayedInThisSessionKey) === true)) {
            return; // Do nothing if the tip was dismissed or already shown
        }
        // Create the popup
        var popupOverlay = document.createElement('div');
        popupOverlay.id = 'popupOverlay';
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = '0';
        popupOverlay.style.left = '0';
        popupOverlay.style.width = '100%';
        popupOverlay.style.height = '100%';
        popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        popupOverlay.style.display = 'flex';
        popupOverlay.style.justifyContent = 'center';
        popupOverlay.style.alignItems = 'center';
        popupOverlay.style.visibility = 'hidden';
        popupOverlay.style.zIndex = '9999';
        var popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '5px 20px 20px';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '1000';
        // Add the HTML content
        popup.innerHTML = htmlContent;
        // Style the title
        var title = popup.querySelector('h3');
        if (title) {
            title.style.color = '#06F'; // Similar blue as the OK button
        }
        // Create the "Never display again" checkbox
        var checkboxLabel = document.createElement('label');
        checkboxLabel.style.display = 'block';
        checkboxLabel.style.marginTop = '10px';
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkboxLabel.appendChild(checkbox);
        var checkboxText = document.createTextNode(' Deze tekst nooit meer weergeven in deze browser.');
        var italicText = document.createElement('i');
        italicText.appendChild(checkboxText);
        checkboxLabel.appendChild(italicText);
        popup.appendChild(checkboxLabel);
        // Create the "OK" button
        var okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.marginTop = '10px';
        okButton.style.padding = '10px 20px';
        okButton.style.cursor = 'pointer';
        okButton.style.backgroundColor = '#3399FF'; // Lighter blue hue
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '5px'; // Rounded corners
        okButton.style.display = 'block';
        okButton.style.marginLeft = 'auto';
        okButton.style.marginRight = 'auto';
        okButton.style.width = '100px'; // Wider button
        // Add hover effect
        okButton.addEventListener('mouseover', function () {
            okButton.style.backgroundColor = '#06F'; // Darker blue on hover
        });
        okButton.addEventListener('mouseout', function () {
            okButton.style.backgroundColor = '#3399FF'; // Lighter blue when not hovering
        });
        okButton.addEventListener('click', function () {
            // Set the neverdisplay flag if the checkbox is checked
            _this.storage.set(displayedInThisSessionKey, true, true);
            if (checkbox.checked) {
                _this.storage.set(neverDisplayKey, true);
            }
            // Remove the popup
            document.body.removeChild(popupOverlay);
            document.body.style.pointerEvents = 'auto';
        });
        popup.appendChild(okButton);
        // Add the popup to the document body
        popupOverlay.appendChild(popup);
        document.body.appendChild(popupOverlay);
        popupOverlay.style.visibility = 'visible';
        document.body.style.pointerEvents = 'none'; // Disable interactions with the background
        popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    };
    return HelperTip;
}());
/* FUNCTION showFilePage
   
   Shows the Documentation-Page.

*/
function showDocumentationPage() {
    var strleft = "\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"100%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Handleiding</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"100%\" align=\"left\">\n            <table border=0>\n              <tr>\n                <td width=100 style=\"vertical-align:top;padding:5px\">\n                  <button style=\"font-size:14px\" id=\"Btn_downloadManual\">E\u00E9ndraadschema</button>\n                </td>\n                <td style=\"vertical-align:top;padding:7px\">\n                  Een volledige handleiding is beschikbaar in PDF formaat.\n                  Klik links om deze in een ander venster te openen.\n                  <br>\n                  Het programma is in volle ontwikkeling dus delen van de handleiding zijn\n                  mogelijk ietwat verouderd.  \n                </td>\n              </tr>\n              <tr>\n                <td width=100 style=\"vertical-align:top;padding:5px\">\n                  <button style=\"font-size:14px\" id=\"Btn_downloadSitPlanManual\">Situatieschema</button>\n                </td>\n                <td style=\"vertical-align:top;padding:7px\">\n                  Specifiek voor het werken met het situatieschema werd een ander korter document opgesteld.\n                  Klik link om deze in een ander venster te openen.\n                </td>\n              </tr>\n            </table>\n        </td>\n      </tr>\n    </table>";
    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
    document.getElementById('Btn_downloadManual').onclick = function () { window.open('Documentation/edsdoc.pdf', '_blank'); };
    document.getElementById('Btn_downloadSitPlanManual').onclick = function () { window.open('Documentation/sitplandoc.pdf', '_blank'); };
}
var ContextMenu = /** @class */ (function () {
    /**
     * Constructor voor het initialiseren van het contextmenu-element.
     * @param div - Het HTML-element waaraan het contextmenu wordt toegevoegd.
     */
    function ContextMenu(div) {
        if (div === void 0) { div = document.body; }
        this.menuItems = [];
        this.menuElement = null;
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'context-menu';
        div.appendChild(this.menuElement);
    }
    /**
     * Wis alle menu-items.
     */
    ContextMenu.prototype.clearMenu = function () {
        this.menuItems = [];
        if (this.menuElement) {
            this.menuElement.innerHTML = '';
        }
    };
    /**
     * Voeg een menu-item toe met een optionele sneltoets.
     * @param label - De tekstlabel van het menu-item.
     * @param callback - De functie die wordt aangeroepen bij het klikken op het menu-item.
     * @param shortcut - De optionele sneltoets voor het menu-item.
     */
    ContextMenu.prototype.addMenuItem = function (label, callback, shortcut) {
        this.menuItems.push({ label: label, shortcut: shortcut, callback: callback });
    };
    /**
     * Voeg een scheidingslijn toe aan het menu.
     */
    ContextMenu.prototype.addLine = function () {
        this.menuItems.push({ label: 'separator', callback: function () { } });
    };
    /**
     * Render de menu-items.
     */
    ContextMenu.prototype.renderMenu = function () {
        var _this = this;
        if (this.menuElement) {
            this.menuElement.innerHTML = '';
            this.menuItems.forEach(function (item, index) {
                if (item.label === 'separator') {
                    var separator = document.createElement('hr');
                    separator.className = 'context-menu-separator';
                    _this.menuElement.appendChild(separator);
                }
                else {
                    var menuItem = document.createElement('div');
                    menuItem.className = 'context-menu-item';
                    var labelElement = document.createElement('span');
                    labelElement.textContent = item.label;
                    var shortcutElement = document.createElement('span');
                    shortcutElement.textContent = item.shortcut || '';
                    shortcutElement.className = 'context-menu-shortcut';
                    menuItem.appendChild(labelElement);
                    menuItem.appendChild(shortcutElement);
                    menuItem.addEventListener('click', function () {
                        item.callback();
                        _this.hide();
                    });
                    _this.menuElement.appendChild(menuItem);
                }
            });
        }
    };
    /**
     * Toon het contextmenu op de locatie van de muisklik.
     * @param event - Het muisgebeurtenisobject.
     */
    ContextMenu.prototype.show = function (event) {
        if (this.menuElement) {
            this.renderMenu();
            this.menuElement.style.display = 'block';
            var clientX = event.clientX, clientY = event.clientY;
            var innerWidth_1 = window.innerWidth, innerHeight_1 = window.innerHeight;
            var _a = this.menuElement, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
            var left = clientX;
            var top_1 = clientY;
            if (left + offsetWidth > innerWidth_1) {
                left = innerWidth_1 - offsetWidth;
            }
            if (top_1 + offsetHeight > innerHeight_1) {
                top_1 = innerHeight_1 - offsetHeight;
            }
            this.menuElement.style.left = "".concat(left, "px");
            this.menuElement.style.top = "".concat(top_1, "px");
        }
    };
    /**
     * Verberg het contextmenu.
     */
    ContextMenu.prototype.hide = function () {
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
        }
    };
    return ContextMenu;
}());
/**
 * Class gebruikt in SituationPlanView om te zoeken naar electroitems op basis van de kringnaam.
 * Dit laat toe items to selecteren uit het volledige eendraadschema en ze te plaatsen op het situatieschema.
 *
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 */
var ElectroItemZoeker = /** @class */ (function () {
    /**
     * Constructor van de ElectroItemZoeker.
     *
     * Initialiseert de lijst van alle toegestane ElectroItems in het situatieplan.
     */
    function ElectroItemZoeker() {
        this.excludedTypes = ['Aansluiting', 'Bord', 'Kring', 'Domotica', 'Domotica module (verticaal)',
            'Domotica gestuurde verbruiker', 'Leiding', 'Splitsing', 'Verlenging',
            'Vrije ruimte', 'Meerdere verbruikers'];
        this.data = [];
        this.borden = [];
        this.reCalculate();
    }
    /**
     * Geeft de lijst van alle toegestane ElectroItems in het situatieplan retour.
     * @returns {Object[]} een lijst van objecten met de volgende structuur:
     *                  {id: number, kringnaam: string, adres: string, type: string}
     */
    ElectroItemZoeker.prototype.getData = function () {
        return this.data;
    };
    /**
    * Geeft de lijst van alle Borden in het eendraadschema.
    * @returns {Object[]} een lijst van objecten met de volgende structuur:
    *                  {id: number, naam: string}
    *
    * Indien de originele naam null is of enkel uit spaties bestaat wordt als naam "Bord" meegegeven
    */
    ElectroItemZoeker.prototype.getBorden = function () {
        return this.borden;
    };
    /**
     * Geeft een lijst van alle unieke kringnamen retour uit de lijst van ElectroItems.
     * @returns {string[]} een lijst van unieke kringnamen.
     */
    ElectroItemZoeker.prototype.getUniqueKringnaam = function () {
        return Array.from(new Set(this.data.map(function (x) { return x.kringnaam; })));
    };
    /**
     * Geeft een lijst van alle ElectroItems retour die behoren tot de kring met de naam 'kringnaam'.
     * @param {string} kringnaam - de naam van de kring.
     * @returns {Object[]} een lijst van objecten met de volgende structuur:
     *                  {id: number, adres: string, type: string}
     */
    ElectroItemZoeker.prototype.getElectroItemsByKring = function (kringnaam) {
        return this.data.filter(function (x) { return x.kringnaam === kringnaam; }).map(function (x) { return ({ id: x.id, adres: x.adres, type: x.type }); });
    };
    /**
     * Rekent de lijst van alle toegestane ElectroItems opnieuw uit.
     *
     * Deze methode wordt gebruikt om de lijst van ElectroItems te vullen die in het situatieplan gebruikt mogen worden.
     * De lijst wordt opnieuw uitgerekend door de volgende stappen:
     * 1. Doorlopen alle actieve ElectroItems in de structuur.
     * 2. Voor elke ElectroItem worden de kringnaam en het type bepaald.
     * 3. Als de kringnaam niet leeg is en het type niet voorkomt in de lijst van uitgesloten types, dan wordt de ElectroItem toegevoegd aan de lijst.
     * 4. De ElectroItem wordt toegevoegd met de volgende structuur: {id: number, kringnaam: string, adres: string, type: string}
     *
     * Er wordt eveneens een lijst van borden gemaakt.
     */
    ElectroItemZoeker.prototype.reCalculate = function () {
        this.data = [];
        this.borden = [];
        for (var i = 0; i < structure.length; i++) {
            if (structure.active[i]) {
                var id = structure.id[i];
                var electroItem = structure.data[i];
                if (electroItem == null)
                    continue;
                var type = electroItem.getType();
                if (type == 'Bord') {
                    var myName = electroItem.props.naam;
                    if ((myName == null) || (myName.trim() == ''))
                        myName = 'Bord';
                    this.borden.push({ id: id, naam: myName });
                }
                else {
                    var kringnaam = structure.findKringName(id).trim();
                    if (kringnaam != '') {
                        if ((type != null) && (this.excludedTypes.indexOf(type) === -1)) {
                            var adres = electroItem.getReadableAdres();
                            this.data.push({ id: id, kringnaam: kringnaam, adres: adres, type: type });
                        }
                    }
                }
            }
        }
    };
    return ElectroItemZoeker;
}());
/**
 * Functie die de breedte en hoogte van een rechthoek als invoer neemt, evenals een rotatie rond het midden van de rechthoek.
 * De functie retourneert de breedte en hoogte van de kleinste rechthoek die de geroteerde rechthoek omsluit met zijden langs de X- en Y-assen.
 */
function getRotatedRectangleSize(width, height, rotation) {
    var rotationInRadians = rotation * Math.PI / 180;
    var cos = Math.cos(rotationInRadians);
    var sin = Math.sin(rotationInRadians);
    var rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
    var rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
    return { width: rotatedWidth, height: rotatedHeight };
}
/**
 * Functie die de breedte en hoogte van een rechthoek als invoer neemt, evenals een rotatie rond het midden van de rechthoek.
 * De functie retourneert de breedte en hoogte van de rechthoek die voldoet aan de volgende eigenschappen:
 * - De zijden zijn parallel aan de X-as en de Y-as.
 * - De rechthoek snijdt de X-as en Y-as in dezelfde punten als de originele geroteerde rechthoek
 *
 * Deze functie kan gebruikt worden om de locatie van labels te bepalen.
 */
function getXYRectangleSize(width, height, rotation) {
    rotation = Math.abs(rotation) % 180;
    if (rotation > 90)
        rotation = 180 - rotation;
    var rotationInRadians = rotation * Math.PI / 180;
    var cos = Math.cos(rotationInRadians);
    var sin = Math.sin(rotationInRadians);
    return { width: Math.min(width / cos, height / sin), height: Math.min(width / sin, height / cos) };
}
/**
 * Cache het resultaat van getPixelsPerMillimeter() om de overhead van het maken en verwijderen van een DOM-element bij elke oproep te voorkomen.
 */
var cachedPixelsPerMillimeter = null;
/**
 * Berekent het aantal pixels in een millimeter op het huidige scherm.
 * Maakt gebruik van een cache om de overhead van het maken en verwijderen van een DOM-element bij elke oproep te voorkomen.
 * @returns {number} Het aantal pixels in een millimeter.
 */
function getPixelsPerMillimeter() {
    if (cachedPixelsPerMillimeter === null) {
        var div = document.createElement('div');
        div.style.width = '10mm';
        div.style.position = 'absolute';
        document.body.appendChild(div);
        var widthInPixels = div.offsetWidth;
        document.body.removeChild(div);
        cachedPixelsPerMillimeter = widthInPixels / 10;
    }
    return cachedPixelsPerMillimeter;
}
/**
 * Class that helps with dragging a box on the situation plan view.
 * It keeps track of the start position of the drag and the zoomfactor.
 */
var MouseDrag = /** @class */ (function () {
    function MouseDrag() {
        this.startDragx = 0;
        this.startDragy = 0;
        this.startOffsetLeft = 0;
        this.startOffsetTop = 0;
        this.zoomfactor = 1;
        this.hassMoved = false;
    }
    /**
     * Start the drag.
     * @param mousex The x position of the mouse when the drag starts.
     * @param mousey The y position of the mouse when the drag starts.
     * @param startOffsetLeft The left position of the box when the drag starts.
     * @param startOffsetTop The top position of the box when the drag starts.
     * @param zoomfactor The zoomfactor of the situation plan view when the drag starts.
     */
    MouseDrag.prototype.startDrag = function (mousex, mousey, startOffsetLeft, startOffsetTop, zoomfactor) {
        if (mousex === void 0) { mousex = 0; }
        if (mousey === void 0) { mousey = 0; }
        if (startOffsetLeft === void 0) { startOffsetLeft = 0; }
        if (startOffsetTop === void 0) { startOffsetTop = 0; }
        if (zoomfactor === void 0) { zoomfactor = 1; }
        this.startDragx = mousex;
        this.startDragy = mousey;
        this.startOffsetLeft = startOffsetLeft;
        this.startOffsetTop = startOffsetTop;
        this.zoomfactor = zoomfactor;
        this.hassMoved = false;
    };
    /**
     * Return the new left and top position of the box based on the current mouse position.
     * @param mousex The current x position of the mouse.
     * @param mousey The current y position of the mouse.
     * @returns An object with the new left and top position of the box.
     */
    MouseDrag.prototype.returnNewLeftTop = function (mousex, mousey) {
        if (mousex === void 0) { mousex = 0; }
        if (mousey === void 0) { mousey = 0; }
        if (mousex != this.startDragx || mousey != this.startDragy)
            this.hassMoved = true;
        return ({
            left: (mousex - this.startDragx) / this.zoomfactor + this.startOffsetLeft,
            top: (mousey - this.startDragy) / this.zoomfactor + this.startOffsetTop
        });
    };
    return MouseDrag;
}());
/**
 * Volledig overzicht van een situatieplan.
 * Werd gebouwd voor gebruik in de browser maar is redelijk browser-agnostic.
 * De effectieve code om te interageren met de browser zelf zit in class SituationPlanView.
 *
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 */
var SituationPlan = /** @class */ (function () {
    function SituationPlan() {
        this.activePage = 1; // We houden deze bij in situationplan zodat ook wijzigingen van pagina's worden opgeslagen
        this.numPages = 1;
        this.elements = [];
        this.defaults = {
            fontsize: 11,
            scale: SITPLANVIEW_DEFAULT_SCALE,
            rotate: 0
        };
    }
    /**
     * Workaround om de private variabele elements te kunnen gebruiken in friend classs
     * @returns {SituationPlanElement[]} De elementen van het situatieplan
     */
    SituationPlan.prototype.getElements = function () {
        return this.elements;
    };
    /**
     * SituationPlanElement toevoegen aan het situatieplan
     * @param element
     * @returns {void}
     */
    SituationPlan.prototype.addElement = function (element) {
        this.elements.push(element);
    };
    /**
     * Laad een SVG-inhoud vanuit een bestand en voegt deze toe aan het situatieplan.
     * De SVG werd geselecteerd in een fileInput HTML element en komt binnen via het event in de functie header.
     *
     * @param {any} event Het event dat aangaf dat er een bestand was gekozen om te uploaden.
     * @param {number} page Het pagina-nummer van het element in het situatieplan.
     * @param {number} posx De x-coordinaat van het element in het situatieplan.
     * @param {number} posy De y-coordinaat van het element in het situatieplan.
     * @param {() => void} callback Een callback-functie die wordt aangeroepen wanneer het element is toegevoegd.
     * @returns {SituationPlanElement} Het element dat is toegevoegd.
     */
    SituationPlan.prototype.addElementFromFile = function (event, page, posx, posy, callback) {
        var element = new SituationPlanElement();
        element.setVars({ page: page, posx: posx, posy: posy, labelfontsize: this.defaults.fontsize, scale: this.defaults.scale, rotate: this.defaults.rotate });
        element.importFromFile(event, callback);
        this.elements.push(element);
        return element;
    };
    /**
     * Creëer een nieuw element in het situatieplan dat gelinkt is aan een Electro_Item
     *
     * @param {number} electroItemId Het ID van de Electro_Item.
     * @param {number} page Het pagina-nummer van het element in het situatieplan.
     * @param {number} posx De x-coordinaat van het element in het situatieplan.
     * @param {number} posy De y-coordinaat van het element in het situatieplan.
     * @param {AdresType} adrestype Het type van het adres, bijvoorbeeld 'manueel'.
     *                              AdresType wordt definieerd in SituationPlanElement.ts
     * @param {string} adres Het adres.
     * @param {AdresLocation} adreslocation De locatie van het adres in het label ('boven' of 'onder' of 'rechts' of 'links').
     *                                      AdresLocation wordt definieerd in SituationPlanElement.ts
     * @param {number} labelfontsize De lettergrootte van het label.
     * @param {number} scale De schaal van het element.
     * @param {number} rotate De rotatie van het element.
     * @returns {SituationPlanElement} Het element dat is toegevoegd.
     */
    SituationPlan.prototype.addElementFromElectroItem = function (electroItemId, page, posx, posy, adrestype, adres, adreslocation, labelfontsize, scale, rotate) {
        var electroItem = structure.getElectroItemById(electroItemId);
        if (!electroItem)
            return null;
        var element = electroItem.toSituationPlanElement();
        Object.assign(element, { page: page, posx: posx, posy: posy, labelfontsize: labelfontsize, scale: scale, rotate: rotate });
        element.setElectroItemId(electroItemId);
        element.setAdres(adrestype, adres, adreslocation);
        this.elements.push(element);
        return element;
    };
    /**
     * Verwijder een element van het situatieplan.
     * In principe is er altijd maar één maar de functie gebruikt recursie in het geval er meerdere zouden zijn
     * om ze allemaal te verwijderen.
     *
     * @param {SituationPlanElement} element Het element dat verwijderd moet worden.
     * @returns {void}
     */
    SituationPlan.prototype.removeElement = function (element) {
        var index = this.elements.indexOf(element);
        if (index === -1)
            return;
        this.elements.splice(index, 1);
        if (element.boxref != null)
            element.boxref.remove();
        if (element.boxlabelref != null)
            element.boxlabelref.remove();
        this.removeElement(element); // Recurse in het geval er meerdere zouden zijn maar dit zou niet mogen gebeuren
    };
    /**
     * Zorgt ervoor dat alle elementen in het situatieplan een link hebben naar
     * het eendraadschema.
     *
     * Als een element in het situatieplan verwijst naar een symbool dat niet langer in
     * het eendraadschema zit, wordt het element verwijderd uit het situatieplan.
     */
    SituationPlan.prototype.syncToEendraadSchema = function () {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            //Indien een symbool niet langer in het eendraadschema zit moet het ook uit het situatieplan verwijderd worden
            //We kunnen hier niet de functie isEendraadSchemaSymbool of getElectroItemById gebruiken want die zorgen
            //ervoor dat onderstaande altijd false geeft als de symbolen niet langer in het eendraadschema zitten waardoor
            //de cleanup die nodig is niet gebeurd.
            if ((element.electroItemId != null) && (structure.getElectroItemById(element.getElectroItemId()) == null)) {
                this.removeElement(element);
                this.syncToEendraadSchema();
                return; // Start opnieuw en stop na recursie
            }
        }
    };
    /**
     * Sorteer de elementen in het situatieplan op basis van de z-index van hun boxref elementen in de DOM.
     * Elementen met een `null` `boxref` worden naar het einde van de lijst verplaatst.
     *
     * Het sorteren is nodig om ervoor te zorgen dat bij het printen wanneer lineair door de elementen wordt gegaan
     * de elementen in de juiste volgorde worden gestacked.
     *
     * @returns {void}
     */
    SituationPlan.prototype.orderByZIndex = function () {
        this.elements.sort(function (a, b) {
            if (a.boxref == null)
                return 1;
            if (b.boxref == null)
                return -1;
            return parseInt(a.boxref.style.zIndex) - parseInt(b.boxref.style.zIndex);
        });
    };
    /**
     * Initialiseer het situatieplan vanuit een json-object.
     *
     * @param {Object} json Het json-object dat het situatieplan bevat.
     *                      Het object bevat een 'numPages' property dat het aantal pagina's in het situatieplan aangeeft.
     *                      Verder bevat het een 'elements' property dat een array is van json-objecten die elk een element in het situatieplan vertegenwoordigen.
     *                      Elke json-object in de array bevat de properties van een SituationPlanElement.
     * @returns {void}
     */
    SituationPlan.prototype.fromJsonObject = function (json) {
        if (json.numPages !== undefined) {
            this.numPages = json.numPages;
        }
        else {
            this.numPages = 1;
        }
        if (json.activePage !== undefined) {
            this.activePage = json.activePage;
        }
        else {
            this.activePage = 1;
        }
        if (json.defaults !== undefined) {
            Object.assign(this.defaults, json.defaults);
        }
        if (Array.isArray(json.elements)) {
            this.elements = json.elements.map(function (element) {
                var newElement = new SituationPlanElement();
                newElement.fromJsonObject(element);
                return newElement;
            });
        }
        else {
            this.elements = [];
        }
    };
    /**
     * Converteer het situatieplan naar een JSON-object dat gebruikt kan worden
     * voor opslaan in lokale storage of voor versturen naar de server.
     *
     * @returns {any} Het JSON-object dat het situatieplan bevat.
     */
    SituationPlan.prototype.toJsonObject = function () {
        var elements = [];
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            elements.push(element.toJsonObject());
        }
        return { numPages: this.numPages, activePage: this.activePage, defaults: this.defaults, elements: elements };
    };
    /**
     * Converteer het situatieplan naar een formaat dat gebruikt kan worden voor printen.
     *
     * @param {boolean} fitToPage Indien `true` dan wordt de pagina automatisch aangepast om alle elementen te laten passen.
     *                            Als `false` dan wordt de pagina in de originele grootte gebruikt.
     * @returns {any} Het formaat van het situatieplan dat gebruikt kan worden voor printen.
     *                Dit is een javascript object met structuur
     *                  {
     *                      numpages: number,
     *                      pages: [
     *                          {
     *                              svg: string,
     *                              minx: number,
     *                              miny: number,
     *                              maxx: number,
     *                              maxy: number
     *                          }
     *                      ]
     *                  }
     */
    SituationPlan.prototype.toSitPlanPrint = function (fitToPage) {
        if (fitToPage === void 0) { fitToPage = false; }
        this.syncToEendraadSchema(); // Om zeker te zijn dat we geen onbestaande elementen meer hebben
        this.orderByZIndex(); // Sorteer de elementen op basis van de z-index zodat ze in de juiste volgorde worden geprint
        var outstruct = {};
        outstruct.numpages = (this.elements.length > 0 ? structure.sitplan.numPages : 0);
        outstruct.pages = [];
        for (var i = 0; i < outstruct.numpages; i++) {
            var svgstr = '';
            var maxx = getPixelsPerMillimeter() * 277;
            var maxy = getPixelsPerMillimeter() * 150;
            var minx = 0;
            var miny = 0;
            for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element.page == (i + 1)) {
                    var fontsize = (element.labelfontsize != null) ? element.labelfontsize : 11;
                    svgstr += element.getScaledSVG(true);
                    if (fitToPage) {
                        var boundingbox = getRotatedRectangleSize(element.sizex * element.getscale(), element.sizey * element.getscale(), element.rotate);
                        maxx = Math.max(maxx, element.posx + boundingbox.width / 2);
                        maxy = Math.max(maxy, element.posy + boundingbox.height / 2);
                        minx = Math.min(minx, element.posx - boundingbox.width / 2);
                        miny = Math.min(miny, element.posy - boundingbox.height / 2);
                    }
                    var str = element.getAdres();
                    svgstr += "<text x=\"".concat(element.labelposx, "\" y=\"").concat(element.labelposy, "\" font-size=\"").concat(fontsize, "\" fill=\"black\" text-anchor=\"middle\" dominant-baseline=\"middle\">").concat(htmlspecialchars(str), "</text>");
                }
            }
            svgstr = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(maxx - minx, "px\" height=\"").concat(maxy - miny, "px\" viewBox=\"").concat(minx, " ").concat(miny, " ").concat(maxx - minx, " ").concat(maxy - miny, "\">").concat(svgstr, "</svg>");
            outstruct.pages.push({ sizex: maxx - minx, sizey: maxy - miny, svg: svgstr });
        }
        return outstruct;
    };
    return SituationPlan;
}());
/**
 * Class SituationPlanElement
 *
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 * - SITPLANVIEW_DEFAULT_SCALE
 */
var SituationPlanElement = /** @class */ (function () {
    /**
     * Constructor
     */
    function SituationPlanElement() {
        this.electroItemId = null; // Referentie naar het electro-element in de datastructuur indien van toepassing
        // -- Basis eigenschappen van het element zelf --
        this.boxref = null; // Referentie naar het DIV document in de browser waar het element wordt afgebeeld
        this.svg = ''; /* SVG content van het element indien van toepassing
                                    Indien electroItemId == null dan is dit de SVG content van het element zelf
                                    Indien electroItemId != null dan is dit de laatste geladen SVG content van het electro-element
                                    Altijd te verifiëren dat deze niet leeg is en evenueel een update forceren */
        // -- Basis eigenschappen van het label --
        //    adres gegevens zijn private gedefinieerd omwille van consistentie (bvb adres kan leeg gelaten worden als het type auto is)
        this.boxlabelref = null; // Referentie naar het DIV document in de browser waar het label wordt afgebeeld
        this.adrestype = null;
        this.adres = null;
        this.adreslocation = 'rechts';
        // -- Positionering van het element zelf --
        this.page = 1; //pagina waarop het element zich bevindt    
        this.posx = 0; //center positie-x in het schema
        this.posy = 0; //center positie-y in het schema
        this.sizex = 0; //breedte
        this.sizey = 0; //hoogte
        this.rotate = 0;
        this.scale = SITPLANVIEW_DEFAULT_SCALE;
        // -- Positionering van het label --
        this.labelposx = 0;
        this.labelposy = 0;
        this.labelfontsize = 11;
        // -- Een vlag om de situationplanview te laten weten dat de box content moet geupdated worden
        this.needsViewUpdate = false;
        this.id = randomId("SP_");
    }
    SituationPlanElement.prototype.setscale = function (scale) {
        this.scale = scale;
        this.needsViewUpdate = true;
    };
    SituationPlanElement.prototype.getscale = function () {
        return this.scale;
    };
    /**
     * isEendraadschemaSymbool
     *
     * Controleer of het element een geldig electro-element is
     * Hiervoor is een geldige electroItemId nodig en moet het element in de datastructuur voorkomen.
     *
     * @returns boolean
     */
    SituationPlanElement.prototype.isEendraadschemaSymbool = function () {
        if (this.electroItemId != null) {
            return (structure.getElectroItemById(this.electroItemId) != null);
        }
        return false;
    };
    SituationPlanElement.prototype.isEDSSymbolAndRotates360degrees = function () {
        if (this.isEendraadschemaSymbool()) {
            var electroElement = structure.getElectroItemById(this.electroItemId);
            if (electroElement != null) {
                var type = electroElement.getType();
                return SituationPlanElement.ROTATES_360_DEGREES_TYPES.has(type);
            }
            return false;
        }
        return false;
    };
    /**
     * setAdres
     *
     * @param adrestype string : 'auto' of 'manueel'
     * @param adres string : Indien manueel, het adres. Indien auto wordt deze genegeerd en this.adres altijd op null gezet.
     * @param adreslocation string: 'rechts' of 'links' of 'boven' of 'onder'
     */
    SituationPlanElement.prototype.setAdres = function (adrestype, adres, adreslocation) {
        this.adrestype = adrestype;
        this.adreslocation = adreslocation;
        if (this.adrestype === 'manueel')
            this.adres = adres;
        else
            this.adres = null;
    };
    /**
     * setAdresLocation
     *
     * @param adreslocation string: 'rechts' of 'links' of 'boven' of 'onder'
     */
    SituationPlanElement.prototype.setAdresLocation = function (adreslocation) {
        this.adreslocation = adreslocation;
    };
    /**
     * getAdresType
     *
     * @returns string : 'auto' of 'manueel'
     */
    SituationPlanElement.prototype.getAdresType = function () {
        return this.adrestype;
    };
    /**
     * getAdres
     *
     * @returns string : adres
     */
    SituationPlanElement.prototype.getAdres = function () {
        var _a;
        if (!this.isEendraadschemaSymbool())
            return ''; // Geen adres voor niet-elektro-elementen
        var element = structure.getElectroItemById(this.electroItemId);
        if (element == null)
            return ''; // zou redundant moeten zijn want we controleerden al in isEendraadschemaSymbool
        if (this.adrestype === 'auto') {
            return element.getReadableAdres();
        }
        else {
            return (_a = this.adres) !== null && _a !== void 0 ? _a : '';
        }
    };
    /**
     * getAdresLocation
     *
     * @returns 'rechts'|'links'|'boven'|'onder'
     */
    SituationPlanElement.prototype.getAdresLocation = function () {
        return this.adreslocation;
    };
    /**
     * setElectroItemId
     *
     * @param electroItemId number : id van het electroitem in structure
     *
     * TODO: zou beter een private functie zijn en niet worden aangeroepen vanuit SituationPlan en SituationPlanView
     */
    SituationPlanElement.prototype.setElectroItemId = function (electroItemId) {
        this.electroItemId = electroItemId;
    };
    /**
     * getElectroItemId
     *
     * @returns number : id van het electroitem in structure
     */
    SituationPlanElement.prototype.getElectroItemId = function () {
        if (this.isEendraadschemaSymbool())
            return this.electroItemId;
        else
            return null;
    };
    /**
     * updateElectroItemSVG
     *
     * @param svg string : nieuwe gegenereerde SVG door het electro-element
     * @param width number : breedte van de SVG zonder schaling en rotatie, indien niet gegeven wordt de breedte gezocht met functie getSizeFromString
     * @param height number : hoogte van de SVG zonder schaling en rotatie
     */
    SituationPlanElement.prototype.updateElectroItemSVG = function (svg, width, height) {
        if (width === void 0) { width = undefined; }
        if (height === void 0) { height = undefined; }
        if (this.isEendraadschemaSymbool()) {
            if (this.svg !== svg) { // This works because when saving to a file, svg is set to '' so an update will be triggered here
                this.needsViewUpdate = true;
                this.svg = svg;
                if (width != null)
                    this.sizex = width;
                if (height != null)
                    this.sizey = height;
                if (width == null || height == null)
                    this.getSizeFromString();
            }
        }
    };
    /**
     * getUnscaledSVGifNotElectroItem
     *
     * @returns string : SVG content van het element op voorwaarde dat het geen electro-element is
     */
    SituationPlanElement.prototype.getUnscaledSVGifNotElectroItem = function () {
        // cleanSVG(): Deze functie is nodig omdat gebleken is dat de print SVG commando's in jsPDF niet overweg kunnen met SVG's die niet dadelijk beginnen met '<svg' 
        var _this = this;
        var cleanSVG = function () {
            if (_this.svg == null)
                _this.svg = '';
            else {
                var index = _this.svg.indexOf('<svg');
                if (index !== -1)
                    _this.svg = _this.svg.substring(index);
            }
        };
        if (!this.isEendraadschemaSymbool()) {
            cleanSVG();
            return this.svg;
        }
        else {
            return '';
        }
    };
    /**
     * getScaledSVG
     *
     * @param positioned boolean : indien true wordt de SVG getransformeerd naar de correcte positie en rotatie
     * @returns string : SVG content van het element dat onmmiddellijk in een innerHTML van de browser of een grotere SVG
     *                   om te printen kan worden geplaatst
     *
     * TODO: kan nog efficienter indien we een flag "updated" hebben in het element zodat we weten wanneer we alles moeten hertekenen
     */
    SituationPlanElement.prototype.getScaledSVG = function (positioned) {
        var _this = this;
        if (positioned === void 0) { positioned = false; }
        var berekenAfbeeldingsRotatieEnSpiegeling = function () {
            var rotate = _this.rotate;
            while (rotate < 0)
                rotate = rotate + 360;
            rotate = rotate % 360;
            var spiegel = false;
            if ((rotate >= 90) && (rotate < 270)) {
                if (_this.isEDSSymbolAndRotates360degrees())
                    spiegel = true;
                if (_this.isEendraadschemaSymbool())
                    rotate = rotate + 180;
            }
            return [rotate, spiegel];
        };
        if (this.isEendraadschemaSymbool()) {
            var electroItem = structure.getElectroItemById(this.electroItemId);
            if (electroItem != null)
                electroItem.updateSituationPlanElement(this);
        }
        var posinfo = '';
        var transform = '';
        if (positioned) { // Indien we de SVG willen positioneren en roteren, bvb voor gebruik in een print
            posinfo = "x=\"".concat(this.posx - this.sizex / 2 * this.scale, "\" y=\"").concat(this.posy - this.sizey / 2 * this.scale, "\"");
            var _a = berekenAfbeeldingsRotatieEnSpiegeling(), rotate = _a[0], spiegel = _a[1];
            transform = "transform=\"rotate(".concat(rotate, " ").concat(this.posx, " ").concat(this.posy, ")").concat((spiegel ? " scale(-1,1) translate(".concat(-this.posx * 2, " 0)") : ''), "\"");
            return "<g ".concat(transform, ">\n                    <svg ").concat(posinfo, " width=\"").concat(this.sizex * this.scale, "px\" height=\"").concat(this.sizey * this.scale, "px\" viewBox=\"0 0 ").concat(this.sizex, " ").concat(this.sizey, "\">").concat(this.svg, "</svg>\n                    </g>");
        }
        else { // Indien we de SVG willen gebruiken in een innerHTML van een div element en dit element dan zelf positioneren en roteren
            return "<svg class=\"svg-icon\" width=\"".concat(this.sizex * this.scale, "px\" height=\"").concat(this.sizey * this.scale, "px\" viewBox=\"0 0 ").concat(this.sizex, " ").concat(this.sizey, "\">").concat(this.svg, "</svg>");
        }
    };
    /**
     * getSizeFromString
     *
     * Haal de grootte van het SVG element uit de SVG string
     */
    SituationPlanElement.prototype.getSizeFromString = function () {
        // Create a DOMParser to parse the SVG string
        var parser = new DOMParser();
        var svgDoc = parser.parseFromString(this.svg, "image/svg+xml");
        // Access the SVG element
        var svgElement = svgDoc.querySelector('svg');
        if (svgElement) {
            // Extract the height and width attributes
            this.sizey = parseInt(svgElement.getAttribute('height'));
            this.sizex = parseInt(svgElement.getAttribute('width'));
        }
        else {
            console.error('Invalid SVG string');
        }
    };
    /**
     * Scalet het selecteerde element naar het papier als dat nodig is
     *
     * @param {number} maxx - Maximale breedte van het canvas
     * @param {number} maxy - Maximale hoogte van het canvas
     */
    SituationPlanElement.prototype.scaleSelectedBoxToPaperIfNeeded = function (maxx, maxy, defaultscale) {
        if (defaultscale === void 0) { defaultscale = 1; }
        //get the width and hight of the sitplanelement
        var width = this.sizex;
        var height = this.sizey;
        //calculate the maximum allowed scaling for a canvas of 550x300
        var maxScale = Math.min(defaultscale, maxx / width, maxy / height);
        //scale the element to the maximum allowed scaling
        this.scale = Math.floor(maxScale * 10000) / 10000;
    };
    /**
     * Leest de inhoud van een situatieplanelement uit een image bestand
     * Enkel image bestanden ondersteund door de browser worden ondersteund
     *
     * @param event Event van het file input element gedefinieerd in index.html
     * @param callback Callback functie die wordt uitgevoerd na het inladen van de file
     */
    SituationPlanElement.prototype.importFromFile = function (event, callback) {
        var _this = this;
        var input = event.target;
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            var fileName = file.name.toLowerCase();
            var mimeType = file.type;
            reader.onload = function (e) {
                var fileContent = e.target.result;
                var image = new Image();
                image.src = fileContent;
                image.onload = function () {
                    _this.sizex = image.width;
                    _this.sizey = image.height;
                    _this.svg = "<svg width=\"".concat(image.width, "\" height=\"").concat(image.height, "\"><image href=\"").concat(fileContent, "\" width=\"").concat(image.width, "\" height=\"").concat(image.height, "\"/></svg>");
                    callback();
                };
                image.onerror = function () {
                    alert('Het formaat van deze file wordt niet ondersteund.');
                };
            };
            reader.readAsDataURL(file); // Read the file as a data URL 
        }
        else {
            alert('Geen bestand geselecteerd');
        }
    };
    /**
     * setVars
     *
     * @param object Object : object met de variabelen die moeten worden ingesteld
     */
    SituationPlanElement.prototype.setVars = function (object) {
        Object.assign(this, object);
    };
    /**
     * toJsonObject
     *
     * @returns Object : object met de variabelen van het element dat dadelijk kan worden omgezet naar een JSON string
     */
    SituationPlanElement.prototype.toJsonObject = function () {
        return {
            page: this.page,
            posx: this.posx,
            posy: this.posy,
            sizex: this.sizex,
            sizey: this.sizey,
            labelposx: this.labelposx,
            labelposy: this.labelposy,
            labelfontsize: this.labelfontsize,
            adrestype: this.adrestype,
            adres: this.adres,
            adreslocation: this.adreslocation,
            rotate: this.rotate,
            scale: this.scale,
            svg: (this.isEendraadschemaSymbool() ? '' : this.svg),
            electroItemId: this.electroItemId
        };
    };
    /**
     * fromJsonObject
     *
     * @param json any : object met de variabelen van het element dat dadelijk kan worden omgezet naar een JSON string
     */
    SituationPlanElement.prototype.fromJsonObject = function (json) {
        this.page = json.page;
        this.posx = json.posx;
        this.posy = json.posy;
        this.sizex = json.sizex;
        this.sizey = json.sizey;
        this.labelposx = (json.labelposx != null) ? json.labelposx : this.posx + 20;
        this.labelposy = (json.labelposy != null) ? json.labelposy : this.posy;
        this.labelfontsize = (json.labelfontsize != null ? json.labelfontsize : 11);
        this.adrestype = (json.adrestype != null) ? json.adrestype : "manueel";
        this.adres = json.adres;
        this.adreslocation = (json.adreslocation != null) ? json.adreslocation : "rechts";
        this.rotate = (json.rotate != null) ? json.rotate : 0;
        this.scale = (json.scale != null) ? json.scale : SITPLANVIEW_DEFAULT_SCALE;
        this.svg = json.svg;
        this.electroItemId = json.electroItemId;
        this.needsViewUpdate = true; // TODO: make this more efficient as it will always trigger redraws, even when not needed
    };
    /**
     * rotates360degrees
     *
     * Per default wordt er vanuit gegaan dat bij rotatie over rotatiehoeken alpha tussen 90 en 270 graden deze rotatie kan vervangen worden.
     * door een rotatie over alpha-180 graden.  Om een voorbeeld te geven, een batterij roteren over 180 graden heeft geen zin, dat blijft het originele symbool.
     *
     * Voor bepaalde elementen is dit niet het geval. Een contactdoos gedraaid over 180 graden moet de opening naar rechts hebben in plaats van naar links.
     * Deze functie geeft true terug indien een volledige rotatie nodig is.
     *
     * @returns boolean
     *
     * TODO: functie verplaatsen naar Electro_Item
     */
    SituationPlanElement.ROTATES_360_DEGREES_TYPES = new Set(['Contactdoos', 'Lichtpunt', 'Drukknop', 'Media', 'Schakelaars', 'Lichtcircuit', 'Bord']);
    return SituationPlanElement;
}());
/**
 * Deze class behandelt het tekenen van het situatieplan.
 *
 * Er wordt regelmatig de terminologie Box gebruikt in de code. Een box is een sleepbaar element en kan zowel
 * een eendraadschema symbool zijn als een ingelezen extern bestand.
 */
var SituationPlanView = /** @class */ (function () {
    function SituationPlanView(canvas, paper, sitplan) {
        var _this = this;
        this.zoomfactor = 1;
        /** Referentie naar meerdere DIV's waar het stuatieplan wordt weergegeven
         *   - paper: hieronder hangen de reële elementen en dit stelt het printable gedeelte van het schema voor
         *   - canvas: deze bevat paper en ook het niet printable gedeelte
        */
        this.canvas = null;
        this.paper = null;
        this.sideBar = new SituationPlanView_SideBar(document.getElementById('sidebar'));
        this.contextMenu = null;
        this.draggedBox = null; /** Box die op dit moment versleept wordt of null */
        this.selectedBox = null; /** Geselelecteerde box of null */
        /**
         * Toont het contextmenu op de locatie van de muis.
         *
         * @param event - De muisgebeurtenis die het menu opent (right click).
         */
        this.showContextMenu = function (event) {
            event.preventDefault();
            _this.contextMenu.clearMenu();
            _this.contextMenu.addMenuItem('Draai rechts', function () { _this.rotateSelectedBox(90, true); }, 'Ctrl →');
            _this.contextMenu.addMenuItem('Draai links', function () { _this.rotateSelectedBox(-90, true); }, 'Ctrl ←');
            _this.contextMenu.addLine();
            _this.contextMenu.addMenuItem('Bewerk', _this.editSelectedBox.bind(_this), 'Enter');
            _this.contextMenu.addLine();
            _this.contextMenu.addMenuItem('Verwijder', _this.deleteSelectedBox.bind(_this), 'Del');
            //this.contextMenu.addMenuItem('Item 3', () => alert('Item 3 clicked'));
            _this.contextMenu.show(event);
        };
        /**
         * Start een sleepactie voor een box in het situatieplan.
         *
         * @param event - De gebeurtenis die de sleepactie activeert (muisklik of touchstart).
         */
        this.startDrag = function (event) {
            //Indien de middelste knop werd gebruikt doen we niets
            if (event.button == 1)
                return;
            //Verbergen van de contextmenu, en enkele controles
            _this.contextMenu.hide();
            if (event == null)
                return;
            var box = null;
            //Juiste box identificeren. Hou er rekening mee dat ook op een boxlabel kan geklikt zijn
            if (event.target.classList.contains('box')) {
                box = event.target;
            }
            else if (event.target.classList.contains('boxlabel')) {
                var sitPlanElement = event.target.sitPlanElementRef;
                if (sitPlanElement == null)
                    return;
                box = sitPlanElement.boxref;
            }
            ;
            if (box == null)
                return;
            //Nu gaan we de box selecteren. Dit moet zowel voor de linker als de rechter muisknop
            event.stopPropagation(); // Voorkomt body klikgebeurtenis
            _this.clearSelection(); // Wist bestaande selectie
            _this.selectBox(box); // Selecteert de box die we willen slepen
            //Indien de rechter muisknop werd gebruikt gaan we niet verder
            if (event.button == 2)
                return;
            //OK, het is een touch event of de linkse knop dus we gaan verder met slepen
            _this.draggedBox = box; // Houdt de box die we aan het slepen zijn
            switch (event.type) {
                case 'mousedown':
                    _this.mousedrag.startDrag(event.clientX, event.clientY, _this.draggedBox.offsetLeft, _this.draggedBox.offsetTop, _this.zoomfactor);
                    document.addEventListener('mousemove', _this.processDrag);
                    document.addEventListener('mouseup', _this.stopDrag);
                    break;
                case 'touchstart':
                    var touch = event.touches[0];
                    _this.mousedrag.startDrag(touch.clientX, touch.clientY, _this.draggedBox.offsetLeft, _this.draggedBox.offsetTop, _this.zoomfactor);
                    document.addEventListener('touchmove', _this.processDrag, { passive: false });
                    document.addEventListener('touchend', _this.stopDrag);
                    break;
                default:
                    console.error('Ongeldige event voor startDrag functie');
            }
        };
        /**
         * Stopt de sleepactie van een box in het situatieplan en stopt de eventlisteners.
         *
         * @param event - De gebeurtenis die de sleepactie stopt (muisklik release of touchend).
         */
        this.stopDrag = function (event) {
            function showArrowHelp() {
                var helperTip = new HelperTip(appDocStorage);
                helperTip.show('sitplan.arrowdrag', "<h3>Tip: Symbolen verplaatsen</h3>\n            <p>Voor fijnere controle tijdens het verschuiven van symbolen kan u ook de pijltjes op het toetsenbord gebruiken.</p>", true);
            }
            event.stopPropagation();
            switch (event.type) {
                case 'mouseup':
                    document.removeEventListener('mousemove', _this.processDrag);
                    document.removeEventListener('mouseup', _this.stopDrag);
                    if (_this.mousedrag.hassMoved)
                        showArrowHelp();
                    break;
                case 'touchend':
                    document.removeEventListener('touchmove', _this.processDrag);
                    document.removeEventListener('touchend', _this.stopDrag);
                    if (_this.mousedrag.hassMoved)
                        showArrowHelp();
                    break;
                default:
                    console.error('Ongeldige event voor stopDrag functie');
            }
            _this.draggedBox = null;
            undostruct.store();
        };
        /**
         * Verwerkt een muisklik of touch event tijdens het slepen van een box in het situatieplan.
         *
         * @param event - De gebeurtenis die verwerkt wordt (muisklik of touchmove).
         */
        this.processDrag = function (event) {
            if (_this.draggedBox) {
                event.preventDefault();
                var newLeftTop = void 0;
                if (event.type === 'mousemove') {
                    newLeftTop = _this.mousedrag.returnNewLeftTop(event.clientX, event.clientY);
                }
                else if (event.type === 'touchmove') {
                    var touch = event.touches[0];
                    newLeftTop = _this.mousedrag.returnNewLeftTop(touch.clientX, touch.clientY);
                }
                //get paperpadding from css
                var paperPadding = parseFloat(getComputedStyle(_this.paper).getPropertyValue('--paperPadding'));
                //return topleft of the scrolled this.outerdiv
                var minLeft = (_this.canvas.scrollLeft - paperPadding) / _this.zoomfactor;
                var minTop = (_this.canvas.scrollTop - paperPadding) / _this.zoomfactor;
                var maxRight = minLeft + (_this.canvas.offsetWidth) / _this.zoomfactor;
                var maxBottom = minTop + (_this.canvas.offsetHeight) / _this.zoomfactor;
                // Zorg ervoor dat de box niet buiten redelijke grenzen van het canvas valt links-boven
                // We doen deze controle niet rechts onder omdat het canvas daar gewoon kan groeien
                newLeftTop.left = Math.min(maxRight - _this.draggedBox.offsetWidth / 2, Math.max(minLeft - _this.draggedBox.offsetWidth / 2, newLeftTop.left));
                newLeftTop.top = Math.min(maxBottom - _this.draggedBox.offsetHeight / 2, Math.max(minTop - _this.draggedBox.offsetHeight / 2, newLeftTop.top));
                var sitPlanElement = _this.draggedBox.sitPlanElementRef;
                sitPlanElement.posx = newLeftTop.left + (_this.draggedBox.offsetWidth / 2);
                sitPlanElement.posy = newLeftTop.top + (_this.draggedBox.offsetHeight / 2);
                _this.updateSymbolAndLabelPosition(sitPlanElement);
            }
        };
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
        this.addElectroItem = function (id, adrestype, adres, adreslocation, labelfontsize, scale, rotate, posx, posy) {
            if (posx === void 0) { posx = null; }
            if (posy === void 0) { posy = null; }
            var paperPos = _this.canvasPosToPaperPos(50, 50);
            if (posx == null)
                posx = paperPos.x;
            if (posy == null)
                posy = paperPos.y;
            if (id != null) {
                var element = _this.sitplan.addElementFromElectroItem(id, _this.sitplan.activePage, posx, posy, adrestype, adres, adreslocation, labelfontsize, scale, rotate);
                if (element != null) {
                    _this.syncToSitPlan();
                    _this.clearSelection();
                    _this.redraw();
                    _this.selectBox(element.boxref); // We moeten dit na redraw doen anders bestaat de box mogelijk nog niet
                    _this.bringToFront();
                    undostruct.store();
                }
            }
            else {
                alert('Geen geldig ID ingegeven!');
            }
        };
        /**
         * Toont een popup met de eigenschappen van het geselecteerde element en maakt het mogelijk om deze te bewerken.
         */
        this.editSelectedBox = function (cancelCallback) {
            _this.contextMenu.hide();
            _this.unattachArrowKeys();
            if (_this.selectedBox) {
                var sitPlanElement_1 = _this.selectedBox.sitPlanElementRef;
                if (!sitPlanElement_1)
                    return;
                SituationPlanView_ElementPropertiesPopup(sitPlanElement_1, function (electroid, adrestype, adres, adreslocation, labelfontsize, scale, rotate) {
                    if (electroid != null) {
                        sitPlanElement_1.setElectroItemId(electroid);
                        sitPlanElement_1.setAdres(adrestype, adres, adreslocation);
                    }
                    sitPlanElement_1.labelfontsize = labelfontsize;
                    sitPlanElement_1.setscale(scale);
                    sitPlanElement_1.rotate = rotate;
                    _this.updateBoxContent(sitPlanElement_1); //content needs to be updated first to know the size of the box
                    _this.updateSymbolAndLabelPosition(sitPlanElement_1);
                    undostruct.store();
                }, cancelCallback);
            }
            _this.attachArrowKeys();
        };
        this.canvas = canvas;
        this.paper = paper;
        this.contextMenu = new ContextMenu();
        this.sitplan = sitplan;
        this.paper.style.transformOrigin = 'top left'; // Keep the origin point consistent when scaling
        this.mousedrag = new MouseDrag();
        this.event_manager = new EventManager();
        // Verwijder alle selecties wanneer we ergens anders klikken dan op een box
        this.event_manager.addEventListener(canvas, 'mousedown', function () { _this.contextMenu.hide(); _this.clearSelection(); });
        this.event_manager.addEventListener(canvas, 'touchstart', function () { _this.contextMenu.hide(); _this.clearSelection(); });
        // Control wieltje om te zoomen
        this.event_manager.addEventListener(canvas, 'wheel', function (event) {
            if (!event.ctrlKey && !event.metaKey)
                return;
            event.preventDefault();
            var zoom = -event.deltaY / 1000;
            if (Math.abs(zoom) >= 0.01) {
                var menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
                var ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
                var sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));
                var canvasx = event.clientX - sideBarWidth;
                var canvasy = event.clientY - menuHeight - ribbonHeight;
                _this.zoomIncrement(-event.deltaY / 2000, canvasx, canvasy);
            }
        }, { passive: false });
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
    SituationPlanView.prototype.canvasPosToPaperPos = function (canvasx, canvasy) {
        var paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));
        return {
            x: (canvasx + this.canvas.scrollLeft - paperPadding) / this.zoomfactor,
            y: (canvasy + this.canvas.scrollTop - paperPadding) / this.zoomfactor
        };
    };
    /**
     * Converteert een punt oöordinaat op het papier naar een coördinaat op het canvas (omgekeerde van hierboven).
     *
     * @param {number} paperx - De x-coördinaat op het paper.
     * @param {number} papery - De y-coördinaat op het papier.
     * @returns {Object} Object {x,y} met de x-coördinaat en y-coördinaat op het canvas.
     */
    SituationPlanView.prototype.paperPosToCanvasPos = function (paperx, papery) {
        var paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));
        return {
            x: paperx * this.zoomfactor - this.canvas.scrollLeft + paperPadding,
            y: papery * this.zoomfactor - this.canvas.scrollTop + paperPadding
        };
    };
    /**
     * Indien een gewenste coördinaat op zowel het canvas als het papier gegeven zijn, hoe moeten we dan scrollen?
     *
     * @param {number} canvasx - De x-co ordinaat in het canvas.
     * @param {number} canvasy - De y-co ordinaat in het canvas.
     * @param {number} paperx - De x-coördinaat op het paper.
     * @param {number} papery - De y-coördinaat op het papier.
     * @returns {Object} Object {x,y} met de gewenste scrollLeft en scrollTop.
     */
    SituationPlanView.prototype.canvasAndPaperPosToScrollPos = function (canvasx, canvasy, paperx, papery) {
        var paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding'));
        return {
            x: paperx * this.zoomfactor - canvasx + paperPadding + 0.5,
            y: papery * this.zoomfactor - canvasy + paperPadding + 0.5
        };
    };
    /**
     * Maakt deze instance ongedaan en verwijderd alle door deze instance aangemaakte elementen uit de DOM.
     *
     * Verwijderd eerst de eventmanager en daarna alle elementen in het situatieplan.
     * Als een element een referentie naar een box heeft, wordt deze verwijderd uit de DOM.
     * Als een element een referentie naar een label heeft, wordt deze verwijderd uit de DOM.
     */
    SituationPlanView.prototype.dispose = function () {
        //Verwijder de event manager
        this.event_manager.dispose();
        //Ga over all situationplanelements and verwijder de bijhorende boxes uit the DOM
        for (var _i = 0, _a = this.sitplan.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.boxref != null)
                element.boxref.remove();
            if (element.boxlabelref != null)
                element.boxlabelref.remove();
        }
    };
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
    SituationPlanView.prototype.syncToSitPlan = function () {
        this.sitplan.syncToEendraadSchema();
    };
    /**
     * Stel de zoomfactor in zodat het paper-element volledig in het browser window wordt weergegeven
     *
     * @param paperPadding - De padding rond het papier in pixels. Dit wordt gebruikt
     *   om te berekenen hoeveel ruimte beschikbaar is voor het papier. De standaard
     *   is de CSS-waarde van --paperPadding.
     */
    SituationPlanView.prototype.zoomToFit = function (paperPadding) {
        if (paperPadding === void 0) { paperPadding = parseFloat(getComputedStyle(this.paper).getPropertyValue('--paperPadding')); }
        var sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));
        var scale = Math.min((this.canvas.offsetWidth - paperPadding * 2) / this.paper.offsetWidth, (this.canvas.offsetHeight - paperPadding * 2) / this.paper.offsetHeight);
        this.setzoom(scale);
    };
    /**
     * Geeft de huidige zoomfactor terug.
     * @returns De huidige zoomfactor.
     */
    SituationPlanView.prototype.getZoomFactor = function () {
        return this.zoomfactor;
    };
    /**
     * Stel de zoomfactor in.
     * @param factor - De zoomfactor, standaard 1.
     */
    SituationPlanView.prototype.setzoom = function (factor) {
        if (factor === void 0) { factor = 1; }
        this.zoomfactor = factor;
        this.paper.style.transform = "scale(".concat(factor, ")");
    };
    /**
     * Verhoogt of verlaagt de zoomfactor met een bepaalde waarde.
     *
     * @param increment - De waarde waarmee de zoomfactor moet worden aangepast.
     *   Een positieve waarde vergroot de zoom, terwijl een negatieve waarde de zoom verkleint.
     *   Standaard is deze waarde 0, wat betekent dat er geen aanpassing is.
     */
    SituationPlanView.prototype.zoomIncrement = function (increment, canvasx, canvasy) {
        if (increment === void 0) { increment = 0; }
        if (canvasx === void 0) { canvasx = this.canvas.offsetWidth / 2; }
        if (canvasy === void 0) { canvasy = this.canvas.offsetHeight / 2; }
        var menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
        var ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
        var sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));
        var paperPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--paperPadding'));
        var mousePosOnPaper = this.canvasPosToPaperPos(canvasx, canvasy);
        this.setzoom(Math.min(SITPLANVIEW_ZOOMINTERVAL.MAX, Math.max(SITPLANVIEW_ZOOMINTERVAL.MIN, this.zoomfactor * (1 + increment))));
        var scrollPos = this.canvasAndPaperPosToScrollPos(canvasx, canvasy, mousePosOnPaper.x, mousePosOnPaper.y);
        this.canvas.scrollLeft = scrollPos.x;
        this.canvas.scrollTop = scrollPos.y;
    };
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
    SituationPlanView.prototype.makeBox = function (element, fragment) {
        if (fragment === void 0) { fragment = null; }
        // Box aanmaken op de DOM voor het symbool of in te laden externe figuur
        // extra property sitPlanElementRef toegevoegd aan DOM zodat we later ons situatieplan element kunnen terugvinden
        var box = document.createElement('div');
        Object.assign(box, { id: element.id, className: "box", sitPlanElementRef: element });
        element.boxref = box;
        // Boxlabel aanmaken op de DOM voor de tekst bij het symbool
        var boxlabel = document.createElement('div');
        Object.assign(boxlabel, { id: element.id + '_label', className: "boxlabel", sitPlanElementRef: element });
        boxlabel.innerHTML = htmlspecialchars(element.getAdres()); // is deze nodig? Wellicht reeds onderdeel van updateContent
        element.boxlabelref = boxlabel;
        // Content updaten en toevoegen aan de DOM
        this.updateBoxContent(element); //content moet eerst updated worden om te weten hoe groot de box is
        if (fragment)
            fragment.append(box, boxlabel);
        else
            this.paper.append(box, boxlabel);
        //this.updateSymbolAndLabelPosition(element); //pas als alles op de DOM zit kunnen we berekenen waar het label hoort
        // Event handlers voor het bewegen met muis of touch
        box.addEventListener('mousedown', this.startDrag);
        box.addEventListener('touchstart', this.startDrag);
        boxlabel.addEventListener('mousedown', this.startDrag);
        boxlabel.addEventListener('touchstart', this.startDrag);
        box.addEventListener('contextmenu', this.showContextMenu);
    };
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
    SituationPlanView.prototype.updateBoxContent = function (sitPlanElement) {
        if (!sitPlanElement)
            return;
        var box = sitPlanElement.boxref;
        var boxlabel = sitPlanElement.boxlabelref;
        if (box == null)
            return;
        var svg = sitPlanElement.getScaledSVG(); // Deze call past ook viewUpdateNeeded aan en moet dus eerst gebeuren
        if (sitPlanElement.needsViewUpdate) {
            sitPlanElement.needsViewUpdate = false;
            if (svg != null)
                box.innerHTML = svg;
            else
                box.innerHTML = '';
        }
        ;
        if (boxlabel != null) {
            var adres = sitPlanElement.getAdres();
            if (sitPlanElement.labelfontsize != null)
                boxlabel.style.fontSize = String(sitPlanElement.labelfontsize) + 'px';
            var newadres = (adres != null ? htmlspecialchars(adres) : '');
            if (newadres != boxlabel.innerHTML)
                boxlabel.innerHTML = newadres;
        }
    };
    /**
     * Berekent de positie van het label van een situationplanelement in functie vna de grootte van het situationplanelement.
     * het situationplanelement moet daarvoor reeds een box hebben die aan de DOM werd toegevoegd om de grootte van deze box te kunnen bepalen.
     *
     * Wijzigt eveneens de grootte, en positie van het DIV-element dat het label van een situationplanelement bevat in de DOM.
     * Controleert ook of het label op een zichtbare pagina staat en maakt het onzichtbaar indien nodig.
     *
     * @param sitPlanElement - Het situatieplanelement waarvoor de positie van het label moet worden berekend.
     */
    SituationPlanView.prototype.updateLabelPosition = function (sitPlanElement) {
        if (!sitPlanElement)
            return;
        var boxlabel = sitPlanElement.boxlabelref;
        if (!boxlabel)
            return;
        var scale = sitPlanElement.getscale();
        var forbiddenLabelZone = getXYRectangleSize(sitPlanElement.sizex * scale + SITPLANVIEW_SELECT_PADDING, sitPlanElement.sizey * scale + SITPLANVIEW_SELECT_PADDING, sitPlanElement.rotate);
        // Berekken de x/left positie van het label
        var adreslocation = sitPlanElement.getAdresLocation();
        switch (adreslocation) {
            case 'links':
                sitPlanElement.labelposx = sitPlanElement.posx - forbiddenLabelZone.width / 2 - boxlabel.offsetWidth / 2;
                break;
            case 'rechts':
                sitPlanElement.labelposx = sitPlanElement.posx + forbiddenLabelZone.width / 2 + boxlabel.offsetWidth / 2;
                break;
            default: sitPlanElement.labelposx = sitPlanElement.posx;
        }
        var left = "".concat(sitPlanElement.labelposx - boxlabel.offsetWidth / 2, "px");
        if (boxlabel.style.left != left)
            boxlabel.style.left = left; // Vermijd aanpassingen DOM indien niet nodig
        // Bereken de y/top positie van het label
        // Deze bevat wat meer complexe trickery om alles min of meer overeen te doen komen tussen print en scherm
        var top;
        switch (adreslocation) {
            case 'boven': {
                top = "".concat(sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.8, "px");
                sitPlanElement.labelposy = sitPlanElement.posy - forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.5 / 2;
                break;
            }
            case 'onder': {
                top = "".concat(sitPlanElement.posy + forbiddenLabelZone.height / 2 - boxlabel.offsetHeight * 0.2, "px");
                sitPlanElement.labelposy = sitPlanElement.posy + forbiddenLabelZone.height / 2 + boxlabel.offsetHeight * 0.7 / 2;
                break;
            }
            default:
                top = "".concat(sitPlanElement.posy - boxlabel.offsetHeight / 2, "px");
                sitPlanElement.labelposy = sitPlanElement.posy + 1;
        }
        if (boxlabel.style.top != top)
            boxlabel.style.top = top; // Vermijd aanpassingen DOM indien niet nodig
        if (this.sitplan.activePage == sitPlanElement.page) {
            if (boxlabel.classList.contains('hidden'))
                boxlabel.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
        else {
            if (!boxlabel.classList.contains('hidden'))
                boxlabel.classList.add('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
    };
    /**
     * Wijzigt de grootte, positie en rotatietransformatie van het DIV-element dat een situationplanelement bevat in de DOM.
     * Controleert ook of het symbool op een zichtbare pagina staat en maakt het onzichtbaar indien nodig.
     *
     * @param sitPlanElement Het situationplanelement dat aangepast moet worden.
     */
    SituationPlanView.prototype.updateSymbolPosition = function (sitPlanElement) {
        function getRotationTransform(sitPlanElement) {
            if (!sitPlanElement)
                return '';
            var rotation = sitPlanElement.rotate;
            while (rotation < 0)
                rotation += 360;
            rotation = rotation % 360;
            var spiegel = false;
            if ((rotation >= 90) && (rotation < 270)) {
                if (sitPlanElement.isEDSSymbolAndRotates360degrees())
                    spiegel = true;
                if (sitPlanElement.isEendraadschemaSymbool())
                    rotation -= 180;
            }
            return "rotate(".concat(rotation, "deg)") + (spiegel ? ' scaleX(-1)' : '');
        }
        if (!sitPlanElement)
            return;
        var div = sitPlanElement.boxref;
        if (!div)
            return;
        var scale = sitPlanElement.getscale();
        var contentwidth = sitPlanElement.sizex * scale;
        var contentheight = sitPlanElement.sizey * scale;
        var left = ((sitPlanElement.posx - contentwidth / 2 - SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        if (div.style.left != left)
            div.style.left = left; // Vermijd aanpassingen DOM indien niet nodig
        var top = ((sitPlanElement.posy - contentheight / 2 - SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        if (div.style.top != top)
            div.style.top = top; // Vermijd aanpassingen DOM indien niet nodig
        var width = ((contentwidth + SITPLANVIEW_SELECT_PADDING * 2)).toString() + "px";
        if (div.style.width != width)
            div.style.width = width; // Vermijd aanpassingen DOM indien niet nodig
        var height = ((contentheight + SITPLANVIEW_SELECT_PADDING * 2)).toString() + "px";
        if (div.style.height != height)
            div.style.height = height; // Vermijd aanpassingen DOM indien niet nodig
        var transform = getRotationTransform(sitPlanElement);
        if (div.style.transform != transform)
            div.style.transform = transform; // Vermijd aanpassingen DOM indien niet nodig
        if (this.sitplan.activePage == sitPlanElement.page) {
            if (div.classList.contains('hidden'))
                div.classList.remove('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
        else {
            if (!div.classList.contains('hidden'))
                div.classList.add('hidden'); // Vermijd aanpassingen DOM indien niet nodig
        }
    };
    /**
     * Werkt de positie van het symbool bij op de DOM indien nodig.
     * Berekent de positie van het label en werkt deze bij op de DOM indien nodig
     *     *
     * @param sitPlanElement - Het situationplanelement
     */
    SituationPlanView.prototype.updateSymbolAndLabelPosition = function (sitPlanElement) {
        if (!sitPlanElement)
            return;
        this.updateSymbolPosition(sitPlanElement); // Eerst content aanpassen anders kennen we de grootte van het symbool niet
        this.updateLabelPosition(sitPlanElement);
    };
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
    SituationPlanView.prototype.redraw = function () {
        var start = performance.now();
        this.syncToSitPlan();
        var fragment = document.createDocumentFragment();
        var appendNeeded = false;
        for (var _i = 0, _a = this.sitplan.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (!element.boxref) {
                this.makeBox(element, fragment);
                appendNeeded = true;
            }
        }
        if (appendNeeded)
            this.paper.append(fragment); // We moeten de boxes toevoegen aan de DOM alvorens de label positie te berekenen aangezien we de size van de labels moeten kennen
        this.showPage(this.sitplan.activePage);
        for (var _b = 0, _c = this.sitplan.elements; _b < _c.length; _b++) {
            var element = _c[_b];
            if (element.page == this.sitplan.activePage) {
                this.updateBoxContent(element);
                this.updateSymbolAndLabelPosition(element);
            }
        }
        this.updateRibbon();
        this.sideBar.render();
        var end = performance.now();
        console.log("Redraw took ".concat(end - start, "ms"));
    };
    /**
     * Maakt de gegeven box de geselecteerde box.
     *
     * @param box - Het element dat geselecteerd moet worden.
     */
    SituationPlanView.prototype.selectBox = function (box) {
        if (!box)
            return;
        box.classList.add('selected');
        this.selectedBox = box;
    };
    /**
     * Verwijdert de selectie van alle boxes.
     */
    SituationPlanView.prototype.clearSelection = function () {
        var boxes = document.querySelectorAll('.box');
        boxes.forEach(function (b) { return b.classList.remove('selected'); });
        this.selectedBox = null;
    };
    /**
     * Verwijdert de geselecteerde box en verwijdert deze ook uit het situatieplan.
     * Verwijdert ook het bijhorende label.
     */
    SituationPlanView.prototype.deleteSelectedBox = function () {
        if (this.selectedBox == null)
            return;
        var id = this.selectedBox.id;
        var sitPlanElement = this.selectedBox.sitPlanElementRef;
        if (sitPlanElement == null)
            return;
        this.selectedBox.remove();
        if (sitPlanElement.boxlabelref != null)
            sitPlanElement.boxlabelref.remove();
        this.sitplan.removeElement(sitPlanElement);
        this.selectedBox = null;
    };
    /**
     * Send the selected box to the back of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     *
     * @returns void
     */
    SituationPlanView.prototype.sendToBack = function () {
        if (this.selectedBox == null)
            return;
        for (var _i = 0, _a = this.sitplan.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.boxref != null) {
                var newzindex = void 0;
                if (element.boxref != this.selectedBox) {
                    newzindex = (parseInt(element.boxref.style.zIndex) || 0) + 1;
                }
                else {
                    newzindex = 0;
                }
                element.boxref.style.zIndex = newzindex.toString();
                if (element.boxlabelref != null) {
                    element.boxlabelref.style.zIndex = newzindex.toString();
                }
            }
        }
        this.sitplan.orderByZIndex();
        undostruct.store();
    };
    /**
     * Send the selected box to the front of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     *
     * @returns void
     */
    SituationPlanView.prototype.bringToFront = function () {
        if (this.selectedBox == null)
            return;
        var newzindex = 0;
        for (var _i = 0, _a = this.sitplan.elements; _i < _a.length; _i++) {
            var element_1 = _a[_i];
            if ((element_1.boxref != null) && (element_1.boxref != this.selectedBox)) {
                newzindex = Math.max(newzindex, parseInt(element_1.boxref.style.zIndex) || 0);
            }
        }
        newzindex += 1;
        var element = this.selectedBox.sitPlanElementRef;
        if (element == null) {
            this.sitplan.syncToSitPlan();
            return;
        }
        this.selectedBox.style.zIndex = newzindex.toString();
        if (element.boxlabelref != null)
            element.boxlabelref.style.zIndex = newzindex.toString();
        this.sitplan.orderByZIndex();
        undostruct.store();
    };
    /**
     * Selecteer een pagina.
     *
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    SituationPlanView.prototype.selectPage = function (page) {
        this.sitplan.activePage = page;
        this.redraw();
    };
    /**
     * Toont enkel de elementen die op de pagina staan die als parameter wordt meegegeven.
     *
     * @param page - Het nummer van de pagina die getoond moet worden.
     */
    SituationPlanView.prototype.showPage = function (page) {
        for (var _i = 0, _a = this.sitplan.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.page != page) {
                element.boxref.classList.add('hidden');
                element.boxlabelref.classList.add('hidden');
            }
            else {
                element.boxref.classList.remove('hidden');
                element.boxlabelref.classList.remove('hidden');
            }
        }
        this.updateRibbon();
    };
    /**
     * Roteert de geselecteerde box met het opgegeven aantal graden.
     * De box wordt geroteerd rond zijn middelpunt.
     * De rotatie wordt cumulatief uitgevoerd, d.w.z. de nieuwe rotatie wordt toegevoegd aan de vorige.
     * De rotatie is beperkt tot het bereik [0, 360) graden.
     * Deze functie slaat de status op, zodat het aanroepen van undo() deze actie ongedaan maakt.
     * @param degrees - Het aantal graden waarmee de box moet worden gedraaid.
     */
    SituationPlanView.prototype.rotateSelectedBox = function (degrees, rotateLabelToo) {
        if (rotateLabelToo === void 0) { rotateLabelToo = false; }
        /**
         * Roteert het label.
         *
         * Het label can de volgende locaties hebben, 'boven', 'rechts','onder', 'links'.
         *
         * @param cycle - Het aantal keren dat het label met 90 graden moet worden gedraaid.
         *                1 is een draaing van 90 graden naar rechts, -1 is een draaing van 90 graden naar links.
         */
        function rotateLabel(cycle) {
            var locations = ['boven', 'rechts', 'onder', 'links'];
            var pic = this.selectedBox.sitPlanElementRef;
            if (pic == null)
                return;
            var index = locations.indexOf(pic.getAdresLocation());
            pic.setAdresLocation(locations[(index + cycle + 4) % 4]);
        }
        ;
        if (this.selectedBox) {
            if (rotateLabelToo) {
                rotateLabel.bind(this)(Math.round(degrees / 90));
            }
            var id = this.selectedBox.id;
            var pic = this.selectedBox.sitPlanElementRef;
            pic.rotate = (pic.rotate + degrees) % 360;
            this.updateBoxContent(pic);
            this.updateSymbolAndLabelPosition(pic);
            undostruct.store();
        }
    };
    SituationPlanView.prototype.unattachArrowKeys = function () {
        this.event_manager.addEventListener(document, 'keydown', function () { });
    };
    /**
     * Voegt eventlisteners toe om pijltjestoetsen te hanteren.
     *
     * Wanneer een pijltjestoets wordt ingedrukt, en er is een box geselecteerd, dan wordt de positie van de box aangepast.
     * De positie van de box wordt aangepast door de posx of posy van het element in het situatieplan te veranderen.
     * Daarna wordt de functie updateSymbolAndLabelPosition aangeroepen om de positie van het symbool en het label van de box te updaten.
     */
    SituationPlanView.prototype.attachArrowKeys = function () {
        var _this = this;
        this.event_manager.addEventListener(document, 'keydown', function (event) {
            _this.contextMenu.hide();
            if (document.getElementById('outerdiv').style.display == 'none')
                return; // Check if we are really in the situationplan, if not, the default scrolling action will be executed by the browser
            if (document.getElementById('popupOverlay') != null)
                return; // We need the keys when editing symbol properties.
            if (_this.selectedBox) { // Check if we have a selected box, if not, the default scrolling action will be executed by the browser
                event.preventDefault();
                var sitPlanElement = _this.selectedBox.sitPlanElementRef;
                if (!sitPlanElement)
                    return;
                switch (event.key) {
                    case 'ArrowLeft':
                        if (event.ctrlKey) {
                            _this.rotateSelectedBox(-90, true);
                            return;
                        }
                        else {
                            sitPlanElement.posx -= 1;
                        }
                        break;
                    case 'ArrowRight':
                        if (event.ctrlKey) {
                            _this.rotateSelectedBox(90, true);
                            return;
                        }
                        else {
                            sitPlanElement.posx += 1;
                        }
                        break;
                    case 'ArrowUp':
                        sitPlanElement.posy -= 1;
                        break;
                    case 'ArrowDown':
                        sitPlanElement.posy += 1;
                        break;
                    case 'Enter':
                        _this.editSelectedBox();
                        return;
                    case 'Delete':
                        _this.deleteSelectedBox();
                        undostruct.store();
                        break;
                    default:
                        return;
                }
                _this.updateSymbolAndLabelPosition(sitPlanElement);
            }
        });
    };
    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box te verwijderen.
     *
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    SituationPlanView.prototype.attachDeleteButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () {
            _this.contextMenu.hide();
            _this.deleteSelectedBox();
            undostruct.store();
            var helperTip = new HelperTip(appDocStorage);
            helperTip.show('sitplan.deletekey', "<h3>Tip: Symbolen verwijderen</h3>\n            <p>Bespaar tijd en gebruik de 'Delete' toets op het toetsenbord om symbolen te verwijderen.</p>", true);
        });
    };
    ;
    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box naar de achtergrond te sturen.
     *
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    SituationPlanView.prototype.attachSendToBackButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.contextMenu.hide(); _this.sendToBack(); });
    };
    ;
    /**
     * Hangt een klik event listener aan het gegeven element met als doel de huidig geselecteerde box naar de voorgrond te brengen.
     *
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    SituationPlanView.prototype.attachBringToFrontButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.contextMenu.hide(); _this.bringToFront(); });
    };
    ;
    /**
     * Hangt een klik event listener aan het gegeven element met als doel de zoomfactor aan te passen.
     *
     * @param elem - Het html element waar de listener wordt aan gehangen.
     * @param increment - De waarde waarmee de zoomfactor wordt aangepast. Een positieve waarde vergroot de zoom,
     *                    terwijl een negatieve waarde de zoom verkleint.
     */
    SituationPlanView.prototype.attachZoomButton = function (elem, increment) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.contextMenu.hide(); _this.zoomIncrement(increment); });
    };
    ;
    /**
     * Hangt een klik event listener aan het gegeven element met als doel het situatieplan
     * aan te passen aan de beschikbare ruimte in het browservenster.
     *
     * @param elem - Het html element waar de listener wordt aan gehangen.
     */
    SituationPlanView.prototype.attachZoomToFitButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.contextMenu.hide(); _this.zoomToFit(); });
    };
    ;
    /**
     * Hangt een klik event listener aan het gegeven element om een bestand te kiezen en een verandering event listener aan het invoerelement
     * om een nieuw element vanuit een bestand aan het situatieplan toe te voegen.
     *
     * @param elem - Het HTML-element dat bij een klik een bestand moet openen.
     * @param fileinput - Het invoerelement voor bestanden dat het bestand uploadt wanneer het verandert.
     */
    SituationPlanView.prototype.attachAddElementFromFileButton = function (elem, fileinput) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.contextMenu.hide(); fileinput.click(); });
        this.event_manager.addEventListener(fileinput, 'change', function (event) {
            var element = _this.sitplan.addElementFromFile(event, _this.sitplan.activePage, _this.paper.offsetWidth / 2, _this.paper.offsetHeight / 2, (function () {
                _this.syncToSitPlan();
                _this.clearSelection();
                element.needsViewUpdate = true; // for an external SVG this is needed, for an electroItem it is automatically set (see next function)
                var lastscale = element.scale;
                element.scaleSelectedBoxToPaperIfNeeded(_this.paper.offsetWidth * 0.995, _this.paper.offsetHeight * 0.995, _this.sitplan.defaults.scale);
                _this.redraw();
                _this.selectBox(element.boxref); // We moeten dit na redraw doen anders bestaat de box mogelijk nog niet
                _this.bringToFront();
                undostruct.store();
                fileinput.value = ''; // Zorgt ervoor dat hetzelfde bestand twee keer kan worden gekozen en dit nog steeds een change triggert
                if (element.scale != lastscale) {
                    //Use the built in help top to display a text that the image was scaled
                    var helperTip = new HelperTip(appDocStorage);
                    helperTip.show('sitplan.scaledImageToFit', '<h3>Mededeling</h3>' +
                        '<p>Deze afbeelding werd automatisch verkleind om binnen de tekenzone te blijven.</p>' +
                        '<p>Kies "Bewerk" in het menu om de schaalfactor verder aan te passen indien gewenst.</p>', true);
                }
            }).bind(_this));
        });
    };
    /**
     * Hangt een klik event listener aan het gegeven element om een nieuw Electro_Item aan het situatieplan toe te voegen.
     *
     * @param elem - Het HTML-element dat bij een klik een nieuw element toevoegt.
     */
    SituationPlanView.prototype.attachAddElectroItemButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () {
            _this.contextMenu.hide();
            _this.unattachArrowKeys();
            SituationPlanView_ElementPropertiesPopup(null, _this.addElectroItem.bind(_this));
            _this.attachArrowKeys();
        });
    };
    /**
     * Hangt een klik event listener aan het gegeven element om een bestaand element in het situatieplan te bewerken.
     *
     * @param elem - Het HTML-element dat bij een klik een bestaand element in het situatieplan bewerkt.
     */
    SituationPlanView.prototype.attachEditButton = function (elem) {
        var _this = this;
        this.event_manager.addEventListener(elem, 'click', function () { _this.editSelectedBox(); });
    };
    /**
     * Verwijdert alle elementen van de pagina met het gegeven nummer.
     *
     * @param page - Het nummer van de pagina die leeg gemaakt moet worden.
     */
    SituationPlanView.prototype.wipePage = function (page) {
        for (var i = 0; i < this.sitplan.elements.length; i++) {
            var element = this.sitplan.elements[i];
            if (element.page == this.sitplan.activePage) {
                var boxref = element.boxref;
                if (boxref != null) {
                    this.selectBox(boxref);
                    this.deleteSelectedBox();
                    this.wipePage(page); // Need to call again to avoid loop going in error as length changes
                    return;
                }
            }
        }
    };
    /**
     * Maakt de knoppen in de ribbon aan om onder andere pagina's te selecteren, elementen te laden of verwijderen en pagina's te zoomen.
     * Deze functie wordt aangeroepen telkens er iets in de toestand verandert die mogelijk kan leiden tot aanpassingen in de ribbon.
     *
     * Deze functie hangt ook onclick events aan interne functies in deze class.
     *
     * TODO: Er zijn efficientiewinsten mogelijk door niet telkens de hele ribbon te hertekenen.
     */
    SituationPlanView.prototype.updateRibbon = function () {
        var _this = this;
        var outputleft = "";
        var outputright = "";
        // -- Undo/redo buttons --
        outputleft += "\n            <div class=\"icon\" ".concat((undostruct.undoStackSize() > 0 ? 'onclick="undoClicked()"' : 'style="filter: opacity(45%)"'), ">\n                <img src=\"gif/undo.png\" alt=\"Ongedaan maken\" class=\"icon-image\">\n                <span class=\"icon-text\">Ongedaan maken</span>\n            </div>\n            <div class=\"icon\"  ").concat((undostruct.redoStackSize() > 0 ? 'onclick="redoClicked()"' : 'style=\"filter: opacity(45%)\"'), ">\n                <img src=\"gif/redo.png\" alt=\"Opnieuw\" class=\"icon-image\">\n                <span class=\"icon-text\">Opnieuw</span>\n            </div>");
        // -- Visuals om items te laden of verwijderen --
        outputleft += "\n            <span style=\"display: inline-block; width: 30px;\"></span>\n            <div class=\"icon\" id=\"button_Add\">\n                <span class=\"icon-image\" style=\"font-size:24px\">\u2795</span>\n                <span class=\"icon-text\">Uit bestand</span>\n            </div>\n            <div class=\"icon\" id=\"button_Add_electroItem\">\n                <span class=\"icon-image\" style=\"font-size:24px\">\u2795</span>\n                <span class=\"icon-text\">Uit schema</span>\n            </div>\n            <div class=\"icon\" id=\"button_Delete\">\n                <span class=\"icon-image\" style=\"font-size:24px\">\uD83D\uDDD1</span>\n                <span class=\"icon-text\">Verwijder</span>\n            </div>";
        // -- Visuals om items te bewerken --
        outputleft += "\n            <span style=\"display: inline-block; width: 10px;\"></span>\n            <div class=\"icon\" id=\"button_edit\">\n                <span class=\"icon-image\" style=\"font-size:24px\">&#x2699;</span>\n                <span class=\"icon-text\">Bewerk</span>\n            </div>";
        // -- Visuals om naar achteren of voren te sturen --
        outputleft += "\n            <span style=\"display: inline-block; width: 10px;\"></span>\n            <div class=\"icon\" id=\"sendBack\">\n                <span class=\"icon-image\" style=\"font-size:24px\">\u2B07\u2B07</span>\n                <span class=\"icon-text\">Naar achter</span>\n            </div>\n            <div class=\"icon\" id=\"bringFront\">\n                <span class=\"icon-image\" style=\"font-size:24px\">\u2B06\u2B06</span>\n                <span class=\"icon-text\">Naar voor</span>\n            </div>";
        // -- Visuals om pagina te selecteren --
        outputleft += "\n            <span style=\"display: inline-block; width: 50px;\"></span>\n            <div>\n                <center>\n                    <span style=\"display: inline-block; white-space: nowrap;\">Pagina\n                        <select id=\"id_sitplanpage\">";
        for (var i = 1; i <= this.sitplan.numPages; i++) {
            outputleft += '<option value="' + i + '"' + (i == this.sitplan.activePage ? ' selected' : '') + '>' + i + '</option>';
        }
        outputleft += "\n                        </select>\n                    </span><br><span style=\"display: inline-block; white-space: nowrap;\">\n                        <button id=\"btn_sitplan_addpage\" ".concat((this.sitplan.activePage != this.sitplan.numPages ? ' disabled' : ''), ">Nieuw</button>\n                        <button id=\"btn_sitplan_delpage\" style=\"background-color:red;\" ").concat((this.sitplan.numPages <= 1 ? ' disabled' : ''), ">&#9851;</button>\n                    </span>\n                </center>\n            </div>");
        // -- Visuals om pagina te zoomen --
        outputright += "\n            <span style=\"display: inline-block; width: 10px;\"></span>\n            <div class=\"icon\" id=\"button_zoomin\">\n                <span class=\"icon-image\" style=\"font-size: 24px;\">\uD83D\uDD0D</span>\n                <span class=\"icon-text\">In</span>\n            </div>\n            <div class=\"icon\" id=\"button_zoomout\">\n                <span class=\"icon-image\" style=\"font-size: 24px;\">\uD83C\uDF0D</span>\n                <span class=\"icon-text\">Uit</span>\n            </div>\n            <div class=\"icon\" id=\"button_zoomToFit\">\n                <span class=\"icon-image\" style=\"font-size: 24px;\">\uD83D\uDDA5\uFE0F</span>\n                <!--<img src=\"gif/scaleup.png\" alt=\"Schermvullend\" class=\"icon-image\">-->\n                <span class=\"icon-text\">Schermvullend</span>\n            </div>\n            <span style=\"display: inline-block; width: 10px;\"></span>";
        // -- Put everything in the ribbon --
        document.getElementById("ribbon").innerHTML = "<div id=\"left-icons\">".concat(outputleft, "</div><div id=\"right-icons\">").concat(outputright, "</div>");
        // -- Actions om pagina te selecteren --
        document.getElementById('id_sitplanpage').onchange = function (event) {
            _this.contextMenu.hide();
            var target = event.target;
            _this.selectPage(Number(target.value));
            undostruct.store();
        };
        document.getElementById('btn_sitplan_addpage').onclick = function () {
            _this.contextMenu.hide();
            _this.sitplan.numPages++;
            _this.selectPage(_this.sitplan.numPages);
        };
        document.getElementById('btn_sitplan_delpage').onclick = function () {
            _this.contextMenu.hide();
            var userConfirmation = confirm('Pagina ' + _this.sitplan.activePage + ' volledig verwijderen?');
            if (userConfirmation) {
                _this.wipePage(_this.sitplan.activePage);
                //set page of all sitplan.elements with page>page one lower
                _this.sitplan.elements.forEach(function (element) {
                    if (element.page > _this.sitplan.activePage) {
                        element.page--;
                    }
                });
                if (_this.sitplan.numPages > 1)
                    _this.sitplan.numPages--;
                _this.selectPage(Math.min(_this.sitplan.activePage, _this.sitplan.numPages));
            }
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
    };
    return SituationPlanView;
}()); // *** END CLASS ***
/**
 * Toon de pagina voor het situatieplan
 */
function showSituationPlanPage() {
    toggleAppView('draw');
    if (!(structure.sitplan)) {
        structure.sitplan = new SituationPlan();
    }
    ;
    if (!(structure.sitplanview)) {
        //Verwijder eerst alle elementen op de DOM met id beginnend met "SP_" om eventuele wezen
        //uit eerdere oefeningen te voorkomen
        var elements = document.querySelectorAll('[id^="SP_"]');
        elements.forEach(function (e) { return e.remove(); });
        //Maak dan de SituationPlanView
        structure.sitplanview = new SituationPlanView(document.getElementById('canvas'), document.getElementById('paper'), structure.sitplan);
        structure.sitplanview.zoomToFit();
    }
    ;
    structure.sitplanview.redraw();
    // Initialize the HelperTip with the storage
    var helperTip = new HelperTip(appDocStorage);
    helperTip.show('sitplan.introductie', "<h3>Situatieschema tekenen</h3>\n    <p>Op deze pagina kan u een situatieschema tekenen.</p>\n    <p>Laad een plattegrond met de knop \"Uit bestand\" en voeg symbolen toe met de knop \"Uit schema\".</p>\n    <p>Klik <a href=\"Documentation/sitplandoc.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">hier</a> om in een nieuw venster de documentatie te bekijken.</p>\n    <p>Het situatieschema werd recent toegevoegd aan het programma en zal nog verder ontwikkeld worden over de komende weken. Opmerkingen zijn welkom in het \"contact\"-formulier.</p>");
}
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
function SituationPlanView_ElementPropertiesPopup(sitplanElement, callbackOK, callbackCancel) {
    // Interne variabelen voor alle subfuncties                                    
    if (callbackCancel === void 0) { callbackCancel = function () { }; }
    var adressen = new ElectroItemZoeker();
    var kringnamen = adressen.getUniqueKringnaam();
    /**
     * Vul het select element voor de kringen met alle gekende info rond kringnamen
     */
    function rePopulateKringSelect() {
        selectKring.innerHTML = ''; // Alles wissen
        for (var _i = 0, kringnamen_1 = kringnamen; _i < kringnamen_1.length; _i++) {
            var kringnaam = kringnamen_1[_i];
            var option = document.createElement('option');
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
    function initKringSelect(electroItemId) {
        if (electroItemId === void 0) { electroItemId = null; }
        rePopulateKringSelect();
        if ((electroItemId == null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null)) {
            electroItemId = sitplanElement.getElectroItemId();
        }
        if (electroItemId != null)
            selectKring.value = structure.findKringName(electroItemId);
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
        var electroItems = adressen.getElectroItemsByKring(selectKring.value);
        selectElectroItemBox.innerHTML = ''; //Clear all options
        for (var i = 0; i < electroItems.length; ++i) {
            var electroItem = electroItems[i];
            var option = document.createElement('option');
            option.value = String(i);
            option.text = electroItem.adres + ' | ' + electroItem.type;
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
    function initElectroItemBox(electroItemId) {
        if (electroItemId === void 0) { electroItemId = null; }
        rePopulateElectroItemBox();
        var electroItems = adressen.getElectroItemsByKring(selectKring.value);
        if ((electroItemId == null) && (sitplanElement != null) && (sitplanElement.getElectroItemId() != null)) {
            electroItemId = sitplanElement.getElectroItemId();
        }
        if (electroItemId != 0) {
            for (var i = 0; i < electroItems.length; ++i) {
                if (electroItems[i].id == electroItemId)
                    selectElectroItemBox.value = String(i);
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
        var str = '';
        var electroItems = adressen.getElectroItemsByKring(selectKring.value);
        var idx = Number(selectElectroItemBox.value);
        if (!isNaN(idx)) {
            var item = electroItems[idx];
            if (item != null)
                str = electroItems[idx].id.toString();
        }
        textInput.value = str;
    }
    /**
     * Initialiseer het Id-veld, ofwel met de id van het sitplanElement, ofwel met de id van het gekozen electro-item
     *
     * Gebruikte variabelen: sitplanElement uit de hoofdfunctie.
     */
    function initIdField() {
        if (sitplanElement != null) {
            if (sitplanElement.getElectroItemId() != null)
                textInput.value = String(sitplanElement.getElectroItemId());
        }
        else
            rePopulateIdField();
        textInput.oninput = IdFieldChanged;
    }
    /**
     * Wanneer het Id-veld gewijzigd wordt, wordt de rest van het formulier bijgewerkt.
     * We verwijderen alle niet-cijfers uit de Id, en passen het volgende aan
     * - veld waarin het type van het electroItem wordt gegeven
     * - select element met te kiezen kringen, voorgeselecteerd op de kring waarin het element met id=id zich bevindt
     * - idem als hierboven voor de selectie van het electroItem
     */
    function IdFieldChanged() {
        if (textInput.value != null) {
            textInput.value = textInput.value.replace(/[^0-9]/g, '');
            var electroItemId = Number(textInput.value);
            updateElectroType();
            if (structure.getElectroItemById(electroItemId) != null) {
                initKringSelect(electroItemId);
                initElectroItemBox(electroItemId);
                selectAdresType.value = 'auto';
                selectAdresTypeChanged();
            }
        }
        ;
    }
    function handleExpandButton(electroItemId) {
        if (electroItemId === void 0) { electroItemId = null; }
        if (electroItemId == null)
            return;
        var element = structure.getElectroItemById(electroItemId);
        if (element == null)
            return;
        element.expand();
        adressen.reCalculate();
        kringnamen = adressen.getUniqueKringnaam();
        IdFieldChanged();
        structure.sitplanview.redraw();
    }
    /**
     * Toon het type verbruiker van het gekozen electro-item
     */
    function updateElectroType() {
        if (textInput.value == null || textInput.value.trim() == '') {
            feedback.innerHTML = '<span style="color: red;">Geen ID ingegeven</span>';
            expandButton.style.display = 'none';
        }
        else {
            var electroItemId_1 = Number(textInput.value);
            var element = structure.getElectroItemById(electroItemId_1);
            if (element != null) {
                var type = element.getType();
                feedback.innerHTML = '<span style="color:green;">' + element.getType() + '</span>';
                if (element.isExpandable()) {
                    expandButton.style.display = 'block';
                    feedback.innerHTML += '<br><span style="color: black;">Klik op uitpakken indien u de onderliggende elementen in het situatieschema wil kunnen plaatsen.</span>';
                    expandButton.onclick = function () { handleExpandButton(electroItemId_1); };
                }
                else
                    expandButton.style.display = 'none';
            }
            else {
                feedback.innerHTML = '<span style="color: red;">Element niet gevonden</span>';
                expandButton.style.display = 'none';
            }
        }
    }
    /**
     * Wanneer het type adres gewijzigd wordt, wordt ook het adresveld zelf aangepast
     */
    function selectAdresTypeChanged() {
        var id = Number(textInput.value);
        updateElectroType();
        var element = structure.getElectroItemById(id);
        if (element == null) {
            adresInput.value = '';
            adresInput.disabled = true;
            return;
        }
        switch (selectAdresType.value) {
            case 'manueel':
                adresInput.value = (element != null ? adresInput.value : '');
                adresInput.disabled = false;
                break;
            case 'auto':
            default:
                adresInput.value = (element != null ? element.getReadableAdres() : '');
                adresInput.disabled = true;
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
        popupOverlay.style.visibility = 'hidden';
        document.body.style.pointerEvents = 'auto'; // Re-enable interactions with the background
        div.remove();
    }
    /**
     * We stellen het tikken van Enter in een veld gelijk aan het klikken op OK in het formulier
     *
     * @param event
     */
    var handleEnterKey = function (event) {
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
    var div = document.createElement('div');
    div.innerHTML = "\n        <div id=\"popupOverlay\" style=\"position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; visibility: hidden; z-index: 9999;\">\n            <div id=\"popupWindow\" style=\"width: 500px; background-color: white; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; justify-content: space-between;\">\n                <div id=\"selectKringContainer\" style=\"display: flex; margin-bottom: 10px; align-items: center;\">\n                    <label for=\"selectKring\" style=\"margin-right: 10px; display: inline-block;\">Kring:</label>\n                    <select id=\"selectKring\"></select>\n                </div>\n                <div id=\"selectElectroItemContainer\" style=\"display: flex; margin-bottom: 10px; align-items: center;\">\n                    <label for=\"selectElectroItemBox\" style=\"margin-right: 10px; display: inline-block;\">Element:</label>\n                    <select id=\"selectElectroItemBox\"></select><span style=\"display: inline-block; width: 10px;\"></span>\n                    <button id=\"expandButton\" title=\"Omzetten in indivuele elementen\" style=\"background-color:lightblue;\">Uitpakken</button>\n                </div>\n                <div id=\"textContainer\" style=\"display: flex; margin-bottom: 30px; align-items: center;\">\n                    <label for=\"textInput\" style=\"margin-right: 10px; display: inline-block;\">ID:</label>\n                    <input id=\"textInput\" style=\"width: 100px;\" type=\"number\" min=\"0\" step=\"1\" value=\"\">\n                    <div id=\"feedback\" style=\"margin-left: 10px; width: 100%; font-size: 12px\"></div>\n                </div>\n                <div id=\"selectContainer\" style=\"display: flex; margin-bottom: 10px; align-items: center;\">\n                    <label for=\"selectAdresType\" style=\"margin-right: 10px; display: inline-block; white-space: nowrap;\">Label type:</label>\n                    <select id=\"selectAdresType\">\n                        <option value=\"auto\">Automatisch</option>\n                        <option value=\"manueel\">Handmatig</option>\n                    </select>\n                </div>\n                <div id=\"adresContainer\" style=\"display: flex; margin-bottom: 10px; align-items: center;\">\n                    <label for=\"adresInput\" style=\"margin-right: 10px; display: inline-block; white-space: nowrap;\">Label tekst:</label>\n                    <input id=\"adresInput\" style=\"width: 100%;\" type=\"text\" value=\"\">\n                    <select id=\"selectAdresLocation\" style=\"margin-left: 10px; display: inline-block;\">\n                        <option value=\"links\">Links</option>\n                        <option value=\"rechts\">Rechts</option>\n                        <option value=\"boven\">Boven</option>\n                        <option value=\"onder\">Onder</option>\n                    </select>\n                </div>\n                <div id=\"fontSizeContainer\" style=\"display: flex; margin-bottom: 30px; align-items: center;\">\n                    <label for=\"fontSizeInput\" style=\"margin-right: 10px; display: inline-block; white-space: nowrap;\">Tekengrootte (px):</label>\n                    <input id=\"fontSizeInput\" style=\"width: 100px;\" type=\"number\" min=\"1\" max=\"72\" step=\"11\" value=\"11\">\n                </div> \n                <div style=\"display: flex; margin-bottom: 10px; align-items: center;\">\n                    <label for=\"scaleInput\" style=\"margin-right: 10px; display: inline-block;\">Schaal (%):</label>\n                    <input id=\"scaleInput\" style=\"width: 100px;\" type=\"number\" min=\"10\" max=\"400\" step=\"10\" value=\"".concat(String(SITPLANVIEW_DEFAULT_SCALE * 100), "\">\n                </div>\n                <div style=\"display: flex; margin-bottom: 20px; align-items: center;\">\n                    <label for=\"rotationInput\" style=\"margin-right: 10px; display: inline-block;\">Rotatie (\u00B0):</label>\n                    <input id=\"rotationInput\" style=\"width: 100px;\" type=\"number\" min=\"0\" max=\"360\" step=\"10\" value=\"0\">\n                </div>\n                <div id=\"setDefaultContainer\" style=\"display: flex; margin-bottom: 20px; align-items: flex-start;\">\n                    <input type=\"checkbox\" id=\"setDefaultCheckbox\">\n                    ").concat((sitplanElement == null) || ((sitplanElement != null) && (sitplanElement.getElectroItemId() != null))
        ? "<label for=\"setDefaultCheckbox\" style=\"margin-left: 10px; flex-grow: 1; flex-wrap: wrap;\">Zet tekengrootte en schaal als standaard voor alle toekomstige nieuwe symbolen.</label>"
        : "<label for=\"setDefaultCheckbox\" style=\"margin-left: 10px; flex-grow: 1; flex-wrap: wrap;\">Zet schaal als standaard voor alle toekomstige nieuwe symbolen.</label>", "            \n                </div>\n                <div style=\"display: flex; justify-content: center;\">\n                    <button id=\"okButton\" style=\"margin-right: 10px;\">OK</button>\n                    <button id=\"cancelButton\" style=\"margin-keft: 10px;\">Cancel</button>\n                </div>\n            </div>\n        </div>");
    var popupOverlay = div.querySelector('#popupOverlay');
    var popupWindow = popupOverlay.querySelector('#popupWindow');
    var selectKringContainer = popupWindow.querySelector('#selectKringContainer');
    var selectKring = popupWindow.querySelector('#selectKring');
    var selectElectroItemContainer = popupWindow.querySelector('#selectElectroItemContainer');
    var selectElectroItemBox = popupWindow.querySelector('#selectElectroItemBox');
    var expandButton = popupWindow.querySelector('#expandButton');
    var textContainer = popupWindow.querySelector('#textContainer');
    var textInput = popupWindow.querySelector('#textInput');
    var feedback = popupWindow.querySelector('#feedback');
    var selectContainer = popupWindow.querySelector('#selectContainer');
    var selectAdresType = popupWindow.querySelector('#selectAdresType');
    var adresContainer = popupWindow.querySelector('#adresContainer');
    var adresInput = popupWindow.querySelector('#adresInput');
    var selectAdresLocation = popupWindow.querySelector('#selectAdresLocation');
    var fontSizeContainer = popupWindow.querySelector('#fontSizeContainer');
    var fontSizeInput = popupWindow.querySelector('#fontSizeInput');
    var scaleInput = popupWindow.querySelector('#scaleInput');
    var rotationInput = popupWindow.querySelector('#rotationInput');
    var setDefaultCheckbox = popupWindow.querySelector('#setDefaultCheckbox');
    var okButton = popupWindow.querySelector('#okButton');
    var cancelButton = popupWindow.querySelector('#cancelButton');
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
            var electroItem = structure.getElectroItemById(sitplanElement.getElectroItemId());
            if ((electroItem != null) && (electroItem.getType() == 'Bord')) {
                selectKringContainer.style.display = 'none';
                selectElectroItemContainer.style.display = 'none';
                textContainer.style.display = 'none';
            }
            selectAdresType.value = sitplanElement.getAdresType();
            adresInput.value = sitplanElement.getAdres();
            fontSizeInput.value = String(sitplanElement.labelfontsize);
            selectAdresLocation.value = sitplanElement.getAdresLocation();
            selectAdresTypeChanged();
        }
        else { // Het gaat over een geimporteerde CSV
            selectKringContainer.style.display = 'none';
            selectElectroItemContainer.style.display = 'none';
            textContainer.style.display = 'none';
            selectContainer.style.display = 'none';
            fontSizeContainer.style.display = 'none';
            adresContainer.style.display = 'none';
        }
        scaleInput.value = String(sitplanElement.getscale() * 100);
        rotationInput.value = String(sitplanElement.rotate);
    }
    else { // Form werd aangeroepen om een nieuw element te creëren
        selectAdresTypeChanged();
        fontSizeInput.value = String(structure.sitplan.defaults.fontsize);
        scaleInput.value = String(structure.sitplan.defaults.scale * 100);
        selectAdresLocation.value = 'rechts';
    }
    /*
     * Eventhandlers, enter op de tekst velden staat gelijk aan OK klikken
     */
    textInput.onkeydown = handleEnterKey;
    adresInput.onkeydown = handleEnterKey;
    fontSizeInput.onkeydown = handleEnterKey;
    scaleInput.onkeydown = handleEnterKey;
    rotationInput.onkeydown = handleEnterKey;
    /*
     * Eventhandlers, adres-text aanpassen triggert aanpassingen van adres-type
     */
    textInput.onblur = selectAdresTypeChanged;
    selectAdresType.onchange = selectAdresTypeChanged;
    /*
     * Eventhandlers, OK en Cancel knoppen
     */
    okButton.onclick = function () {
        function isNumeric(value) {
            return /^-?\d+(\.\d+)?$/.test(value);
        }
        var returnId = (textInput.value.trim() == '' ? null : Number(textInput.value));
        if (!(isNumeric(scaleInput.value)) || (Number(scaleInput.value) <= 0))
            scaleInput.value = String(structure.sitplan.defaults.scale * 100);
        if (!(isNumeric(rotationInput.value)))
            rotationInput.value = String(0);
        if (setDefaultCheckbox.checked) {
            if ((sitplanElement == null) || ((sitplanElement != null) && (sitplanElement.getElectroItemId() != null)))
                structure.sitplan.defaults.fontsize = Number(fontSizeInput.value);
            structure.sitplan.defaults.scale = Number(scaleInput.value) / 100;
        }
        closePopup(); // We close the popup first to avoid that an error somewhere leaves it open
        callbackOK(returnId, selectAdresType.value, adresInput.value, selectAdresLocation.value, Number(fontSizeInput.value), Number(scaleInput.value) / 100, Number(rotationInput.value));
    };
    cancelButton.onclick = function () {
        closePopup();
        callbackCancel();
    };
    /*
     * Het volledige formulier aan de body toevoegen en tonen
     */
    document.body.appendChild(div);
    showPopup();
}
var SituationPlanView_SideBar = /** @class */ (function () {
    function SituationPlanView_SideBar(div) {
    }
    SituationPlanView_SideBar.prototype.renderSymbols = function () {
    };
    SituationPlanView_SideBar.prototype.render = function () {
    };
    return SituationPlanView_SideBar;
}());
function HLInsertSymbol(event, id) {
}
var MultiLevelStorage = /** @class */ (function () {
    function MultiLevelStorage(storageKey, initialData) {
        this.storageKey = storageKey;
        // Load data from storage or initialize with default data
        this.data = this.loadFromStorage() || deepClone(initialData);
        this.memoryData = deepClone(initialData);
    }
    // Load data from localStorage
    MultiLevelStorage.prototype.loadFromStorage = function () {
        var storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    };
    // Save data to localStorage
    MultiLevelStorage.prototype.saveToStorage = function () {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    };
    // Get a value at a specific path (e.g., "user.profile.name")
    MultiLevelStorage.prototype.get = function (path) {
        var keys = path.split('.');
        var current = this.memoryData;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            }
            else {
                current = undefined;
                break;
            }
        }
        if (current !== undefined) {
            return current;
        }
        current = this.data;
        for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
            var key = keys_2[_a];
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            }
            else {
                return undefined; // Path not found
            }
        }
        return current;
    };
    // Set a value at a specific path (e.g., "user.profile.name", "John Doe")
    MultiLevelStorage.prototype.set = function (path, value, inMemory) {
        if (inMemory === void 0) { inMemory = false; }
        var keys = path.split('.');
        var current = inMemory ? this.memoryData : this.data;
        for (var i = 0; i < keys.length - 1; i++) {
            var key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {}; // Create nested objects if they don't exist
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value; // Set the value at the final key
        if (!inMemory) {
            this.saveToStorage(); // Save updated data to storage
        }
    };
    // Delete a node at a specific path (e.g., "user.profile.name")
    MultiLevelStorage.prototype.delete = function (path) {
        var keys = path.split('.');
        var current = this.memoryData;
        for (var i = 0; i < keys.length - 1; i++) {
            var key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                break; // Path not found, nothing to delete
            }
            current = current[key];
        }
        delete current[keys[keys.length - 1]]; // Delete the key
        current = this.data;
        for (var i = 0; i < keys.length - 1; i++) {
            var key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                return; // Path not found, nothing to delete
            }
            current = current[key];
        }
        delete current[keys[keys.length - 1]]; // Delete the key
        this.saveToStorage(); // Save updated data to storage
    };
    // Get the entire data object
    MultiLevelStorage.prototype.getAll = function () {
        return __assign(__assign({}, this.data), this.memoryData);
    };
    // Clear the entire data and storage
    MultiLevelStorage.prototype.clear = function () {
        this.data = {};
        this.memoryData = {};
        localStorage.removeItem(this.storageKey);
    };
    return MultiLevelStorage;
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
    // -- Displays the Expand button for the Electro_item, in case the item is expandable --
    Electro_Item.prototype.toHTMLFooter = function () {
        if (this.isExpandable()) {
            return (" <button title=\"Meerdere elementen (bvb schakelaars) omzetten in indivuele elementen\" style=\"background-color:lightblue;\" onclick=\"HLExpand(".concat(this.id, ")\">Uitpakken</button>"));
        }
        else {
            return ("");
        }
    };
    // -- This one will get called if the type of the Electro_Item has not yet been chosen --
    Electro_Item.prototype.toHTML = function (mode) { return (this.toHTMLHeader(mode)); }; // Implemented in the derived classes
    // -- Get the number of the Electro_Item, if it is not defined, ask the parent
    Electro_Item.prototype.getnr = function () {
        var parent = this.getParent();
        if (parent != null) {
            switch (parent.getType()) {
                case "Kring":
                case "Domotica module (verticaal)":
                    return this.props.nr;
                default:
                    return parent.getnr();
            }
        }
        else {
            return "";
        }
        ;
    };
    // -- Get readable address of the Electro_Item, if it is not defined, ask the parent --
    Electro_Item.prototype.getReadableAdres = function () {
        if (this.getType() == "Bord") {
            var str = this.props.naam;
            if (str == null)
                str = "";
            return str;
        }
        else {
            var kringname = structure.findKringName(this.id).trim();
            var nr = this.getnr().trim();
            if (kringname == "")
                return nr;
            else if (nr == "")
                return kringname;
            else
                return kringname + "." + nr;
        }
    };
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
        var returnstr = "";
        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            returnstr = '<text x="' + ((mySVG.xright - 20) / 2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown = mySVG.ydown + godown;
        }
        return returnstr;
    };
    // -- Make the SVG for the electro item, placeholder for derived classes --
    Electro_Item.prototype.toSVG = function (sitplan, mirror) {
        if (sitplan === void 0) { sitplan = false; }
        if (mirror === void 0) { mirror = false; }
        return (new SVGelement());
    }; //Placeholder for derived classes
    /** ToSituationPlanElement
     *
     * @returns {SituationPlanElement} The SituationPlanElement that represents this Electro_Item
     */
    Electro_Item.prototype.toSituationPlanElement = function () {
        var myElement = new SituationPlanElement();
        //this.updateSituationPlanElement(myElement); //Lijkt niet nodig aangezien dit zoiezo gebeurt in getScaledSVG bij iedere update
        return (myElement);
    };
    /**
     * Functie geeft aan of een Electro_Item nog verder kan uitgesplitst worden in kleinere Items.
     * Deze is vooral nuttig voor het situatieschema om groepen van schakelaars of een lichtcircuit te herkennen.
     */
    Electro_Item.prototype.isExpandable = function () {
        return false;
    };
    /**
     * Deze functie splitst een Electro_Item verder uit in kleinere Items.  Dit is uiteraard enkel mogelijk indien isExpandable() true geeft.
     * De aanpassing wordt direct op de sourcelist uitgevoerd.
     */
    Electro_Item.prototype.expand = function () {
        if (!this.isExpandable())
            return;
    };
    /**
     * Geeft de boundary's terug van het element in het situatieplan. Deze boundary's worden gebruikt om het element te positioneren en te clippen.
     *
     * @returns {Object} Een object met de volgende properties:
     *   - clipleft: de afstand die links wordt weggesneden op de standaard tekening van het Electro_Item. Vaak zit hier 20 nutteloze pixels waar in het eendraadschema een stukje leiding en het nummer staat.
     *   - addright: een eventuele afstand die rechts dient toegevoegd te worden, of (indien negatief) een clipping aan de rechter kant.
     *   - cliptop: zelfs als clipleft maar aan de bovenkant.
     *   - addbottom: zelfde als addright maar aan de onderkant.
     */
    Electro_Item.prototype.getSitPlanBoundaries = function () {
        return {
            clipleft: 12,
            addright: 0,
            cliptop: 0,
            addbottom: 0
        };
    };
    /**
     * Genereert de SVG voor gebruik in het Situatieplan.  Deze wordt gegenereerd op basis van de standaard SVG in het eendraadschema
     * maar met extra aanpassingen:
     * - de getSVG functies van het Electro_Item worden aangeroepen met een flag dat het hier over een situatieplan symbool gaat.  Dit zal er vaak toe leiden dat het stukje leiding links niet getekend wordt.
     *   ook is het in dat geval niet altijd nodig om alle tekst rond de symbolen te zetten.
     * - er kunnen clipping operaties plaats vinden omdat de bounding box van het SVG element geoptimaliseerd werd voor gebruik in het eendraadschema en dit is niet noodzakelijk handig
     *   voor gebruik in het situatieplan.
     *
     * @param myElement - Het SituationPlanElement waarvoor de SVG gecreëerd moet worden.
     */
    Electro_Item.prototype.updateSituationPlanElement = function (myElement) {
        var spiegeltext = false;
        var rotate = myElement.rotate % 360;
        if ((rotate >= 90) && (rotate < 270))
            spiegeltext = true;
        SVGSymbols.clearSymbols(); // We gaan enkel de symbolen gebruiken die nodig zijn voor dit element
        var mySVGElement = this.toSVG(true, spiegeltext);
        var sizex = mySVGElement.xright + mySVGElement.xleft + 10;
        var sizey = mySVGElement.yup + mySVGElement.ydown;
        var boundaries = this.getSitPlanBoundaries();
        switch (this.getType()) {
            case 'Contactdoos':
            case 'Bel':
            case 'Bord':
                boundaries.clipleft = 0;
                break;
        }
        var width = sizex - boundaries.clipleft + boundaries.addright;
        var height = sizey - boundaries.cliptop + boundaries.addbottom;
        myElement.updateElectroItemSVG('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" ' +
            "viewBox=\"".concat(boundaries.clipleft, " ").concat(boundaries.cliptop, " ").concat(sizex - boundaries.clipleft + boundaries.addright, " ").concat(sizey - boundaries.cliptop + boundaries.addbottom, "\" width=\"").concat(width, "\" height=\"").concat(height, "\">") +
            SVGSymbols.getNeededSymbols() + // enkel de symbolen die nodig zijn voor dit element
            mySVGElement.data +
            '</svg>', width, height);
    };
    return Electro_Item;
}(List_Item));
var Schakelaar = /** @class */ (function () {
    function Schakelaar(type, halfwaterdicht, verklikkerlamp, signalisatielamp, trekschakelaar, aantal) {
        if (halfwaterdicht === void 0) { halfwaterdicht = false; }
        if (verklikkerlamp === void 0) { verklikkerlamp = false; }
        if (signalisatielamp === void 0) { signalisatielamp = false; }
        if (trekschakelaar === void 0) { trekschakelaar = false; }
        if (aantal === void 0) { aantal = 1; }
        this.sitplan = false;
        this.mirrortext = false;
        this.type = type;
        this.halfwaterdicht = halfwaterdicht;
        this.verklikkerlamp = verklikkerlamp;
        this.signalisatielamp = signalisatielamp;
        this.trekschakelaar = trekschakelaar;
        this.aantal = aantal;
    }
    Schakelaar.prototype.schakelaarAttributentoSVGString = function (endx, isdubbel) {
        if (isdubbel === void 0) { isdubbel = false; }
        SVGSymbols.addSymbol('signalisatielamp');
        var outputstr = "";
        if (this.signalisatielamp)
            outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
        if (this.halfwaterdicht) {
            var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (this.mirrortext == false)
                outputstr += "<text x=\"".concat(endx, "\" y=\"10\" ").concat(textoptions, ">h</text>");
            else
                outputstr += "<text transform=\"scale(-1,1) translate(".concat(-2 * endx, ",0)\" x=\"").concat(endx, "\" y=\"10\" ").concat(textoptions, ">h</text>");
        }
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
        SVGSymbols.addSymbol('schakelaar_enkel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dubbeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_dubbel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.driepoligtoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_trippel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_trippel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dubbelaanstekingtoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_dubbelaansteking');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.wissel_enkeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_wissel_enkel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.wissel_dubbeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_wissel_dubbel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx, true);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.kruis_enkeltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_kruis_enkel');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dimschakelaartoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_enkel_dim');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.dimschakelaarWisseltoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 30;
        SVGSymbols.addSymbol('schakelaar_wissel_dim');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_wissel_dim" x="' + endx + '" y="25" />'
            + this.schakelaarAttributentoSVGString(endx);
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.bewegingsschakelaartoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 20;
        SVGSymbols.addSymbol('relais');
        SVGSymbols.addSymbol('moving_man');
        SVGSymbols.addSymbol('detectie_klein');
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
        SVGSymbols.addSymbol('schakelaar_rolluik');
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';
        if (this.halfwaterdicht) {
            var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (this.mirrortext == false)
                outputstr += "<text x=\"".concat(endx, "\" y=\"10\" ").concat(textoptions, ">h</text>");
            else
                outputstr += "<text transform=\"scale(-1,1) translate(".concat(-2 * endx, ",0)\" x=\"").concat(endx, "\" y=\"10\" ").concat(textoptions, ">h</text>");
        }
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.magneetcontacttoDrawReturnObj = function (startx) {
        var outputstr = "";
        var endx = startx + 20;
        SVGSymbols.addSymbol('magneetcontact');
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        if (this.aantal > 1) {
            var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (this.mirrortext == false)
                outputstr += "<text x=\"31\" y=\"10\" ".concat(textoptions, ">x").concat(htmlspecialchars(this.aantal), "</text>");
            else
                outputstr += "<text transform=\"scale(-1,1) translate(-62,0)\" x=\"31\" y=\"10\" ".concat(textoptions, ">x").concat(htmlspecialchars(this.aantal), "</text>");
        }
        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
            + '<use xlink:href="#magneetcontact" x="' + endx + '" y="25" />';
        return ({ endx: endx, str: outputstr, lowerbound: null });
    };
    Schakelaar.prototype.defaulttoDrawReturnObj = function (startx, symbol) {
        var outputstr = "";
        var endx = startx + 20;
        SVGSymbols.addSymbol(symbol.substring(1));
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
    Schakelaar.prototype.toSVGString = function (startx, last, sitplan, mirrortext) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
        var outputstr = "";
        var endx;
        var lowerbound = 20;
        this.sitplan = sitplan;
        this.mirrortext = mirrortext;
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
                SVGSymbols.addSymbol('arrow'); // nodig voor de schemerschakelaar
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
        output += this.toHTMLFooter();
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
    Schakelaars.prototype.isExpandable = function () {
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
            case "dubbelpolig":
                return (Number(this.props.aantal_schakelaars) > 1);
            default:
                return (false);
        }
    };
    Schakelaars.prototype.expand = function () {
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
                if (Number(this.props.aantal_schakelaars) > 1) { // Er zijn er altijd 2 als er niet 1 is
                    var adresGoesHere = Math.floor(this.props.aantal_schakelaars / 2);
                    var schakelaar1 = new Schakelaars(this.sourcelist);
                    Object.assign(schakelaar1.props, this.props);
                    schakelaar1.props.aantal_schakelaars = 1;
                    schakelaar1.props.type_schakelaar = "wissel_enkel";
                    schakelaar1.props.adres = "";
                    this.sourcelist.insertItemBeforeId(schakelaar1, this.id);
                    var lastschakelaar = schakelaar1;
                    for (var i = 0; i < Number(this.props.aantal_schakelaars) - 2; ++i) {
                        var schakelaar = new Schakelaars(this.sourcelist);
                        Object.assign(schakelaar.props, this.props);
                        schakelaar.props.aantal_schakelaars = 1;
                        schakelaar.props.type_schakelaar = "kruis_enkel";
                        if (adresGoesHere == i + 1) {
                            schakelaar.props.adres = this.props.adres;
                        }
                        else {
                            schakelaar.props.adres = "";
                        }
                        if (this.getParent().props.type === "Meerdere verbruikers") {
                            this.sourcelist.insertItemBeforeId(schakelaar, this.id);
                        }
                        else {
                            this.sourcelist.insertChildAfterId(schakelaar, lastschakelaar.id);
                            lastschakelaar = schakelaar;
                        }
                    }
                    if (adresGoesHere == Number(this.props.aantal_schakelaars) - 1) {
                        this.props.adres = this.props.adres;
                    }
                    else {
                        this.props.adres = "";
                    }
                    this.props.aantal_schakelaars = 1;
                    this.props.type_schakelaar = "wissel_enkel";
                    if (this.getParent().props.type === "Meerdere verbruikers") {
                        this.parent = this.getParent().id;
                    }
                    else {
                        this.parent = lastschakelaar.id;
                    }
                }
                break;
            case "dubbelpolig":
                if (Number(this.props.aantal_schakelaars) > 1) { // Er zijn er altijd 2 als er niet 1 is
                    var schakelaar1 = new Schakelaars(this.sourcelist);
                    Object.assign(schakelaar1.props, this.props);
                    schakelaar1.props.aantal_schakelaars = 1;
                    schakelaar1.props.type_schakelaar = "wissel_dubbel";
                    schakelaar1.props.adres = "";
                    this.sourcelist.insertItemBeforeId(schakelaar1, this.id);
                    this.props.aantal_schakelaars = 1;
                    this.props.type_schakelaar = "wissel_dubbel";
                    if (this.getParent().props.type == "Meerdere verbruikers") {
                        this.parent = this.getParent().id;
                    }
                    else {
                        this.parent = schakelaar1.id;
                    }
                }
                break;
        }
    };
    Schakelaars.prototype.toSVG = function (sitplan, mirrortext) {
        var _a;
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
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
            (_a = tekenKeten[i].toSVGString(startx, islast, sitplan, mirrortext), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if ((!this.heeftVerbruikerAlsKind()) || (sitplan)) {
            var extra = tekenKeten[tekenKeten.length - 1].extraPlaatsRechts();
            if (sitplan)
                extra = Math.max(0, extra - 5);
            startx += extra;
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += (sitplan ? '' : this.addAddressToSVG(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20)));
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
        output += this.toHTMLFooter();
        return (output);
    };
    Lichtcircuit.prototype.countExpandableElements = function () {
        var countExpandableElements = (this.props.aantal_lichtpunten == "0") ? 0 : 1;
        switch (this.props.type_schakelaar) {
            case "enkelpolig":
            case "dubbelpolig":
                countExpandableElements += (+this.props.aantal_schakelaars);
                break;
            default:
                countExpandableElements += 1;
        }
        return countExpandableElements;
    };
    Lichtcircuit.prototype.isExpandable = function () {
        return this.countExpandableElements() > 1;
    };
    Lichtcircuit.prototype.expand = function () {
        //Nieuwe schakelaars maken, alle eigenschappen kopieren behalve type en aantal_lichtpunten
        //Het adres nemen we over van het this element
        var schakelaars = new Schakelaars(this.sourcelist);
        var _a = this.props, type = _a.type, aantal_lichtpunten = _a.aantal_lichtpunten, rest = __rest(_a, ["type", "aantal_lichtpunten"]);
        Object.assign(schakelaars.props, rest);
        schakelaars.props.adres = this.props.adres;
        if (+(this.props.aantal_lichtpunten) > 0) { // Er is minstens 1 lichtpunt
            // Eerst schakelaars in het schema hangen vlak voor het this element zodat ze een id krijgen
            this.sourcelist.insertItemBeforeId(schakelaars, this.id);
            // Dan het this element door een nieuw lichtpunt vervangen
            var lichtpunt = new Lichtpunt(this.sourcelist);
            lichtpunt.props.aantal = this.props.aantal_lichtpunten;
            lichtpunt.props.is_halfwaterdicht = this.props.is_halfwaterdicht;
            lichtpunt.id = this.id;
            if (this.getParent().props.type == "Meerdere verbruikers") {
                lichtpunt.parent = this.getParent().id;
            }
            else {
                lichtpunt.parent = schakelaars.id;
            }
            var ordinal = this.sourcelist.getOrdinalById(this.id); // Deze kan hier pas komen want de ordinal is gewijzigd door het invoegen van de schakelaars
            this.sourcelist.data[ordinal] = lichtpunt;
        }
        else { // enkel schakelaars
            // Het this element door de schakelaars vervangen
            schakelaars.id = this.id;
            schakelaars.parent = this.getParent().id;
            var ordinal = this.sourcelist.getOrdinalById(this.id);
            this.sourcelist.data[ordinal] = schakelaars;
        }
        // schakelaars uitpakken in elementen
        schakelaars.expand();
    };
    Lichtcircuit.prototype.toSVG = function (sitplan, mirrortext) {
        var _a;
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
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
            (_a = tekenKeten[i].toSVGString(startx, islast, sitplan, mirrortext), startx = _a.endx, str = _a.str, lowerbound = _a.lowerbound);
            mySVG.data += str;
        }
        if (this.props.aantal_lichtpunten >= 1) { //1 of meerdere lampen
            // Teken de lamp
            endx = startx + 29;
            SVGSymbols.addSymbol('lamp');
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
            if (print_str_upper != "") {
                var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                if (mirrortext == false)
                    mySVG.data += "<text x=\"".concat(endx, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                else
                    mySVG.data += "<text transform=\"scale(-1,1) translate(".concat(-2 * endx, ",0)\" x=\"").concat(endx, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
            }
            // Teken een leiding achter de lamp indien er nog kinderen zijn
            endx++;
            if (this.heeftVerbruikerAlsKind())
                mySVG.data += '<line x1="' + endx + '" y1="25" x2="' + (endx + 10) + '" y2="25" stroke="black" />';
            // Bepaal finale Bounding Box om het geheel te tekenen
            startx = endx + 10;
            lowerbound = Math.max(lowerbound, 29);
        }
        else { //Geen lampen
            // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
            if ((!this.heeftVerbruikerAlsKind() || sitplan) && (tekenKeten.length > 0)) {
                var extra = tekenKeten[tekenKeten.length - 1].extraPlaatsRechts();
                if (sitplan)
                    extra = Math.max(0, extra - 5);
                startx += extra;
            }
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx - 2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += (sitplan ? '' : this.addAddressToSVG(mySVG, 25 + lowerbound, Math.max(0, lowerbound - 20)));
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
        this.props.huishoudelijk = true;
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
        this.props.huishoudelijk = true;
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
        if (typeof (this.props.huishoudelijk) == 'undefined')
            this.props.huishoudelijk = true;
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
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
        }
        output += ", Kabeltype na teller: " + this.stringPropToHTML('type_kabel_na_teller', 10)
            + ", Kabeltype v&oacute;&oacute;r teller: " + this.stringPropToHTML('type_kabel_voor_teller', 10);
        if ((this.props.kortsluitvermogen != '') && (['differentieel', 'automatisch', 'differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Aansluiting.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('zekering_automatisch');
        SVGSymbols.addSymbol('zekering_empty');
        SVGSymbols.addSymbol('arrow');
        SVGSymbols.addSymbol('zekering_smelt');
        SVGSymbols.addSymbol('elekriciteitsmeter');
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
    Aansluitpunt.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('aansluitpunt');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 29;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#aansluitpunt" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 45, 0));
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
    Aftakdoos.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('aftakdoos');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#aftakdoos" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55, 10));
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
    Batterij.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        var outputstr = "";
        SVGSymbols.addSymbol('batterij');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#batterij" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55, 10));
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
        SVGSymbols.addSymbol('bel');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 40;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
            + '<use xlink:href="#bel" x="21" y="25"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
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
    Boiler.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('boiler');
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('boiler_accu');
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
        }
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60));
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
    Bord.prototype.toSitPlanSVG = function (mirrortext) {
        if (mirrortext === void 0) { mirrortext = false; }
        //let str = this.props.naam;
        //if ((str == null) || (str.trim() == "")) {
        //    str = '';
        //}
        var minheight = 60; //Math.max(60,svgTextWidth(htmlspecialchars(str),16,'') + 20); //15 padding
        var shift = (minheight - 60) / 2;
        var mySVG = new SVGelement();
        mySVG.xleft = 0;
        mySVG.xright = 41 - 10; // the 10 is added again by another routine
        mySVG.yup = 0;
        mySVG.ydown = minheight;
        mySVG.data += "<rect y=\"5\" x=\"8\" height=\"".concat(minheight - 10, "\" width=\"24\" stroke=\"black\" stroke-width=\"1\" fill=\"none\" />");
        mySVG.data += "<line y1=\"".concat(minheight / 2, "\" x1=\"0\" y2=\"").concat(minheight / 2, "\" x2=\"8\" stroke=\"black\" stroke-width=\"1\" />");
        for (var i = 0; i < 5; i++) {
            mySVG.data += "<line y1=\"".concat(10 + shift + i * 10, "\" x1=\"32\" y2=\"").concat(10 + shift + i * 10, "\" x2=\"40\" stroke=\"black\" stroke-width=\"1\" />");
        }
        /*mySVG.data += '<text x="' + (15) + '" ' + 'y="' + (minheight/2) + '" '
                   +  `transform="${mirrortext ? `translate(${44},0) scale(-1,1) `: ''} rotate(90 18,${(minheight/2)})" `
                   + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="16"' + '>'
                   + htmlspecialchars(str) + '</text>';*/
        return mySVG;
    };
    Bord.prototype.toSVG = function (sitplan, mirrortext) {
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
        var mySVG; // = new SVGelement();
        if (sitplan) {
            return this.toSitPlanSVG(mirrortext);
        }
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
    Contactdoos.prototype.toSVG = function (sitplan, mirrortext) {
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('contactdoos');
        SVGSymbols.addSymbol('contactdoos_aarding');
        SVGSymbols.addSymbol('contactdoos_kinderveilig');
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
        if (this.props.is_halfwaterdicht) {
            mySVG.data += '<rect x="' + (22 + (this.props.heeft_ingebouwde_schakelaar) * 10 + (this.props.is_meerfasig) * 34) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" />';
            var textX = (25 + (this.props.heeft_ingebouwde_schakelaar) * 10 + (this.props.is_meerfasig) * 34);
            var textStyle = 'text-anchor:middle" font-family="Arial, Helvetica, sans-serif';
            if (mirrortext == false)
                mySVG.data += '<text x="' + (+textX) + '" y="8" style="' + textStyle + '" font-size="10">h</text>';
            else
                mySVG.data += '<text transform="scale(-1,1) translate(' + (-textX * 2) + ',0)" x="' + (+textX) + '" y="8" style="' + textStyle + '" font-size="10">h</text>';
        }
        // Indien de contactdoos een kind heeft, teken een streepje rechts
        if ((this.heeftVerbruikerAlsKind()) && (!sitplan)) {
            mySVG.data += '<line x1="' + startx + '" y1="25" x2="' + (startx + 21) + '" y2="25" stroke="black" />';
        }
        ;
        // Adres helemaal onderaan plaatsen
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Diepvriezer.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('ster');
        SVGSymbols.addSymbol('diepvriezer');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 60;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#diepvriezer" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Domotica_gestuurde_verbruiker.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('draadloos_klein');
        SVGSymbols.addSymbol('drukknop_klein');
        SVGSymbols.addSymbol('tijdschakelaar_klein');
        SVGSymbols.addSymbol('detectie_klein');
        SVGSymbols.addSymbol('schakelaar_klein');
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
        if (sitplan == false) {
            if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
                mySVG.data += '<text x="' + ((mySVG.xright - 20) / 2 + 21 + 0) + '" y="' + (mySVG.ydown + mySVG.yup + 10)
                    + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">'
                    + htmlspecialchars(this.props.adres) + '</text>';
                mySVG.ydown += 15;
            }
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
    Droogkast.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('droogkast');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#droogkast" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Drukknop.prototype.toSVG = function (sitplan, mirrortext) {
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('drukknop');
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 43;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        var aantal_knoppen = this.props.aantal;
        // Teken lijn links
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
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
        if (printstr != '') {
            var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (mirrortext == false)
                mySVG.data += '<text x="33" y="49" ' + textoptions + '>' + htmlspecialchars(printstr) + '</text>';
            else
                mySVG.data += '<text transform="scale(-1,1) translate(-66,0)" x="33" y="49" ' + textoptions + '>' + htmlspecialchars(printstr) + '</text>';
        }
        // Plaats tekst voor aantal knoppen per armatuur
        if (this.props.aantal_knoppen_per_armatuur > 1) {
            var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (mirrortext == false)
                mySVG.data += '<text x="44" y="13" ' + textoptions + '>' + htmlspecialchars(this.props.aantal_knoppen_per_armatuur) + '</text>';
            else
                mySVG.data += '<text transform="scale(-1,1) translate(-88,0)" x="44" y="13" ' + textoptions + '>' + htmlspecialchars(this.props.aantal_knoppen_per_armatuur) + '</text>';
            mySVG.data += '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
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
            mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 65, 20));
        }
        else {
            mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 49, 5));
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
    EV_lader.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('EVlader');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 60;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#EVlader" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Elektriciteitsmeter.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('elektriciteitsmeter');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Elektrische_oven.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('oven');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#oven" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Ketel.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('verbruiker');
        SVGSymbols.addSymbol('gas_ventilator');
        SVGSymbols.addSymbol('gas_atmosferisch');
        SVGSymbols.addSymbol('bliksem');
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
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>')
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
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60 + shifty, 15));
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
    Koelkast.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('ster');
        SVGSymbols.addSymbol('koelkast');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#koelkast" x="21" y="25"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
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
    Kookfornuis.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('kookfornuis');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#kookfornuis" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
        this.props.huishoudelijk = true;
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
        this.props.huishoudelijk = true;
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
        if (typeof (this.props.huishoudelijk) == 'undefined')
            this.props.huishoudelijk = true;
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
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
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
        if ((this.props.kortsluitvermogen != '') && (['differentieel', 'automatisch', 'differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }
        output += ", Tekst: " + this.stringPropToHTML('tekst', 10);
        return (output);
    };
    Kring.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('zekering_automatisch');
        SVGSymbols.addSymbol('zekering_empty');
        SVGSymbols.addSymbol('zekering_smelt');
        SVGSymbols.addSymbol('overspanningsbeveiliging_inline');
        SVGSymbols.addSymbol('arrow');
        SVGSymbols.addSymbol('relais_kring');
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + "</text>";
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (mySVG.xleft + 15 + 11 * (numlines - 2) + 1) + '" y="' + (mySVG.yup - 10 - (rectsize / 2)) + '" width="' + (11 * 1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "\" y=\"" + (mySVG.yup - 10) + "\""
                            + " transform=\"rotate(-90 " + (mySVG.xleft + 15 + 11 * (numlines - 1)) + "," + (mySVG.yup - 10) + ")"
                            + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
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
    Lichtpunt.prototype.overrideKeys = function () {
        if ((this.props.type_lamp == null) && (this.props.type_lamp == "")) {
            this.props.type_lamp = "standaard";
        }
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
        this.overrideKeys();
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
    /**
     * Berekent de grenzen voor het sitplan-element op basis van het type lamp.
     *
     * @returns Een object met de grensverrekeningen: clipleft, addright, cliptop en addbottom.
     *          De waarde van clipleft wordt kleiner gezet voor standaardlampen omdat die tekening iets meer naar links ligt.
     */
    Lichtpunt.prototype.getSitPlanBoundaries = function () {
        var clipleft = 0;
        var addright = 0;
        var cliptop = 0;
        var addbottom = 0;
        switch (this.props.type_lamp) {
            case "led":
                clipleft = 14;
                break;
            case "TL":
                clipleft = 20;
                if (+this.props.aantal_buizen_indien_TL > 3) {
                    cliptop = -1;
                    addbottom = 1;
                }
                break;
            case "spot":
                clipleft = 17;
                break;
            case "standaard":
            default:
                clipleft = 10;
                break;
        }
        return {
            clipleft: clipleft,
            addright: addright,
            cliptop: cliptop,
            addbottom: addbottom
        };
    };
    Lichtpunt.prototype.toSVG = function (sitplan, mirrortext) {
        if (sitplan === void 0) { sitplan = false; }
        if (mirrortext === void 0) { mirrortext = false; }
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;
        // Teken de leiding links
        mySVG.data = (sitplan ? "" : '<line x1="1" x2="30" y1="25" y2="25" stroke="black" />');
        // Indien halfwaterdicht en/of meerdere lampen, voorzie de tekst bovenaan
        var print_str_upper = "";
        if (this.props.is_halfwaterdicht) {
            print_str_upper = "h";
            if ((parseInt(this.props.aantal) > 1) && (!sitplan))
                print_str_upper += ", x" + this.props.aantal; //Meer dan 1 lamp
        }
        else if ((parseInt(this.props.aantal) > 1) && (!sitplan))
            print_str_upper = "x" + this.props.aantal;
        switch (this.props.type_lamp) {
            case "led":
                SVGSymbols.addSymbol('led');
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
                if (print_str_upper != "") {
                    var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7"';
                    if (mirrortext == false)
                        mySVG.data += "<text x=\"".concat(textxpos, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                    else
                        mySVG.data += "<text transform=\"scale(-1,1) translate(".concat(-2 * textxpos, ",0)\" x=\"").concat(textxpos, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                }
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
                mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 50, 5, 2));
                break;
            case "spot":
                SVGSymbols.addSymbol('spot');
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
                if (print_str_upper != "") {
                    var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7"';
                    if (mirrortext == false)
                        mySVG.data += "<text x=\"".concat(textxpos, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                    else
                        mySVG.data += "<text transform=\"scale(-1,1) translate(".concat(-2 * textxpos, ",0)\" x=\"").concat(textxpos, "\" y=\"10\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                }
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
                mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 52, 7, 4));
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
                if (print_str_upper != "") {
                    var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                    if (mirrortext == false)
                        mySVG.data += "<text x=\"60\" y=\"".concat(25 - (aantal_buizen * 3.5), "\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                    else
                        mySVG.data += "<text transform=\"scale(-1,1) translate(-120,0)\" x=\"60\" y=\"".concat(25 - (aantal_buizen * 3.5), "\" ").concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                }
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
                    default:
                    //Do nothing
                }
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 90;
                mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, endy + 13, Math.max(0, endy - 25 - 5), 2));
                break;
            default: //Normaal lichtpunt (kruisje)
                switch (this.props.type_noodverlichting) {
                    case "Centraal":
                        SVGSymbols.addSymbol('lamp');
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />'
                            + '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                        if ((this.heeftVerbruikerAlsKind()) && (!sitplan))
                            mySVG.data += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 11) + '" y2="25" stroke="black" />';
                        break;
                    case "Decentraal":
                        SVGSymbols.addSymbol('noodlamp_decentraal');
                        mySVG.data += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                        if (this.props.heeft_ingebouwde_schakelaar)
                            mySVG.data += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />'; //Ingebouwde schakelaar
                        break;
                    default:
                        SVGSymbols.addSymbol('lamp');
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                        if ((this.heeftVerbruikerAlsKind()) && (!sitplan))
                            mySVG.data += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 11) + '" y2="25" stroke="black" />';
                        break;
                }
                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "") {
                    var textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                    if (mirrortext == false)
                        mySVG.data += "<text x=\"30\" y=\"10\" ".concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                    else
                        mySVG.data += "<text transform=\"scale(-1,1) translate(-60,0)\" x=\"30\" y=\"10\" ".concat(textoptions, ">").concat(htmlspecialchars(print_str_upper), "</text>");
                }
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp)
                    mySVG.data += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar)
                    mySVG.data += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 39;
                mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 54, 10, -1));
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
        if (['luidspreker', 'intercom'].includes(this.props.symbool)) {
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
            + "Symbool: " + this.selectPropToHTML('symbool', ["", "luidspreker", "intercom"]);
        if (['luidspreker', 'intercom'].includes(this.props.symbool)) {
            output += ", Aantal: " + this.selectPropToHTML('aantal', ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        }
        output += ", Adres/tekst: " + this.stringPropToHTML('adres', 5);
        return (output);
    };
    Media.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('luidspreker');
        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if ((this.props.aantal > 1) && (!sitplan) && (['luidspreker', 'intercom'].includes(this.props.symbool))) {
            switch (this.props.symbool) {
                case "luidspreker":
                    shifty = 15;
                    mySVG.data += '<text x="31" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
                    break;
                case "intercom":
                    shifty = 5;
                    mySVG.data += '<text x="36" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>';
                    break;
                default:
                //Do nothing
            }
        }
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;
        switch (this.props.symbool) {
            case "luidspreker":
                mySVG.data += (sitplan ? '' : '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black" />');
                mySVG.data += '<use xlink:href="#luidspreker" x="21" y="' + (25 + shifty) + '" />';
                mySVG.xright = 36;
                mySVG.data += (sitplan ? '' : this.addAddressToSVG(mySVG, 60 + shifty, 15, 0));
                break;
            case "intercom":
                mySVG.data += (sitplan ? '' : '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black" />');
                mySVG.data += "<rect x=\"21\" y=\"".concat((15 + shifty), "\" width=\"30\" height=\"20\" stroke=\"black\" fill=\"none\" />");
                mySVG.data += "<rect x=\"36\" y=\"".concat((20 + shifty), "\" width=\"4\" height=\"10\" stroke=\"black\" fill=\"none\" />");
                mySVG.data += "<line x1=\"40\" y1=\"".concat((20 + shifty), "\" x2=\"51\" y2=\"").concat((15 + shifty), "\" stroke=\"black\" />");
                mySVG.data += "<line x1=\"40\" y1=\"".concat((30 + shifty), "\" x2=\"51\" y2=\"").concat((35 + shifty), "\" stroke=\"black\" />");
                mySVG.data += "<line x1=\"46\" y1=\"".concat((25 + shifty), "\" x2=\"56\" y2=\"").concat((25 + shifty), "\" stroke=\"black\" stroke-width=\"2\" />");
                mySVG.data += "<line x1=\"46\" y1=\"".concat((25 + shifty), "\" x2=\"48\" y2=\"").concat((23 + shifty), "\" stroke=\"black\" stroke-width=\"1\" stroke-linecap=\"round\" />");
                mySVG.data += "<line x1=\"46\" y1=\"".concat((25 + shifty), "\" x2=\"48\" y2=\"").concat((27 + shifty), "\" stroke=\"black\" stroke-width=\"1\" stroke-linecap=\"round\" />");
                mySVG.data += "<line x1=\"56\" y1=\"".concat((25 + shifty), "\" x2=\"54\" y2=\"").concat((23 + shifty), "\" stroke=\"black\" stroke-width=\"1\" stroke-linecap=\"round\" />");
                mySVG.data += "<line x1=\"56\" y1=\"".concat((25 + shifty), "\" x2=\"54\" y2=\"").concat((27 + shifty), "\" stroke=\"black\" stroke-width=\"1\" stroke-linecap=\"round\" />");
                mySVG.xright = 54;
                mySVG.data += (sitplan ? '' : this.addAddressToSVG(mySVG, 50 + shifty, 5, -3));
                break;
            default:
                mySVG.data += (sitplan ? '' : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
                mySVG.xright = 19;
                break;
        }
        return (mySVG);
    };
    Media.prototype.getSitPlanBoundaries = function () {
        var clipleft = 12;
        var addright = 0;
        var cliptop = 0;
        var addbottom = 0;
        switch (this.props.symbool) {
            case 'luidspreker':
                break;
            case 'intercom':
                addright = -5;
                cliptop = 5;
                addbottom = -5;
                break;
            default:
                break;
        }
        return ({ clipleft: clipleft, addright: addright, cliptop: cliptop, addbottom: addbottom });
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
    Microgolfoven.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('sinus');
        SVGSymbols.addSymbol('microgolf');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#microgolf" x="21" y="25"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
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
    Motor.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('motor');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#motor" x="21" y="25"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
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
    Omvormer.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('sinus');
        SVGSymbols.addSymbol('omvormer');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#omvormer" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Overspanningsbeveiliging.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('overspanningsbeveiliging');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 34;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#overspanningsbeveiliging" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55, 10));
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
    Stoomoven.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('stoomoven');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#stoomoven" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Transformator.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('transformator');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 47;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#transformator" x="21" y="25"></use>'
            + '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
            htmlspecialchars(this.props.voltage) + "</text>";
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 58, 15));
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
    USB_lader.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('usblader');
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
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>')
            + '<use xlink:href="#usblader" x="21" y="' + (shifty + 25) + '"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55 + shifty, 10));
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
    Vaatwasmachine.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('vaatwasmachine');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#vaatwasmachine" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60, 15));
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
    Ventilator.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('ventilator');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#ventilator" x="21" y="25"></use>';
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55, 10));
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
    Verbruiker.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
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
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="' + (25 + extraplace / 2.0) + '" x2="21" y2="' + (25 + extraplace / 2.0) + '" stroke="black" />')
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
    Verwarmingstoestel.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 69;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('verwarmingstoestel');
                mySVG.data += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                break;
            case true:
                switch (this.props.heeft_ventilator) { //ventilator
                    case false:
                        SVGSymbols.addSymbol('VerticalStripe');
                        SVGSymbols.addSymbol('verwarmingstoestel_accu');
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                        break;
                    case true:
                        SVGSymbols.addSymbol('VerticalStripe');
                        SVGSymbols.addSymbol('verwarmingstoestel_accu_ventilator');
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                        mySVG.xright = 89;
                        break;
                }
                break;
        }
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 55, 10));
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
    Vrije_tekst.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
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
                mySVG.data += (sitplan ? "" : '<line x1="1" y1="' + (25 + extraplace / 2.0) + '" x2="21" y2="' + (25 + extraplace / 2.0) + '" stroke="black" />')
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
    Warmtepomp.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('verbruiker');
        SVGSymbols.addSymbol('bliksem');
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
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>')
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
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 60 + shifty, 15));
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
    Wasmachine.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('wasmachine');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        mySVG.data = (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
            + '<use xlink:href="#wasmachine" x="21" y="25"></use>';
        mySVG.data += this.addAddressToSVG(mySVG, 60, 15);
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
        this.props.huishoudelijk = true;
    };
    Zekering.prototype.overrideKeys = function () {
        if ((this.props.aantal_polen < 1) || (this.props.aantal_polen > 4))
            this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
        if ((this.props.bescherming != "differentieel") && (this.props.bescherming != "differentieelautomaat"))
            this.props.differentieel_is_selectief = false;
        if (!this.isChildOf("Kring"))
            this.props.nr = "";
        if (typeof (this.props.huishoudelijk) == 'undefined')
            this.props.huishoudelijk = true;
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
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA";
                break;
            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage', 3) + "mA"
                    + ", Curve:" + this.selectPropToHTML('curve_automaat', ["", "B", "C", "D"])
                    + ", Type:" + this.selectPropToHTML('type_differentieel', ["", "A", "B"])
                    + ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen', 3) + "kA"
                    + ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief');
                break;
        }
        if ((this.props.kortsluitvermogen != '') && (['differentieel', 'automatisch', 'differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }
        return (output);
    };
    Zekering.prototype.toSVG = function () {
        var mySVG = new SVGelement();
        var outputstr = "";
        SVGSymbols.addSymbol('zekering_automatisch_horizontaal');
        SVGSymbols.addSymbol('zekering_smelt_horizontaal');
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + '</text>';
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (21 + 10 - (rectsize / 2)) + '" y="' + (25 + 15 + (numlines - 1) * 11 - 10) + '" width="' + rectsize + '" height="' + (11 * 1.2) + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + '</text>';
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (21 + 10 - (rectsize / 2)) + '" y="' + (25 + 15 + (numlines - 1) * 11 - 10) + '" width="' + rectsize + '" height="' + (11 * 1.2) + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
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
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen * 1000)) + '</text>';
                        var rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen * 1000))) + 6;
                        mySVG.data += '<rect x="' + (21 + 10 - (rectsize / 2)) + '" y="' + (25 + 15 + (numlines - 1) * 11 - 10) + '" width="' + rectsize + '" height="' + (11 * 1.2) + '" fill="none" stroke="black" />';
                    }
                    else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21 + 10) + '" y="' + (25 + 15 + (numlines - 1) * 11) + '" '
                            + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                            + htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
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
    Zeldzame_symbolen.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('deurslot');
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        switch (this.props.symbool) {
            case "deurslot":
                mySVG.data += (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                    + '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddressToSVG(mySVG, 55, 10, 2);
                break;
            default:
                mySVG.data += (sitplan ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
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
    Zonnepaneel.prototype.toSVG = function (sitplan) {
        if (sitplan === void 0) { sitplan = false; }
        var mySVG = new SVGelement();
        SVGSymbols.addSymbol('arrow');
        SVGSymbols.addSymbol('zonnepaneel');
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 69;
        mySVG.yup = 35;
        mySVG.ydown = 25;
        mySVG.data += (sitplan ? "" : '<line x1="1" y1="35" x2="21" y2="35" stroke="black"></line>')
            + '<use xlink:href="#zonnepaneel" x="21" y="35"></use>'
            + '<text x="45" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.props.aantal) + 'x</text>';
        // Adres helemaal onderaan plaatsen
        mySVG.data += (sitplan ? "" : this.addAddressToSVG(mySVG, 70, 15));
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
        this.currentView = 'config';
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
    SVGSymbols.addSymbol = function (symbol) {
        if (!this.neededSymbols.includes(symbol)) {
            this.neededSymbols.push(symbol);
        }
    };
    SVGSymbols.clearSymbols = function () {
        this.neededSymbols = [];
    };
    SVGSymbols.getNeededSymbols = function () {
        var output = '<defs>';
        if (this.neededSymbols.includes('VerticalStripe')) {
            output += '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
                '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
                '</pattern>';
        }
        for (var key in this.data) {
            if (this.neededSymbols.includes(key)) {
                output += "<g id=\"".concat(key, "\">").concat(this.data[key].replace(/\n/g, ''), "</g>");
            }
        }
        output += '</defs>';
        return (output);
    };
    SVGSymbols.outputSVGSymbols = function () {
        var output = '<defs>' +
            '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
            '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
            '</pattern>';
        for (var key in this.data) {
            if (key != 'VerticalStripe')
                output += "<g id=\"".concat(key, "\">").concat(this.data[key].replace(/\n/g, ''), "</g>");
        }
        output += '</defs>';
        return (output);
    };
    SVGSymbols.neededSymbols = [];
    SVGSymbols.data = {
        batterij: "\n<rect x=\"0\" y=\"-12\" width=\"40\" height=\"27\" stroke=\"black\" fill=\"none\"/>\n<rect x=\"5\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n<rect x=\"25\" y=\"-15\" width=\"10\" height=\"3\" stroke=\"black\" fill=\"none\"/>\n<line x1=\"8\" y1=\"-5\" x2=\"12\" y2=\"-5\" stroke=\"black\"/>\n<line x1=\"10\" y1=\"-7\" x2=\"10\" y2=\"-3\" stroke=\"black\"/>\n<line x1=\"28\" y1=\"-5\" x2=\"32\" y2=\"-5\" stroke=\"black\"/>\n",
        contactdoos: "\n<path d=\"M20 0 A15 15 0 0 1 35 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n<path d=\"M20 0 A15 15 0 0 0 35 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n<line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"0\" stroke=\"black\" />\n",
        deurslot: "\n<line x1=\"1\" y1=\"-15\" x2=\"31\" y2=\"-15\" stroke=\"black\"/>\n<line x1=\"1\" y1=\"15\"  x2=\"46\" y2=\"15\" stroke=\"black\"/>\n<line x1=\"1\" y1=\"-15\" x2=\"1\" y2=\"15\" stroke=\"black\"/>\n<line x1=\"31\" y1=\"-15\" x2=\"46\" y2=\"15\" stroke=\"black\"/>\n<path d=\"M 7 3 A 6 6 0 0 1 19 3 A 6 6 0 0 1 31 3\" stroke=\"black\" fill=\"none\" />\n",
        ster: "\n<line x1=\"0\" y1=\"-5\" x2=\"0\" y2=\"5\" style=\"stroke:black\" />\n<line x1=\"-4.33\" y1=\"-2.5\" x2=\"4.33\" y2=\"2.5\" style=\"stroke:black\" />\n<line x1=\"-4.66\" y1=\"2.5\" x2=\"4.33\" y2=\"-2.5\" style=\"stroke:black\" />\n",
        EVlader: "\n<rect x=\"0\" y=\"13\" width=\"40\" height=\"7\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"0\" x2=\"7\" y2=\"0\" style=\"stroke:black\" />\n<line x1=\"7\" y1=\"-20\" x2=\"7\" y2=\"13\" style=\"stroke:black\" />\n<line x1=\"33\" y1=\"-20\" x2=\"33\" y2=\"13\" style=\"stroke:black\" />\n<line x1=\"7\" y1=\"-20\" x2=\"33\" y2=\"-20\" style=\"stroke:black\" />\n<rect x=\"10\" y=\"-17\" width=\"20\" height=\"8\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"20\" y1=\"-6\" x2=\"20\" y2=\"10\" style=\"stroke:black\" />\n<line x1=\"33\" y1=\"-6\" x2=\"36\" y2=\"-6\" style=\"stroke:black\" />\n<line x1=\"36\" y1=\"-6\" x2=\"36\" y2=\"4\" style=\"stroke:black\" />\n<line x1=\"36\" y1=\"4\" x2=\"39\" y2=\"4\" style=\"stroke:black\" />\n<line x1=\"39\" y1=\"4\" x2=\"39\" y2=\"-15\" style=\"stroke:black\" />\n<line x1=\"39\" y1=\"-6\" x2=\"39\" y2=\"-15\" style=\"stroke:black;stroke-width:2\" />\n<text x=\"15\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n<text x=\"25\" y=\"1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n<text x=\"15\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">E</text>\n<text x=\"25\" y=\"9\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"6\">V</text>\n",
        lamp: "\n<line x1=\"-10.61\" y1=\"-10.61\" x2=\"10.61\" y2=\"10.61\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"-10.61\" y1=\"10.61\" x2=\"10.61\" y2=\"-10.61\" stroke=\"black\" stroke-width=\"2\" />\n",
        led: "\n<line x1=\"0\" y1=\"-7\" x2=\"0\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"0\" y1=\"-7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"0\" y1=\"7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"12\" y1=\"-7\" x2=\"12\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"6\" y1=\"-6\" x2=\"7\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"7\" y1=\"-11\" x2=\"8.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"7\" y1=\"-11\" x2=\"5.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"9\" y1=\"-6\" x2=\"10\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"10\" y1=\"-11\" x2=\"11.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"10\" y1=\"-11\" x2=\"8.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n",
        luidspreker: "\n<polygon points=\"0,-10 7,-10 17,-20 17,20 7,10 0,10\" fill=\"none\" stroke=\"black\"/>\n<line x1=\"7\" y1=\"-10\" x2=\"7\" y2=\"10\" stroke=\"black\" stroke-width=\"1\" />\n",
        magneetcontact: "\n<rect x=\"0\" y=\"-10\" width=\"20\" height=\"20\" fill=\"black\" stroke=\"black\"/>\n",
        sinus: "\n<path d=\"M0,0 C2,-5 8,-5 10,0 S18,5 20,0\" style=\"stroke:black;fill:none\" />\n",
        spot: "\n<path d=\"M0 0 A10 10 0 0 1 10 -10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n<path d=\"M0 0 A10 10 0 0 0 10 10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n<circle cx=\"10\" cy=\"0\" r=\"6\" style=\"stroke:black;fill:white\" />\n<line x1=\"5.76\" x2=\"14.24\" y1=\"-4.24\" y2=\"4.24\" stroke=\"black\" stroke-width=\"1\" />\n<line x1=\"5.76\" x2=\"14.24\" y1=\"4.24\" y2=\"-4.24\" stroke=\"black\" stroke-width=\"1\" />\n",
        noodlamp_decentraal: "\n<rect x=\"-10.61\" y=\"-10.61\" width=\"21.22\" height=\"21.22\" fill=\"white\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:black\" />\n<line x1=\"-7\" y1=\"-7\" x2=\"7\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"-7\" y1=\"7\" x2=\"7\" y2=\"-7\" stroke=\"black\" stroke-width=\"2\" />\n",
        signalisatielamp: "\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n<line x1=\"-3\" y1=\"-3\" x2=\"3\" y2=\"3\" stroke=\"black\" />\n<line x1=\"-3\" y1=\"3\" x2=\"3\" y2=\"-3\" stroke=\"black\" />\n",
        schakelaar_enkel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_klein: "\n<line x1=\"0\" y1=\"0\" x2=\"6\" y2=\"-12\" stroke=\"black\" />\n<line x1=\"6\" y1=\"-12\" x2=\"9\" y2=\"-10.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"3\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_dubbel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_trippel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n<line x1=\"6\" y1=\"-12\" x2=\"11\" y2=\"-9.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_wissel_enkel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_rolluik: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n<rect x=\"-8\" y=\"-8\" width=\"16\" height=\"16\" fill=\"white\" stroke=\"black\" />\n<text x=\"0\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">S</text>\n",
        schakelaar_enkel_dim: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n<polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n",
        schakelaar_wissel_dim: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n<polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n",
        schakelaar_kruis_enkel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"20\" x2=\"15\" y2=\"17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_dubbelaansteking: "\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        schakelaar_wissel_dubbel: "\n<line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n<line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n<line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n<line x1=\"-8\" y1=\"16\" x2=\"-13\" y2=\"13.5\" stroke=\"black\" />\n<circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n",
        aansluitpunt: "\n<circle cx=\"5\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n",
        aftakdoos: "\n<circle cx=\"15\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n<circle cx=\"15\" cy=\"0\" r=\"7.5\" style=\"stroke:black;fill:black\" />\n",
        bewegingsschakelaar: "\n<rect x=\"0\" y=\"-13\" width=\"10\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<rect x=\"10\" y=\"-13\" width=\"30\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"10\" y1=\"13\" x2=\"40\" y2=\"-13\"  stroke=\"black\" />\n<line x1=\"15\" y1=\"-5\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n<line x1=\"20\" y1=\"-10\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n<line x1=\"20\" y1=\"-10\" x2=\"25\" y2=\"-10\"  stroke=\"black\" />\n<text x=\"22\" y=\"11\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"10\">PIR</text>\n",
        schakelaar: "\n<line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n<line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n<line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n",
        schemerschakelaar: "\n<line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n<line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n<line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n<use xlink:href=\"#arrow\" x=\"14\" y=\"-17\" transform=\"rotate(90 14 -17)\" />\n<use xlink:href=\"#arrow\" x=\"18\" y=\"-17\" transform=\"rotate(90 18 -17)\" />\n",
        stoomoven: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<path d=\"M 6 -2 A 7 5 0 0 1 13 -7 A 7 5 0 0 1 27 -7 A 7 5 0 0 1 33 -2\" stroke=\"black\" fill=\"none\" />\n<path d=\"M 6  5 A 7 5 0 0 1 13  0 A 7 5 0 0 1 27  0 A 7 5 0 0 1 33  5\" stroke=\"black\" fill=\"none\" />\n<path d=\"M 6 12 A 7 5 0 0 1 13  7 A 7 5 0 0 1 27  7 A 7 5 0 0 1 33 12\" stroke=\"black\" fill=\"none\" />\n",
        contactdoos_aarding: "\n<line x1=\"20\" y1=\"-15\" x2=\"20\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n",
        contactdoos_kinderveilig: "\n<line x1=\"35\" y1=\"-20\" x2=\"35\" y2=\"-14.1\"  stroke=\"black\" stroke-width=\"2\" />\n<line x1=\"35\" y1=\"20\" x2=\"35\" y2=\"14.1\"  stroke=\"black\" stroke-width=\"2\" />\n",
        bel: "\n<path d=\"M20 0 A15 15 0 0 1 0 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n<path d=\"M20 0 A15 15 0 0 0 0 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n<line x1=\"0\" y1=\"15\" x2=\"0\" y2=\"-15\" stroke=\"black\" stroke-width=\"2\" />\n",
        boiler: "\n<circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black; fill:url(#VerticalStripe);\" />\n",
        boiler_accu: "\n<circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n<circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n",
        motor: "\n<circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n<text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">M</text>\n",
        elektriciteitsmeter: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"-6\" x2=\"40\" y2=\"-6\" stroke=\"black\" stroke-width=\"1\" />\n<text x=\"20\" y=\"10\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"12\">kWh</text>\n",
        diepvriezer: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<use xlink:href=\"#ster\" x=\"10\" y=\"0\" />\n<use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\n<use xlink:href=\"#ster\" x=\"30\" y=\"0\" />\n",
        zonnepaneel: "\n<rect x=\"0\" y=\"-20\" width=\"50\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"0\" x2=\"50\" y2=\"0\" stroke=\"black\" />\n<use xlink:href=\"#arrow\" x=\"5\" y=\"-12\" transform=\"rotate(45 5 -10)\" />\n<use xlink:href=\"#arrow\" x=\"10\" y=\"-14\" transform=\"rotate(45 10 -14)\" />\n",
        drukknop_klein: "\n<circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n<circle cx=\"8\" cy=\"0\" r=\"4\" style=\"stroke:black;fill:none\" />\n",
        draadloos_klein: "\n<path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n<path d=\"M 7 -5 A 8 8 0 0 1 7 5\" stroke=\"black\" fill=\"none\" /> \n<path d=\"M 4 -3 A 6 6 0 0 1 4 3\" stroke=\"black\" fill=\"none\" /> \n",
        detectie_klein: "\n<path d=\"M 10 -7 A 10 10 0 0 1 10 7\" stroke=\"black\" fill=\"none\" /> \n<path d=\"M 5 -7 A 10 10 0 0 1 5 7\" stroke=\"black\" fill=\"none\" /> \n",
        drukknop: "\n<circle cx=\"12\" cy=\"0\" r=\"12\" style=\"stroke:black;fill:none\" />\n<circle cx=\"12\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n",
        teleruptor: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n<line x1=\"24\" y1=\"6\" x2=\"32\" y2=\"6\"  stroke=\"black\" />\n<line x1=\"16\" y1=\"-6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n<line x1=\"24\" y1=\"-6\" x2=\"24\" y2=\"6\"  stroke=\"black\" />\n",
        dimmer: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"10\" y1=\"5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n<line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"-5\"  stroke=\"black\" />\n<line x1=\"10\" y1=\"-5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n",
        relais: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"10\" y1=\"-13\" x2=\"30\" y2=\"13\"  stroke=\"black\" />\n",
        minuterie: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\">t</text>\n",
        thermostaat: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n<line x1=\"12\" y1=\"0\" x2=\"28\" y2=\"0\"  stroke=\"black\" />\n",
        tijdschakelaar: "\n<rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"11\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n<line x1=\"10\" y1=\"0\"  x2=\"17\" y2=\"0\"  stroke=\"black\" />\n<line x1=\"11\" y1=\"-6\" x2=\"11\" y2=\"1\"  stroke=\"black\" />\n<line x1=\"21\" y1=\"0\"  x2=\"25\" y2=\"0\"  stroke=\"black\" />\n<line x1=\"25\" y1=\"0\"  x2=\"31\" y2=\"-5\"  stroke=\"black\" />\n<line x1=\"31\" y1=\"0\"  x2=\"36\" y2=\"0\"  stroke=\"black\" />\n",
        tijdschakelaar_klein: "\n<circle cx=\"8\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n<line x1=\"7\" y1=\"0\"  x2=\"13\" y2=\"0\"  stroke=\"black\" />\n<line x1=\"8\" y1=\"-5\" x2=\"8\" y2=\"1\"  stroke=\"black\" />\n",
        droogkast: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"15\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n<circle cx=\"25\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n<circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n",
        omvormer: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"20\" x2=\"40\" y2=\"-20\" stroke=\"black\" />\n<use xlink:href=\"#sinus\" x=\"5\" y=\"-12\" />\"\n<line x1=\"20\" y1=\"10\" x2=\"35\" y2=\"10\" stroke=\"black\" />\n<line x1=\"20\" y1=\"13\" x2=\"35\" y2=\"13\" stroke=\"black\" stroke-dasharray=\"3\" />\n",
        overspanningsbeveiliging: "\n<rect x=\"0\" y=\"-15\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"7.5\" y1=\"-18\" x2=\"7.5\" y2=\"-5\" stroke=\"black\" />\n<line x1=\"7.5\" y1=\"-5\" x2=\"4.5\" y2=\"-9\" stroke=\"black\" />\n<line x1=\"7.5\" y1=\"-5\" x2=\"10.5\" y2=\"-9\" stroke=\"black\" />\n<line x1=\"7.5\" y1=\"18\" x2=\"7.5\" y2=\"5\" stroke=\"black\" />\n<line x1=\"7.5\" y1=\"5\" x2=\"4.5\" y2=\"9\" stroke=\"black\" />\n<line x1=\"7.5\" y1=\"5\" x2=\"10.5\" y2=\"9\" stroke=\"black\" />\n",
        koelkast: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\"\n",
        kookfornuis: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"10\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n<circle cx=\"30\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n<circle cx=\"30\" cy=\"-10\" r=\"3\" style=\"stroke:black;fill:black\" />\n",
        microgolf: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<use xlink:href=\"#sinus\" x=\"10\" y=\"-10\" />\"\n<use xlink:href=\"#sinus\" x=\"10\" y=\"0\" />\"\n<use xlink:href=\"#sinus\" x=\"10\" y=\"10\" />\"\n",
        oven: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"-5\" x2=\"40\" y2=\"-5\" stroke=\"black\" />\n<circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n",
        usblader: "\n<rect x=\"0\" y=\"-15\" width=\"60\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"12\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n<circle cx=\"19\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n<text x=\"15\" y=\"8\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"8\">AC/DC</text>\n<text x=\"42\" y=\"4\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"11\">USB</text>\n",
        vaatwasmachine: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"-20\" x2=\"40\" y2=\"20\" style=\"stroke:black;fill:none\" />\n<line x1=\"40\" y1=\"-20\" x2=\"0\" y2=\"20\" style=\"stroke:black;fill:none\" />\n<circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:white\" />\n",
        ventilator: "\n<rect x=\"0\" y=\"-15\" width=\"30\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"10\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n<circle cx=\"20\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n",
        transformator: "\n<circle cx=\"8\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n<circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n",
        verwarmingstoestel: "\n<rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n",
        verwarmingstoestel_accu: "\n<rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<rect x=\"5\" y=\"-10\" width=\"40\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n",
        verwarmingstoestel_accu_ventilator: "\n<rect x=\"0\" y=\"-15\" width=\"70\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<rect x=\"5\" y=\"-10\" width=\"35\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n<circle cx=\"50\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n<circle cx=\"60\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n",
        verbruiker: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n",
        wasmachine: "\n<rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n<circle cx=\"20\" cy=\"0\" r=\"3\" style=\"stroke:black;fill:black\" />\n<circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n",
        zekering_automatisch: "\n<g transform=\"rotate(-20)\">\n<line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n<rect x=\"-4\" y=\"-30\" width=\"4\" height=\"10\" style=\"fill:black\" />\n</g>\n",
        zekering_automatisch_horizontaal: "\n<g transform=\"rotate(-20)\">\n<line x1=\"0\" y1=\"0\" x2=\"30\" y2=\"0\"  stroke=\"black\" />\n<rect x=\"20\" y=\"-4\" height=\"4\" width=\"10\" style=\"fill:black\" />\n</g>\n",
        zekering_smelt: "\n<rect x=\"-4\" y=\"-30\" width=\"8\" height=\"30\" style=\"stroke:black;fill:none\" />\n<line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\" stroke=\"black\" />\n",
        zekering_smelt_horizontaal: "\n<rect x=\"0\" y=\"-4\" height=\"8\" width=\"30\" style=\"stroke:black;fill:none\" />\n<line x1=\"0\" y1=\"0\" x2=\"30\" y2=\"0\" stroke=\"black\" />\n",
        relais_kring: "\n<rect x=\"-8\" y=\"-30\" width=\"16\" height=\"30\" style=\"stroke:black;fill:none\" />\n<line x1=\"8\" y1=\"-22.5\" x2=\"-8\" y2=\"-7.5\" stroke=\"black\" />\n",
        overspanningsbeveiliging_inline: "\n-> shift x -7.5  y -15\n<rect x=\"-7.5\" y=\"-30\" width=\"15\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n<line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"-20\" stroke=\"black\" />\n<line x1=\"0\" y1=\"-20\" x2=\"-3\" y2=\"-24\" stroke=\"black\" />\n<line x1=\"0\" y1=\"-20\" x2=\"3\" y2=\"-24\" stroke=\"black\" />\n<line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-10\" stroke=\"black\" />\n<line x1=\"0\" y1=\"-10\" x2=\"-3\" y2=\"-6\" stroke=\"black\" />\n<line x1=\"0\" y1=\"-10\" x2=\"3\" y2=\"-6\" stroke=\"black\" />\n",
        zekering_empty: "\n<g transform=\"rotate(-20)\">\n<line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n</g>\n",
        arrow: "\n<line x1=\"0\" y1=\"0\" x2=\"8\" y2=\"0\" stroke=\"black\" />\n<line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"-1\" stroke=\"black\" />\n<line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"1\" stroke=\"black\" />\n",
        gas_ventilator: "\n<polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"black\" stroke=\"black\" />\n",
        gas_atmosferisch: "\n<polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"white\" stroke=\"black\" />\n",
        bliksem: "\n<line x1=\"0\" y1=\"-5.2\" x2=\"-3\" y2=\"0\" stroke=\"black\"/>\n<line x1=\"-3\" y1=\"0\" x2=\"3\" y2=\"0\" stroke=\"black\"/>\n<line x1=\"3\" y1=\"0\" x2=\"0\" y2=\"5.2\" stroke=\"black\"/>\n<line x1=\"0\" y1=\"5.2\" x2=\"0\" y2=\"2.2\" stroke=\"black\"/>\n<line x1=\"0\" y1=\"5.2\" x2=\"2.6\" y2=\"3.7\" stroke=\"black\"/>\n",
        moving_man: "\n<g transform=\"matrix(0.0152987,0,0,0.01530866,0,0)\">\n<path d=\"M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z\" id=\"path4\" stroke=\"black\" stroke-width=\"10\" />\n<path d=\"m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z\" id=\"path6\" stroke=\"black\" stroke-width=\"10\" />\n</g>\n"
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
    getElectroItemById(my_id: number) : Electro_Item
        Returns the Electro_Item in the array for a given ID
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
        this.sitplan = new SituationPlan();
    }
    ;
    /** dispose
     *
     */
    Hierarchical_List.prototype.dispose = function () {
        if (this.sitplanview != null) {
            this.sitplanview.dispose();
        }
    };
    // -- Definitief verwijderen van items die als inactief werden geflagged --
    /*    deleteInactive() {
            for (let i = 0; i<this.length; i++) { //Loop over all items
                while ( (!this.active[i]) && (i<this.length) ) {
                    this.data.splice(i,1);
                    this.active.splice(i,1);
                    this.id.splice(i,1);
                    this.length--;
                }
            }
        }*/
    /** Member functie resort
     *
     *  Sorteert de structuur zodat ouders steeds vlak voor de kinderen zitten en alles in de volgorde zoals
     *  zichtbaar in het schema.
     *
     *  Onbereikbare of niet actieve elementen worden verwijderd
     *
     **/
    Hierarchical_List.prototype.reSort = function () {
        var _this = this;
        var sortToOrdinal = function (parent, ordinals) {
            if (parent === void 0) { parent = 0; }
            if (ordinals === void 0) { ordinals = []; }
            for (var i = 0; i < _this.length; i++) {
                if (_this.active[i]) {
                    if (_this.data[i].parent == parent) {
                        ordinals.push(i);
                        sortToOrdinal(_this.id[i], ordinals);
                    }
                }
            }
            return ordinals;
        };
        var ordinals = sortToOrdinal();
        var data = [];
        var active = [];
        var id = [];
        for (var i = 0; i < ordinals.length; i++) {
            data.push(this.data[ordinals[i]]);
            active.push(this.active[ordinals[i]]);
            id.push(this.id[ordinals[i]]);
        }
        this.data = data;
        this.active = active;
        this.id = id;
        this.length = ordinals.length;
    };
    // -- Plaats in de array zoeken op basis van de id --
    Hierarchical_List.prototype.getOrdinalById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id)
                return (i);
        }
        return null;
    };
    Hierarchical_List.prototype.getElectroItemById = function (my_id) {
        var ordinal = this.getOrdinalById(my_id);
        if (ordinal !== null)
            return this.data[ordinal];
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
        output += "\n            <div class=\"icon\" ".concat((undostruct.undoStackSize() > 0 ? 'onclick="undoClicked()"' : "style=\"filter: opacity(45%)\""), ">\n                <img src=\"gif/undo.png\" alt=\"Ongedaan maken\" class=\"icon-image\">\n                <span class=\"icon-text\">Ongedaan maken</span>\n            </div>\n            <div class=\"icon\" ").concat((undostruct.redoStackSize() > 0 ? 'onclick="redoClicked()"' : "style=\"filter: opacity(45%)\""), ">\n                <img src=\"gif/redo.png\" alt=\"Opnieuw\" class=\"icon-image\">\n                <span class=\"icon-text\">Opnieuw</span>\n            </div>\n            <span style=\"display: inline-block; width: 30px;\"></span>\n        ");
        output += '<p style="margin-top: 5px;margin-bottom: 5px;">';
        switch (this.mode) {
            case "edit":
                output += "\n                        <div>\n                            Werkmodus<br>\n                            <select id=\"edit_mode\" onchange=\"HL_editmode()\">\n                                <option value=\"edit\" selected>Invoegen</option>\n                                <option value=\"move\">Verplaatsen/Clone</option>\n                            </select>\n                        </div>";
                break;
            case "move":
                output += "\n                        <div>\n                            Werkmodus<br>\n                            <select id=\"edit_mode\" onchange=\"HL_editmode()\">\n                                <option value=\"edit\">Invoegen</option>\n                                <option value=\"move\" selected>Verplaatsen/Clone</option>\n                            </select>\n                        </div>\n                        <span style=\"display: inline-block; width: 30px;\"></span>";
                output += "\n                        <div style=\"color:black;font-size:12px\"><i>\n                            Gebruik de <b>blauwe</b> pijlen om de volgorde van elementen te wijzigen.<br>\n                            Gebruik het <u>Moeder</u>-veld om een component elders in het schema te hangen.<br>\n                            Kies \"<b>clone</b>\" om een dubbel te maken van een element.\n                        </i></div>";
                break;
        }
        output += '</p>';
        output += '<span style="display: inline-block; width: 30px;"></span>';
        output += '<p style="margin-top: 5px;margin-bottom: 5px;" class="highlight-warning-big">Vergeet niet regelmatig uw werk<br>op te slaan in het "Bestand"-menu.</p>';
        document.getElementById("ribbon").innerHTML = "<div id=\"left-icons\">".concat(output, "</div>");
    };
    // -- Functie om de tree links te tekenen te starten by node met id = myParent --
    Hierarchical_List.prototype.toHTMLinner = function (ordinal) {
        if (this.data[ordinal].collapsed) {
            return ("<tr>\n                        <td bgcolor=\"#8AB2E4\" onclick=\"HLCollapseExpand(".concat(this.data[ordinal].id, ")\" valign= \"top\">&#x229E;</td>\n                        <td width=\"100%\">").concat(this.data[ordinal].toHTML(structure.mode), "<br></td>\n                    </tr>"));
        }
        else {
            return ("<tr>\n                       <td bgcolor=\"C0C0C0\" onclick=\"HLCollapseExpand(".concat(this.data[ordinal].id, ")\" valign= \"top\">&#x229F;</td>\n                       <td width=\"100%\">").concat(this.data[ordinal].toHTML(structure.mode), "<br>").concat(this.toHTML(this.id[ordinal]), "</td>\n                    </tr>"));
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
    /** Functie om de naam van een kring te vinden waartoe een element behoord
     *
    */
    Hierarchical_List.prototype.findKringName = function (my_id) {
        var myOrdinal = this.getOrdinalById(my_id);
        var myParent = this.data[myOrdinal].parent;
        if (myParent == 0) {
            return ("");
        }
        else {
            var myParentOrdinal = this.getOrdinalById(myParent);
            if (myParentOrdinal == null)
                return ("");
            if (this.data[myParentOrdinal].getType() == "Kring") {
                var kringnaam = this.data[myParentOrdinal].props.naam;
                if (kringnaam.trim() != "") {
                    return (this.data[myParentOrdinal].props.naam);
                }
                else {
                    return (this.findKringName(myParent));
                }
            }
            else {
                return (this.findKringName(myParent));
            }
        }
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
var SITPLANVIEW_SELECT_PADDING = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--selectPadding').trim());
var SITPLANVIEW_ZOOMINTERVAL = { MIN: 0.1, MAX: 1000 };
var SITPLANVIEW_DEFAULT_SCALE = 0.7;
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
function PROP_edit_menu(menuItems) { }
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
function HLExpand(my_id) {
    var element = structure.getElectroItemById(my_id);
    if (element !== null) {
        element.expand();
    }
    structure.reSort();
    undostruct.store();
    HLRedrawTree();
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
    document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button>';
}
function HL_changeFilename() {
    var regex = new RegExp('^.*\\.eds$');
    var filename = document.getElementById("filename").value;
    if (regex.test(filename)) {
        structure.properties.setFilename(document.getElementById("filename").value);
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    }
    else {
        structure.properties.setFilename(document.getElementById("filename").value + '.eds');
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    }
}
function HL_enterSettings() {
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + structure.properties.filename + '" pattern="^.*\\.eds$"><br><i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}
function HLRedrawTreeHTML() {
    toggleAppView('2col');
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
        + '<div id="EDS">' + flattenSVGfromString(structure.toSVG(0, "horizontal").data, 10) + '</div>'
        + '<h2>Legende:</h2>'
        + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
        + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
        + '<i><br><small>Versie: ' + CONF_builddate
        + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">Terms</a></small></i><br><br>';
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
    if (structure != null)
        structure.dispose();
    structure = new Hierarchical_List();
    buildNewStructure(structure);
    topMenu.selectMenuItemByName('Eéndraadschema');
    undostruct.clear();
    undostruct.store();
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
    strleft = strleft.replace(/Bewerken/g, "Eéndraadschema");
    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
}
function restart_all() {
    var strleft = CONFIGPAGE_LEFT;
    strleft +=
        "\n      Hoofddifferentieel (in mA) <input id=\"differentieel_droog\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"300\"><br><br>\n      Hoofdzekering (in A) <input id=\"hoofdzekering\" type=\"text\" size=\"4\" maxlength=\"4\" value=\"65\"><br><br>\n      Aantal fazen:\n      <select id=\"aantal_fazen_droog\"><option value=\"2\">2p</option><option value=\"3\">3p</option><option value=\"4\">4p (3p+n)</option></select>";
    strleft += CONFIGPAGE_RIGHT;
    strleft += PROP_getCookieText(); //Will only be displayed in the online version
    strleft += PROP_development_options();
    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
    if (browser_ie_detected()) {
        alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}
function toggleAppView(type) {
    var lastview = structure.properties.currentView;
    if ((structure.sitplanview != null) && (structure.sitplanview.contextMenu != null))
        structure.sitplanview.contextMenu.hide();
    structure.properties.currentView = type;
    if (type === '2col') {
        document.getElementById("configsection").innerHTML = '';
        document.getElementById("configsection").style.display = 'none';
        document.getElementById("outerdiv").style.display = 'none';
        document.getElementById("ribbon").style.display = 'flex';
        document.getElementById("canvas_2col").style.display = 'flex';
        structure.updateRibbon();
    }
    else if (type === 'config') {
        document.getElementById("configsection").style.display = 'block';
        document.getElementById("outerdiv").style.display = 'none';
        document.getElementById("ribbon").innerHTML = ''; // Voor performance redenen
        document.getElementById("ribbon").style.display = 'none';
        document.getElementById("left_col_inner").innerHTML = ''; // Voor performance redenen
        // We zetten bewist het SVG element EDS niet op nul want is nodig voor het print-voorbeeld
        document.getElementById("canvas_2col").style.display = 'none';
    }
    else if (type === 'draw') {
        document.getElementById("configsection").innerHTML = "";
        document.getElementById("configsection").style.display = 'none';
        document.getElementById("outerdiv").style.display = 'flex';
        document.getElementById("ribbon").style.display = 'flex';
        document.getElementById("left_col_inner").innerHTML = ''; // Voor performance redenen
        if (document.getElementById("EDSSVG") !== null)
            document.getElementById("EDSSVG").innerHTML = ''; // Deze is nodig anders wil het situatieschema het patroon VerticalStripe niet laden wegens dubbel gedefinieerd
        // We maken de EDSSVG leeg en niet de EDS-DIV want anders onthoudt de browser de positie van de scrollbars niet
        document.getElementById("canvas_2col").style.display = 'none';
    }
    if ((['2col', 'draw'].includes(type)) && (['2col', 'draw'].includes(lastview)) && (type !== lastview))
        undostruct.store();
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
    if ((structure.sitplanview != null) && (structure.sitplanview.contextMenu != null))
        structure.sitplanview.contextMenu.hide();
    undostruct.undo();
}
function redoClicked() {
    if ((structure.sitplanview != null) && (structure.sitplanview.contextMenu != null))
        structure.sitplanview.contextMenu.hide();
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
var appDocStorage = new MultiLevelStorage('appDocStorage', {});
// Configure the app-zone in the HTML
document.getElementById('svgdefs').innerHTML =
    '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
        '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
        '</pattern>';
// Build the menu
var menuItems;
menuItems = [
    { name: 'Nieuw', callback: restart_all },
    { name: 'Bestand', callback: showFilePage },
    { name: 'Eéndraadschema', callback: HLRedrawTree },
    { name: 'Situatieschema', callback: showSituationPlanPage },
    { name: 'Print', callback: printsvg },
    { name: 'Documentatie', callback: showDocumentationPage },
    { name: 'Info/Contact', callback: openContactForm }
];
PROP_edit_menu(menuItems);
var topMenu = new TopMenu('minitabs', 'menu-item', menuItems);
// Download a default structure
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
                if (item === 'kortsluitvermogen')
                    structure.updateHTMLinner(my_id);
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
