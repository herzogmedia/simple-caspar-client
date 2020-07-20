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
const durationA = document.querySelector('#a-ap-interval');
const addLibA = document.querySelector('#add-lib-a');

// Slot B
const playB = document.querySelector('#play-b');
const stopB = document.querySelector('#stop-b');
const autoB = document.querySelector('#auto-b');
const line1B = document.querySelector('#b-line1');
const line2B = document.querySelector('#b-line2');
const durationB = document.querySelector('#b-ap-interval');

//----- Event Listeners ------//
// Listen for Status Changes
ipc.on('cgsConnection', (event, connection) => {
    populateCGStatus(connection);
});

// Slot A Buttons
playA.addEventListener('click', playSlotA);
stopA.addEventListener('click', stopSlotA);
autoA.addEventListener('click', autoSlotA);
addLibA.addEventListener('click', addLibSlotA);

// Slot A Buttons
playB.addEventListener('click', playSlotB);
stopB.addEventListener('click', stopSlotB);
autoB.addEventListener('click', autoSlotB);

//-----Playout Function SLOT A -------//

function playSlotA(e) {
    e.preventDefault();
    const playData = {
        slot: 'A',
        line1: line1A.value,
        line2: line2A.value
    };
    ipc.send('cg-play', playData);
}

function stopSlotA(e) {
    e.preventDefault();
    const playData = {
        slot: 'A'
    };
    ipc.send('cg-stop', playData);
}

function autoSlotA(e) {
    e.preventDefault();
    const playData = {
        slot: 'A',
        line1: line1A.value,
        line2: line2A.value,
        duration: parseInt(durationA.value)
    };
    ipc.send('cg-auto', playData);
}

function addLibSlotA(e) {
    e.preventDefault();
    const data = {
        line1: line1A.value,
        line2: line2A.value
    };
    ipc.send('lib-add', data);
    populateLibrary();
}

//-----Playout Function SLOT B -------//

function playSlotB(e) {
    e.preventDefault();
    const playData = {
        slot: 'B',
        line1: line1B.value,
        line2: line2B.value
    };
    ipc.send('cg-play', playData);
}

function stopSlotB(e) {
    e.preventDefault();
    const playData = {
        slot: 'B'
    };
    ipc.send('cg-stop', playData);
}

function autoSlotB(e) {
    e.preventDefault();
    const playData = {
        slot: 'B',
        line1: line1B.value,
        line2: line2B.value,
        duration: parseInt(durationB.value)
    };
    ipc.send('cg-auto', playData);
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

// ------- Library ----------//

const libraryTable = document.querySelector('#library-hits');
const secondaryContent = `<div class="secondary-content">
<button class="btn-small waves-effect blue-grey"> <i class="material-icons">arrow_upward</i>Load A</button>
<button class="btn-small waves-effect blue-grey"><i class="material-icons">arrow_upward</i>Load B</button>
<button class="btn-floating indigo darken-3"><i class="material-icons">edit</i></button>
<button class="btn-floating red darken-3"><i class="material-icons">clear</i></button>
</div>`;

// Populate Library
function populateLibrary() {
    const lowerThirds = ipc.sendSync('lib-getLatest', 3);
    let html;
    if (lowerThirds.length < 1) {
        html = '<h6><em>The Library is currently empty.</em></h6></br>';
    } else {
        html = '<ul class="collection grey darken-3" style="border: none;">';
        lowerThirds.forEach((lt) => {
            html += `<li class="collection-item grey darken-2" id="${lt._id}">
            <strong>${lt.line1}</strong><br />${lt.line2} 
            ${secondaryContent}</li>`;
        });
        html += '</ul>';
    }
    libraryTable.innerHTML = html;
}

populateLibrary();
