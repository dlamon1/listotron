'use strict';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { updater } from './updater';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { vmixApi } from './api/vmixSocket';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import { Vmix } from './vmixObject';

dotenv.config();

let windows = [];
let isDev = false;
let connection = null;
let isMac = process.platform === 'darwin';
let initialWindowCreated = false;

const vmixEvent = new EventEmitter();
const vmix = new Vmix(vmixEvent);

const connected = (data) => {
  vmix.setIsConnected(data.isConnected);
  vmix.setIp(data.ip);
};

vmixEvent.on('connected', connected);

app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('ignore-certificate-errors');

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true;
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths) => {
  return path.join(RESOURCES_PATH, ...paths);
};

function createWindow() {
  let window = new BrowserWindow({
    width: 650,
    height: 900,
    minWidth: 333,
    frame: true,
    x: 0,
    y: 0,
    show: false,
    backgroundColor: '#202020',
    icon: isMac ? getAssetPath('icon.icns') : getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      pageVisibility: true,
    },
  });

  window.loadURL(resolveHtmlPath('index.html'));

  window.once('did-finish-load', () => console.log('did finish'));

  window.once('ready-to-show', () => {
    window.webContents.send('app-version', app.getVersion());
    window.webContents.send('app-isVmixConnected', vmix.isConnected, vmix.ip);
    window.webContents.send('vmix-xmlDataRes', vmix.xmlString);

    isDev && window.webContents.openDevTools();

    if (!initialWindowCreated) {
      updater(isDev, window);
    }

    window.show();
  });

  window.on('closed', function () {
    console.log(window);
    windows.pop();
    console.log('closed window length: ', windows.length);
    window = null;
  });

  windows.push(window);

  initialWindowCreated = true;

  return window;
}

ipcMain.handle('app-createWindow', () => {
  let window = createWindow();
  const menuBuilder = new MenuBuilder(window, windows);
  menuBuilder.buildMenu();
});

app.on('ready', () => {
  let window = createWindow();
  const menuBuilder = new MenuBuilder(window, windows);
  menuBuilder.buildMenu();
  window.webContents.send('app-version', app.getVersion());
  vmixApi(vmixEvent, window, windows, connection, vmix);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows.length === null) {
    createWindow();
  }
});

app.on('before-quit', () => {});
