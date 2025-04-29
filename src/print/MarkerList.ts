/**
 * A class to handle a list of potential page breaks or markers in the form {depth,xpos} with depth how nested 
 * they are (lower depth is better to include a page break) and xpos the location in pixels in the SVG where
 * the break could be added
 */

export class MarkerList {

    markers: { depth: number, xpos: number }[] = [];

    /**
     * Clear the list of markers
     */

    clear(): void {
        this.markers = [];
    }

    /**
     * Add a marker to the markerlist.
     * If the same marker already exists, no new one will be added.
     * @param depth - The depth of the marker, or how nested it is (lower depth is better for page breaks).
     * @param xpos - The x-coordinate position of the marker.
     */

    addMarker(depth, xpos): void {
        // Check if the marker already exists
        const exists = this.markers.some(marker => marker.depth === depth && marker.xpos === xpos);
        if (!exists) {
          this.markers.push({ depth, xpos });
        }
    }

    /**
     * Sorts the markers by their x-coordinate position in ascending order.
     */
    sort(): void {
        this.markers.sort((a, b) => a.xpos - b.xpos);
    }

    /**
     * Looks for the marker in the half-open internal (minx, maxx] with the lowest possible depth.
     * If multiple markers exist with the same depth, the one with the highest xpos is returned.
     * If no suitable marker is found, a dummy {depth=null, xpos=maxx} is returned.
     * @param minx - Minimal x for any markers that will be considered.
     * @param maxx - Maximal x for any markers that will be considered.
     * @returns The marker with the lowest depth (and highest xpos if multiple exist) or a dummy marker if none are found.
     */

    findMinDepth(minx: number, maxx: number): {depth: number | null, xpos: number} {
        // Filter markers within the range
        const filteredMarkers = this.markers.filter(marker => marker.xpos > minx && marker.xpos <= maxx);

        if (filteredMarkers.length === 0) {
            return {depth: null, xpos: maxx}; // No markers in the specified range so we just take the maximum
        }
        
        // Find the marker with the lowest depth, if multiple exist with the same depth, take the one with the highest xpos
        return filteredMarkers.reduce((minDepthMarker, marker) => {
            if (marker.depth < minDepthMarker.depth ||
                (marker.depth === minDepthMarker.depth && marker.xpos > minDepthMarker.xpos)) {
                return marker;
            }
            return minDepthMarker;
        }, filteredMarkers[0]);
    }
}