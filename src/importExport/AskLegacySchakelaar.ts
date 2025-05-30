export class AskLegacySchakelaar {
  
    // Show the helper tip if it hasn't been dismissed before
    show() {
      
      // Create the popup
      const popupOverlay = document.createElement('div');
      popupOverlay.id = 'popupOverlay';
      Object.assign(popupOverlay.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        visibility: 'hidden', zIndex: '9999'
      });
      
      const popup = document.createElement('div');
      Object.assign(popup.style, {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', backgroundColor: 'white',
        padding: '5px 20px 20px', border: '1px solid #ccc', borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', zIndex: '1000'
      });
  
      // Add the HTML content
      popup.innerHTML = `<h3>Aanpassing symbolen schakelaars</h3>`+
                        `<p>Beste gebruiker. Uw situatieschema bevat symbolen voor schakelaars. `+
                        `Tot nogtoe werden die altijd afgebeeld met een klein lijntje (leiding) aan de zijkant.</p>`+
                        '<table border="0" style="border-collapse:collapse"><tr><td>' +
                          `<svg style="padding: 0px; margin: 0px; display:block" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" viewBox="12 0 38 40" width="38" height="40"><defs><g id="signalisatielamp"><circle cx="0" cy="0" r="5" fill="white" stroke="black"></circle><line x1="-3" y1="-3" x2="3" y2="3" stroke="black"></line><line x1="-3" y1="3" x2="3" y2="-3" stroke="black"></line></g><g id="schakelaar_enkel"><line x1="0" y1="0" x2="10" y2="-20" stroke="black"></line><line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black"></line><circle cx="0" cy="0" r="5" fill="white" stroke="black"></circle></g></defs><line x1="1" x2="31" y1="25" y2="25" stroke="black"></line><use xlink:href="#schakelaar_enkel" x="31" y="25"></use></svg>`+
                        '</td><td>' +
                          `<svg style="padding: 0px; margin: 0px; display:block" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" viewBox="12 0 38 40" width="38" height="40"><defs><g id="signalisatielamp"><circle cx="0" cy="0" r="5" fill="white" stroke="black"></circle><line x1="-3" y1="-3" x2="3" y2="3" stroke="black"></line><line x1="-3" y1="3" x2="3" y2="-3" stroke="black"></line></g><g id="schakelaar_enkel"><line x1="0" y1="0" x2="10" y2="-20" stroke="black"></line><line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black"></line><circle cx="0" cy="0" r="5" fill="white" stroke="black"></circle></g></defs><use xlink:href="#schakelaar_enkel" x="31" y="25"></use></svg>`+
                        '</td></tr></table>' +
                        `<p>Op terechte vraag van enkele gebruikers zal dat voor toekomstige schema's niet meer het geval zijn en zullen de `+
                        `symbolen getekend worden zoals gangbaar in de meeste andere tekenprogramma's.</p>`+
                        `<p>Doorgaans zal het dan ook niet langer noodzakelijk zijn om dergelijke schakelaars te roteren.</p>` +
                        `<p>Voor dit schema kan u zelf nog kiezen hoe u de symbolen wenst weer te geven.</p>`
  
      // Style the title
      const title = popup.querySelector('h3');
      if (title) title.style.color = '#06F'; // Similar blue as the OK button
  
      // Create the radioButtons
      const radioButtons = document.createElement('div');
      radioButtons.style.display = 'flex';
      radioButtons.style.flexDirection = 'column';
      radioButtons.style.marginTop = '10px';
  
      const radioButton1 = document.createElement('input');
      radioButton1.type = 'radio';
      radioButton1.name = 'symbolChoice';
      radioButton1.id = 'keepLegacy';
      radioButton1.checked = true;

      const label1 = document.createElement('label');
      label1.htmlFor = 'keepLegacy';
      label1.style.display = 'flex';
      label1.style.alignItems = 'start';
      label1.style.marginBottom = '10px';
      label1.appendChild(radioButton1);
      label1.appendChild(document.createTextNode('U behoudt de symbolen zoals voorheen voor dit schema.'));
      
      radioButtons.appendChild(label1);
      
      const radioButton2 = document.createElement('input');
      radioButton2.type = 'radio';
      radioButton2.name = 'symbolChoice';
      radioButton2.id = 'dropLegacy';

      const label2 = document.createElement('label');
      label2.htmlFor = 'dropLegacy';
      label2.style.display = 'flex';
      label2.style.alignItems = 'start';
      label2.style.marginBottom = '10px';
      label2.appendChild(radioButton2);
      label2.appendChild(document.createTextNode('U gebruikt de nieuwe symbolen zonder lijntje. De oorspronkelijke rotatie wordt hersteld. Mogelijk zal u bepaalde symbolen zelf opnieuw moeten roteren.'));
      
      radioButtons.appendChild(label2);
  
      popup.appendChild(radioButtons);
  
      // Create the "OK" button
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      Object.assign(okButton.style, {
        marginTop: '10px', padding: '10px 20px', cursor: 'pointer',
        backgroundColor: '#3399FF', // Lighter blue hue color: 'white',
        border: 'none', borderRadius: '5px', // Rounded corners display: 'block',
        marginLeft: 'auto', marginRight: 'auto', width: '100px' // Wider button
      });
  
      // Add hover effect
      okButton.addEventListener('mouseover', () => {
        okButton.style.backgroundColor = '#06F'; // Darker blue on hover
      });
      okButton.addEventListener('mouseout', () => {
        okButton.style.backgroundColor = '#3399FF'; // Lighter blue when not hovering
      });
  
      popup.appendChild(okButton);
  
      // Add the popup to the document body
      popupOverlay.appendChild(popup);
      document.body.appendChild(popupOverlay);

      popupOverlay.style.visibility = 'visible';
      document.body.style.pointerEvents = 'none'; // Disable interactions with the background
      popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup

      return new Promise((resolve) => {
        okButton.addEventListener('click', () => {
          const symbolChoice = document.querySelector('input[name="symbolChoice"]:checked');
          if (symbolChoice && symbolChoice.id === 'keepLegacy') {
            globalThis.structure.properties.legacySchakelaars = true;
          } else if (symbolChoice && symbolChoice.id === 'dropLegacy') {
            globalThis.structure.properties.legacySchakelaars = false;
            globalThis.structure.sitplan.dropLegacySchakelaars();
          }
  
          // Remove the popup
          document.body.removeChild(popupOverlay);
          document.body.style.pointerEvents = 'auto';
          resolve("OK clicked!");
        }, { once: true });

      });

    }

    

  }




  