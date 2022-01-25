import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const ClockFormated = observer(() => {
  const [version, sVersion] = useState(process.env.VERSION);

  const setVersion = (__, version) => {
    sVersion(version);
  };

  useEffect(() => {
    window.api.on('app-version', setVersion);
  }, []);

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Typography
        style={{
          color: 'white',
          // marginTop: -5,
          marginBottom: 5,
          fontSize: 13,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        v. {version}
      </Typography>
    </Grid>
  );
});

export default ClockFormated;
