import { makeAutoObservable } from 'mobx';

export class AppState {
  // 0 = timer
  // 1 = video reader
  tabValue = 0;
  areBetaFeaturesEnabled = false;
  hasNewFeaturesDialogBeenSeen = false;

  constructor() {
    makeAutoObservable(this);
  }

  createWindow() {
    window.api.app.createWindow();
  }

  setAreBetaFeaturesEnabled(boolean) {
    this.areBetaFeaturesEnabled = boolean;
  }

  setTabValue(value) {
    this.tabValue = value;
  }

  enableBetaButton() {
    window.api.enableBetaButton();
  }

  setHasNewFeaturesDialogBeenSeen(boolean) {
    this.hasNewFeaturesDialogBeenSeen = boolean;
    window.api.store.set('hasNewFeaturesBeenSeen', true);
  }

  storeSet(key, value) {
    window.api.store.set(key, value);
  }
}
