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
                    templates.push('');
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

//Exports
module.exports.cgsReconnect = cgsReconnect;
module.exports.cgsConnectionHandler = cgsConnectionHandler;
module.exports.cgsGetConnectionSettings = cgsGetConnectionSettings;
module.exports.cgsGetTemplates = cgsGetTemplates;
