import type { Hierarchical_List } from "../Hierarchical_List";

/**
 * Class that helps with dragging a box on the situation plan view.
 * It keeps track of the start position of the drag and the zoomfactor.
 */
export class MouseDrag {

    private startOffsetLeft: number = 0;
    private startOffsetTop: number = 0;

    private startPaperPos = {x:0, y:0};

    public hassMoved: boolean = false;

    /**
     * Start the drag.
     * @param mouseX The x position of the mouse when the drag starts.
     * @param mouseY The y position of the mouse when the drag starts.
     * @param startOffsetLeft The left position of the box when the drag starts.
     * @param startOffsetTop The top position of the box when the drag starts.
     */
    startDrag(mouseX: number = 0, mouseY: number = 0, 
              startOffsetLeft: number = 0, startOffsetTop: number = 0) {

        this.startOffsetLeft = startOffsetLeft;
        this.startOffsetTop = startOffsetTop;
        this.hassMoved = false;

        const menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
        const ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
        const sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));

        this.startPaperPos = (globalThis.structure as Hierarchical_List).sitplanview.canvasPosToPaperPos(mouseX - sideBarWidth, mouseY - menuHeight - ribbonHeight);
    }

    /**
     * Return the new x and y position of the box based on the current mouse position.
     * @param mouseX The current x position of the mouse.
     * @param mouseY The current y position of the mouse.
     * @returns An object with the new x and y position of the box.
     */
    returnNewPaperPos(mousex: number = 0, mousey: number = 0) {

        const menuHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-height'));
        const ribbonHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-height'));
        const sideBarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sideBarWidth'));

        let stopPaperPos = (globalThis.structure as Hierarchical_List).sitplanview.canvasPosToPaperPos(mousex - sideBarWidth, mousey - menuHeight - ribbonHeight);

        if (stopPaperPos.x != this.startPaperPos.x || stopPaperPos.y != this.startPaperPos.y) this.hassMoved = true;

        return ( {
                    x: (stopPaperPos.x - this.startPaperPos.x) + this.startOffsetLeft,
                    y: (stopPaperPos.y - this.startPaperPos.y) + this.startOffsetTop
                });
    }


}
