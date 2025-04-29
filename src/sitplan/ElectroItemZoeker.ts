/**
 * Class gebruikt in SituationPlanView om te zoeken naar electroitems op basis van de kringnaam.
 * Dit laat toe items to selecteren uit het volledige eendraadschema en ze te plaatsen op het situatieschema.
 * 
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 */

import { Electro_Item } from "../List_Item/Electro_Item";

export class ElectroItemZoeker {

    private excludedTypes = ['Aansluiting','Bord','Kring','Domotica','Domotica module (verticaal)',
                             'Domotica gestuurde verbruiker','Leiding','Splitsing','Verlenging',
                             'Vrije ruimte','Meerdere verbruikers'];

    private data: {id: number, kringnaam: string, adres: string, type: string}[] = [];
    private borden: {id: number, naam: string}[] = [];

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
     * Geeft de lijst van alle Borden in het eendraadschema.
     * @returns {Object[]} een lijst van objecten met de volgende structuur:
     *                  {id: number, naam: string}
     * 
     * Indien de originele naam null is of enkel uit spaties bestaat wordt als naam "Bord" meegegeven
     */   

    getBorden() {
        return this.borden;
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
     * 
     * Er wordt eveneens een lijst van borden gemaakt.
     */

    reCalculate() {
        this.data = [];
        this.borden = [];
        for (let i = 0; i<window.global_structure.length; i++) {
            if (window.global_structure.active[i]) {
                let id:number = window.global_structure.id[i];
                let electroItem = window.global_structure.data[i] as Electro_Item;
                if (electroItem == null) continue;
                let type:string = electroItem.getType();
                if (type == 'Bord') {
                    let myName = electroItem.props.naam;
                    if ( (myName == null) || (myName.trim() == '') ) myName = 'Bord';
                    this.borden.push({id: id, naam: myName})
                } else {
                    let kringnaam:string = window.global_structure.findKringName(id).trim();
                    if (kringnaam != '') {
                        if ( (type != null) && (this.excludedTypes.indexOf(type) === -1) ) {
                            let adres:string = electroItem.getReadableAdres();
                            this.data.push({id: id, kringnaam: kringnaam, adres:adres, type: type});
                        }
                    }
                }
            }
        }
    }
    
}
