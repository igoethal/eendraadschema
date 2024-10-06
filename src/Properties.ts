class Properties {
  filename: string;
  owner: string;
  installer: string;
  info: string;

  constructor() {
    this.filename = "eendraadschema.eds";
    this.owner = "Voornaam Achternaam<br>Straat 0<br>0000 gemeente<br>Tel: +32 00 00 00 00<br>GSM: +32 000 00 00 00<br>e-mail: voornaam.achternaam@domein.be";;
    this.installer = "idem";
    this.info = "1 x 230V + N ~50 Hz";
  };

  setFilename(name) {
    this.filename = name;
  }
}
