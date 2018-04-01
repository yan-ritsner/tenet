import { ContactStatus } from "./contact-status";

export class ContactData {

    constructor(name: string, address: string, data: string, status: ContactStatus) {
      this.name = name;
      this.address = address;
      this.data = data;
      this.status = status != null ? status : ContactStatus.Initiated;
    }

    public name: string;
    public address: string;
    public data: string;
    public status: ContactStatus;
  }
  