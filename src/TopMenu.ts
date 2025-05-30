export interface MenuItem {
    name: string;
    callback: () => void;
}

export class TopMenu {
    private ulElement: HTMLUListElement;
    private liClassName: string;
    private menuItems: MenuItem[];

    constructor(ulId: string, liClassName: string, menuItems: MenuItem[]) {
        this.ulElement = document.getElementById(ulId) as HTMLUListElement;
        this.liClassName = liClassName;
        this.menuItems = menuItems;

        this.renderMenu();
        this.resetToFirstItem(); // Ensure the first item is selected initially
    }

    private renderMenu() {
        this.ulElement.innerHTML = ''; // Clear any existing content
        this.menuItems.forEach(item => {
            const liElement = document.createElement('li');
            const aElement = document.createElement('a');

            liElement.className = this.liClassName;
            aElement.innerText = item.name;

            aElement.addEventListener('click', () => {
                this.selectItem(aElement);
                item.callback();
            });

            liElement.appendChild(aElement);
            this.ulElement.appendChild(liElement);
        });
    }

    private selectItem(selectedElement: HTMLAnchorElement) {
        // Remove 'current' ID from all <a> elements
        const items = this.ulElement.querySelectorAll('a');
        items.forEach(item => item.removeAttribute('id'));

        // Add 'current' ID to the clicked <a> element
        selectedElement.id = 'current';
    }

    public resetToFirstItem() {
        const firstItem = this.ulElement.querySelector('a');
        if (firstItem) {
            this.selectItem(firstItem as HTMLAnchorElement);
        }
    }

    public selectMenuItemByName(name: string) { 
        const item = this.menuItems.find(menuItem => menuItem.name === name); 
        if (item) { 
            const aElement = Array.from(this.ulElement.querySelectorAll('a')).find(a => a.innerText === name); 
            if (aElement) { 
                this.selectItem(aElement as HTMLAnchorElement); 
                item.callback(); 
            } 
        } 
    }

    public selectMenuItemByOrdinal(nr: number) {
        // Remove 'current' ID from all <a> elements
        const items = this.ulElement.querySelectorAll('a');
        items.forEach(item => item.removeAttribute('id'));

        this.selectItem(items[nr]);
    }
    
}


