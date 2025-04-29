export class ContextMenu {
    private menuItems: { label: string, shortcut?: string, callback: () => void }[] = [];
    private menuElement: HTMLElement | null = null;

    /**
     * Constructor voor het initialiseren van het contextmenu-element.
     * @param div - Het HTML-element waaraan het contextmenu wordt toegevoegd.
     */
    constructor(div: HTMLElement = document.body) {
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'context-menu';
        div.appendChild(this.menuElement);
    }

    /**
     * Wis alle menu-items.
     */
    clearMenu(): void {
        this.menuItems = [];
        if (this.menuElement) {
            this.menuElement.innerHTML = '';
        }
    }

    /**
     * Voeg een menu-item toe met een optionele sneltoets.
     * @param label - De tekstlabel van het menu-item.
     * @param callback - De functie die wordt aangeroepen bij het klikken op het menu-item.
     * @param shortcut - De optionele sneltoets voor het menu-item.
     */
    addMenuItem(label: string, callback: () => void, shortcut?: string): void {
        this.menuItems.push({ label, shortcut, callback });
    }

    /**
     * Voeg een scheidingslijn toe aan het menu.
     */
    addLine(): void {
        this.menuItems.push({ label: 'separator', callback: () => {} });
    }

    /**
     * Render de menu-items.
     */
    private renderMenu(): void {
        if (this.menuElement) {
            this.menuElement.innerHTML = '';
            this.menuItems.forEach((item, index) => {
                if (item.label === 'separator') {
                    const separator = document.createElement('hr');
                    separator.className = 'context-menu-separator';
                    this.menuElement.appendChild(separator);
                } else {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'context-menu-item';

                    const labelElement = document.createElement('span');
                    labelElement.textContent = item.label;

                    const shortcutElement = document.createElement('span');
                    shortcutElement.textContent = item.shortcut || '';
                    shortcutElement.className = 'context-menu-shortcut';

                    menuItem.appendChild(labelElement);
                    menuItem.appendChild(shortcutElement);

                    menuItem.addEventListener('click', () => {
                        item.callback();
                        this.hide();
                    });

                    this.menuElement.appendChild(menuItem);
                }
            });
        }
    }

    /**
     * Toon het contextmenu op de locatie van de muisklik.
     * @param event - Het muisgebeurtenisobject.
     */
    show(event: MouseEvent): void {
        if (this.menuElement) {
            this.renderMenu();
            this.menuElement.style.display = 'block';
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;
            const { offsetWidth, offsetHeight } = this.menuElement;

            let left = clientX;
            let top = clientY;

            if (left + offsetWidth > innerWidth) {
                left = innerWidth - offsetWidth;
            }
            if (top + offsetHeight > innerHeight) {
                top = innerHeight - offsetHeight;
            }

            this.menuElement.style.left = `${left}px`;
            this.menuElement.style.top = `${top}px`;
        }
    }

    /**
     * Verberg het contextmenu.
     */
    hide(): void {
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
        }
    }
}
