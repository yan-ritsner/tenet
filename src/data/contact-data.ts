import { ContactStatus } from "./contact-status";

export class ContactData {

    constructor(name: string, address: string, data: string) {
      this.name = name;
      this.address = address;
      this.data = data;
    }

    public name: string;
    public address: string;
    public data: string;
    public status: ContactStatus;
  }
  