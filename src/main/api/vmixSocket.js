import net from 'net';
import { ipcMain } from 'electron';

export function vmixApi(vmixEvent, mainWindow, windows, connection, vmix) {
  let initConnectListener;
  let vmixPostReqListener;
  let vmixRequestXmlListener;
  let socketShutdownListener;
  let requestXmlData;
  let functionReqCount = 0;

  const connect = (ip) => {
    connection = net.connect(
      { port: 8099, host: ip },
      () => {
        console.log('connected to server!');
      },
      () => {
        vmixPostReqListener();
        vmixRequestXmlListener();
        socketShutdownListener();
        connection.write('SUBSCRIBE ACTS\r\n');
        // console.log('one time connection res');
        let data = { isConnected: true, ip: ip };
        vmixEvent.emit('connected', data);
        mainWindow.webContents.send('vmix-connected');
      }
    );

    connection.on('data', function (data) {
      const dataStr = data.toString();
      handleRes(dataStr);
    });

    connection.on('error', function (e) {
      handleError(e, connection);
    });

    requestXmlData = () => {
      connection.write('XML\r\n');
    };

    const vmixPostFunction = (cmd) => {
      connection.write('FUNCTION ' + cmd + '\r\n');
    };

    vmixRequestXmlListener = () => {
      console.log('running xml listener');
      ipcMain.handle('vmix-reqXml', () => {
        requestXmlData();
      });
    };
    vmixPostReqListener = () => {
      console.log('running xml listener');
      ipcMain.handle('vmix-postFunction', (__, cmd) => {
        vmixPostFunction(cmd);
        functionReqCount = functionReqCount + 1;
      });
    };
    socketShutdownListener = () => {
      ipcMain.handle('socket-shutdown', () => {
        console.log('shutdown');
        removeIpcListeners();
        requestShutdown();
      });
    };
  };

  let timeout = null;

  const handleRes = (data) => {
    const resType = data.split(' ')[0];
    console.log(resType);
    // console.log(data);
    switch (resType) {
      case 'XML':
        handleXmlRes(data);
        break;
      case 'FUNCTION':
        clearTimeout(timeout);
        timeout = setTimeout(requestXmlData, 150);
        // requestXmlData();
        break;
      case 'ACTS':
        // console.log(data);
        break;
      default:
        break;
    }
  };

  const handleXmlRes = (data) => {
    let vmixNodeString = data.split('<vmix>')[1];
    if (!vmixNodeString) {
      console.error('error parsing XML data: ', data);
      return;
    }
    let vmixNodeStringClean = vmixNodeString.replace(/(\r\n|\n|\r)/gm, '');
    let domString = `<xml><vmix>${vmixNodeStringClean}</xml>`;

    windows.forEach((window) => {
      window.webContents.send('vmix-xmlDataRes', domString);
    });
    vmix.setXmlString(domString);
  };

  const handleError = (e, connection) => {
    console.log('----error----');
    switch (e.code) {
      case 'EPIPE':
        requestShutdown(connection);
        removeIpcListeners();
        initConnectListener();
        mainWindow.webContents.send('socket-error', e.code);
        mainWindow.webContents.send('vmix-disconnected');
        break;
      case 'ECONNREFUSED':
        requestShutdown(connection);
        removeIpcListeners();
        initConnectListener();
        break;
      default:
        break;
    }
  };

  const requestShutdown = (connection) => {
    console.log('request shutdown');
    if (windows.length == 0 && connection) {
      console.log('request shutdown check passed');
      connection.end();
    }
  };

  const removeIpcListeners = () => {
    if (
      vmixPostReqListener == null &&
      vmixRequestXmlListener == null &&
      socketShutdownListener == null
    )
      return;
    console.log('removing listeners');
    ipcMain.removeHandler('vmix-connect', initConnectListener);
    ipcMain.removeHandler('vmix-reqXml', vmixPostReqListener);
    ipcMain.removeHandler('vmix-postFunction', vmixRequestXmlListener);
    ipcMain.removeHandler('socket-shutdown', socketShutdownListener);
    // initConnectListener = null;
    vmixPostReqListener = null;
    vmixRequestXmlListener = null;
    socketShutdownListener = null;

    console.log(vmixRequestXmlListener, vmixPostReqListener);
  };

  initConnectListener = () => {
    ipcMain.handle('vmix-connect', async (__, ip) => {
      connection = null;
      connect(ip);
    });
  };

  initConnectListener();
}
