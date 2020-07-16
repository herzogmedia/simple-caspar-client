//----- Selectors ------//
const cgsForm = document.querySelector('#cg-server-settings');
const cgsIP = document.querySelector('#cgs-ip');
const cgsPort = document.querySelector('#cgs-port');
const cgsQueue = document.querySelector('#cgs-queuemode');
const cgsResetBtn = document.querySelector('#cgs-reset');
const cgsSaveBtn = document.querySelector('#cgs-save');

//----- Event Listeners -------//
cgsResetBtn.addEventListener('click', resetCGServerSettings);
cgsSaveBtn.addEventListener('click', setCGServerSettings);

//----- CG Server Setting ------//

function getCGServerSettings() {
    const settings = window.getCGSsettings();
    return settings;
}

function populateCGServerSettings(settings) {
    cgsIP.value = settings.cgsIP;
    cgsPort.value = settings.cgsPort;
    cgsQueue.value = settings.cgsQueue;
}

function resetCGServerSettings(e) {
    window.resetCGSsettings();
    const cgsSettings = getCGServerSettings();
    populateCGServerSettings(cgsSettings);
    e.preventDefault();
}

function setCGServerSettings(e) {
    e.preventDefault();
    const newSettings = {
        cgsIP: cgsIP.value,
        cgsPort: parseInt(cgsPort.value),
        cgsQueue: parseInt(cgsQueue.value),
    };
    window.setCGSsettings(newSettings);
}

//Global Functions

function initializeSettingsWindow() {
    const cgsSettings = getCGServerSettings();
    populateCGServerSettings(cgsSettings);
}

// Initialize on Load
initializeSettingsWindow();
