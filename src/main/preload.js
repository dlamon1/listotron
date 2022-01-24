require('regenerator-runtime/runtime');
const { ipcRenderer, contextBridge } = require('electron');

let messages = [];

contextBridge.exposeInMainWorld('api', {
  vmix: {
    connect: (ip) => {
      ipcRenderer.invoke('vmix-connect', ip);
    },
    reqXml: () => {
      ipcRenderer.invoke('vmix-reqXml');
    },
    postFunction: (cmd) => {
      ipcRenderer.invoke('vmix-postFunction', cmd);
    },
    shutdown: () => {
      ipcRenderer.invoke('vmix-shutdown');
    },
  },
  app: {
    createWindow: () => {
      ipcRenderer.invoke('app-createWindow');
    },
  },
  on(eventName, callback) {
    messages.indexOf(eventName) >= 0
      ? ipcRenderer.on(eventName, callback)
      : null;
  },
  off(eventName, callback) {
    messages.indexOf(eventName) >= 0
      ? ipcRenderer.removeListener(eventName, callback)
      : null;
  },
  all() {
    ipcRenderer.removeAllListeners();
  },
});

messages = [
  'app-isVmixConnected',
  'vmix-connected',
  'vmix-xmlDataRes',
  'version',
];
