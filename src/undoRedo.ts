class jsonStore {
    private maxSteps: number;
    private undoStack: string[];
    private redoStack: string[];

    constructor(maxSteps: number = 100) {
        this.maxSteps = maxSteps;
        this.undoStack = [];
        this.redoStack = [];
    }

    store(text: string): void {
        if (this.undoStack.length >= this.maxSteps) {
            this.undoStack.shift(); // Remove the oldest entry to maintain maxSteps
        }
        this.undoStack.push(text);
        this.redoStack = []; // Clear the redo stack whenever a new store is made
    }

    //Always call store before undo otherwise there is nothing to put on the redo stack !!
    undo(): string | null {
        if (this.undoStack.length <= 1) {
            return null;
        }
        const lastState = this.undoStack.pop()!;
        this.redoStack.push(lastState);
        return this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : null;
    }

    redo(): string | null {
        if (this.redoStack.length === 0) {
            return null;
        }
        var lastRedoState = this.redoStack.pop()!;
        this.undoStack.push(lastRedoState);
        return lastRedoState;
    }

    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
    }

    undoStackSize():number {return(Math.max(this.undoStack.length-1,0));}
    redoStackSize():number {return(Math.max(this.redoStack.length,0));}
}

class undoRedo {
    private history: jsonStore;

    constructor(maxSteps: number = 100) {
        this.history = new jsonStore(maxSteps);
    }

    store() { 
        this.history.store(structure_to_json());
        if (structure.currentView == 'draw') structure.sitplanview.updateRibbon();
        else if (structure.currentView == '2col') structure.updateRibbon(); 
    }

    undo() {
        let lastView = structure.properties.currentView;
        let lastmode = structure.mode;
        let text:string = this.history.undo();
        if (text != null) json_to_structure(text, 0, false); 
        structure.mode = lastmode;
        if (structure.properties.currentView != lastView) toggleAppView(structure.properties.currentView as '2col' | 'config' | 'draw');
        if (structure.properties.currentView == 'draw') {
            topMenu.selectMenuItemByOrdinal(3);
            showSituationPlanPage();
        } else if (structure.properties.currentView == '2col') {
            topMenu.selectMenuItemByOrdinal(2);
            HLRedrawTree(); 
        }
    }

    redo() { 
        let lastView = structure.properties.currentView;
        let lastmode = structure.mode;
        let text:string = this.history.redo();
        if (text != null) json_to_structure(text, 0, false); 
        structure.mode = lastmode;
        if (structure.properties.currentView != lastView) toggleAppView(structure.properties.currentView as '2col' | 'config' | 'draw');
        if (structure.properties.currentView == 'draw') {
            topMenu.selectMenuItemByOrdinal(3);
            showSituationPlanPage();
        } else if (structure.properties.currentView == '2col') {
            topMenu.selectMenuItemByOrdinal(2);
            HLRedrawTree(); 
        }
    }

    clear() {
        this.history.clear();
        structure.updateRibbon();
    }

    undoStackSize():number {return(this.history.undoStackSize());}
    redoStackSize():number {return(this.history.redoStackSize());}

}