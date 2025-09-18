/**
 * Store information on what part of the SVG lands on one specific page
 * The height is the final height in number of pixels
 * The start and stop are the x-locations in pixels of the part of the total SVG that needs to land on this particular page
 */

export class Page_Info {
    height: number;
    start: number;
    stop: number;
    info: string;

    constructor() {
        this.height = 0;
        this.start = 0;
        this.stop = 0;
        this.info = (globalThis.structure?.properties?.info != null) 
                    ? globalThis.structure.properties.info 
                    : "";
    }
}