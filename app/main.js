const { app, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');
const settings = require('./import/settings');
const path = require('path');
const CG = require('./import/casparcg');

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
        width: isDev ? 1800 : 1100,
        height: 850,
        // icon: './assets/icons/icon.png',
        resizable: isDev ? true : false,
        backgroundColor: 'white'
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
        width: isDev ? 1050 : 350,
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

    // Connect to CG-Server
    CG.connect();

    log.info('App loaded.');
});

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
                label: 'Clear CG-Channels'
            },
            {
                label: 'Reconnect CG-Server'
            }
        ]
    },
    {
        label: 'Library',
        submenu: [
            {
                label: 'Show Library'
            },
            {
                label: 'Clear Library'
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
