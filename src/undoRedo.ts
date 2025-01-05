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

class LargeStringStore {
    private data = [];

    push(text: string): number {
        this.data.push(text);
        return (this.data.length-1);
    }

    pushIfNotExists(text: string): number {
        let index = this.data.indexOf(text);
        if (index == -1) {
            this.data.push(text);
            return (this.data.length-1);
        } else {
            return index;
        }
    }

    get(index: number): string {
        return this.data[index];
    }

    clear() {
        this.data = [];
    }
}

class undoRedo {
    private history: jsonStore;
    private largeStrings: LargeStringStore = new LargeStringStore();

    constructor(maxSteps: number = 100) {
        this.history = new jsonStore(maxSteps);
    }

    replaceSVGsByStringStore() {
        if (structure.sitplan != null) {
            for (let element of structure.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.pushIfNotExists(element.getUnscaledSVGifNotElectroItem()).toString();
            }
        }
    }

    replaceStringStoreBySVGs() {
        if (structure.sitplan != null) {
            for (let element of structure.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.get(parseInt(element.svg));
            }
        }
    }

    store() {
        // We store the current state of the structure in the history but we replace the SVGs by a reference to a large string store
        this.replaceSVGsByStringStore();
        this.history.store(structure_to_json());
        this.replaceStringStoreBySVGs();

        if ( (structure.properties.currentView == 'draw') && (structure.sitplanview != null) ) structure.sitplanview.updateRibbon();
        else if (structure.properties.currentView == '2col') structure.updateRibbon(); 
    }

    undo() {
        let lastView = structure.properties.currentView;
        let lastmode = structure.mode;
        let text:string = this.history.undo();
        if (text != null) json_to_structure(text, 0, false);
        
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        structure.reSort();

        structure.mode = lastmode;
        if (structure.properties.currentView != lastView) toggleAppView(structure.properties.currentView as '2col' | 'config' | 'draw');
        switch (structure.properties.currentView) {
            case 'draw': topMenu.selectMenuItemByOrdinal(3); showSituationPlanPage(); break;
            case '2col': topMenu.selectMenuItemByOrdinal(2); HLRedrawTree(); break;
            case 'config': topMenu.selectMenuItemByOrdinal((isDevMode() ? 4 : 3)); printsvg(); break;
        }
    }

    redo() { 
        let lastView = structure.properties.currentView;
        let lastmode = structure.mode;
        let text:string = this.history.redo();
        if (text != null) json_to_structure(text, 0, false);
        
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        structure.reSort();

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
        this.largeStrings.clear();
        structure.updateRibbon();
    }

    undoStackSize():number {return(this.history.undoStackSize());}
    redoStackSize():number {return(this.history.redoStackSize());}

}