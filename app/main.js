const electron = require('electron');
const log = require('electron-log');
const path = require('path');
const CG = require('./import/casparcg');
const LowerThird = require('./import/lowerThird');
const {
    cgsReconnect,
    cgsConnectionHandler,
    cgsGetConnectionSettings,
    cgsGetTemplates,
    cgsPlay,
    cgsStop,
    cgsAuto,
    cgsClear
} = require('./import/cgs-helpers');

const { app, BrowserWindow, Menu, dialog } = electron;
const ipc = electron.ipcMain;

// Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let settingsWindow;

// ---- Create Windows Functions ----//

// Main Window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Simple Caspar Client',
        width: isDev ? 1800 : 1215,
        height: 850,
        // icon: './assets/icons/icon.png',
        resizable: isDev ? true : false,
        backgroundColor: 'white',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile('./app/public/index.html');
}

// Settings Window
function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        title: 'Settings',
        width: isDev ? 1050 : 400,
        height: 850,
        resizable: isDev ? true : false,
        backgroundColor: 'white',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'import', 'preload-settings.js')
        }
    });

    if (isDev) {
        settingsWindow.webContents.openDevTools();
    }

    settingsWindow.loadFile('./app/public/settings.html');

    // Hide Menu for Settings Window
    settingsWindow.setMenuBarVisibility(false);

    // Garbage Collection
    settingsWindow.on('close', () => {
        settingsWindow = null;
    });
}

// ---- Run on App Start ----//

app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // Get Connection Status on Startup and pass it to Main Window
    mainWindow.webContents.on('dom-ready', () => {
        cgsGetConnectionSettings()
            .then((connection) => {
                connection.connected = false;
                mainWindow.webContents.send('cgsConnection', connection);
            })
            .catch((err) => log.error(err));

        // Connect to CG-Server
        CG.connect();
    });

    log.info('App loaded.');
});

//---- IPC ----//

// Caspar Queries
ipc.on('cg', (event, arg) => {
    switch (arg) {
        case 'reconnect':
            cgsReconnect();
            log.debug('IPC Main: Reconnect CG-Server');
            break;
        case 'getTemplates':
            cgsGetTemplates()
                .then((templates) => {
                    event.returnValue = templates;
                })
                .catch((err) => log.error(err));
            break;
        default:
            log.error(
                `IPC Main Process: Argument "${arg}" for event "cg" not valid`
            );
            break;
    }
});

// Caspar Playout Commands
ipc.on('cg-play', (event, arg) => {
    cgsPlay(arg);
});

ipc.on('cg-stop', (event, arg) => {
    cgsStop(arg);
});

ipc.on('cg-auto', (event, arg) => {
    cgsAuto(arg);
});

// Library
ipc.on('lib-add', (event, arg) => {
    const LT = new LowerThird(arg.line1, arg.line2);
    LT.savetoDB();
});

ipc.on('lib-getLatest', (event, arg) => {
    if (typeof arg === 'number') {
        LowerThird.getLatest(arg).then((result) => {
            event.returnValue = result;
        });
    }
});

ipc.on('lib-getItem', (event, arg) => {
    LowerThird.getItem(arg).then((result) => {
        event.returnValue = result;
    });
});

ipc.on('lib-search', (event, arg) => {
    LowerThird.search(arg, 3).then((result) => {
        event.returnValue = result;
    });
});

ipc.on('lib-updateItem', (event, arg) => {
    LowerThird.updateLT(arg);
});

ipc.on('lib-remove', (event, arg) => {
    LowerThird.removeLT(arg);
});

// Listen for CG-Connection Change
CG.onConnectionChanged = (connected) =>
    cgsConnectionHandler(connected)
        .then((connection) =>
            mainWindow.webContents.send('cgsConnection', connection)
        )
        .catch((err) => log.error(err));

// Menu Template
const menu = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
        label: 'App',
        submenu: [
            {
                label: 'Settings',
                click() {
                    createSettingsWindow();
                }
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'CG-Server',
        submenu: [
            {
                label: 'Clear CG-Layers',
                click() {
                    cgsClear();
                }
            },
            {
                label: 'Reconnect CG-Server',
                click() {
                    cgsReconnect();
                }
            }
        ]
    },
    {
        label: 'Library',
        submenu: [
            // {
            //     label: 'Show Library'
            // },
            {
                label: 'Clear Library',
                click() {
                    dialog
                        .showMessageBox({
                            type: 'question',
                            buttons: ['yes', 'no'],
                            title: 'Clear Library',
                            message:
                                'Do you really want to remove all items from the Library?'
                        })
                        .then((res) => {
                            if (res.response === 0) {
                                LowerThird.clearAll();
                                mainWindow.webContents.send('lib-refresh');
                            }
                        });
                }
            }
        ]
    },
    ...(isDev
        ? [
              {
                  label: 'Developer Tools',
                  submenu: [
                      { role: 'reload' },
                      { role: 'forcereload' },
                      { type: 'separator' },
                      { role: 'toggledevtools' }
                  ]
              }
          ]
        : [])
];

// Quit app and disconnect if all windows are closed
app.on('window-all-closed', () => {
    if (!isMac) {
        CG.disconnect();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.allowRendererProcessReuse = true;
