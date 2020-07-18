const ipc = require('electron').ipcRenderer;

//----- Selectors ------//
// Status
const ServerConStatus = document.querySelector('#connection');
const ServerIP = document.querySelector('#ip');
const ServerVersion = document.querySelector('#server-version');
const ServerStatusIcon = document.querySelector('#status-icon');

// Slot A
const playA = document.querySelector('#play-a');
const stopA = document.querySelector('#stop-a');
const autoA = document.querySelector('#auto-a');
const line1A = document.querySelector('#a-line1');
const line2A = document.querySelector('#a-line2');

//----- Event Listeners ------//
// Listen for Status Changes
ipc.on('cgsConnection', (event, connection) => {
    populateCGStatus(connection);
});

// Slot A Buttons
playA.addEventListener('click', playSlotA);
// stopA.addEventListener('click', stopSlotA);
// autoA.addEventListener('click', autoSlotA);

//-----Playout Function -------//

function playSlotA(e) {
    e.preventDefault();
    const playData = {
        slot: 'A',
        line1: line1A.value,
        line2: line2A.value
    };
    ipc.send('cg-play', playData);
}

// populate Status Fields
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
