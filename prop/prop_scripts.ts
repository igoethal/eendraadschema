export function PROP_GDPR() {
  return("");
}

export function PROP_getCookieText() {
  return("");
}

globalThis.propUpload = (text: string) => {
  return(0);
  //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
  
  //avoid warning on text never used
  text;
}

export class CookieBanner {
  run() {} //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}
