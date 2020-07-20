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
const cgtResetBtn = document.querySelector('#cgt-reset');

//----- Event Listeners -------//
cgsResetBtn.addEventListener('click', resetCGServerSettings);
cgsSaveBtn.addEventListener('click', setCGServerSettings);

cgtResetBtn.addEventListener('click', resetCGTemplateSettings);
cgtSaveBtn.addEventListener('click', setCGTemplateSettings);

//----- CG Server Setting ------//

function getCGServerSettings() {
    const settings = window.getCGSsettings();
    // console.log('get');
    return settings;
}

function populateCGServerSettings(settings) {
    cgsIP.value = settings.IP;
    cgsPort.value = settings.Port;
    cgsQueue.value = settings.Queue;
    // console.log('populate');
}

function resetCGServerSettings(e) {
    e.preventDefault();
    const cgsSettings = window.resetCGSsettings();
    populateCGServerSettings(cgsSettings);
    window.cgsReconnect();
    reloadTemplateSettings();
}

function setCGServerSettings(e) {
    e.preventDefault();
    const newSettings = {
        IP: cgsIP.value,
        Port: parseInt(cgsPort.value),
        Queue: parseInt(cgsQueue.value)
    };
    window.setCGSsettings(newSettings);
    window.cgsReconnect();
    reloadTemplateSettings();
}

//----- Slot Settings ------//

function populateTemplateSelects(templates, NameA, NameB) {
    // Add Current Selection on Top
    // A
    let templatesA = [...templates];
    let templatesB = [...templates];
    templatesA.unshift(NameA);
    templatesB.unshift(NameB);

    let optionsA;
    let optionsB;
    templatesA.forEach((template) => {
        optionsA += `<option>${template}</option>`;
    });
    templatesB.forEach((template) => {
        optionsB += `<option>${template}</option>`;
    });
    cgtTemplateA.innerHTML = optionsA;
    cgtTemplateB.innerHTML = optionsB;
}

function getCGServerTemplates(NameA, NameB) {
    window
        .cgsGetTemplates()
        .then((templates) => {
            populateTemplateSelects(templates, NameA, NameB);
        })
        .catch((err) => console.log(err));
}

function getCGTemplateSettings() {
    const templateSettings = window.cgtGetTemplateSettings();
    return templateSettings;
}

function populateCGTemplateSettings(settings) {
    // Slot A
    cgtKey1A.value = settings.SlotA.Key1;
    cgtKey2A.value = settings.SlotA.Key2;
    cgtLayerA.value = settings.SlotA.Layer;
    cgtJsonA.checked = settings.SlotA.SendJSON;
    // Slot B
    cgtKey1B.value = settings.SlotB.Key1;
    cgtKey2B.value = settings.SlotB.Key2;
    cgtLayerB.value = settings.SlotB.Layer;
    cgtJsonB.checked = settings.SlotB.SendJSON;

    // Get Server Templates
    getCGServerTemplates(settings.SlotA.Name, settings.SlotB.Name);
}

function setCGTemplateSettings(e) {
    e.preventDefault;
    const newSettings = {
        SlotA: {
            Name: cgtTemplateA.value,
            Key1: cgtKey1A.value,
            Key2: cgtKey2A.value,
            Layer: parseInt(cgtLayerA.value),
            SendJSON: cgtJsonA.checked
        },
        SlotB: {
            Name: cgtTemplateB.value,
            Key1: cgtKey1B.value,
            Key2: cgtKey2B.value,
            Layer: parseInt(cgtLayerB.value),
            SendJSON: cgtJsonB.checked
        }
    };
    window.cgtSetSettings(newSettings);
}

function resetCGTemplateSettings(e) {
    e.preventDefault;
    const newSettings = window.cgtResetSettings();
    populateCGTemplateSettings(newSettings);
}

//Global Functions

function initializeSettingsWindow() {
    const cgsSettings = getCGServerSettings();
    populateCGServerSettings(cgsSettings);
    const cgtSettings = getCGTemplateSettings();
    populateCGTemplateSettings(cgtSettings);
}

function reloadTemplateSettings() {
    const cgtSettings = getCGTemplateSettings();
    populateCGTemplateSettings(cgtSettings);
}

// Initialize on Load
initializeSettingsWindow();
