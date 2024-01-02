class Boiler extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); 
        this.resetKeys();
    }

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = mykeys[0][2];
        this.props.heeftAccumulatie = mykeys[3][2];
        this.props.adres            = mykeys[15][2];
    }

    resetKeys() {
        this.clearKeys();
        this.props.type                = "Boiler"; 
        this.props.heeftAccumulatie    = false;  
        this.props.adres               = "";
        delete this.keys; 
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5) + ", ";
        output += "Accumulatie: " + this.checkboxPropToHTML('heeftAccumulatie');
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.props.heeftAccumulatie) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
          }

        mySVG.data += this.addPropAddress(mySVG,60);
        mySVG.data += "\n";

        return(mySVG);
    }

}