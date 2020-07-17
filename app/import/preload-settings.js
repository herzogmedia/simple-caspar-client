const settings = require('./settings');
const log = require('electron-log');
const ipc = require('electron').ipcRenderer;

//---- CG Server Settings ----//

// Get Settings
window.getCGSsettings = () => {
    const cgsIP = settings.get('cgsServer.IP');
    const cgsPort = settings.get('cgsServer.Port');
    const cgsQueue = settings.get('cgsServer.Queue');
    const cgsSettings = {
        cgsIP,
        cgsPort,
        cgsQueue
    };
    return cgsSettings;
};

// Set Settings
window.setCGSsettings = (newSettings) => {
    settings.set('cgsServer.IP', newSettings.cgsIP);
    settings.set('cgsServer.Port', newSettings.cgsPort);
    settings.set('cgsServer.Queue', newSettings.cgsQueue);
    log.info('CGS-Settings stored');
    // console.log('Set');
};

// Restore to default
window.resetCGSsettings = () => {
    settings.set('cgsServer.IP', '127.0.0.1');
    settings.set('cgsServer.Port', 5250);
    settings.set('cgsServer.Queue', 1); //Enum (Salvo)
    log.info('CGS-Settings reset to default');
    // console.log('reset');
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
