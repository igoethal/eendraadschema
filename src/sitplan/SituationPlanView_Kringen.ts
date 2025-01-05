function SituationPlanView_Kringen(): any {

    const excludedTypes = ['Aansluiting','Bord','Kring','Domotica','Domotica module (verticaal)','Domotica gestuurde verbruiker',
                           'Leiding','Splitsing','Verlenging','Vrije ruimte','Meerdere verbruikers'];

    // Aansluiting is wel toegelaten in Trikker en willen we wellicht later toelaten

    let output: any = {};
    output.alldata = [];

    output.getUniqueSortedKringnaam = () => {
        const uniqueKringnaamArray = [];
        for (let i = 0; i < output.alldata.length; i++) { 
            if (uniqueKringnaamArray.indexOf(output.alldata[i].kringnaam) === -1) uniqueKringnaamArray.push(output.alldata[i].kringnaam); 
        }
        return uniqueKringnaamArray;
    }
    
    output.getElectroItemsByKring = (kringnaam: string) => {
        const electroItemArray = [];
        for (let i = 0; i < output.alldata.length; i++) { 
            if (output.alldata[i].kringnaam === kringnaam) {
                electroItemArray.push({id: output.alldata[i].id, adres: output.alldata[i].adres, type: output.alldata[i].type})
            }; 
        }
        return electroItemArray;
    }

    for (let i = 0; i<structure.length; i++) {
        if (structure.active[i]) {
            let id:number = structure.id[i];
            let kringnaam:string = structure.findKringName(id).trim();
            if (kringnaam != '') {
                let type:string = (structure.data[i] as Electro_Item).getType();
                if ( (type != null) && (excludedTypes.indexOf(type) === -1) ) {
                    let adres:string = (structure.data[i] as Electro_Item).getReadableAdres();
                    output.alldata.push({id: id, kringnaam: kringnaam, adres:adres, type: type});
                }
            }
        }
    }

    return output;
}