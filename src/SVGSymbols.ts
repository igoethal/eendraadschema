class SVGSymbols {

    static neededSymbols: string[] = [];

    static addSymbol(symbol: string) {
        if (!this.neededSymbols.includes(symbol)) {
            this.neededSymbols.push(symbol);
        }
    }

    static clearSymbols() {
        this.neededSymbols = [];
    }

    static getNeededSymbols() {
        let output: string =  '<defs>';
      
        if (this.neededSymbols.includes('VerticalStripe')) {
            output += '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
                            '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
                      '</pattern>';
        }
     
        for (let key in this.data) {
            if (this.neededSymbols.includes(key)) {
                output += `<g id="${key}">${this.data[key].replace(/\n/g, '')}</g>`;
            }
        }
        output += '</defs>';
        return(output);
    }

    static outputSVGSymbols() {
        let output: string =  '<defs>' +
                                  '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
                                      '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
                                  '</pattern>';
        for (let key in this.data) {
            if (key != 'VerticalStripe') output += `<g id="${key}">${this.data[key].replace(/\n/g, '')}</g>`;
        }
        output += '</defs>';
        return(output);
    }

static data = {

batterij: `
<rect x="0" y="-12" width="40" height="27" stroke="black" fill="none"/>
<rect x="5" y="-15" width="10" height="3" stroke="black" fill="none"/>
<rect x="25" y="-15" width="10" height="3" stroke="black" fill="none"/>
<line x1="8" y1="-5" x2="12" y2="-5" stroke="black"/>
<line x1="10" y1="-7" x2="10" y2="-3" stroke="black"/>
<line x1="28" y1="-5" x2="32" y2="-5" stroke="black"/>
`,
contactdoos: `
<path d="M20 0 A15 15 0 0 1 35 -15" stroke="black" fill="none" stroke-width="2" />
<path d="M20 0 A15 15 0 0 0 35 15" stroke="black" fill="none" stroke-width="2" />
<line x1="0" y1="0" x2="20" y2="0" stroke="black" />
`,
deurslot: `
<line x1="1" y1="-15" x2="31" y2="-15" stroke="black"/>
<line x1="1" y1="15"  x2="46" y2="15" stroke="black"/>
<line x1="1" y1="-15" x2="1" y2="15" stroke="black"/>
<line x1="31" y1="-15" x2="46" y2="15" stroke="black"/>
<path d="M 7 3 A 6 6 0 0 1 19 3 A 6 6 0 0 1 31 3" stroke="black" fill="none" />
`,
ster: `
<line x1="0" y1="-5" x2="0" y2="5" style="stroke:black" />
<line x1="-4.33" y1="-2.5" x2="4.33" y2="2.5" style="stroke:black" />
<line x1="-4.66" y1="2.5" x2="4.33" y2="-2.5" style="stroke:black" />
`,
EVlader: `
<rect x="0" y="13" width="40" height="7" fill="none" style="stroke:black" />
<line x1="0" y1="0" x2="7" y2="0" style="stroke:black" />
<line x1="7" y1="-20" x2="7" y2="13" style="stroke:black" />
<line x1="33" y1="-20" x2="33" y2="13" style="stroke:black" />
<line x1="7" y1="-20" x2="33" y2="-20" style="stroke:black" />
<rect x="10" y="-17" width="20" height="8" fill="none" style="stroke:black" />
<line x1="20" y1="-6" x2="20" y2="10" style="stroke:black" />
<line x1="33" y1="-6" x2="36" y2="-6" style="stroke:black" />
<line x1="36" y1="-6" x2="36" y2="4" style="stroke:black" />
<line x1="36" y1="4" x2="39" y2="4" style="stroke:black" />
<line x1="39" y1="4" x2="39" y2="-15" style="stroke:black" />
<line x1="39" y1="-6" x2="39" y2="-15" style="stroke:black;stroke-width:2" />
<text x="15" y="1" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="6">V</text>
<text x="25" y="1" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="6">E</text>
<text x="15" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="6">E</text>
<text x="25" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="6">V</text>
`,
lamp: `
<line x1="-10.61" y1="-10.61" x2="10.61" y2="10.61" stroke="black" stroke-width="2" />
<line x1="-10.61" y1="10.61" x2="10.61" y2="-10.61" stroke="black" stroke-width="2" />
`,
led: `
<line x1="0" y1="-7" x2="0" y2="7" stroke="black" stroke-width="2" />
<line x1="0" y1="-7" x2="12" y2="0" stroke="black" stroke-width="2" />
<line x1="0" y1="7" x2="12" y2="0" stroke="black" stroke-width="2" />
<line x1="12" y1="-7" x2="12" y2="7" stroke="black" stroke-width="2" />
<line x1="6" y1="-6" x2="7" y2="-11" stroke="black" stroke-width="1" />
<line x1="7" y1="-11" x2="8.11" y2="-9.34" stroke="black" stroke-width="1" />
<line x1="7" y1="-11" x2="5.34" y2="-9.9" stroke="black" stroke-width="1" />
<line x1="9" y1="-6" x2="10" y2="-11" stroke="black" stroke-width="1" />
<line x1="10" y1="-11" x2="11.11" y2="-9.34" stroke="black" stroke-width="1" />
<line x1="10" y1="-11" x2="8.34" y2="-9.9" stroke="black" stroke-width="1" />
`,
luidspreker: `
<polygon points="0,-10 7,-10 17,-20 17,20 7,10 0,10" fill="none" stroke="black"/>
<line x1="7" y1="-10" x2="7" y2="10" stroke="black" stroke-width="1" />
`,
magneetcontact: `
<rect x="0" y="-10" width="20" height="20" fill="black" stroke="black"/>
`,
sinus: `
<path d="M0,0 C2,-5 8,-5 10,0 S18,5 20,0" style="stroke:black;fill:none" />
`,
spot: `
<path d="M0 0 A10 10 0 0 1 10 -10" stroke="black" fill="white" stroke-width="1" />
<path d="M0 0 A10 10 0 0 0 10 10" stroke="black" fill="white" stroke-width="1" />
<circle cx="10" cy="0" r="6" style="stroke:black;fill:white" />
<line x1="5.76" x2="14.24" y1="-4.24" y2="4.24" stroke="black" stroke-width="1" />
<line x1="5.76" x2="14.24" y1="4.24" y2="-4.24" stroke="black" stroke-width="1" />
`,
noodlamp_decentraal: `
<rect x="-10.61" y="-10.61" width="21.22" height="21.22" fill="white" stroke="black" />
<circle cx="0" cy="0" r="5" style="stroke:black;fill:black" />
<line x1="-7" y1="-7" x2="7" y2="7" stroke="black" stroke-width="2" />
<line x1="-7" y1="7" x2="7" y2="-7" stroke="black" stroke-width="2" />
`,
signalisatielamp: `
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
<line x1="-3" y1="-3" x2="3" y2="3" stroke="black" />
<line x1="-3" y1="3" x2="3" y2="-3" stroke="black" />
`,
schakelaar_enkel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_klein: `
<line x1="0" y1="0" x2="6" y2="-12" stroke="black" />
<line x1="6" y1="-12" x2="9" y2="-10.5" stroke="black" />
<circle cx="0" cy="0" r="3" fill="white" stroke="black" />
`,
schakelaar_dubbel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_trippel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
<line x1="6" y1="-12" x2="11" y2="-9.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_wissel_enkel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
<line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_rolluik: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
<line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
<rect x="-8" y="-8" width="16" height="16" fill="white" stroke="black" />
<text x="0" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16">S</text>
`,
schakelaar_enkel_dim: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
<polygon points="-1,-8 11,-8 11,-15" fill="black" stroke="black" />
`,
schakelaar_wissel_dim: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
<line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
<polygon points="-1,-8 11,-8 11,-15" fill="black" stroke="black" />
`,
schakelaar_kruis_enkel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
<line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
<line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="10" y2="20" stroke="black" />
<line x1="10" y1="20" x2="15" y2="17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_dubbelaansteking: `
<line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
<line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
schakelaar_wissel_dubbel: `
<line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
<line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
<line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
<line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
<line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
<line x1="-8" y1="16" x2="-13" y2="13.5" stroke="black" />
<circle cx="0" cy="0" r="5" fill="white" stroke="black" />
`,
aansluitpunt: `
<circle cx="5" cy="0" r="5" style="stroke:black;fill:none" />
`,
aftakdoos: `
<circle cx="15" cy="0" r="15" style="stroke:black;fill:none" />
<circle cx="15" cy="0" r="7.5" style="stroke:black;fill:black" />
`,
bewegingsschakelaar: `
<rect x="0" y="-13" width="10" height="26" fill="none" style="stroke:black" />
<rect x="10" y="-13" width="30" height="26" fill="none" style="stroke:black" />
<line x1="10" y1="13" x2="40" y2="-13"  stroke="black" />
<line x1="15" y1="-5" x2="20" y2="-5"  stroke="black" />
<line x1="20" y1="-10" x2="20" y2="-5"  stroke="black" />
<line x1="20" y1="-10" x2="25" y2="-10"  stroke="black" />
<text x="22" y="11" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">PIR</text>
`,
schakelaar: `
<line x1="0" y1="0" x2="5" y2="0"  stroke="black" />
<line x1="5" y1="0" x2="35" y2="-10"  stroke="black" />
<line x1="35" y1="0" x2="40" y2="0"  stroke="black" />
`,
schemerschakelaar: `
<line x1="0" y1="0" x2="5" y2="0"  stroke="black" />
<line x1="5" y1="0" x2="35" y2="-10"  stroke="black" />
<line x1="35" y1="0" x2="40" y2="0"  stroke="black" />
<use xlink:href="#arrow" x="14" y="-17" transform="rotate(90 14 -17)" />
<use xlink:href="#arrow" x="18" y="-17" transform="rotate(90 18 -17)" />
`,
stoomoven: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<path d="M 6 -2 A 7 5 0 0 1 13 -7 A 7 5 0 0 1 27 -7 A 7 5 0 0 1 33 -2" stroke="black" fill="none" />
<path d="M 6  5 A 7 5 0 0 1 13  0 A 7 5 0 0 1 27  0 A 7 5 0 0 1 33  5" stroke="black" fill="none" />
<path d="M 6 12 A 7 5 0 0 1 13  7 A 7 5 0 0 1 27  7 A 7 5 0 0 1 33 12" stroke="black" fill="none" />
`,
contactdoos_aarding: `
<line x1="20" y1="-15" x2="20" y2="15"  stroke="black" stroke-width="2" />
`,
contactdoos_kinderveilig: `
<line x1="35" y1="-20" x2="35" y2="-14.1"  stroke="black" stroke-width="2" />
<line x1="35" y1="20" x2="35" y2="14.1"  stroke="black" stroke-width="2" />
`,
bel: `
<path d="M20 0 A15 15 0 0 1 0 15" stroke="black" fill="none" stroke-width="2" />
<path d="M20 0 A15 15 0 0 0 0 -15" stroke="black" fill="none" stroke-width="2" />
<line x1="0" y1="15" x2="0" y2="-15" stroke="black" stroke-width="2" />
`,
boiler: `
<circle cx="20" cy="0" r="20" style="stroke:black; fill:url(#VerticalStripe);" />
`,
boiler_accu: `
<circle cx="20" cy="0" r="20" style="stroke:black;fill:none" />
<circle cx="20" cy="0" r="15" style="stroke:black;fill:url(#VerticalStripe)" />
`,
motor: `
<circle cx="20" cy="0" r="20" style="stroke:black;fill:none" />
<text x="20" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16">M</text>
`,
elektriciteitsmeter: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="-6" x2="40" y2="-6" stroke="black" stroke-width="1" />
<text x="20" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12">kWh</text>
`,
diepvriezer: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<use xlink:href="#ster" x="10" y="0" />
<use xlink:href="#ster" x="20" y="0" />
<use xlink:href="#ster" x="30" y="0" />
`,
zonnepaneel: `
<rect x="0" y="-20" width="50" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="0" x2="50" y2="0" stroke="black" />
<use xlink:href="#arrow" x="5" y="-12" transform="rotate(45 5 -10)" />
<use xlink:href="#arrow" x="10" y="-14" transform="rotate(45 10 -14)" />
`,
zonnepaneel_driehoek: `
<rect x="0" y="-20" width="50" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="-20" x2="20" y2="0" stroke="black" />
<line x1="0" y1="20" x2="20" y2="0" stroke="black" />
`,
drukknop_klein: `
<circle cx="8" cy="0" r="7" style="stroke:black;fill:none" />
<circle cx="8" cy="0" r="4" style="stroke:black;fill:none" />
`,
draadloos_klein: `
<path d="M 10 -7 A 10 10 0 0 1 10 7" stroke="black" fill="none" /> 
<path d="M 7 -5 A 8 8 0 0 1 7 5" stroke="black" fill="none" /> 
<path d="M 4 -3 A 6 6 0 0 1 4 3" stroke="black" fill="none" /> 
`,
detectie_klein: `
<path d="M 10 -7 A 10 10 0 0 1 10 7" stroke="black" fill="none" /> 
<path d="M 5 -7 A 10 10 0 0 1 5 7" stroke="black" fill="none" /> 
`,
drukknop: `
<circle cx="12" cy="0" r="12" style="stroke:black;fill:none" />
<circle cx="12" cy="0" r="7" style="stroke:black;fill:none" />
`,
teleruptor: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<line x1="8" y1="6" x2="16" y2="6"  stroke="black" />
<line x1="24" y1="6" x2="32" y2="6"  stroke="black" />
<line x1="16" y1="-6" x2="16" y2="6"  stroke="black" />
<line x1="24" y1="-6" x2="24" y2="6"  stroke="black" />
`,
dimmer: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<line x1="10" y1="5" x2="30" y2="5"  stroke="black" />
<line x1="10" y1="5" x2="10" y2="-5"  stroke="black" />
<line x1="10" y1="-5" x2="30" y2="5"  stroke="black" />
`,
relais: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<line x1="10" y1="-13" x2="30" y2="13"  stroke="black" />
`,
minuterie: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<text x="20" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="16">t</text>
`,
thermostaat: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<circle cx="20" cy="0" r="8" style="stroke:black;fill:none" />
<line x1="12" y1="0" x2="28" y2="0"  stroke="black" />
`,
tijdschakelaar: `
<rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
<circle cx="11" cy="0" r="8" style="stroke:black;fill:none" />
<line x1="10" y1="0"  x2="17" y2="0"  stroke="black" />
<line x1="11" y1="-6" x2="11" y2="1"  stroke="black" />
<line x1="21" y1="0"  x2="25" y2="0"  stroke="black" />
<line x1="25" y1="0"  x2="31" y2="-5"  stroke="black" />
<line x1="31" y1="0"  x2="36" y2="0"  stroke="black" />
`,
tijdschakelaar_klein: `
<circle cx="8" cy="0" r="7" style="stroke:black;fill:none" />
<line x1="7" y1="0"  x2="13" y2="0"  stroke="black" />
<line x1="8" y1="-5" x2="8" y2="1"  stroke="black" />
`,
droogkast: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<circle cx="15" cy="-7.5" r="5" style="stroke:black;fill:none" />
<circle cx="25" cy="-7.5" r="5" style="stroke:black;fill:none" />
<circle cx="20" cy="7.5" r="3" style="stroke:black;fill:black" />
`,
omvormer: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="20" x2="40" y2="-20" stroke="black" />
<use xlink:href="#sinus" x="5" y="-12" />"
<line x1="20" y1="10" x2="35" y2="10" stroke="black" />
<line x1="20" y1="13" x2="35" y2="13" stroke="black" stroke-dasharray="3" />
`,
overspanningsbeveiliging: `
<rect x="0" y="-15" width="15" height="30" fill="none" style="stroke:black" />
<line x1="7.5" y1="-18" x2="7.5" y2="-5" stroke="black" />
<line x1="7.5" y1="-5" x2="4.5" y2="-9" stroke="black" />
<line x1="7.5" y1="-5" x2="10.5" y2="-9" stroke="black" />
<line x1="7.5" y1="18" x2="7.5" y2="5" stroke="black" />
<line x1="7.5" y1="5" x2="4.5" y2="9" stroke="black" />
<line x1="7.5" y1="5" x2="10.5" y2="9" stroke="black" />
`,
koelkast: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<use xlink:href="#ster" x="20" y="0" />"
`,
kookfornuis: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<circle cx="10" cy="10" r="3" style="stroke:black;fill:black" />
<circle cx="30" cy="10" r="3" style="stroke:black;fill:black" />
<circle cx="30" cy="-10" r="3" style="stroke:black;fill:black" />
`,
microgolf: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<use xlink:href="#sinus" x="10" y="-10" />"
<use xlink:href="#sinus" x="10" y="0" />"
<use xlink:href="#sinus" x="10" y="10" />"
`,
oven: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="-5" x2="40" y2="-5" stroke="black" />
<circle cx="20" cy="7.5" r="3" style="stroke:black;fill:black" />
`,
usblader: `
<rect x="0" y="-15" width="60" height="30" fill="none" style="stroke:black" />
<circle cx="12" cy="-5" r="5" style="stroke:black;fill:none" />
<circle cx="19" cy="-5" r="5" style="stroke:black;fill:none" />
<text x="15" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="8">AC/DC</text>
<text x="42" y="4" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="11">USB</text>
`,
vaatwasmachine: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<line x1="0" y1="-20" x2="40" y2="20" style="stroke:black;fill:none" />
<line x1="40" y1="-20" x2="0" y2="20" style="stroke:black;fill:none" />
<circle cx="20" cy="0" r="8" style="stroke:black;fill:white" />
`,
ventilator: `
<rect x="0" y="-15" width="30" height="30" fill="none" style="stroke:black" />
<circle cx="10" cy="0" r="5" style="stroke:black;fill:none" />
<circle cx="20" cy="0" r="5" style="stroke:black;fill:none" />
`,
transformator: `
<circle cx="8" cy="0" r="8" style="stroke:black;fill:none" />
<circle cx="20" cy="0" r="8" style="stroke:black;fill:none" />
`,
verwarmingstoestel: `
<rect x="0" y="-15" width="50" height="30" fill="url(#VerticalStripe)" style="stroke:black" />
`,
verwarmingstoestel_accu: `
<rect x="0" y="-15" width="50" height="30" fill="none" style="stroke:black" />
<rect x="5" y="-10" width="40" height="20" fill="url(#VerticalStripe)" style="stroke:black" />
`,
verwarmingstoestel_accu_ventilator: `
<rect x="0" y="-15" width="70" height="30" fill="none" style="stroke:black" />
<rect x="5" y="-10" width="35" height="20" fill="url(#VerticalStripe)" style="stroke:black" />
<circle cx="50" cy="0" r="5" style="stroke:black;fill:none" />
<circle cx="60" cy="0" r="5" style="stroke:black;fill:none" />
`,
verbruiker: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
`,
wasmachine: `
<rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
<circle cx="20" cy="0" r="3" style="stroke:black;fill:black" />
<circle cx="20" cy="0" r="15" style="stroke:black;fill:none" />
`,
zekering_automatisch: `
<g transform="rotate(-20)">
<line x1="0" y1="-30" x2="0" y2="0"  stroke="black" />
<rect x="-4" y="-30" width="4" height="10" style="fill:black" />
</g>
`,
zekering_automatisch_horizontaal: `
<g transform="rotate(-20)">
<line x1="0" y1="0" x2="30" y2="0"  stroke="black" />
<rect x="20" y="-4" height="4" width="10" style="fill:black" />
</g>
`,
zekering_smelt: `
<rect x="-4" y="-30" width="8" height="30" style="stroke:black;fill:none" />
<line x1="0" y1="-30" x2="0" y2="0" stroke="black" />
`,
zekering_smelt_horizontaal: `
<rect x="0" y="-4" height="8" width="30" style="stroke:black;fill:none" />
<line x1="0" y1="0" x2="30" y2="0" stroke="black" />
`,
relais_kring: `
<rect x="-8" y="-30" width="16" height="30" style="stroke:black;fill:none" />
<line x1="8" y1="-22.5" x2="-8" y2="-7.5" stroke="black" />
`,
overspanningsbeveiliging_inline: `
-> shift x -7.5  y -15
<rect x="-7.5" y="-30" width="15" height="30" fill="none" style="stroke:black" />
<line x1="0" y1="-30" x2="0" y2="-20" stroke="black" />
<line x1="0" y1="-20" x2="-3" y2="-24" stroke="black" />
<line x1="0" y1="-20" x2="3" y2="-24" stroke="black" />
<line x1="0" y1="0" x2="0" y2="-10" stroke="black" />
<line x1="0" y1="-10" x2="-3" y2="-6" stroke="black" />
<line x1="0" y1="-10" x2="3" y2="-6" stroke="black" />
`,
zekering_empty: `
<g transform="rotate(-20)">
<line x1="0" y1="-30" x2="0" y2="0"  stroke="black" />
</g>
`,
arrow: `
<line x1="0" y1="0" x2="8" y2="0" stroke="black" />
<line x1="8" y1="0" x2="5" y2="-1" stroke="black" />
<line x1="8" y1="0" x2="5" y2="1" stroke="black" />
`,
gas_ventilator: `
<polygon points="-6,5.2 0,-5.2 6,5.2" fill="black" stroke="black" />
`,
gas_atmosferisch: `
<polygon points="-6,5.2 0,-5.2 6,5.2" fill="white" stroke="black" />
`,
bliksem: `
<line x1="0" y1="-5.2" x2="-3" y2="0" stroke="black"/>
<line x1="-3" y1="0" x2="3" y2="0" stroke="black"/>
<line x1="3" y1="0" x2="0" y2="5.2" stroke="black"/>
<line x1="0" y1="5.2" x2="0" y2="2.2" stroke="black"/>
<line x1="0" y1="5.2" x2="2.6" y2="3.7" stroke="black"/>
`,
moving_man: `
<g transform="matrix(0.0152987,0,0,0.01530866,0,0)">
<path d="M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z" id="path4" stroke="black" stroke-width="10" />
<path d="m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z" id="path6" stroke="black" stroke-width="10" />
</g>
`
}


}
