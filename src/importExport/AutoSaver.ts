/**
 * Klasse voor het automatisch en regelmatig opslaan van het huidige schema in IndexedDB
 *
 * @class AutoSaver
 */
class AutoSaver {

    /**
     * Enum voor soorten opslag.
     *
     * @readonly
     * @enum {string}
     * @property {string} AUTOMATIC Automatische opslag
     * @property {string} MANUAL Manuele opslag
     * @property {string} NONE Geen opslag
     */
    static SavedType = {
        AUTOMATIC: "AUTOMATIC",
        MANUAL: "MANUAL",
        NONE: "NONE"
    } as const;

    /**
     * Interval tussen autosave pogingen in milliseconden.
     *
     * @type {number}
     */
    private interval: number;
    
    /**
     * Timer ID.
     *
     * @type {number | null}
     */
    private timerId: number | null = null;
    
    /**
     * Laatste opgeslagen data (als string).
     *
     * @type {string | null}
     */
    private lastSavedString: string | null = null;
    /**
     * Geeft weer of de laatste data manueel was (user-interactie) of een echte autoSave.
     *
     * @type {typeof AutoSaver.SavedType[keyof typeof AutoSaver.SavedType]}
     */
    private lastChangedType: typeof AutoSaver.SavedType[keyof typeof AutoSaver.SavedType] = AutoSaver.SavedType.NONE;
    /**
     * Zelfs indien we de timer gestart hebben zal het saven pas beginnen als deze false wordt.
     *
     * @type {boolean}
     */
    private suspendSaving: boolean = true;
    
    /**
     * Constructor voor AutoSaver-klasse.
     *
     * @param {number} interval - Het interval in seconden tussen autosave pogingen.
     */
    constructor(interval: number) {
        this.interval = interval * 1000; // Converteer seconden naar milliseconden
    }

    /**
     * Start het autosaven van de huidige structuur.
     *
     * Deze methode start een timer die elke {@link interval} seconden een poging doet om de huidige structuur op te slaan.
     * Dit opslaan zal echter worden uitgesteld (suspendSaving) zolang de gebruiker niet een scherm open heeft waarop
     * getekend kan worden (eendraadschema of situatieschema).
     */
    start() {
        this.stop();
        this.timerId = window.setInterval(() => {
            this.saveAutomatically();
        }, this.interval);
        this.suspendSaving = true;
    }

    /**
     * Stop het autosaven van de huidige structuur.
     *
     * Deze methode verwijdert de timer die elke {@link interval} seconden een poging doet om de huidige structuur op te slaan.
     */
    stop() {
        // Clear existing timer
        if (this.timerId !== null) {
            window.clearInterval(this.timerId);
        }
    }

    /**
     * Herstart het autosaven van de huidige structuur.
     *
     * Deze methode verwijdert de timer die elke {@link interval} seconden een poging doet om de huidige structuur op te slaan en
     * start de timer opnieuw op.
     *
     * @param {number} [interval] Nieuwe interval in seconden (standaardwaarde: huidige interval)
     */
    reset(interval: number = this.interval / 1000) {
        // Clear existing timer and restart
        this.stop();
        this.interval = interval * 1000; // Convert seconds to milliseconds
        this.start();
    }

    /**
     * Controleert of de gebruiker een scherm open heeft waarop getekend kan worden (eendraadschema of situatieschema)
     * Zoja wordt suspend uitgeschakeld en kan het autosaven beginnen.
     */
    private haltSuspendingIfUserStartedDrawing() {
        if (structure.properties.currentView != "config") this.suspendSaving = false;
    }

