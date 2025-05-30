import { loadFromText } from "./importExport/importExport";
import { showSituationPlanPage } from "./sitplan/SituationPlanView";
import { printsvg } from "./print/print";

class jsonStore {
    private maxSteps: number;
    private undoStack: string[];
    private redoStack: string[];

    constructor(maxSteps: number = 100) {
        this.maxSteps = maxSteps;
        this.undoStack = [];
        this.redoStack = [];
    }

    store(text: string, popFirst: boolean = false): void {
        if ( (popFirst) && (this.undoStack.length > 0) ) this.undoStack.pop(); // Remove the oldest entry
        
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
        let lastRedoState = this.redoStack.pop()!;
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
    private data:string[] = [];

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

export class undoRedo {
    private historyEds: jsonStore;
    private historyOptions: jsonStore;
    private largeStrings: LargeStringStore = new LargeStringStore();

    private samenVoegSleutel: string|null = null; // Indien de store functie wordt opgeroepen met deze string wordt geen nieuwe undo stap gecreëerd maar de vorige aangepast

    constructor(maxSteps: number = 100) {
        this.historyEds = new jsonStore(maxSteps);
        this.historyOptions = new jsonStore(maxSteps);
    }

    replaceSVGsByStringStore() {
        if (globalThis.structure.sitplan != null) {
            for (let element of globalThis.structure.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.pushIfNotExists(element.getUnscaledSVGifNotElectroItem()).toString();
            }
        }
    }

    replaceStringStoreBySVGs() {
        if (globalThis.structure.sitplan != null) {
            for (let element of globalThis.structure.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.get(parseInt(element.svg));
            }
        }
    }

    getOptions(): string {
        let options:any = {};

        if (globalThis.structure.sitplanview != null) {
            options.selectedBoxesOrdinals = globalThis.structure.sitplanview.getSelectedBoxesOrdinals();
            if ((globalThis.structure.sitplanview.sideBar as any).getUndoRedoOptions != null) {
                Object.assign(options,(globalThis.structure.sitplanview.sideBar as any).getUndoRedoOptions());
            }
        }

        return(JSON.stringify(options));
    }

    store(sleutel: string|null = null) {
        let overschrijfVorige = false;

        if ( (sleutel != null) && (sleutel == this.samenVoegSleutel) ) overschrijfVorige = true;
        this.samenVoegSleutel = sleutel;

        // We store the current state of the globalThis.structure in the history but we replace the SVGs by a reference to a large string store
        this.replaceSVGsByStringStore();

        if (!overschrijfVorige) {
            this.historyEds.store(globalThis.structure.toJsonObject(false)); // needs to call with false as we want to keep currentView info
            this.historyOptions.store(this.getOptions());
        } else {
            this.historyEds.replace(globalThis.structure.toJsonObject(false)); // needs to call with false as we want to keep currentView info
            this.historyOptions.replace(this.getOptions());
        }
        
        this.replaceStringStoreBySVGs();

        if ( (globalThis.structure.properties.currentView == 'draw') && (globalThis.structure.sitplanview != null) ) globalThis.structure.sitplanview.updateRibbon();
        else if (globalThis.structure.properties.currentView == '2col') globalThis.structure.updateRibbon(); 
    }

    updateSelectedBoxes() {
        this.historyOptions.store(this.getOptions(), true);
    }

    reload(text: string|null, options: any) {
        this.samenVoegSleutel = null;

        let lastView = globalThis.structure.properties.currentView;
        let lastmode = globalThis.structure.mode;
        if (text != null) loadFromText(text, 0, false);
        
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the globalThis.structure to avoid bad references
        globalThis.structure.reSort();

        globalThis.structure.mode = lastmode;
        if (globalThis.structure.properties.currentView != lastView) globalThis.toggleAppView(globalThis.structure.properties.currentView as '2col' | 'config' | 'draw');
        switch (globalThis.structure.properties.currentView) {
            case 'draw': 
                globalThis.topMenu.selectMenuItemByOrdinal(3);
                showSituationPlanPage();
                
                if ((globalThis.structure.sitplanview.sideBar as any).setUndoRedoOptions != null) (globalThis.structure.sitplanview.sideBar as any).setUndoRedoOptions(options);

                if (options.selectedBoxesOrdinals == null) break;

                for (let selectedBox of options.selectedBoxesOrdinals) {
                    if (globalThis.structure.sitplan.getElements().length <= selectedBox) break;
                    let element = globalThis.structure.sitplan.getElements()[selectedBox];
                    if (element == null) break;
                    let htmlId = element.id;
                    if (htmlId == null) break;
                    let div = document.getElementById(htmlId);
                    if (div != null) globalThis.structure.sitplanview.selectBox(div);
                }

                break;
            case '2col': globalThis.topMenu.selectMenuItemByOrdinal(2); globalThis.HLRedrawTree(); break;
            case 'config': globalThis.topMenu.selectMenuItemByOrdinal(4); printsvg(); break;
        }
    }

    undo() {
        let text:string|null = this.historyEds.undo();
        let optionsString: string | null = this.historyOptions.undo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    redo() { 
        let text:string|null = this.historyEds.redo();
        let optionsString: string | null = this.historyOptions.redo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    clear() {
        this.samenVoegSleutel = null;

        this.historyEds.clear();
        this.historyOptions.clear();
        this.largeStrings.clear();
        globalThis.structure.updateRibbon();
    }

    undoStackSize():number {return(this.historyEds.undoStackSize());}
    redoStackSize():number {return(this.historyEds.redoStackSize());}

}