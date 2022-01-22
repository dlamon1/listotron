import express from 'express';

import { apiFunction } from './apiServer';
import { vmixSocket } from './vmixSocket';

const api = express();

export function runNetConnections(mainWindow, connection) {
  apiFunction(mainWindow, api);
  vmixSocket(mainWindow, connection);
}
