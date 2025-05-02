class Dialog {

    private title: string;
    private body: string;
    private buttons: {text: string, callback: () => void}[];
  
    constructor(title: string, body: string, buttons: {text: string, callback: () => void}[] = null) {
        this.title = title;
        this.body = body;
        if (!buttons) {
            this.buttons = [{text: 'OK', callback:() => {}}];
        } else {
            this.buttons = buttons;
        }
    }
  
    // Show the helper tip if it hasn't been dismissed before
    show(): void {
  
        // Create the popup
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'popupOverlay';
        popupOverlay.classList.add('popup-overlay');
        
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.classList.add('popup');
    
        // Add the HTML content
        popup.innerHTML = `<h3>${this.title}</h3><p>${this.body}</p>`;

        // Add the buttons
    
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '0px';        

        for (const button of this.buttons) {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = button.text;
            buttonElement.classList.add('rounded-button');
            buttonElement.addEventListener('click', (() => {
                document.body.removeChild(popupOverlay);
                document.body.style.pointerEvents = 'auto';
                button.callback();
            }).bind(this))
            buttonContainer.appendChild(buttonElement);
        }

        popup.appendChild(buttonContainer);
    
        // Add the popup to the document body
        popupOverlay.appendChild(popup);
        document.body.appendChild(popupOverlay);

        popupOverlay.style.visibility = 'visible';
        document.body.style.pointerEvents = 'none'; // Disable interactions with the background
        popupOverlay.style.pointerEvents = 'auto'; // Enable interactions with the popup
    }
}