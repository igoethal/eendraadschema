import type { MarkerList } from "./print/MarkerList";

export function htmlspecialchars(my_input) {
    let returnstr:string;
    if (typeof(my_input) == 'undefined') returnstr = ""; else returnstr=my_input.toString();

    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return returnstr.replace(/[&<>"']/g, function(m) {return map[m];});
}

export const isFirefox = (function () {
  let cachedResult = null;

  // return function() { return false; }; // Default to false for non-Firefox browsers

  return function () {
    if (cachedResult !== null) {
      return cachedResult;
    }

    // Primary detection using Firefox-specific object
    if ("InstallTrigger" in window) {
      cachedResult = true;
    } else {
      // Fallback to user agent sniffing
      cachedResult = navigator.userAgent.toLowerCase().includes('firefox');
    }

    return cachedResult;
  };
})();

export const svgTextWidth = (() => {
  const cache: Record<string, number> = {};

  return (input: string, fontsize: number = 10, options: string = ''): number => {
    const key = `${input}|${fontsize}|${options}`;
    if (key in cache) {
      return cache[key];
    }

    const div = document.createElement('div');
    div.innerHTML = `<svg width="1000" height="20"><text x="0" y="10" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="${fontsize}" ${options}>${input}</text></svg>`;

    document.body.appendChild(div);
    const width = (div.children[0].children[0] as SVGGraphicsElement).getBBox().width;
    document.body.removeChild(div);

    cache[key] = Math.ceil(width);
    return cache[key];
  };
})();

export function insertArrow(textColor: string = "black"): string {
  return `
    <div style="display:inline-block; width:1em; height:1em; vertical-align:middle;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="100%" height="100%">
        <path d="M4 11h12M4 11L4 4M16 11L11 6M16 11L11 16" stroke="${textColor}" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

export function contains(a, obj) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

// A function to trim a string.  If it is not a string, attempt to convert to string first. If conversion is not possible, return an empty string.
export function trimString(str: any): string {
  if (str == null || typeof str === 'undefined') {
    return '';
  }
  if (typeof str !== 'string') {
    try {
      str = String(str);
    } catch {
      return '';
    }
  }
  return str.trim();
}

export function deepClone (obj) {
    let _out = new obj.constructor;

    let getType = function (n) {
        return Object.prototype.toString.call(n).slice(8, -1);
    }

    for (let _key in obj) {
        if (obj.hasOwnProperty(_key)) {
            _out[_key] = getType(obj[_key]) === 'Object' || getType(obj[_key]) === 'Array' ? deepClone(obj[_key]) : obj[_key];
        }
    }
    return _out;
}

export const randomId = (() => {
  const counters: Record<string, number> = {};
  
  return (prefix: string = "Rnd_"): string => {
      if (!(prefix in counters)) {
          counters[prefix] = 0;
      }
  
      const value = counters[prefix];
      counters[prefix]++;
      
      return `${prefix}${value.toString()}`;
  };
})();


function flattenSVG(
  SVGstruct,
  shiftx,
  shifty,
  node,
  overflowright = 0,
  pageMarkers: MarkerList | null = null,
) {

  if (node === 0) pageMarkers?.clear();
  
  var str:string = "";

  var X = new XMLSerializer()
  var parser = new DOMParser();
  var forceNewPage: boolean = false;

  var outstruct = SVGstruct;
  if (SVGstruct.localName == "svg") {
    if (outstruct.attributes.getNamedItem("newPage")) {
      forceNewPage = true;
    }
    if (outstruct.attributes.getNamedItem("x")) { // make SVG a 0,0 element
      shiftx += parseFloat(outstruct.attributes.getNamedItem("x").nodeValue);
      outstruct.attributes.getNamedItem("x").nodeValue = 0;
    }
    if (outstruct.attributes.getNamedItem("y")) { // make SVG a 0,0 element
      shifty += parseFloat(outstruct.attributes.getNamedItem("y").nodeValue);
      outstruct.attributes.getNamedItem("y").nodeValue = 0;
    }
    for (var i = 0; i < SVGstruct.children.length; i++) {
      str = str.concat(flattenSVG(
        SVGstruct.children[i],
        shiftx,
        shifty,
        node + 1,
        0,
        pageMarkers,
      ),"\n");
    }
    const schemaItemId = outstruct.attributes.getNamedItem("data-schema-item-id")?.nodeValue;
    if (node > 0 && schemaItemId !== undefined) {
      const anchorY = parseFloat(outstruct.attributes.getNamedItem("data-schema-anchor-y")?.nodeValue ?? "0");
      const endX = parseFloat(outstruct.attributes.getNamedItem("data-schema-end-x")?.nodeValue ?? "0");
      const topX = parseFloat(outstruct.attributes.getNamedItem("data-schema-top-x")?.nodeValue ?? "0");
      const topY = parseFloat(outstruct.attributes.getNamedItem("data-schema-top-y")?.nodeValue ?? "0");
      const width = parseFloat(outstruct.attributes.getNamedItem("data-schema-width")?.nodeValue ?? "0");
      const height = parseFloat(outstruct.attributes.getNamedItem("data-schema-height")?.nodeValue ?? "0");
      str = `<g data-schema-item-id="${schemaItemId}" data-schema-x="${shiftx}" data-schema-y="${shifty}" data-schema-width="${width}" data-schema-height="${height}" data-schema-anchor-x="${shiftx}" data-schema-anchor-y="${shifty + anchorY}" data-schema-end-x="${shiftx + endX}" data-schema-top-x="${shiftx + topX}" data-schema-top-y="${shifty + topY}">${str}</g>`;
    }
    if (node <= 0) {
      if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
        str = '<svg id="EDSSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" width="' + (parseInt(outstruct.attributes.getNamedItem("width").nodeValue)+overflowright)  +
                    '" height="' + (outstruct.attributes.getNamedItem("height").nodeValue) + '">' + str + '</svg>';
      } else {
        str = '<svg>' + str + '</svg>';
      }
    }
  } else if (SVGstruct.localName == "g") {
    // Unlike <svg>, a <g> establishes no coordinate system of its own, so its
    // drawable descendants (e.g. the omschakelaar's self-contained <g>) still
    // need the shift accumulated so far. Recurse instead of serializing
    // verbatim, and shift any zero-size schema-anchor attributes carried
    // directly on the <g> itself (used for port/insertion anchors).
    if (shiftx != 0) {
      for (const attrName of ["data-schema-anchor-x", "data-schema-end-x"]) {
        const attr = outstruct.attributes.getNamedItem(attrName);
        if (attr) attr.nodeValue = String(parseFloat(attr.nodeValue) + shiftx);
      }
    }
    if (shifty != 0) {
      const attr = outstruct.attributes.getNamedItem("data-schema-anchor-y");
      if (attr) attr.nodeValue = String(parseFloat(attr.nodeValue) + shifty);
    }
    var innerG = "";
    for (var gi = 0; gi < SVGstruct.children.length; gi++) {
      innerG = innerG.concat(flattenSVG(
        SVGstruct.children[gi],
        shiftx,
        shifty,
        node + 1,
        0,
        pageMarkers,
      ), "\n");
    }
    var openTagG = X.serializeToString(outstruct.cloneNode(false))
      .replace(/\/>\s*$/, ">")
      .replace(/xmlns="[^"]+"/g, '');
    str = openTagG + innerG + "</g>";
  } else {
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
        } else {
          outstruct.attributes.getNamedItem("transform").value = "scale(-1,1) translate(-" +
          outstruct.attributes.getNamedItem("x").nodeValue*2 + ",0)";
        }
      }
    }
    if (SVGstruct.localName == "polygon") {
      var polystr_out = "";
      var polystr_in = outstruct.attributes.getNamedItem("points").nodeValue;
      var splitted_in = polystr_in.split(" ");
      for (let countstr = 0; countstr < splitted_in.length; countstr++) {
        let points_in = splitted_in[countstr].split(",");
        polystr_out += (points_in[0]*1+shiftx) + ',' + (points_in[1]*1+shifty);
        if (countstr < splitted_in.length-1) { polystr_out += ' ' }
      }
      outstruct.attributes.getNamedItem("points").nodeValue = polystr_out;
    }
    str = X.serializeToString(outstruct);

    //remove all the xmlns tags
    var regex = /xmlns="[^"]+"/g;
    str = str.replace(regex, '');
  }

  pageMarkers?.addMarker(node, shiftx, forceNewPage);

  return str;
}

export function flattenSVGfromString(
  xmlstr,
  overflowright: number = 0,
  pageMarkers: MarkerList | null = null,
) {
  var str:string = "";
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
  str = flattenSVG(xmlDoc.childNodes[0], 0, 0, 0, overflowright, pageMarkers);
  return str;
}

/**
 * Returns true if the current mode is a development mode.
 * This is determined by the presence of a 'dev' parameter in the URL.
 *
 * @returns {boolean} True if this is a development mode, false otherwise.
 */

export function isDevMode(): boolean {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('dev');
    } catch (error) {
        console.error('Error checking for dev mode:', error);
        return false;
    }
}
export function isInt(value) {
  return !isNaN(value) &&
         parseInt(value) == value &&
         !isNaN(parseInt(value, 10));
}

export function browser_ie_detected() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');


    if ( (msie > 0) || (trident > 0) ) return true; else return false;
}

// I need a function that takes a floating point number as an input and transforms it into a string with a meaninful number of decimals like excel would do.
// the easiest is probably to first round to 6 decimals and then remove all trailing zeros and the dot if it is the last character
export function formatFloat(value: number, decimals: number = 6): string {
    if (isNaN(value) || !isFinite(value)) return "";

    // Ensure decimals is an integer
    decimals = Math.floor(decimals);

    // Round to the specified number of decimal places
    let roundedValue = Math.round(value * 10**decimals) / (10**decimals);

    // Convert to string and remove trailing zeros
    let strValue = roundedValue.toString();
    
    // Remove trailing zeros and dot if necessary
    strValue = strValue.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');

    return strValue;
}

/**
 * Converts a string to a floating point number, handling both dot and comma as decimal separators.
 * First attempts conversion with dot as decimal separator, then with comma if that fails.
 * 
 * @param str - The string to convert to a number
 * @returns The parsed number, or NaN if conversion fails
 */
export function parseLocaleFloat(str: string): number {
    if (typeof str !== 'string' || str.trim() === '') {
        return NaN;
    }

    const trimmed = str.trim();
    
    // First try with dot as decimal separator (standard)
    let result = parseFloat(trimmed);
    if (!isNaN(result) && !trimmed.includes(',')) {
        return result;
    }
    
    // If the string contains a comma, try replacing comma with dot and parse again
    if (trimmed.includes(',')) {
        const withDot = trimmed.replace(',', '.');
        result = parseFloat(withDot);
        return result; // Will be NaN if this also fails
    }
    
    return result; // Return the original result (could be NaN)
}
