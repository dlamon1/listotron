import { makeAutoObservable } from 'mobx';
import { XMLParser } from 'fast-xml-parser';
import { options } from '../utils/options';

export class Vmix {
  unconfirmedIp = '';
  ip = '';
  isSocketConnected = false;
  connectionTimeout;
  alertStore;
  lists = [];
  isAttemptingConnection = false;

  constructor(alertStore) {
    this.alertStore = alertStore;
    makeAutoObservable(this);
  }

  postFunction(cmd) {
    console.log(cmd);
    window.api.vmix.postFunction(cmd);
  }

  selectInputByIndex(file, i, key) {
    let cmd = `SelectIndex Input=${key}&Value=${i + 1}`;
    this.postFunction(cmd);
  }

  previous(key) {
    let cmd = `PreviousItem Input=${key}`;
    this.postFunction(cmd);
  }

  next(key) {
    let cmd = `NextItem Input=${key}`;
    this.postFunction(cmd);
  }

  handleDroppedFiles(files, key) {
    let length = files.length;
    for (let i = 0; i < length; i++) {
      let isVideoImageOrAudio = this.checkFileType(files[i]);
      if (isVideoImageOrAudio) {
        this.postAddFileToListReq(files[i].path, key);
      }
    }
  }

  checkFileType(file) {
    let acceptedTypes = ['audio', 'video', 'image'];
    let type = file.type.split('/');
    let i = acceptedTypes.includes(type[0]);
    if (i) {
      return true;
    } else {
      return false;
    }
  }

  postAddFileToListReq(path, key) {
    let cmd = `ListAdd Input=${key}&Value=${path}`;
    this.postFunction(cmd);
  }

  getListIndexFromListKey(key) {
    let index = this.lists.findIndex((list) => list.key == key);
    return index;
  }

  requestXml() {
    window.api.vmix.reqXml();
  }

  xmlDataRes(domString) {
    let inputs = this.parseXmlForInputs(domString);
    let lists = this.getListsFromInputs(inputs);
    this.lists = lists;
  }

  parseXmlForInputs(data) {
    const parser = new XMLParser(options);
    let jsonObj = parser.parse(data);
    let inputs = jsonObj.xml.vmix.inputs.input;
    return inputs;
  }

  getListsFromInputs(inputs) {
    let lists = [];
    inputs.forEach((input) => {
      let isList = this.checkIfList(input);
      if (isList) lists.push(input);
    });
    return lists;
  }

  checkIfListExistsLocally(key) {
    let index = this.lists.findIndex((list) => list.key == key);
    return index;
  }

  addListToLists(list) {
    this.lists.push(list);
  }

  updateListInLists(index, list) {
    this.lists[index] = list;
  }

  checkIfList(input) {
    if (input.type == 'VideoList') {
      return true;
    } else {
      return false;
    }
  }

  setIp(ip) {
    this.ip = ip;
  }

  attemptVmixConnection(ip) {
    this.isAttemptingConnection = true;
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
    this.isAttemptingConnection = false;
  }

  disconnected() {
    this.ip = '';
    this.unconfirmedIp = '';
    this.setIsSocketConnected = false;
    this.alertStore.lostVmixConnection();
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
    this.isAttemptingConnection = false;
    this.alertStore.cannotConnect();
  }

  lostSocketConnection(__, error) {
    this.alertStore.lostVmixConnection();
    this.setIp = '';
    this.isSocketConnected = false;
  }
}
