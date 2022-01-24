export class Vmix {
  event;
  ip = '';
  isConnected = false;
  xmlString = '';

  constructor(event) {
    this.event = event;
  }

  setIp(ip) {
    this.ip = ip;
  }

  setIsConnected(boolean) {
    this.isConnected = boolean;
  }

  setXmlString(string) {
    this.xmlString = string;
  }
}
