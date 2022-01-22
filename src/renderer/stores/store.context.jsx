import { createContext } from 'react';

import { AppState } from './app.store';
import { Vmix } from './vmix.store';
import { AlertState } from './alert.store';

const alertState = new AlertState();
const app = new AppState();
const vmix = new Vmix(alertState);

export const StoreContext = createContext({
  app,
  vmix,
  alertState,
});
