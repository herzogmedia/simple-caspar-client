const ipc = require('electron').ipcRenderer;

//----- Selectors ------//
const ServerConStatus = document.querySelector('#connection');
const ServerIP = document.querySelector('#ip');
const ServerVersion = document.querySelector('#server-version');
const ServerStatusIcon = document.querySelector('#status-icon');

//----- Event Listeners ------//
// Listen for Status Changes
ipc.on('cgsConnection', (event, connection) => {
    populateCGStatus(connection);
});

function populateCGStatus(connection) {
    ServerIP.textContent = `${connection.IP}:${connection.Port}`;
    if (connection.connected) {
        ServerConStatus.textContent = 'connected';
        ServerVersion.textContent = connection.version;
        ServerStatusIcon.classList.remove('red-text');
        ServerStatusIcon.classList.add('green-text');
    } else {
        ServerConStatus.textContent = 'disconnected';
        ServerVersion.textContent = '---';
        ServerStatusIcon.classList.add('red-text');
        ServerStatusIcon.classList.remove('green-text');
    }
}
