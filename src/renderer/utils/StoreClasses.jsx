import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export class Example {
  constructor(type) {
    makeAutoObservable(this);
  }

  // addColor(color, time, isDown) {
  //   let newColor = new ColorCheckpoint(color, time, isDown);
  //   this.colors.push(newColor);
  // }
  // addTrigger() {
  //   let newTrigger = new Trigger();
  //   this.triggers.push(newTrigger);
  // }
  // removeTrigger(id) {
  //   let index = this.triggers.map((trigger) => trigger.id).indexOf(id);
  //   if (index > -1) {
  //     this.triggers.splice(index, 1);
  //     // console.log("Result", arrayObject);
  //   }
  // }
}
