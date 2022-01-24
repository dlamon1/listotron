import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { StoreContext } from './stores/store.context';

import { IpForm } from './components/ip.app';
import { Ipc } from './components/ipc.app';
import { Dashboard } from './pages/dashboard.app';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './app.css';

const App = observer(() => {
  const { vmix } = useContext(StoreContext);

  return (
    <>
      <Grid
        id="app"
        container
        style={{
          background: '#202020',
          overflow: 'hidden',
          width: '100vw',
        }}
        justifyContent="space-around"
      >
        <Ipc />
        {!vmix.ip && <IpForm />}
        {vmix.ip && <Dashboard />}
      </Grid>
    </>
  );
});

export default App;
