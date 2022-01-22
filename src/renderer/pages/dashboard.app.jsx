import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { StoreContext } from '../stores/store.context';

import Button from '@material-ui/core/Button';

export const Dashboard = observer(() => {
  const { app } = useContext(StoreContext);

  return (
    <>
      <Button onClick={() => app.createWindow()}>hello</Button>;
    </>
  );
});
