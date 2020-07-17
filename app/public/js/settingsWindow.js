//----- Selectors ------//

// Server Settings
const cgsForm = document.querySelector('#cg-server-settings');
const cgsIP = document.querySelector('#cgs-ip');
const cgsPort = document.querySelector('#cgs-port');
const cgsQueue = document.querySelector('#cgs-queuemode');
const cgsResetBtn = document.querySelector('#cgs-reset');
const cgsSaveBtn = document.querySelector('#cgs-save');
// Slot A
const cgtTemplateA = document.querySelector('#cgt-template-a');
const cgtKey1A = document.querySelector('#cgt-key1-a');
const cgtKey2A = document.querySelector('#cgt-key2-a');
const cgtLayerA = document.querySelector('#cgt-layer-a');
const cgtJsonA = document.querySelector('#cgt-datatype-a');
// Slot B
const cgtTemplateB = document.querySelector('#cgt-template-b');
const cgtKey1B = document.querySelector('#cgt-key1-b');
const cgtKey2B = document.querySelector('#cgt-key2-b');
const cgtLayerB = document.querySelector('#cgt-layer-b');
const cgtJsonB = document.querySelector('#cgt-datatype-b');

const cgtSaveBtn = document.querySelector('#cgt-save');

//----- Event Listeners -------//
cgsResetBtn.addEventListener('click', resetCGServerSettings);
cgsSaveBtn.addEventListener('click', setCGServerSettings);

cgtSaveBtn.addEventListener('click', setCGTemplateSettings);

//----- CG Server Setting ------//

function getCGServerSettings() {
    const settings = window.getCGSsettings();
    // console.log('get');
    return settings;
}

function populateCGServerSettings(settings) {
    cgsIP.value = settings.cgsIP;
    cgsPort.value = settings.cgsPort;
    cgsQueue.value = settings.cgsQueue;
    // console.log('populate');
}

function resetCGServerSettings(e) {
    window.resetCGSsettings();
    const cgsSettings = getCGServerSettings();
    populateCGServerSettings(cgsSettings);
    window.cgsReconnect();
    e.preventDefault();
}

function setCGServerSettings(e) {
    e.preventDefault();
    const newSettings = {
        cgsIP: cgsIP.value,
        cgsPort: parseInt(cgsPort.value),
        cgsQueue: parseInt(cgsQueue.value)
    };
    window.setCGSsettings(newSettings);
    window.cgsReconnect();
}

//----- Slot Settings ------//

function populateTemplateSelects(templates) {
    if (templates.length > 0) {
        let options;
        templates.forEach((template) => {
            options += `<option>${template}</option>`;
        });
        cgtTemplateA.innerHTML = options;
        cgtTemplateB.innerHTML = options;
    }
}

function getCGServerTemplates() {
    window
        .cgsGetTemplates()
        .then((templates) => populateTemplateSelects(templates))
        .catch((err) => console.log(err));
}

function getCGTemplateSettings() {
    const templateSettings = window.cgtGetTemplateSettings();
    return templateSettings;
}

function poplulateCGTemplateSettings(settings) {
    // Slot A
    cgtTemplateA.value = settings.SlotA.Name;
    cgtKey1A.value = settings.SlotA.Key1;
    cgtKey2A.value = settings.SlotA.Key2;
    cgtLayerA.value = settings.SlotA.Layer;
    cgtJsonA.checked = settings.SlotA.SendJSON;
    // Slot B
    cgtTemplateB.value = settings.SlotB.Name;
    cgtKey1B.value = settings.SlotB.Key1;
    cgtKey2B.value = settings.SlotB.Key2;
    cgtLayerB.value = settings.SlotB.Layer;
    cgtJsonB.checked = settings.SlotB.SendJSON;
}

function setCGTemplateSettings() {}

//Global Functions

function initializeSettingsWindow() {
    const cgsSettings = getCGServerSettings();
    populateCGServerSettings(cgsSettings);
    getCGServerTemplates();
    const cgtSettings = getCGTemplateSettings();
    poplulateCGTemplateSettings(cgtSettings);
}
// Initialize on Load
initializeSettingsWindow();
