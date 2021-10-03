const { contextBridge } = require('electron')
const { ipcRenderer } = require('electron');
 
contextBridge.exposeInMainWorld('settings', {
  get: () => {
    return ipcRenderer.sendSync('settings-get');
  },
  close: () => {
    return ipcRenderer.sendSync('settings-close');
  },
  setAndRefreshShortcuts: (settings) => {
    ipcRenderer.send('settings-set-and-refresh-shortcuts', settings);
  }
})
