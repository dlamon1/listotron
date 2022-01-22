import { makeAutoObservable } from 'mobx';
import { XMLParser } from 'fast-xml-parser';
import { options } from '../utils/options';

export class Vmix {
  unconfirmedIp = '';
  ip = '';
  xmlRaw = '';
  isSocketConnected = false;
  connectionTimeout;
  alertStore;
  inputs = [];
  lists = [];

  constructor(alertStore) {
    this.alertStore = alertStore;
    makeAutoObservable(this);
  }

  setIp(ip) {
    this.ip = ip;
  }

  attemptVmixConnection(ip) {
    this.unconfirmedIp = ip;
    window.api.vmix.connect(ip);
    this.connectionTimeout = setTimeout(() => this.connectError(), 5000);
  }

  connected() {
    this.ip = this.unconfirmedIp;
    this.setIsSocketConnected = true;
    clearTimeout(this.connectionTimeout);
    this.alertStore.connectionMadeToVmix();
    this.requestXml();
  }

  requestXml() {
    window.api.vmix.reqXml();
  }

  xmlDataRes(domString) {
    console.log(domString);
  }

  setXmlRaw(data) {
    this.xmlRaw = data;
  }

  updateInputList(data) {
    const parser = new XMLParser(options);
    let jsonObj = parser.parse(data);
    let list = jsonObj.xml.vmix.inputs.input;
    this.inputs = list;
  }

  setIsSocketConnected(boolean) {
    this.isSocketConnected = boolean;
  }

  shutdownSocket() {
    window.api.vmix.shutdown();
  }

  refresh() {
    this.ip && window.api.vmix.reqXml();
  }

  connectError() {
    this.alertStore.cannotConnect();
  }

  lostSocketConnection(__, error) {
    this.alertStore.lostVmixConnection();
    this.setIp = '';
    this.isSocketConnected = false;
  }
}
