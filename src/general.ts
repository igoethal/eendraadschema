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

export function svgTextWidth(input:String, fontsize:Number = 10, options:String = '') {
    const div = document.createElement('div');
    div.innerHTML = '<svg width="1000" height="20"><text x="0" y="10" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="' + Number(fontsize) + '" ' + options + '>' + input + '</text></svg>';
    
    let tryoutdiv: HTMLElement = document.body;
    
    tryoutdiv.appendChild(div);
    const width = (div.children[0].children[0] as SVGGraphicsElement).getBBox().width;
    tryoutdiv.removeChild(div);
    return(Math.ceil(width));
}

export function contains(a, obj) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
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

/**
 * Toont een popup met een vraag en een dropdown lijst met opties.
 * De gebruiker kan kiezen tussen "OK" of "Annuleer".
 * 
 * @param question - De vraag om af te beelden in de popup.
 * @param options - An array van strings met de opties in de dropdown lijst.
 * @returns A promise that resolves to the selected option string, or null if cancelled.
 */

export async function showSelectPopup(
  question: string,
  options: string[]
): Promise<string | null> {
  return new Promise((resolve) => {
    const popupOverlay = document.createElement("div");
    Object.assign(popupOverlay.style, {
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center', alignItems: 'center',
      visibility: 'hidden',
      zIndex: 9999
    });
    document.body.appendChild(popupOverlay);

    const popup = document.createElement("div");
    Object.assign(popup.style, {
      backgroundColor: "white", border: "1px solid #ccc", padding: "20px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
    });
    popupOverlay.appendChild(popup);

    const questionAndSelect = document.createElement("div");
    questionAndSelect.style.display = "flex";
    questionAndSelect.style.alignItems = "center";

    const questionElem = document.createElement("p");
    questionElem.textContent = question;
    questionAndSelect.appendChild(questionElem);

    const selectElem = document.createElement("select");
    options.forEach((option) => {
      const optionElem = document.createElement("option");
      optionElem.value = option;
      optionElem.textContent = option;
      selectElem.appendChild(optionElem);
    });
    selectElem.style.marginLeft = "10px";
    questionAndSelect.appendChild(selectElem);

    popup.appendChild(questionAndSelect);

    const buttonBar = document.createElement("div");
    Object.assign(buttonBar.style, {
      display: "flex", justifyContent: "center", marginTop: "10px"
    });

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.marginRight = "10px";
    buttonBar.appendChild(okButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Annuleren";
    buttonBar.appendChild(cancelButton);

    popup.appendChild(buttonBar);

    okButton.addEventListener("click", () => {
      const selectedValue = selectElem.value;
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.removeChild(popup);
      document.body.removeChild(popupOverlay);
      resolve(selectedValue);
    });

    cancelButton.addEventListener("click", () => {
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.removeChild(popup);
      document.body.removeChild(popupOverlay);
      resolve(null);
    });

    popupOverlay.style.visibility = 'visible';
  });
}

function flattenSVG(SVGstruct,shiftx,shifty,node,overflowright=0) {

  if (node==0) globalThis.structure.print_table.pagemarkers.clear();
  
  var str:string = "";

  var X = new XMLSerializer()
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
      str = str.concat(flattenSVG(SVGstruct.children[i],shiftx,shifty,node+1),"\n");
    }
    if (node <= 0) {
      if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
        str = '<svg id="EDSSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" width="' + (parseInt(outstruct.attributes.getNamedItem("width").nodeValue)+overflowright)  +
                    '" height="' + (outstruct.attributes.getNamedItem("height").nodeValue) + '">' + str + '</svg>';
      } else {
        str = '<svg>' + str + '</svg>';
      }
    }
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

  globalThis.structure.print_table.pagemarkers.addMarker(node,shiftx);

  return str;
}

export function flattenSVGfromString(xmlstr, overflowright: number = 0) {
  var str:string = "";
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
  str = flattenSVG(xmlDoc.childNodes[0],0,0,0,overflowright);
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