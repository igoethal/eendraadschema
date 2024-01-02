class Ventilator extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); 
        this.resetKeys();
    }

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = mykeys[0][2];
        this.props.adres            = mykeys[15][2];
    }

    resetKeys() {
        this.clearKeys();
        this.props.type = "Ventilator";
        this.props.adres = "";  
        delete this.keys; 
    } 

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   + '<use xlink:href="#ventilator" x="21" y="25"></use>';
        
        mySVG.data += this.addPropAddress(mySVG,55,10);
        mySVG.data += "\n";

        return(mySVG);
    }

}