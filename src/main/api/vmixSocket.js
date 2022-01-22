import net from 'net';
import { ipcMain } from 'electron';

export function vmixApi(
  vmixEvent,
  mainWindow,
  windows,
  connection,
  isVmixConnected,
  vmixIp
) {
  let initConnectListener;
  let vmixPostReqListener;
  let vmixRequestXmlListener;
  let socketShutdownListener;
  // let isVmixConnected = isVmixConnected;
  // let vmixIp = vmixIp;

  const connect = (ip, isVmixConnected, vmixIp) => {
    connection = net.connect(
      { port: 8099, host: ip },
      () => {
        console.log('connected to server!');
      },
      () => {
        let data = { isVmixConnected: true, vmixIp: ip };
        vmixEvent.emit('connected', data);
        console.log('one time connection res');
        mainWindow.webContents.send('vmix-connected');
        // console.log(isVmixConnected, vmixIp);
      }
    );

    connection.on('data', function (data) {
      const dataStr = data.toString();
      handleRes(dataStr);
    });

    connection.on('error', function (e) {
      handleError(e, connection);
    });

    const requestXmlData = () => {
      connection.write('XML\r\n');
    };

    const vmixPostReq = (cmd) => {
      connection.write('FUNCTION ' + cmd + '\r\n');
    };

    vmixRequestXmlListener = () => {
      ipcMain.handle('vmix-reqXml', () => {
        console.log('reqXml');
        requestXmlData();
      });
    };
    vmixPostReqListener = () => {
      ipcMain.handle('vmix-PostReq', (__, cmd) => {
        vmixPostReq(cmd);
      });
    };
    socketShutdownListener = () => {
      ipcMain.handle('socket-shutdown', () => {
        console.log('shutdown');
        removeIpcListeners();
        requestShutdown();
      });
    };
    vmixPostReqListener();
    vmixRequestXmlListener();
    socketShutdownListener();
  };

  const handleRes = (data) => {
    const resType = data.split(' ')[0];
    console.log(resType);
    switch (resType) {
      case 'XML':
        sendXmlToRender(data);
        break;
      case 'FUNCTION':
      default:
        break;
    }
  };

  const sendXmlToRender = (data) => {
    let vmixNodeString = data.split('<vmix>')[1];
    if (!vmixNodeString) {
      console.error('error parsing XML data: ', data);
      return;
    }
    let vmixNodeStringClean = vmixNodeString.replace(/(\r\n|\n|\r)/gm, '');
    let domString = `<xml><vmix>${vmixNodeStringClean}</xml>`;

    mainWindow.webContents.send('vmix-xmlDataRes', domString);
  };

  const handleError = (e, connection) => {
    // console.log(e);
    // console.log('----error----');
    switch (e.code) {
      case 'EPIPE':
        requestShutdown(connection);
        removeIpcListeners();
        initConnectListener();
        mainWindow.webContents.send('socket-error', e.code);
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
    connection && connection.end();
  };

  const removeIpcListeners = () => {
    ipcMain.removeHandler('vmix-connect', initConnectListener);
    ipcMain.removeHandler('vmix-reqXml', vmixPostReqListener);
    ipcMain.removeHandler('vmix-PostReq', vmixRequestXmlListener);
    ipcMain.removeHandler('socket-shutdown', socketShutdownListener);
  };

  initConnectListener = () => {
    ipcMain.handleOnce('vmix-connect', async (__, ip) => {
      connection = null;
      connect(ip, isVmixConnected, vmixIp);
    });
  };

  initConnectListener();
}
