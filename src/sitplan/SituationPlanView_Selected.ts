class SituationPlanView_Selected {
    private data: Array<HTMLElement> = [];

    constructor() {}

    public clear() {
        this.data = [];
    }

    public selectOne(element: HTMLElement) {
        this.clear();
        this.data.push(element);
    }

    public select(element: HTMLElement) {
        if (this.data.includes(element)) {
            // if element is the last one in the list, it can remain, if not, it should move to the last position so-that we can use it as a last selected element
            if (this.data.indexOf(element) != this.data.length - 1) {
                this.data.splice(this.data.indexOf(element), 1);
                this.data.push(element);
            }
            return; 
        } else this.data.push(element);
    }

    public toggleButNeverRemoveLast(element: HTMLElement) {
        if (this.data.includes(element)) {
            if (this.data.length != 1) this.data.splice(this.data.indexOf(element), 1);
        } else {
            this.data.push(element);
        }
    }

    public getLastSelected(): HTMLElement | null {
        if (this.data.length == 0) return null;
        return this.data[this.data.length - 1];
    }

    /*public getAllSelected(): IterableIterator<HTMLElement> {
        return this.data[Symbol.iterator]();
    }*/

    public getAllSelected(): Array<HTMLElement> {
        return this.data;
    }

    public length() {
        return this.data.length;
    }

    public includes(element: HTMLElement): boolean {
        return this.data.includes(element);
    }
}
