const { CasparCG } = require('casparcg-connection');
const settings = require('./settings');
const log = require('electron-log');

//Get CasparCG Settings
const cgsIP = settings.get('cgsServer.IP');
const cgsPort = settings.get('cgsServer.Port');
const cgsQueue = settings.get('cgsServer.Queue');

module.exports = new CasparCG({
    host: cgsIP,
    port: cgsPort,
    autoConnect: false,
    queueMode: cgsQueue,
    autoReconnectInterval: 10000, // 10 sec
    onError: (err) => {
        log.error(`CasparCG-Error: ${err}`);
    },
    onConnectionStatus: (data) => {
        const status = data.connected ? 'connected' : 'disconnected';
        log.info(`CasparCG-Server ${status}.`);
    }
});
