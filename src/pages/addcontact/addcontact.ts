import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ConnectData } from './../../data/connect-data';
import { ContactData } from './../../data/contact-data';
import { ContactStatus } from '../../data/contact-status';
import { SystemProvider } from '../../providers/system/system';
import * as Message from 'bitcore-message';

@Component({
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddcontactPage {

  name: string;
  address: string;
  
  error: string;
  errorVisible: boolean = false;

  constructor(public navCtrl: NavController,    
              public navParams: NavParams,
              public api: ApiProvider,
              public storage: Storage,
              public system: SystemProvider){
  }

  addContact(){
    let model = this;
    let messageData = JSON.stringify({
      username: this.system.getUsername(),
      pubKey: this.system.getPubKey().toString(),
    });
    let message = new Message(messageData);
    let key = this.system.getKey();
    let signature = message.sign(key);
    let data = JSON.stringify({
      message: messageData,
      signature : signature
    });
    let connectData = new ConnectData(this.address, data);

    this.api
      .messagingConnect(connectData)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            model.storage.get('contacts')
            .then((data) => {

              let name = model.name ? model.name : "New Contact";
              let contact = new ContactData(name, model.address, ContactStatus.Initiated);
              if(!data) data = {};

              data[model.address] = contact;
              model.storage.set('contacts',data);

              let contactsComponent = model.navParams.data;
              contactsComponent.contacts.push(contact);
              contactsComponent.contactsDict[model.address]=contact;

            }, (error) => {
              console.log(error);
            });

            model.navCtrl.pop();
          }
        },
        error => {
          console.log(error);
         
          if (error.status === 0) {
            this.error = "Could not send connect request"
          
          } else if (error.status >= 400) {
            if (!error.json().errors[0]) {
              this.error = error;
            }
            else {
              this.error = error.json().errors[0].message;
            }
          }
  
          this.errorVisible = true;
        },
      )
  }
}
