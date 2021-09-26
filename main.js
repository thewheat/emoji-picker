const { app, BrowserWindow } = require('electron')

const { Menu, Tray } = require('electron')
const path = require('path')

const { ipcMain } = require('electron')
const { globalShortcut } = require('electron')

const SETTINGS_KEY = "SETTINGS";
const Store = require('electron-store');
const store = new Store();

let appIcon = null
let currentWindow = null;
let settingsWindow = null;

function createWindow () {
  if (currentWindow != null){
    togglePicker(true);
    return;
  }
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'index-preload.js')
    }
  })

  win.loadFile('index.html')
  currentWindow = win;

  win.on('close', function(){
    currentWindow = null;
  })
}

function createSettingsWindow () {
  if (settingsWindow != null){
    settingsWindow.show();
    return;
  }
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'settings-preload.js')
    }
  })

  win.loadFile('settings.html')
  settingsWindow = win;
  win.on('close', function(){
    settingsWindow = null;
  })
}

setupDockIcon();

app.whenReady().then(() => {
  getSavedSettings();
  createWindow()
  createAppIcon()
  registerShortcuts()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

function setupDockIcon(){
  const iconName = 'assets/appIcon.png'
  const iconPath = path.join(__dirname, iconName)
  app.dock.setIcon(iconPath);
  //app.dock.hide(); 
}

function createAppIcon() {
  const iconName = 'assets/trayIcon.png'
  const iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        togglePicker(true);
      }
    },
    {
      label: 'Settings',
      click: () => {
        createSettingsWindow();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ])

  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (appIcon) appIcon.destroy()
  unregisterShortcuts();
})

function registerShortcuts(){
  let settings = getSavedSettings();
  try{
    if (settings['shortcut-toggle']) {
      globalShortcut.register(settings['shortcut-toggle'], () => {
        togglePicker(true);
      })
    }
    return true;
  }catch(err){
    console.log("err", err);
    return false;
  }
}

function unregisterShortcuts(){
  globalShortcut.unregisterAll();
}

function refreshShortcuts(){
  unregisterShortcuts();
  return registerShortcuts();
}

function getSavedSettings(){
  let rawSettings = store.get(SETTINGS_KEY);
  let jsonSettings;
  try{
    jsonSettings = JSON.parse(rawSettings);
  }
  catch(err){
    jsonSettings = {};
  }
  return jsonSettings;
}

function saveSettings(settings){
  store.set(SETTINGS_KEY, settings);
}

ipcMain.on('settings-get', (event) => {
  event.returnValue = getSavedSettings();
});

ipcMain.on('settings-set', (event, settings) => {
  saveSettings(settings);
});

ipcMain.on('settings-set-and-refresh-shortcuts', (event, settings) => {
  saveSettings(settings);
  refreshShortcuts();
});

function togglePicker(show){
  if (currentWindow == null) return;

  if(show) {
    currentWindow.show();
  }
  else
    currentWindow.hide();
}

ipcMain.on('picker-hide', (event) => {
  togglePicker(false);
});

ipcMain.on('picker-show', (event) => {
  togglePicker(true);
});

ipcMain.on('picker-showSettings', (event) => {
  createSettingsWindow();
});
