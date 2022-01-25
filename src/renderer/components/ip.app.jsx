import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Version from './version.app.jsx';
import { CircularProgress, Typography } from '@material-ui/core';

import { StoreContext } from '../stores/store.context';

import { useStyles } from '../utils/AppStyles.jsx';

export const IpForm = observer(() => {
  const classes = useStyles();
  const { vmix } = useContext(StoreContext);

  const [ip, setIpp] = useState('127.0.0.1');

  return (
    <Grid item xs={12} style={{ marginTop: 0 }}>
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        style={{}}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100vh' }}
        >
          <Box style={{ width: '85%', backgroundColor: '', maxWidth: 450 }}>
            <Grid container justifyContent="center" alignItems="center">
              <TextField
                color="secondary"
                id="outlined-textarea"
                label="vMix IP Address"
                variant="outlined"
                margin="dense"
                value={ip}
                onChange={(e) => setIpp(e.target.value)}
                style={{ backgroundColor: '', width: '90%' }}
                focus="true"
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => vmix.attemptVmixConnection(ip)}
                style={{
                  marginTop: 10,
                  marginBottom: 15,
                  width: 100,
                }}
              >
                {vmix.isAttemptingConnection ? (
                  <CircularProgress size={25} />
                ) : (
                  <Typography>Set</Typography>
                )}
              </Button>

              <Version />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
});
