import React, { useContext, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { ListComponent } from '../components/list.dashboard';
import { StoreContext } from '../stores/store.context';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const Dashboard = observer(() => {
  const { vmix, lists } = useContext(StoreContext);

  let timeout = useRef();

  const newList = () => {
    lists.addList();
  };

  useEffect(() => {
    lists.addList();

    const refresh = () => {
      vmix.requestXml();
      timeout.current = setTimeout(refresh, 1500);
    };
    refresh();
    return () => clearTimeout(timeout.current);
  }, []);

  return (
    <>
      <Button
        onClick={() => newList()}
        variant="outlined"
        style={{ width: '50%', marginTop: 10, borderColor: 'orange' }}
      >
        Add List
      </Button>
      <Grid
        container
        justifyContent="space-around"
        style={{ background: '', width: '100%' }}
      >
        {lists.lists.map((list, i) => (
          <ListComponent listIndex={i} key={i} />
        ))}
      </Grid>
    </>
  );
});
