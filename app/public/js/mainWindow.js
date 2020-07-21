const ipc = require('electron').ipcRenderer;
const { dialog } = require('electron').remote;

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
const addLibB = document.querySelector('#add-lib-b');

// Library
const libraryList = document.querySelector('#library-hits');

//----- Event Listeners ------//
// Listen for Status Changes
ipc.on('cgsConnection', (event, connection) => {
    populateCGStatus(connection);
});

//Listen for Refresh Library
ipc.on('lib-refresh', (e) => {
    populateLibrary();
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
addLibB.addEventListener('click', addLibSlotB);

// Library
libraryList.addEventListener('click', handleLibraryClicks);

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

function addLibSlotB(e) {
    e.preventDefault();
    const data = {
        line1: line1B.value,
        line2: line2B.value
    };
    ipc.send('lib-add', data);
    populateLibrary();
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

// Handle Clicks on Library Items
function handleLibraryClicks(e) {
    e.preventDefault;
    // console.log(e.target.id, e.target.tagName);
    switch (e.target.id) {
        case 'remove':
            libRemoveItem(e);
            break;
        case 'load-a':
            loadItemtoSlot(e, 'a');
            break;
        case 'load-b':
            loadItemtoSlot(e, 'b');
            break;
        default:
            break;
    }
}

function loadItemtoSlot(e, slot) {
    const id = getIDfromElement(e.target);
    const lt = ipc.sendSync('lib-getItem', id);
    if (slot === 'a') {
        line1A.value = lt.line1;
        line2A.value = lt.line2;
    } else if (slot === 'b') {
        line1B.value = lt.line1;
        line2B.value = lt.line2;
    } else {
        console.log('Error: Slot is neither A nor B.');
    }
}

function libRemoveItem(e) {
    const id = getIDfromElement(e.target);
    dialog
        .showMessageBox({
            type: 'question',
            buttons: ['yes', 'no'],
            title: 'Remove Item',
            message: 'Do you really want to remove the item from the Library?'
        })
        .then((res) => {
            if (res.response === 0) {
                ipc.send('lib-remove', id);
                populateLibrary();
            }
        });
}

function getIDfromElement(target) {
    let id;
    if (target.tagName === 'I') {
        id = target.parentElement.parentElement.parentElement.id;
    } else {
        id = target.parentElement.parentElement.id;
    }
    return id;
}

const secondaryContent = `<div class="secondary-content">
<button id="load-a" class="btn-small waves-effect blue-grey"><i id="load-a" class="material-icons">arrow_upward</i>Load A</button>
<button id="load-b" class="btn-small waves-effect blue-grey"><i id="load-b" class="material-icons">arrow_upward</i>Load B</button>
<button id="edit" class="btn-floating indigo darken-3"><i id="edit" class="material-icons">edit</i></button>
<button id="remove" class="btn-floating red darken-3"><i id="remove" class="material-icons">clear</i></button>
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
    libraryList.innerHTML = html;
}

populateLibrary();
