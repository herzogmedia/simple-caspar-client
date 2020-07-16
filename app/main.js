const { app, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');

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
        backgroundColor: 'white',
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile('./app/public/index.html');
}

// Settings Window
function createSettingsWindow() {
    sett;
}

// ---- Run on App Start ----//

app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
});

// Menu Template
const menu = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
        label: 'App',
        submenu: [
            {
                label: 'Settings',
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                },
            },
        ],
    },
    {
        label: 'CG-Server',
        submenu: [
            {
                label: 'Clear CG-Channels',
            },
            {
                label: 'Reconnect CG-Server',
            },
        ],
    },
    {
        label: 'Library',
        submenu: [
            {
                label: 'Show Library',
            },
            {
                label: 'Clear Library',
                click() {
                    createSettingsWindow();
                },
            },
        ],
    },
    ...(isDev
        ? [
              {
                  label: 'Developer Tools',
                  submenu: [
                      { role: 'reload' },
                      { role: 'forcereload' },
                      { type: 'separator' },
                      { role: 'toggledevtools' },
                  ],
              },
          ]
        : []),
];

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.allowRendererProcessReuse = true;
