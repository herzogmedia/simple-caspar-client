const settings = require('./settings');
const log = require('electron-log');
const ipc = require('electron').ipcRenderer;

//---- CG Server Settings ----//

// Get Settings
window.getCGSsettings = () => {
    const cgsSettings = settings.get('cgsServer');
    return cgsSettings;
};

// Set Settings
window.setCGSsettings = (newSettings) => {
    settings.set('cgsServer', newSettings);
    log.info('CasparCG Server Settings stored');
    // console.log('Set');
};

// Restore to default
window.resetCGSsettings = () => {
    const newSettings = {
        IP: '127.0.0.1',
        Port: 5250,
        Queue: 1
    };
    settings.set('cgsServer', newSettings);
    log.info('CasparCG Server Settings reset to default');
    return newSettings;
};

// Reconnect CG-Server
window.cgsReconnect = () => {
    ipc.send('cg', 'reconnect');
    // log.debug('IPC Renderer: Reconnect CG-Server');
    // console.log('reconnect');
};

// Get Templates
window.cgsGetTemplates = () => {
    return new Promise((resolve, reject) => {
        const templates = ipc.sendSync('cg', 'getTemplates');
        if (templates !== undefined) {
            resolve(templates);
        } else {
            reject(log.error('Variable templates is undefined.'));
        }
    });
};

// Get Template Settings
window.cgtGetTemplateSettings = () => {
    const templateSettings = settings.get('cgtTemplate');
    return templateSettings;
};

// Set Template Settings
window.cgtSetSettings = (newSettings) => {
    settings.set('cgtTemplate', newSettings);
    log.info('CasparCG Template Settings stored.');
};

// Reset Template Settings
window.cgtResetSettings = () => {
    const newSettings = {
        SlotA: {
            Name: '',
            Key1: 'f0',
            Key2: 'f1',
            Layer: 20,
            SendJSON: false
        },
        SlotB: {
            Name: '',
            Key1: 'f0',
            Key2: 'f1',
            Layer: 20,
            SendJSON: false
        }
    };
    settings.set('cgtTemplate', newSettings);
    log.info('CasparCG Template Setting reset to default.');
    return newSettings;
};
