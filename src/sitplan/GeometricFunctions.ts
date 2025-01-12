/**
 * Functie die de breedte en hoogte van een rechthoek als invoer neemt, evenals een rotatie rond het midden van de rechthoek.
 * De functie retourneert de breedte en hoogte van de kleinste rechthoek die de geroteerde rechthoek omsluit met zijden langs de X- en Y-assen.
 */

function getRotatedRectangleSize(width: number, height: number, rotation: number) {
    const rotationInRadians = rotation * Math.PI / 180;
    const cos = Math.cos(rotationInRadians);
    const sin = Math.sin(rotationInRadians);
    const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
    const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
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

function getXYRectangleSize(width: number, height: number, rotation: number) {
    rotation = Math.abs(rotation) % 180;
    if (rotation > 90) rotation = 180 - rotation;
    const rotationInRadians = rotation * Math.PI / 180;
    const cos = Math.cos(rotationInRadians);
    const sin = Math.sin(rotationInRadians);
    return { width: Math.min(width/cos,height/sin), height: Math.min(width/sin,height/cos) };
}

/**
 * Cache het resultaat van getPixelsPerMillimeter() om de overhead van het maken en verwijderen van een DOM-element bij elke oproep te voorkomen.
 */
let cachedPixelsPerMillimeter: number | null = null;

/**
 * Berekent het aantal pixels in een millimeter op het huidige scherm.
 * Maakt gebruik van een cache om de overhead van het maken en verwijderen van een DOM-element bij elke oproep te voorkomen.
 * @returns {number} Het aantal pixels in een millimeter.
 */
function getPixelsPerMillimeter(): number {
    if (cachedPixelsPerMillimeter === null) {
        const div = document.createElement('div');
        div.style.width = '10mm';
        div.style.position = 'absolute';
        document.body.appendChild(div);
        const widthInPixels = div.offsetWidth;
        document.body.removeChild(div);
        cachedPixelsPerMillimeter = widthInPixels / 10;
    }
    return cachedPixelsPerMillimeter;
}