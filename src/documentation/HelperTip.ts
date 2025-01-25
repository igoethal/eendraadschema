class HelperTip {
    private storage: MultiLevelStorage<any>;
    private storagePrefix: string;
  
    constructor(storage: MultiLevelStorage<any>, storagePrefix: string = 'helpertip') {
      this.storage = storage;
      this.storagePrefix = storagePrefix;
    }
  
    // Show the helper tip if it hasn't been dismissed before
    show(key: string, htmlContent: string): void {
      const neverDisplayKey = `${this.storagePrefix}.${key}.neverDisplay`;
      const displayedInThisSessionKey = `${this.storagePrefix}.${key}.displayedInThisSession`;
  
      // Check if the tip was dismissed before
      if ( (this.storage.get(neverDisplayKey) === true) || (this.storage.get(displayedInThisSessionKey) === true) ) {
        return; // Do nothing if the tip was dismissed or already shown
      }
  
      // Create the popup
      const popupOverlay = document.createElement('div');
      popupOverlay.id = 'popupOverlay';
      popupOverlay.style.position = 'fixed';
      popupOverlay.style.top = '0';
      popupOverlay.style.left = '0';
      popupOverlay.style.width = '100%';
      popupOverlay.style.height = '100%';
      popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      popupOverlay.style.display = 'flex';
      popupOverlay.style.justifyContent = 'center';
      popupOverlay.style.alignItems = 'center';
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.style.zIndex = '9999';
      
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.backgroundColor = 'white';
      popup.style.padding = '5px 20px 20px';
      popup.style.border = '1px solid #ccc';
      popup.style.borderRadius = '8px';
      popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      popup.style.zIndex = '1000';
  
      // Add the HTML content
      popup.innerHTML = htmlContent;
  
      // Style the title
      const title = popup.querySelector('h3');
      if (title) {
        title.style.color = '#06F'; // Similar blue as the OK button
      }
  
      // Create the "Never display again" checkbox
      const checkboxLabel = document.createElement('label');
      checkboxLabel.style.display = 'block';
      checkboxLabel.style.marginTop = '10px';
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkboxLabel.appendChild(checkbox);
  
      const checkboxText = document.createTextNode(' Deze tekst niet meer weergeven');
      const italicText = document.createElement('i');
      italicText.appendChild(checkboxText);
      checkboxLabel.appendChild(italicText);
  
      popup.appendChild(checkboxLabel);
  
      // Create the "OK" button
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      okButton.style.marginTop = '10px';
      okButton.style.padding = '10px 20px';
      okButton.style.cursor = 'pointer';
      okButton.style.backgroundColor = '#3399FF'; // Lighter blue hue
      okButton.style.color = 'white';
      okButton.style.border = 'none';
      okButton.style.borderRadius = '5px'; // Rounded corners
      okButton.style.display = 'block';
      okButton.style.marginLeft = 'auto';
      okButton.style.marginRight = 'auto';
      okButton.style.width = '100px'; // Wider button
  
      // Add hover effect
      okButton.addEventListener('mouseover', () => {
        okButton.style.backgroundColor = '#06F'; // Darker blue on hover
      });
      okButton.addEventListener('mouseout', () => {
        okButton.style.backgroundColor = '#3399FF'; // Lighter blue when not hovering
      });
  
      okButton.addEventListener('click', () => {
        // Set the neverdisplay flag if the checkbox is checked
        this.storage.set(displayedInThisSessionKey, true, true);
        if (checkbox.checked) {
          this.storage.set(neverDisplayKey, true);
        }
        // Remove the popup
        document.body.removeChild(popupOverlay);
        document.body.style.pointerEvents = 'auto';
      });
  
      popup.appendChild(okButton);
  
      // Add the popup to the document body
      popupOverlay.appendChild(popup);
      document.body.appendChild(popupOverlay);

      popupOverlay.style.visibility = 'visible';
      document.body.style.pointerEvents = 'none'; // Disable interactions with the background
      popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    }
  }