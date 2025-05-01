class AutoSaver {
    private interval: number; // Interval in milliseconds
    private timerId: number | null = null; // Timer ID for clearing
    private lastSaved: string | null = null;
    private suspendSaving: boolean = true; // Zelfs indien we de timer gestart hebben zal het saven ben beginnen als deze false wordt

    constructor(interval: number) {
        this.interval = interval * 1000; // Convert seconds to milliseconds
    }

    start() {
        this.stop();
        this.timerId = window.setInterval(() => {
            this.saveAutomatically();
        }, this.interval);
    }

    stop() {
        // Clear existing timer
        if (this.timerId !== null) {
            window.clearInterval(this.timerId);
        }
    }

    reset(interval: number = this.interval / 1000) {
        // Clear existing timer and restart
        this.stop();
        this.interval = interval * 1000; // Convert seconds to milliseconds
        this.start();
    }

    private saveAutomatically() {
        if (structure.properties.currentView != "config") this.suspendSaving = false;
        if (this.suspendSaving) return;
        const text = "TXT0040000" + structure_to_json(true);
        if (text != this.lastSaved) {
            (async () => {
                try {
                    await this.saveToIndexedDB("TXT0040000" + structure_to_json(), true);
                } catch (error) {
                    console.error("Error saving to IndexedDB:", error);
                }
            })();
            //console.log('Autosave executed at ' + new Date().toLocaleString());
            this.lastSaved = text;
        } else {
            //console.log('Autosave skipped since no change detected at ' + new Date().toLocaleString());
        }
    }

    saveManually(text: string = null) {
        this.suspendSaving = false;
        (async () => {
            try {
                if (text == null) text = "TXT0040000" + structure_to_json(true);
                await this.saveToIndexedDB(text, false);
            } catch (error) {
                console.error("Error saving to IndexedDB:", error);
            }
            this.lastSaved = text;
        })();
        this.reset();
    }

    /**
     * Slaat de huidige structuur op in de IndexedDB onder de naam "autoSave".
     * Slaat eveneens een JSON string autoSaveInfo op met volgende informatie:
     *   - filename: de filename zoals gekozen door de gebruiker
     *   - currentTimeStamp: de tijd waarop de structuur opgeslagen werd
     *   - recovery: een bollean die weergeeft of het schema spontaan werd opgeslagen zonder user-interventie (recovery=true)
     *     of samen met een save-actie (recovery=false). In het laatste geval heeft de user al een saved version van de file en
     *     moet de cache versie niet noodzakelijk pro-actief worden aangeboden bij het opnieuw opstarten van de tool.
     * 
     * @param {string} [text] - De tekst die opgeslagen moet worden. Indien niet gespecificeerd, wordt de huidige structuur gebruikt.
     */
    async saveToIndexedDB(text: string, recovery: boolean = false): Promise<void> {
        const db = new IndexedDBStorage("DB_EDS", "Store_EDS");

        // Save the structure
        await db.set("autoSave", text);

        // Save some additional information 
        let currentDate = new Date();
        const info = {
            filename: structure.properties.filename,
            currentTimeStamp: currentDate.getDate().toString().padStart(2, '0') + "/" +
                            (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/" +
                            currentDate.getFullYear().toString() + " " +
                            currentDate.getHours().toString().padStart(2, '0') + ":" +
                            currentDate.getMinutes().toString().padStart(2, '0') + ":" +
                            currentDate.getSeconds().toString().padStart(2, '0'),
            recovery: recovery
        }
        //console.log(info.currentTimeStamp);
        await db.set("autoSaveInfo", JSON.stringify(info));
    }

    async loadLastSaved(): Promise<[string | null, string | null]> {
        const db = new IndexedDBStorage("DB_EDS", "Store_EDS");
        let lastSavedInfo = null;
        try {
            this.lastSaved = await db.get("autoSave");
            const lastSavedInfoStr = await db.get("autoSaveInfo");
            lastSavedInfo = lastSavedInfoStr ? JSON.parse(lastSavedInfoStr) : null;
        } catch (error) {
            this.lastSaved = null;
            console.error("Error loading from IndexedDB:", error);
        }
        return([this.lastSaved, lastSavedInfo]);
    }
  
}

