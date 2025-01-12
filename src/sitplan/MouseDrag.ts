/**
 * Class that helps with dragging a box on the situation plan view.
 * It keeps track of the start position of the drag and the zoomfactor.
 */
class MouseDrag {

    private startDragx: number = 0;
    private startDragy: number = 0;
    private startOffsetLeft: number = 0;
    private startOffsetTop: number = 0;
    private zoomfactor: number = 1;

    /**
     * Start the drag.
     * @param mousex The x position of the mouse when the drag starts.
     * @param mousey The y position of the mouse when the drag starts.
     * @param startOffsetLeft The left position of the box when the drag starts.
     * @param startOffsetTop The top position of the box when the drag starts.
     * @param zoomfactor The zoomfactor of the situation plan view when the drag starts.
     */
    startDrag(mousex: number = 0, mousey: number = 0, 
              startOffsetLeft: number = 0, startOffsetTop: number = 0, 
              zoomfactor: number = 1) {
        this.startDragx = mousex;
        this.startDragy = mousey;
        this.startOffsetLeft = startOffsetLeft;
        this.startOffsetTop = startOffsetTop;
        this.zoomfactor = zoomfactor;
    }

    /**
     * Return the new left and top position of the box based on the current mouse position.
     * @param mousex The current x position of the mouse.
     * @param mousey The current y position of the mouse.
     * @returns An object with the new left and top position of the box.
     */
    returnNewLeftTop(mousex: number = 0, mousey: number = 0) {
        return ( {
            left: (mousex - this.startDragx) / this.zoomfactor + this.startOffsetLeft,
            top: (mousey - this.startDragy) / this.zoomfactor + this.startOffsetTop});
    }
}
