const CG = require('./casparcg');
const log = require('electron-log');
const settings = require('./settings');

// Reconnect to CG-Server
function cgsReconnect() {
    const cgsIP = settings.get('cgsServer.IP');
    const cgsPort = settings.get('cgsServer.Port');
    const cgsQueue = settings.get('cgsServer.Queue');
    CG.connect({
        host: cgsIP,
        port: cgsPort,
        queueMode: cgsQueue
    });
}

function cgsGetConnectionSettings() {
    return new Promise((resolve, reject) => {
        let connection = {
            IP: settings.get('cgsServer.IP'),
            Port: settings.get('cgsServer.Port')
        };
        resolve(connection);
    });
}

// Handle CGS-Connection Events
function cgsConnectionHandler(connected) {
    return new Promise((resolve, reject) => {
        let connection = {
            connected,
            IP: settings.get('cgsServer.IP'),
            Port: settings.get('cgsServer.Port')
        };
        if (connected) {
            CG.version()
                .then((res) => {
                    const version = res.response.data;
                    connection.version = version;
                    log.info(`CasparCG-Server Version: ${version}`);
                    resolve(connection);
                })
                .catch((err) => {
                    log.error(`Error getting CG-Server Version: ${err}`);
                    reject(err);
                });
        } else {
            resolve(connection);
        }
    });
}

function cgsGetTemplates() {
    return new Promise((resolve, reject) => {
        let templates = [];
        if (CG.connected) {
            CG.tls()
                .then((res) => {
                    const data = res.response.data;
                    data.forEach((item) => {
                        if (item.type === 'template') {
                            templates.push(item.name);
                        }
                    });
                    resolve(templates);
                })
                .catch((err) => {
                    log.error(err);
                    templates = [];
                    resolve(templates);
                });
        } else {
            resolve(templates);
        }
    });
}

// Parse as CasparCG XML String
function parseCasparXML(templateData, Key1, Key2) {
    const { line1, line2 } = templateData;
    const data = `<templateData><componentData id="${Key1}"><data id="text" value="${line1}"/></componentData>
    <componentData id="${Key2}"><data id="text" value="${line2}"/></componentData></templateData>`;
    return data;
}

// Play
function cgsPlay(templateData) {
    let cgtSettings;
    switch (templateData.slot.toLowerCase()) {
        case 'a':
            cgtSettings = settings.get('cgtTemplate.SlotA');
            break;
        case 'b':
            cgtSettings = settings.get('cgtTemplate.SlotB');
            break;
        default:
            log.error('CG Play: Slot Var is neither a nor b');
            break;
    }
    const { Name, Key1, Key2, Layer, SendJSON } = cgtSettings;
    let data;
    if (SendJSON) {
        data = {};
        data[Key1] = templateData.line1;
        data[Key2] = templateData.line2;
    } else {
        data = parseCasparXML(templateData, Key1, Key2);
    }
    CG.cgAdd(1, Layer, 1, Name, true, data).catch((err) => log.error(err));
}

function cgsStop(templateData) {
    let cgtLayer;
    switch (templateData.slot.toLowerCase()) {
        case 'a':
            cgtLayer = settings.get('cgtTemplate.SlotA.Layer');
            break;
        case 'b':
            cgtLayer = settings.get('cgtTemplate.SlotB.Layer');
            break;
        default:
            log.error('CG Sop: Slot Var is neither a nor b');
            break;
    }
    const Layer = parseInt(cgtLayer);
    CG.cgStop(1, Layer, 1).catch((err) => log.error(err));
}

function cgsAuto(templateData) {
    const slot = templateData.slot;
    const duration = templateData.duration * 1000;
    log.debug(`Auto-Play ${slot} Duration ${duration}ms`);
    cgsPlay(templateData);
    log.debug(`Auto-Play ${slot}: Play`);
    setTimeout(() => {
        cgsStop(templateData);
        log.debug(`Auto-Play ${slot}: Stop`);
    }, duration);
}

//Exports
module.exports.cgsReconnect = cgsReconnect;
module.exports.cgsConnectionHandler = cgsConnectionHandler;
module.exports.cgsGetConnectionSettings = cgsGetConnectionSettings;
module.exports.cgsGetTemplates = cgsGetTemplates;
module.exports.cgsPlay = cgsPlay;
module.exports.cgsStop = cgsStop;
module.exports.cgsAuto = cgsAuto;
