import { PublicKey } from 'bitcore-lib';
import { ContactStatus } from "./contact-status";

export class ContactData {

    constructor(name: string, address: string, status: ContactStatus) {
      this.name = name;
      this.address = address;
      this.status = status;
    }

    public name: string;
    public address: string;
    public status: ContactStatus;
    public pubKey: PublicKey;
  }
  