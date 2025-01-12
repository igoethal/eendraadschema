/**
 * Class gebruikt in SituationPlanView om te zoeken naar electroitems op basis van de kringnaam.
 * Dit laat toe items to selecteren uit het volledige eendraadschema en ze te plaatsen op het situatieschema.
 * 
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 */

class ElectroItemZoeker {

    private excludedTypes = ['Aansluiting','Bord','Kring','Domotica','Domotica module (verticaal)',
                             'Domotica gestuurde verbruiker','Leiding','Splitsing','Verlenging',
                             'Vrije ruimte','Meerdere verbruikers'];

    private data: {id: number, kringnaam: string, adres: string, type: string}[] = [];

    /**
     * Constructor van de ElectroItemZoeker.
     * 
     * Initialiseert de lijst van alle toegestane ElectroItems in het situatieplan.
     */

    constructor() {
        this.reCalculate();
    }

    /**
     * Geeft de lijst van alle toegestane ElectroItems in het situatieplan retour.
     * @returns {Object[]} een lijst van objecten met de volgende structuur:
     *                  {id: number, kringnaam: string, adres: string, type: string}
     */

    getData() {
        return this.data;
    }

    /**
     * Geeft een lijst van alle unieke kringnamen retour uit de lijst van ElectroItems.
     * @returns {string[]} een lijst van unieke kringnamen.
     */

    getUniqueKringnaam(): string[] {
        return Array.from(new Set(this.data.map(x => x.kringnaam))); 
    }

    /**
     * Geeft een lijst van alle ElectroItems retour die behoren tot de kring met de naam 'kringnaam'.
     * @param {string} kringnaam - de naam van de kring.
     * @returns {Object[]} een lijst van objecten met de volgende structuur:
     *                  {id: number, adres: string, type: string}
     */

    getElectroItemsByKring(kringnaam: string): {id: number, adres: string, type: string}[] {
        return this.data.filter(x => x.kringnaam === kringnaam).map(x => ({id: x.id, adres: x.adres, type: x.type}));
    }
    
    /**
     * Rekent de lijst van alle toegestane ElectroItems opnieuw uit.
     * 
     * Deze methode wordt gebruikt om de lijst van ElectroItems te vullen die in het situatieplan gebruikt mogen worden.
     * De lijst wordt opnieuw uitgerekend door de volgende stappen:
     * 1. Doorlopen alle actieve ElectroItems in de structuur.
     * 2. Voor elke ElectroItem worden de kringnaam en het type bepaald.
     * 3. Als de kringnaam niet leeg is en het type niet voorkomt in de lijst van uitgesloten types, dan wordt de ElectroItem toegevoegd aan de lijst.
     * 4. De ElectroItem wordt toegevoegd met de volgende structuur: {id: number, kringnaam: string, adres: string, type: string}
     */

    reCalculate() {
        for (let i = 0; i<structure.length; i++) {
            if (structure.active[i]) {
                let id:number = structure.id[i];
                let kringnaam:string = structure.findKringName(id).trim();
                if (kringnaam != '') {
                    let type:string = (structure.data[i] as Electro_Item).getType();
                    if ( (type != null) && (this.excludedTypes.indexOf(type) === -1) ) {
                        let adres:string = (structure.data[i] as Electro_Item).getReadableAdres();
                        this.data.push({id: id, kringnaam: kringnaam, adres:adres, type: type});
                    }
                }
            }
        }
    }
    
}
