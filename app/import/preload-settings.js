const settings = require('./settings');
const log = require('electron-log');

//---- CG Server Settings ----//

// Get Settings
window.getCGSsettings = function () {
    const cgsIP = settings.get('cgsServer.IP');
    const cgsPort = settings.get('cgsServer.Port');
    const cgsQueue = settings.get('cgsServer.Queue');
    const cgsSettings = {
        cgsIP,
        cgsPort,
        cgsQueue,
    };
    return cgsSettings;
};

// Set Settings
window.setCGSsettings = function (newSettings) {
    settings.set('cgsServer.IP', newSettings.cgsIP);
    settings.set('cgsServer.Port', newSettings.cgsPort);
    settings.set('cgsServer.Queue', newSettings.cgsQueue);
    log.info('CGS-Settings stored');
};

// Restore to default
window.resetCGSsettings = () => {
    settings.set('cgsServer.IP', '127.0.0.1');
    settings.set('cgsServer.Port', 5250);
    settings.set('cgsServer.Queue', 1); //Enum (Salvo)
    log.info('CGS-Settings reset to default');
};
