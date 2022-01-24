import { createContext } from 'react';

import { AppState } from './app.store';
import { Vmix } from './vmix.store';
import { AlertState } from './alert.store';
import { Lists } from './lists.store';

const alertState = new AlertState();
const app = new AppState();
const vmix = new Vmix(alertState);
const lists = new Lists(alertState, vmix);

export const StoreContext = createContext({
  app,
  vmix,
  alertState,
  lists,
});
