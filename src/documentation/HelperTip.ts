class HelperTip {
    private storage: MultiLevelStorage<any>;
    private storagePrefix: string;
  
    constructor(storage: MultiLevelStorage<any>, storagePrefix: string = 'helpertip') {
        this.storage = storage;
        this.storagePrefix = storagePrefix;
    }
  
    // Show the helper tip if it hasn't been dismissed before
    show(key: string, htmlContent: string, checked: boolean = false, callback: () => void = () => {}): void {
        const neverDisplayKey = `${this.storagePrefix}.${key}.neverDisplay`;
        const displayedInThisSessionKey = `${this.storagePrefix}.${key}.displayedInThisSession`;
    
        // Check if the tip was dismissed before
        if ( (this.storage.get(neverDisplayKey) === true) || (this.storage.get(displayedInThisSessionKey) === true) ) {
          if (callback) callback();
          return; // Do nothing if the tip was dismissed or already shown
        }
    
        // Create the popup
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'popupOverlay';
        popupOverlay.classList.add('popup-overlay');
        
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.classList.add('popup');
    
        // Add the HTML content
        popup.innerHTML = htmlContent;
    
        // Create the "Never display again" checkbox
        const checkboxLabel = document.createElement('label');
        checkboxLabel.style.display = 'block';
        checkboxLabel.style.marginTop = '10px';
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkboxLabel.appendChild(checkbox);
    
        const checkboxText = document.createTextNode(' Deze tekst nooit meer weergeven in deze browser.');
        const italicText = document.createElement('i');
        italicText.appendChild(checkboxText);
        checkboxLabel.appendChild(italicText);
    
        popup.appendChild(checkboxLabel);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '0px';        
    
        // Create the "OK" button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.classList.add('rounded-button');
    
        okButton.addEventListener('click', (event) => {
          //stop the event from propagating
          event.stopPropagation();
          // Set the neverdisplay flag if the checkbox is checked
          this.storage.set(displayedInThisSessionKey, true, true);
          if (checkbox.checked) {
            this.storage.set(neverDisplayKey, true);
          }
          // Remove the popup
          document.body.removeChild(popupOverlay);
          document.body.style.pointerEvents = 'auto';
          if (callback) callback();
        });
    
        buttonContainer.appendChild(okButton);

        popup.appendChild(buttonContainer);
    
        // Add the popup to the document body
        popupOverlay.appendChild(popup);
        document.body.appendChild(popupOverlay);

        popupOverlay.style.visibility = 'visible';
        document.body.style.pointerEvents = 'none'; // Disable interactions with the background
        popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    }
}