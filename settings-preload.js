const { contextBridge } = require('electron')
const { ipcRenderer } = require('electron');

 
contextBridge.exposeInMainWorld('settings', {
  get: () => {
    return ipcRenderer.sendSync('settings-get');
  },
  setAndRefreshShortcuts: (settings) => {
    ipcRenderer.send('settings-set-and-refresh-shortcuts', settings);
  }
})
