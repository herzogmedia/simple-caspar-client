// Initialize Materialize Select
document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('select');
    const instances = M.FormSelect.init(elems);
});

//----- Selectors ------//
const cgsForm = document.querySelector('#cg-server-settings');
const cgsIP = document.querySelector('#cgs-ip');
const cgsPort = document.querySelector('#cgs-port');
const cgsQueue = document.querySelector('#cgs-queuemode');

//----- CG Server Setting ------//

function getCGServerSettings() {
    const settings = window.getCGSsettings();
    console.log(settings);
    return settings;
}

function populateCGServerSettings() {
    const settings = getCGServerSettings();
    cgsIP.value = settings.cgsIP;
    cgsPort.value = settings.cgsPort;
    cgsQueue.value = settings.cgsQueue.toString();
}

populateCGServerSettings();
