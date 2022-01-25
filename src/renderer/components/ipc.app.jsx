import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from '../stores/store.context';

export const Ipc = observer(() => {
  const { vmix, app } = useContext(StoreContext);

  const isVmixConnected = (__, isConnected, ip) => {
    vmix.setIp(ip);
  };

  const vmixConnected = () => {
    vmix.connected();
  };

  const vmixDisconnected = () => {
    vmix.disconnected();
  };

  const newWindow = () => {
    app.createWindow();
  };

  // This will trigger vmix.lists to change
  const vmixDataRes = (__, domString) => {
    vmix.xmlDataRes(domString);
  };

  useEffect(() => {
    window.api.on('app-isVmixConnected', isVmixConnected);
    window.api.on('vmix-connected', vmixConnected);
    window.api.on('vmix-disconnected', vmixDisconnected);
    window.api.on('vmix-xmlDataRes', vmixDataRes);
    window.api.on('app-newWindow', newWindow);

    return () => {
      vmix.isSocketConnect && vmix.shutdown();
      vmix.isSocketConnect && window.api.all();
    };
  }, []);

  return <></>;
});
