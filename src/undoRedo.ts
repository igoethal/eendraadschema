import { DocumentSnapshotHistory } from "./application/DocumentSnapshotHistory";
import type { Hierarchical_List } from "./Hierarchical_List";

export interface UndoRedoViewPort {
    showSituationPlan(): void;
    showSchema(): void;
}

const noOpViewPort: UndoRedoViewPort = {
    showSituationPlan() {},
    showSchema() {},
};

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
    private historyEds: DocumentSnapshotHistory;
    private historyOptions: DocumentSnapshotHistory;
    private largeStrings: LargeStringStore = new LargeStringStore();

    private samenVoegSleutel: string|null = null; // Indien de store functie wordt opgeroepen met deze string wordt geen nieuwe undo stap gecreëerd maar de vorige aangepast

    constructor(
        maxSteps: number,
        private readonly getDocument: () => Hierarchical_List,
        private readonly replaceDocumentFromText: (text: string, version: number) => Hierarchical_List,
        private readonly viewPort: UndoRedoViewPort = noOpViewPort,
    ) {
        this.historyEds = new DocumentSnapshotHistory(undefined, maxSteps, false);
        this.historyOptions = new DocumentSnapshotHistory(undefined, maxSteps, false);
    }

    replaceSVGsByStringStore() {
        const document = this.getDocument();
        if (document.sitplan != null) {
            for (let element of document.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.pushIfNotExists(element.getUnscaledSVGifNotElectroItem()).toString();
            }
        }
    }

    replaceStringStoreBySVGs() {
        const document = this.getDocument();
        if (document.sitplan != null) {
            for (let element of document.sitplan.getElements()) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.get(parseInt(element.svg));
            }
        }
    }

    getOptions(): string {
        let options:any = {};
        const document = this.getDocument();

        if (document.sitplanview != null) {
            options.selectedBoxesOrdinals = document.sitplanview.getSelectedBoxesOrdinals();
        }

        return(JSON.stringify(options));
    }

    store(sleutel: string|null = null) {
        let overschrijfVorige = false;

        if ( (sleutel != null) && (sleutel == this.samenVoegSleutel) ) overschrijfVorige = true;
        this.samenVoegSleutel = sleutel;

        // Store the current document while replacing large custom SVG strings by compact references.
        this.replaceSVGsByStringStore();
        const document = this.getDocument();

        if (!overschrijfVorige) {
            this.historyEds.record(document.toJsonObject(false)); // needs to call with false as we want to keep currentView info
            this.historyOptions.record(this.getOptions());
        } else {
            this.historyEds.replace(document.toJsonObject(false)); // needs to call with false as we want to keep currentView info
            this.historyOptions.replace(this.getOptions());
        }
        
        this.replaceStringStoreBySVGs();

    }

    updateSelectedBoxes() {
        this.historyOptions.replace(this.getOptions());
    }

    reload(text: string|null, options: any) {
        this.samenVoegSleutel = null;

        let document = this.getDocument();
        let lastmode = document.mode;
        if (text != null) document = this.replaceDocumentFromText(text, 0);
        
        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // Resort and clean the restored document to avoid stale references.
        document.reSort();

        document.mode = lastmode;
        switch (document.properties.currentView) {
            case 'draw': 
                this.viewPort.showSituationPlan();
                
                if (options.selectedBoxesOrdinals == null) break;

                for (let selectedBox of options.selectedBoxesOrdinals) {
                    if (document.sitplan.getElements().length <= selectedBox) break;
                    let element = document.sitplan.getElements()[selectedBox];
                    if (element == null) break;
                    let htmlId = element.id;
                    if (htmlId == null) break;
                    let div = globalThis.document.getElementById(htmlId);
                    if (div != null) document.sitplanview.selectBox(div);
                }

                break;
            case '2col':
                this.viewPort.showSchema();
                break;
            case 'config':
                document.properties.currentView = '2col';
                this.viewPort.showSchema();
                break;
        }
    }

    undo() {
        let text:string|null = this.historyEds.undo() ?? null;
        let optionsString: string | null = this.historyOptions.undo() ?? null;
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    redo() { 
        let text:string|null = this.historyEds.redo() ?? null;
        let optionsString: string | null = this.historyOptions.redo() ?? null;
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text,options);
    }

    clear() {
        this.samenVoegSleutel = null;

        this.historyEds.clear();
        this.historyOptions.clear();
        this.largeStrings.clear();
    }

    undoStackSize():number {return(this.historyEds.undoCount());}
    redoStackSize():number {return(this.historyEds.redoCount());}

}
