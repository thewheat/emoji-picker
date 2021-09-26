const { contextBridge } = require('electron')
const { ipcRenderer } = require('electron');
 
contextBridge.exposeInMainWorld('picker', {
  hide: () => {
    ipcRenderer.send('picker-hide');
  },
  showSettings: () => {
    ipcRenderer.send('picker-showSettings');
  }
})