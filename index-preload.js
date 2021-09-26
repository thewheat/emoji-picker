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

ipcRenderer.on('clear', (event, args) => {
  const search = document.querySelector("#search");
});
