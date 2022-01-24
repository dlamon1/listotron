import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { StoreContext } from './stores/store.context';

import { IpForm } from './components/ip.app';
import { Ipc } from './components/ipc.app';
import { Dashboard } from './pages/dashboard.app';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './app.css';

const App = observer(() => {
  const { vmix, lists } = useContext(StoreContext);

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
        {lists.lists.length == 0 && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ width: '100%', height: '100vh', background: '' }}
          >
            <Button
              variant="contained"
              style={{ padding: 40 }}
              onClick={() => lists.addList()}
            >
              Add List
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
});

export default App;
