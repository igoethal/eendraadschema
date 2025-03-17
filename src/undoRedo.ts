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

    replace(text: string): void {
        if (this.undoStack.length > 0) {
            this.undoStack[this.undoStack.length - 1] = text;
        } else {
            this.store(text);
        }
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
    private historyEds: jsonStore;
    private historyOptions: jsonStore;
    private largeStrings: LargeStringStore = new LargeStringStore();

    private samenVoegSleutel: string = null; // Indien de store functie wordt opgeroepen met deze string wordt geen nieuwe undo stap gecreëerd maar de vorige aangepast

    constructor(maxSteps: number = 100) {
        this.historyEds = new jsonStore(maxSteps);
        this.historyOptions = new jsonStore(maxSteps);
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

    getOptions(): string {
        let options:any = {};

        if (structure.sitplanview != null) {
            options.selectedBoxOrdinal = structure.sitplanview.getSelectedBoxOrdinal();
            if ((structure.sitplanview.sideBar as any).getUndoRedoOptions != null) {
                Object.assign(options,(structure.sitplanview.sideBar as any).getUndoRedoOptions());
            }
        }

        return(JSON.stringify(options));
    }

    store(sleutel: string = null) {
        let overschrijfVorige = false;

        if ( (sleutel != null) && (sleutel == this.samenVoegSleutel) ) overschrijfVorige = true;
        this.samenVoegSleutel = sleutel;

        // We store the current state of the structure in the history but we replace the SVGs by a reference to a large string store
        this.replaceSVGsByStringStore();

        if (!overschrijfVorige) {
            this.historyEds.store(structure_to_json());
            this.historyOptions.store(this.getOptions());
        } else {
            this.historyEds.replace(structure_to_json());
            this.historyOptions.replace(this.getOptions());
        }
        
        this.replaceStringStoreBySVGs();

        if ( (structure.properties.currentView == 'draw') && (structure.sitplanview != null) ) structure.sitplanview.updateRibbon();
        else if (structure.properties.currentView == '2col') structure.updateRibbon(); 
    }

    reload(text: string, options: any) {
        this.samenVoegSleutel = null;

        let lastView = structure.properties.currentView;
        let lastmode = structure.mode;
        if (text != null) loadFromText(text, 0, false);
        
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        structure.reSort();

        structure.mode = lastmode;
        if (structure.properties.currentView != lastView) toggleAppView(structure.properties.currentView as '2col' | 'config' | 'draw');
        switch (structure.properties.currentView) {
            case 'draw': 
                topMenu.selectMenuItemByOrdinal(3);
                showSituationPlanPage();

                if ((structure.sitplanview.sideBar as any).setUndoRedoOptions != null) (structure.sitplanview.sideBar as any).setUndoRedoOptions(options);

                let htmlId = structure.sitplan.getElements()[options.selectedBoxOrdinal].id;
                if (htmlId == null) break;
                let div = document.getElementById(htmlId);
                if (div != null) structure.sitplanview.selectBox(div);

                break;
            case '2col': topMenu.selectMenuItemByOrdinal(2); HLRedrawTree(); break;
            case 'config': topMenu.selectMenuItemByOrdinal(4); printsvg(); break;
        }
    }

    undo() {
        let text:string = this.historyEds.undo();
        let optionsString: string | null = this.historyOptions.undo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    redo() { 
        let text:string = this.historyEds.redo();
        let optionsString: string | null = this.historyOptions.redo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    clear() {
        this.samenVoegSleutel = null;

        this.historyEds.clear();
        this.historyOptions.clear();
        this.largeStrings.clear();
        structure.updateRibbon();
    }

    undoStackSize():number {return(this.historyEds.undoStackSize());}
    redoStackSize():number {return(this.historyEds.redoStackSize());}

}