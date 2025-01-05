function isDevMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('dev');
}

function showSituationPlanPage() {
    toggleAppView('draw');

    if (!(structure.sitplan)) { structure.sitplan = new SituationPlan() };
    if (!(structure.sitplanview)) {
        //First destroy all elements on the DOM with id starting with "SP_" to avoid any orphans being left from earlier exercises
        let elements = document.querySelectorAll('[id^="SP_"]');
        elements.forEach(e => e.remove());
        //Then create the SituationPlanView
        structure.sitplanview = new SituationPlanView(
            document.getElementById('outerbox'), 
            document.getElementById('paper'), 
            structure.sitplan) 
    };

    structure.sitplanview.updateRibbon();
    
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    document.getElementById('outerbox').appendChild(spinner);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            render();
        });
    });

    function render() {
        const start = performance.now();
        //structure.sitplanview.zoomToFit();
        structure.sitplanview.redraw();
        
        const end = performance.now();
        console.log(`Update took ${end - start}ms`);
    
        document.getElementById('outerbox').removeChild(spinner);    
    }
}

class MouseDrag {
    private startDragx: number;
    private startDragy: number;
    private startOffsetLeft: number;
    private startOffsetTop: number;
    private zoomfactor: number = 1;

    constructor() {}

    startDrag(mousex: number, mousey: number, startOffsetLeft: number, startOffsetTop: number, zoomfactor) {
        this.startDragx = mousex;
        this.startDragy = mousey;
        this.startOffsetLeft = startOffsetLeft;
        this.startOffsetTop = startOffsetTop;
        this.zoomfactor = zoomfactor;
    }

    returnNewLeftTop(mousex: number, mousey: number) {
        return ( {
            left: (mousex - this.startDragx) / this.zoomfactor + this.startOffsetLeft,
            top: (mousey - this.startDragy) / this.zoomfactor + this.startOffsetTop});
    }
}

class EventManager {
    private listeners: { element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject }[] = [];

    addEventListener(element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject) {
        const existingListenerIndex = this.listeners.findIndex(l => l.element === element && l.type === type); 
        if (existingListenerIndex !== -1) {
             const existingListener = this.listeners[existingListenerIndex]; 
             element.removeEventListener(type, existingListener.listener); 
             this.listeners.splice(existingListenerIndex, 1); 
        } 

        this.listeners.push({ element, type, listener });
        element.addEventListener(type, listener);
    }

    removeAllEventListeners() {
        this.listeners.forEach(({ element, type, listener }) => {
            element.removeEventListener(type, listener);
        });
        this.listeners = [];
    }

    dispose() {
        this.removeAllEventListeners();
    }
}

class SituationPlanView {
    private zoomfactor:number = 1;
    private outerbox: HTMLElement;
    private paper:HTMLElement;

    private currentBox:HTMLElement = null;
    private selectedBox:HTMLElement = null;

    private mousedrag: MouseDrag;

    private boxes = {};
    private sitplan;

    private event_manager;

    constructor(outerbox: HTMLElement, paper: HTMLElement, sitplan: SituationPlan) {
        this.outerbox = outerbox;
        this.paper = paper;
        this.sitplan = sitplan;
        this.paper.style.transformOrigin = 'top left'; // Keep the origin point consistent when scaling
        this.reloadSitPlan();
        this.mousedrag = new MouseDrag();

        this.zoomToFit();

        this.event_manager = new EventManager();

        // Remove red border when clicking on the body
        this.event_manager.addEventListener(outerbox, 'mousedown', () => { this.clearSelection(); } );
        this.event_manager.addEventListener(outerbox, 'touchstart', () => { this.clearSelection(); } );
    }

    dispose() {
        this.event_manager.dispose();
        //loop over all situationplanelements and remove the corresponding boxes from the DOM
        for (let element of this.sitplan.elements) {
            if (element.boxref != null) element.boxref.remove();
            if (element.boxlabelref != null) element.boxlabelref.remove();
        }
    }

    attachDeleteButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.deleteBox(); undostruct.store(); } ); 
        
    };

    attachScaleButton(elem: HTMLElement, increment: number) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.scaleBox(increment); undostruct.store(); } ); 
    };

    attachRotateButton(elem: HTMLElement, increment: number) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.rotateBox(increment); undostruct.store(); } ); 
    };

    attachSendToBackButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.sendToBack(); } ); 
    };

    attachZoomButton(elem: HTMLElement, increment: number) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.zoom(increment); } ); 
    };

    attachZoomToFitButton(elem: HTMLElement) { 
        this.event_manager.addEventListener(elem, 'click', () => { this.zoomToFit(); } ); 
    };

    attachAddElementFromFileButton(elem: HTMLElement, fileinput: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => { fileinput.click(); } );
        this.event_manager.addEventListener(fileinput, 'change', (event) => { 
            let element = this.sitplan.addElementFromFile(event, this.sitplan.activePage, 550, 300, 
                (() => {
                    this.reloadSitPlan();
                    this.clearSelection();
                    this.selectBox(element.boxref);
                    this.redraw();
                    undostruct.store();
                }).bind(this)
            );
        });
    }

    attachAddElectroItemButton(elem: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => {
            // Display an html input dialog in the browser and ask for a number, return the number as variable id
            SituationPlanView_ElementPropertiesPopup(null,
                (id, adrestype, adres, adreslocation, labelfontsize, scale, rotate) => {
                    if (id != null) {
                        let element = this.sitplan.addElementFromElectroItem(id, this.sitplan.activePage, 550, 300, 
                                                                  adrestype, adres, adreslocation, labelfontsize,
                                                                  scale, rotate);
                        if (element != null) {
                            this.reloadSitPlan();
                            this.clearSelection();
                            this.selectBox(element.boxref);
                            this.redraw();
                            undostruct.store();
                        }
                    } else {
                        alert('Geen geldig ID ingegeven!');
                    }
                }
            ); 
        } );
    }

    attachEditButton(elem: HTMLElement) {
        this.event_manager.addEventListener(elem, 'click', () => {
            if (this.selectedBox) {
                const id = this.selectedBox.id;
                const pic = (this.selectedBox as any).picref;
                SituationPlanView_ElementPropertiesPopup(pic,
                    (id, adrestype, adres, adreslocation, labelfontsize, scale, rotate) => {
                        if (id != null) {
                            pic.setElectroItemId(id);
                            pic.setAdres(adrestype,adres,adreslocation);
                        }
                        pic.labelfontsize = labelfontsize;
                        pic.scale = scale;
                        pic.rotate = rotate;
                        this.updateBoxContent(this.selectedBox); //content needs to be updated first to know the size of the box
                        this.updateBoxPosition(this.selectedBox);
                        undostruct.store();
                    }
                );
            }
        } );
    }

    private makeBox(element: SituationPlanElement) {
        let box = document.createElement('div');
        box.id = element.id;
        box.className = "box";
        (box as any).picref = element; // We add an extra property to the DOM to be able to find back our data from within the browser
        element.boxref = box;

        let boxlabel = document.createElement('div');
        boxlabel.className = "boxlabel";
        boxlabel.innerHTML = element.getAdres();
        element.boxlabelref = boxlabel;

        this.paper.append(box);
        this.paper.append(boxlabel);
    
        this.updateBoxContent(box); //content needs to be updated first to know the size of the box
        this.updateBoxPosition(box);

        box.addEventListener('mousedown', this.startDrag);
        box.addEventListener('touchstart', this.startDrag);
        box.addEventListener('touchend', this.stopDrag);
    
        return box;
    }

    deleteBox() {
        if (this.selectedBox) {
            let id = this.selectedBox.id;
            let picref = (this.selectedBox as any).picref;

            this.selectedBox.remove();
            if (picref.boxlabelref != null) picref.boxlabelref.remove();

            this.sitplan.removeElement(picref);
            this.selectedBox = null
        }
    }

    scaleBox(increment: number) {
        if (this.selectedBox) {
            (this.selectedBox as any).picref.scale = Math.min(Math.max(0.1,(this.selectedBox as any).picref.scale+increment),1000);

            this.updateBoxContent(this.selectedBox); //content needs to be updated first to know the size of the box
            this.updateBoxPosition(this.selectedBox);
        }
    }

    rotateBox(degrees: number) {
        if (this.selectedBox) {
            let id = this.selectedBox.id;
            let pic = (this.selectedBox as any).picref;
            pic.rotate = (pic.rotate + degrees) % 360;
            this.selectedBox.style.transform = `rotate(${pic.rotate}deg)`;
        }
    }

    /**
     * Send the selected box to the back of the z-index stack and reorder the elements of the situation plan accordingly
     * so that after saving or during printing the elements are drawn in the same order.
     * 
     * @returns void
     */

    sendToBack() {
        if (this.selectedBox) {
            for (let element of this.sitplan.elements) {
                if (element.boxref != null) {
                    let newzindex;

                    if (element.boxref != this.selectedBox) {
                        newzindex = (parseInt(element.boxref.style.zIndex) || 0)+1;
                    } else { 
                        newzindex = 0; }

                    element.boxref.style.zIndex = newzindex.toString();
                    if (element.boxlabelref != null) { 
                        element.boxlabelref.style.zIndex = newzindex.toString(); }
                    
                }
            }            
        }
        this.sitplan.orderByZIndex();
        undostruct.store();
    }

    private updateBoxPosition(box) {
        let pic = box.picref;

        box.classList.remove('hidden');
    
        box.style.left = ((pic.posx-pic.sizex*pic.scale/2-SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        box.style.top = ((pic.posy-pic.sizey*pic.scale/2-SITPLANVIEW_SELECT_PADDING)).toString() + "px";
        box.style.width = ((pic.sizex*pic.scale + SITPLANVIEW_SELECT_PADDING*2)).toString() + "px";
        box.style.height = ((pic.sizey*pic.scale + SITPLANVIEW_SELECT_PADDING*2)).toString() + "px";

        let rotate = pic.rotate;
        let spiegel = false;
        rotate = rotate % 360;
        if ( (rotate >= 90) && (rotate < 270) ) {
            if (pic.rotates360degrees()) spiegel = true;
            if (pic.isEendraadschemaSymbool()) rotate = rotate - 180;
        }

        box.style.transform = `rotate(${rotate}deg)` + (spiegel ? ' scaleX(-1)' : '');

        if (pic != null) {
            let boxlabel = pic.boxlabelref;
            boxlabel.classList.remove('hidden');

            if (boxlabel != null) {

                pic.labelsizex = boxlabel.offsetWidth;
                pic.labelsizey = boxlabel.offsetHeight;
                
                switch (pic.adreslocation) {
                    case 'links': {
                        let rotate = Math.abs(pic.rotate) % 180;
                        if (rotate > 90) rotate = 180 - rotate;
                        let offset1 = (pic.sizex/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos(rotate/180*Math.PI));
                        let offset2 = (pic.sizey/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos((90-rotate)/180*Math.PI));
                        let offset = Math.min(offset1,offset2);

                        boxlabel.style.left = (pic.posx - offset - boxlabel.offsetWidth) + 'px';
                        boxlabel.style.top = (pic.posy - boxlabel.offsetHeight/2) + 'px';

                        pic.labelposx = (pic.posx - offset - boxlabel.offsetWidth/2);
                        pic.labelposy = (pic.posy + 1);
                        
                        break; }
                    case 'rechts': {
                        let rotate = Math.abs(pic.rotate) % 180;
                        if (rotate > 90) rotate = 180 - rotate;
                        let offset1 = (pic.sizex/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos(rotate/180*Math.PI));
                        let offset2 = (pic.sizey/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos((90-rotate)/180*Math.PI));
                        let offset = Math.min(offset1,offset2);

                        boxlabel.style.left = (pic.posx + offset + 0) + 'px';
                        boxlabel.style.top = ((pic.posy) - boxlabel.offsetHeight/2) + 'px';

                        pic.labelposx = (pic.posx + offset + boxlabel.offsetWidth/2);
                        pic.labelposy = (pic.posy + 1);

                        break; }
                    case 'boven': {
                        let rotate = Math.abs(pic.rotate) % 180;
                        if (rotate > 90) rotate = 180 - rotate;
                        let offset1 = (pic.sizey/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos(rotate/180*Math.PI));
                        let offset2 = (pic.sizex/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos((90-rotate)/180*Math.PI));
                        let offset = Math.min(offset1,offset2);
                        boxlabel.style.left = ((pic.posx) - boxlabel.offsetWidth/2) + 'px';
                        boxlabel.style.top = ((pic.posy - offset) - boxlabel.offsetHeight*0.8) + 'px';

                        pic.labelposx = (pic.posx);
                        pic.labelposy = (pic.posy - offset - boxlabel.offsetHeight*0.5/2);

                        break; }
                    case 'onder': {
                        let rotate = Math.abs(pic.rotate) % 180;
                        if (rotate > 90) rotate = 180 - rotate;
                        let offset1 = (pic.sizey/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos(rotate/180*Math.PI));
                        let offset2 = (pic.sizex/2*pic.scale+SITPLANVIEW_SELECT_PADDING)/(Math.cos((90-rotate)/180*Math.PI));
                        let offset = Math.min(offset1,offset2);
                        boxlabel.style.left = ((pic.posx) - boxlabel.offsetWidth/2) + 'px';
                        boxlabel.style.top = ((pic.posy + offset) - boxlabel.offsetHeight*0.2) + 'px';

                        pic.labelposx = (pic.posx);
                        pic.labelposy = (pic.posy + offset + boxlabel.offsetHeight*0.7/2);

                        break; }
                }
            }

            if (this.sitplan.activePage != pic.page) boxlabel.classList.add('hidden');
        }

        if (this.sitplan.activePage != pic.page) box.classList.add('hidden');
    }

    private updateBoxContent(box) {
        let pic = box.picref;

        let svg = pic.getScaledSVG();
        if (svg != null) box.innerHTML = pic.getScaledSVG();

        if (pic.boxlabelref != null) {
            let adres = pic.getAdres();
            if (pic.labelfontsize != null) pic.boxlabelref.style.fontSize = String(pic.labelfontsize) + 'px';
            if (adres != null) pic.boxlabelref.innerHTML = adres;
        }
    }

    clearSelection() {
        let boxes = document.querySelectorAll('.box');
        boxes.forEach(b => b.classList.remove('selected'));
        this.selectedBox = null;
    }

    private startDrag = (event) => {
        event.stopPropagation();   // Prevent body click event
        this.clearSelection();          // Clears any existing selection
        this.selectBox(event.target);   // Selects the box we want to drag
        this.currentBox = event.target;   // IS THIS NEEDED IF WE ALREADY HAVE SELECTEDBOX ????
        
        if (event.type === 'mousedown') {
            this.mousedrag.startDrag(event.clientX, event.clientY, this.currentBox.offsetLeft, this.currentBox.offsetTop, this.zoomfactor);
        } else if (event.type === 'touchstart') {
            const touch = event.touches[0];
            this.mousedrag.startDrag(touch.clientX, touch.clientY, this.currentBox.offsetLeft, this.currentBox.offsetTop, this.zoomfactor);
        }

        document.addEventListener('mousemove', this.processDrag);
        document.addEventListener('touchmove', this.processDrag, { passive: false });
        document.addEventListener('mouseup', this.stopDrag);
        document.addEventListener('touchend', this.stopDrag);
    }

    private stopDrag = () => {
        document.removeEventListener('mousemove', this.processDrag);
        document.removeEventListener('touchmove', this.processDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        document.removeEventListener('touchend', this.stopDrag);
        this.currentBox = null;
        undostruct.store();
    }

    private processDrag = (event) => {
        if (this.currentBox) {
            event.preventDefault();

            let newLeftTop: {left: number,top: number};
            if (event.type === 'mousemove') {
                newLeftTop = this.mousedrag.returnNewLeftTop(event.clientX,event.clientY);
            } else if (event.type === 'touchmove') {
                const touch = event.touches[0];
                newLeftTop = this.mousedrag.returnNewLeftTop(touch.clientX,touch.clientY);
            }
    
            // Ensure the box stays within reasonable boundaries
            newLeftTop.left = Math.max(- this.currentBox.offsetWidth/2, newLeftTop.left);
            newLeftTop.top = Math.max(- this.currentBox.offsetHeight/2, newLeftTop.top);

            (this.currentBox as any).picref.posx = newLeftTop.left + (this.currentBox.offsetWidth/2);
            (this.currentBox as any).picref.posy = newLeftTop.top + (this.currentBox.offsetHeight/2);

            this.updateBoxPosition(this.currentBox);
        }
    }

    private selectBox(box) {
        box.classList.add('selected');
        this.selectedBox = box;
    }

    reloadSitPlan() { //Loops again over the situation plan and checks that we have divs for everything
        for (let element of this.sitplan.elements) {
            if (element.electroItemId != null) {
                let ordinal = structure.getOrdinalById(element.electroItemId);
                if (ordinal == null) {
                    this.sitplan.removeElement(element);
                    this.reloadSitPlan(); // Go to the next element in the loop
                    return;
                }
            }
            if (this.boxes[element.id] === undefined) {
                this.boxes[element.id] = this.makeBox(element);
            }
        }
    }

    redraw() {
        this.selectPage(this.sitplan.activePage);
        this.reloadSitPlan();
        for (let element of this.sitplan.elements) {
            this.updateBoxContent(element.boxref); //content needs to be updated first to know the size of the box
            this.updateBoxPosition(element.boxref);
        }
        this.updateRibbon();
    }

    selectPage(page: number) {
        this.sitplan.activePage = page;

        for (let element of this.sitplan.elements) {
            if (element.page != page) {
                element.boxref.classList.add('hidden');
                element.boxlabelref.classList.add('hidden');
            } else {
                element.boxref.classList.remove('hidden');
                element.boxlabelref.classList.remove('hidden');
            }
        }

        this.updateRibbon();
    }

    setzoom(factor: number) {
        this.zoomfactor = Math.min(Math.max(SITPLANVIEW_ZOOMINTERVAL.MIN, factor), SITPLANVIEW_ZOOMINTERVAL.MAX);
        this.paper.style.transform = `scale(${this.zoomfactor})`;
    }
    
    zoom(increment: number) { //increment is a value indicating how much we can zoom
        this.setzoom(this.zoomfactor + increment);
    }

    zoomToFit() {
        const paperwidth = this.paper.offsetWidth;
        const paperheight = this.paper.offsetHeight;

        const outerwidth = this.outerbox.offsetWidth;
        const outerheight = this.outerbox.offsetHeight;

        const zoomfactor = Math.min((outerwidth-20)/(paperwidth), (outerheight-20)/(paperheight));

        this.setzoom(zoomfactor);
    }

    updateRibbon() {
        let outputleft: string = "";
        let outputright: string = "";

        // -- Undo/redo buttons --

        outputleft += `
            <div class="icon" onclick="undoClicked()" ${(undostruct.undoStackSize() > 0 ? "" : "style=\"filter: opacity(45%)\"")}>
                <img src="gif/undo.png" alt="Ongedaan maken" class="icon-image">
                <span class="icon-text">Ongedaan maken</span>
            </div>
            <div class="icon" onclick="redoClicked()" ${(undostruct.redoStackSize() > 0 ? "" : "style=\"filter: opacity(45%)\"")}>
                <img src="gif/redo.png" alt="Opnieuw" class="icon-image">
                <span class="icon-text">Opnieuw</span>
            </div>
            <span style="display: inline-block; width: 30px;"></span>
        `

        // -- Visuals om items te laden of verwijderen --

        outputleft += '<span style="display: inline-block; width: 10px;"></span>';
        outputleft += `
        <div class="icon" id="button_Add">
            <span class="icon-image" style="font-size:24px">➕</span>
            <span class="icon-text">Uit bestand</span>
        </div>
        <div class="icon" id="button_Add_electroItem">
            <span class="icon-image" style="font-size:24px">➕</span>
            <span class="icon-text">Uit schema</span>
        </div>
        <div class="icon" id="button_Delete">
            <span class="icon-image" style="font-size:24px">🗑</span>
            <span class="icon-text">Verwijder</span>
        </div>`;

        // -- Visuals om items te bewerken --

        outputleft += `
        <span style="display: inline-block; width: 10px;"></span>
        <div class="icon" id="button_edit">
            <span class="icon-image" style="font-size:24px">📝</span>
            <span class="icon-text">Bewerk</span>
        </div>
        <!--<span style="display: inline-block; width: 10px;"></span>
        <div class="icon" id="button_rotate_left_90">
            <span class="icon-image" style="font-size:24px">↺</span>
            <span class="icon-text">-90°</span>
        </div>
        <div class="icon" id="button_rotate_right_90">
            <span class="icon-image" style="font-size:24px">↺</span>
            <span class="icon-text">+90°</span>
        </div>
        <div class="icon" id="button_rotate_left_10">
            <span class="icon-image" style="font-size:24px">↺</span>
            <span class="icon-text">-10°</span>
        </div>
        <div class="icon" id="button_rotate_right_10">
            <span class="icon-image" style="font-size:24px">↺</span>
            <span class="icon-text">+10°</span>
        </div>
        <span style="display: inline-block; width: 10px;"></span>
        <div class="icon" id="scale_up_100">
            <img src="gif/scaleup.png" alt="Scale up 100%" class="icon-image">
            <span class="icon-text">+100%</span>
        </div>
        <div class="icon" id="scale_down_100">
            <img src="gif/scaledown.png" alt="Scale down 100%" class="icon-image">
            <span class="icon-text">-100%</span>
        </div>
        <div class="icon" id="scale_up_10">
            <img src="gif/scaleup.png" alt="Scale up 100%" class="icon-image">
            <span class="icon-text">+10%</span>
        </div>
        <div class="icon" id="scale_down_10">
            <img src="gif/scaledown.png" alt="Scale down 100%" class="icon-image">
            <span class="icon-text">-10%</span>
        </div>-->`;

        // -- Visuals om naar achteren te sturen --

        outputleft += `
        <span style="display: inline-block; width: 10px;"></span>
        <div class="icon" id="sendBack">
            <span class="icon-image" style="font-size:24px">⬇⬇</span>
            <span class="icon-text">Naar achter</span>
        </div>
        <!--<button class="icon-button" id="sendBack">Naar achter</button>-->`

        // -- Visuals om pagina te selecteren --

        outputleft  += '<span style="display: inline-block; width: 50px;"></span><div><center>Pagina '
        +  '<select id="id_sitplanpage">';
        
        for (let i=1; i<= this.sitplan.numPages; i++) {
            outputleft += '<option value="' + i + '"' + (i == this.sitplan.activePage ? ' selected' : '') + '>' + i + '</option>';
        }

        outputleft += '</select><br>';
        outputleft += '<button id="btn_sitplan_addpage"' +
                  (this.sitplan.activePage != this.sitplan.numPages ? ' disabled' : '')      
               +  '>Nieuw</button>';

        outputleft += '<button id="btn_sitplan_delpage" style="background-color:red;" ' + (this.sitplan.numPages <= 1 ? ' disabled' : '') + '>&#9851;</button>';

        outputleft += '</center></div>';
 
        // -- Visuals om pagina te zoomen --

        outputright += '<span style="display: inline-block; width: 10px;"></span>';
        outputright += `
        <div class="icon" id="button_zoomin">
            <span class="icon-image" style="font-size: 24px;">🔍</span>
            <span class="icon-text">In</span>
        </div>
        <div class="icon" id="button_zoomout">
            <span class="icon-image" style="font-size: 24px;">🌍</span>
            <span class="icon-text">Uit</span>
        </div>
        <div class="icon" id="button_zoomToFit">
            <span class="icon-image" style="font-size: 24px;">🖥️</span>
            <!--<img src="gif/scaleup.png" alt="Schermvullend" class="icon-image">-->
            <span class="icon-text">Schermvullend</span>
        </div>`

        outputright += '<span style="display: inline-block; width: 10px;"></span>';
        
        // -- Put everything in the ribbon --
        document.getElementById("ribbon").innerHTML = `<div id="left-icons">${outputleft}</div><div id="right-icons">${outputright}</div>`;

        // -- Actions om pagina te selecteren --

        document.getElementById('id_sitplanpage')!.onchange = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            this.selectPage(Number(target.value));
            undostruct.store();
        };
        
        document.getElementById('btn_sitplan_addpage')!.onclick = () => {
            this.sitplan.numPages++;
            this.selectPage(this.sitplan.numPages);
        };

        document.getElementById('btn_sitplan_delpage')!.onclick = () => {
            const userConfirmation = confirm('Pagina '+this.sitplan.activePage+' volledig verwijderen?'); 
            if (userConfirmation) {
                this.sitplan.numPages--;
                this.selectPage(Math.min(this.sitplan.activePage,this.sitplan.numPages));
            }
        };

        // -- Actions om elementen toe te voegen of verwijderen --

        this.attachAddElementFromFileButton(document.getElementById('button_Add'), document.getElementById('fileInput'));
        this.attachAddElectroItemButton(document.getElementById('button_Add_electroItem'));
        this.attachDeleteButton(document.getElementById('button_Delete'));

        // -- Actions om visuals te bewerken --

        this.attachEditButton(document.getElementById('button_edit'));

        /*this.attachScaleButton(document.getElementById('scale_up_10'), 0.1);
        this.attachScaleButton(document.getElementById('scale_down_10'), -0.1);
        this.attachScaleButton(document.getElementById('scale_up_100'), 1);
        this.attachScaleButton(document.getElementById('scale_down_100'), -1);

        this.attachRotateButton(document.getElementById('button_rotate_left_90'), -90);
        this.attachRotateButton(document.getElementById('button_rotate_right_90'), 90);
        this.attachRotateButton(document.getElementById('button_rotate_left_10'), -10);
        this.attachRotateButton(document.getElementById('button_rotate_right_10'), 10);*/

        // -- Actions om naar achteren te sturen --

        this.attachSendToBackButton(document.getElementById('sendBack'));

        // -- Actions om pagina te zoomen --

        this.attachZoomButton(document.getElementById('button_zoomin'), 0.1);
        this.attachZoomButton(document.getElementById('button_zoomout'), -0.1);
        this.attachZoomToFitButton(document.getElementById('button_zoomToFit'));
        
    }

}