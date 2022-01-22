import React from 'react';
import { observer } from 'mobx-react-lite';

import { IpForm } from '../components/ip.app';

import Button from '@material-ui/core/Button';

const Page = observer((props) => {
  const {} = props;

  const createWindow = () => {
    window.api.createWindow();
  };

  // useEffect(() => {
  //   window.api.on('0', () => {
  //     console.log('0');
  //   });

  //   return () => {
  //     window.api.all();
  //   };
  // }, []);

  // const toggle = () => {
  //   window.api.example.exmple('hello world');
  // };

  return (
    <>
      <IpForm />
      <Button onClick={() => createWindow()}>hello</Button>;
    </>
  );
});

export default Page;