    /**
     * Slaat nhet huidige schema automatisch op in de IndexedDB onder de naam "autoSave".
     * Dit wel enkel indien de gebruiker al een tekenscherm geopend heeft (eendraadschema of situatieschema)
     *
     * Deze methode wordt elke {@link interval} seconden uitgevoerd door de timer die gestart is met {@link start}.
     */
    private saveAutomatically() {

        // Als de gebruiker nog niet aan het tekenen is dan is er niets te saven
        this.haltSuspendingIfUserStartedDrawing();
        if (this.suspendSaving) return;

        // Als het schema gewijzigd is wordt dit opgeslagen in IndexedDB
        const text = "TXT0040000" + structure.toJsonObject(true);
        if (text != this.lastSavedString) {
            (async () => {
                try {
                    await this.saveToIndexedDB("TXT0040000" + structure.toJsonObject(true), true); // parameter true geeft aan dat het over een autosave gaat
                    this.lastSavedString = text;
                    //console.log('Autosave uitgevoerd op ' + new Date().toLocaleString());
                } catch (error) {
                    console.error("Error saving to IndexedDB:", error);
                }
            })();
        } else {
            //console.log('Autosave overgeslagen omdat er geen veranderingen waren op ' + new Date().toLocaleString());
        }
    }

    /**
     * Slaat het huidige schema op in de IndexedDB onder de naam "autoSave".
     *
     * @param {string} [text] - De tekst die opgeslagen moet worden. Indien niet gespecificeerd, wordt de structure.toJsonObject gebruikt.
     */
    saveManually(text: string = null) {

        // Een gebruiker die actief zelf een schema opslaat wordt gezien als bewijs dat de gebruiker actief aan het tekenen is
        this.suspendSaving = false;

        // Het schema wordt altijd opgeslagen in IndexedDB
        (async () => {
            try {
                if (text == null) text = "TXT0040000" + structure.toJsonObject(true);
                await this.saveToIndexedDB(text, false); // parameter false geeft aan dat het over een manual save gaat
                this.lastSavedString = text;
            } catch (error) {
                console.error("Error saving to IndexedDB:", error);
            }
        })();
        this.reset();
    }

    /**
     * Slaat de huidige structuur op in de IndexedDB onder de naam "autoSave".
     * Slaat eveneens een JSON string autoSaveInfo op met volgende informatie:
     *   - filename: de filename zoals gekozen door de gebruiker
     *   - currentTimeStamp: de datum tijd waarop de structuur opgeslagen werd
     *   - recovery: een bollean die weergeeft of het schema spontaan werd opgeslagen zonder user-interventie (recovery=true)
     *     of samen met een save-actie (recovery=false). In het laatste geval heeft de user al een saved version van de file en
     *     moet de cache versie niet noodzakelijk pro-actief worden aangeboden bij het opnieuw opstarten van de tool.
     * 
     * @param {string} [text] - De tekst die opgeslagen moet worden.
     */
    async saveToIndexedDB(text: string, recovery: boolean = false): Promise<void> {
        const db = new IndexedDBStorage("DB_EDS", "Store_EDS");

        if (!db) {
            console.error("Error saving to IndexedDB, kan de database niet openen.");
            return;
        }

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
        
        await Promise.all([
            db.set("autoSave", text),
            db.set("autoSaveInfo", JSON.stringify(info))
        ]);

    }

    /**
     * Laadt de laatste opgeslagen data uit de IndexedDB, en retourneert deze als een array
     * met twee elementen: de eigenlijke code van het schema (json)en de info over de opslag zoals filename, 
     * currentTimeStamp en recovery (true indien het een autosave was, false indien het een 
     * save-actie was).
     * 
     * @returns {Promise<[string | null, string | null]>} Een promise die resolvet naar een 
     * array met twee elementen: de tekst van het schema en de info over de opslag.
     */
    async loadLastSaved(): Promise<[string | null, string | null]> {
        const db = new IndexedDBStorage("DB_EDS", "Store_EDS");

        if (!db) return [null, null];

        try {
            let lastSavedInfoStr;
            [this.lastSavedString, lastSavedInfoStr] = await Promise.all([
                db.get("autoSave"),
                db.get("autoSaveInfo")
            ]);
            const lastSavedInfo = lastSavedInfoStr ? JSON.parse(lastSavedInfoStr) : null;
            return([this.lastSavedString, lastSavedInfo]);
        } catch (error) {
            this.lastSavedString = null;
            console.error("Error loading from IndexedDB:", error);
            return [null, null];
        }
        
    }
  
}

