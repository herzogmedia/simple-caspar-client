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

//Exports
module.exports.cgsReconnect = cgsReconnect;
