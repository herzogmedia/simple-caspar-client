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

// Handle CGS-Connection Events
function cgsConnectionHandler(connected) {
    return new Promise((resolve, reject) => {
        global.cgsConnected = connected;
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
                })
                .catch((err) => {
                    log.error(`Error getting CG-Server Version: ${err}`);
                    reject(err);
                });
        }
        resolve(connection);
    });
}

//Exports
module.exports.cgsReconnect = cgsReconnect;
module.exports.cgsConnectionHandler = cgsConnectionHandler;
