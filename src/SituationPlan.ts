function isDevMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('dev');
}

function showSituationPlanPage() {
    updateRibbon();
    toggleAppView('draw');
}

function updateRibbon() {
    let output: string = "";
   
    document.getElementById("ribbon").innerHTML = output;
}