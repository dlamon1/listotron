import { makeAutoObservable } from 'mobx';

export class Lists {
  lists = [];

  constructor(alertState, vmix) {
    this.alertState = alertState;
    this.vmix = vmix;
    makeAutoObservable(this);
  }

  addList() {
    let list = new List(this.alertState, this.vmix);
    this.lists.push(list);
  }

  removeList(index) {
    this.lists.splice(index, 1);
  }
}

class List {
  key = '';
  files = [];

  constructor(alertState, vmix) {
    this.alertState = alertState;
    this.vmix = vmix;
    makeAutoObservable(this);
  }

  setKey(key) {
    this.key = key;
  }

  setFiles(files) {
    this.files = files;
  }

  createFileList() {
    if (!this.key) return [];
    let key = this.key;
    let index = this.getListIndexFromListKey(key);
    let listToSelect = this.vmix.lists[index];
    let listToReturn = [];

    // empty list
    if (typeof listToSelect.list == 'string') {
      listToReturn = [];
    }

    // one item list
    if (listToSelect.list && !listToSelect.list.item.length) {
      let file = {
        title: listToSelect.list.item._text,
        isSelected: true,
        listKey: listToSelect.key,
      };
      listToReturn.push(file);
    }

    // multiple item list
    if (
      typeof listToSelect.list == 'object' &&
      listToSelect.list.item.length > 0
    ) {
      let files = this.parseListFiles(listToSelect);
      listToReturn = files;
    }

    return listToReturn;
  }

  parseListFiles(listToSelect) {
    let files = [];
    listToSelect.list.item.forEach((item, i) => {
      let file = { isSelected: false, listKey: listToSelect.key };
      if (typeof item != 'string') {
        file.title = item._text;
        file.isSelected = true;
        file.listKey = listToSelect.key;
      } else {
        file.title = item;
      }
      files.push(file);
    });
    return files;
  }

  getListIndexFromListKey(key) {
    let index = this.vmix.lists.findIndex((list) => list.key == key);
    return index;
  }
}
