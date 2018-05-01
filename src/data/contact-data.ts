import { ContactStatus } from "./contact-status";

export class ContactData {

    constructor(name: string, address: string, status: ContactStatus) {
      this.name = name;
      this.address = address;
      this.status = status;
    }

    public initiator: boolean; 
    public name: string;
    public address: string;
    public status: ContactStatus;
    public pubKey: string;

    getIcon(){
      switch(this.status)
      {
        case ContactStatus.Initiated:
          return "ios-contact-outline";
        case ContactStatus.Requested:
          return "ios-help-circle-outline";
        case ContactStatus.Accepted:
          return "ios-contact-outline";
        case ContactStatus.Connected:
          return "ios-contact-outline";
      }
    }
  
    getColor(){
      switch(this.status)
      {
        case ContactStatus.Initiated:
          return "secondary";
        case ContactStatus.Requested:
          return "secondary";
        case ContactStatus.Accepted:
          return "primary3";
        case ContactStatus.Connected:
          return "primary";
      }
    }
  
    getStatus(ready: string="ready"){
      switch(this.status)
      {
        case ContactStatus.Initiated:
          return "pending";
        case ContactStatus.Requested:
          return "pending";
        case ContactStatus.Accepted:
          return ready;
        case ContactStatus.Connected:
          return "connected";
      }
    }
  }
  