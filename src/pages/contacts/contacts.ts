import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddcontactPage } from './../addcontact/addcontact';
import { EditcontactPage } from './../editcontact/editcontact';
import { ContactData } from './../../data/contact-data';
import { ContactStatus } from '../../data/contact-status';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit {

  contacts: Array<ContactData> = [];
  contactActive: ContactData = null;

  constructor(public navCtrl: NavController,
              public storage: Storage) {
  }

  ngOnInit(){
    let model = this;
    this.storage.get('contacts')
    .then( function (data) {
      if(data){
        var keys = Object.keys(data);
        for(let i= 0; i < keys.length; i++)
        {
          let contactData  = data[keys[i]];
          let contact = new ContactData(contactData.name, contactData.address, contactData.data);
          contact.status = contact.status ? contact.status : ContactStatus.Initiated;
          model.contacts.push(contact);
        }
      }
    }, function (error) {
      console.log(error);
    });
  }

  addContact(){
    this.navCtrl.push(AddcontactPage,this.contacts);
  }


  deleteContact(contact: ContactData){
   let index = this.contacts.indexOf(contact);
   this.contacts.splice(index,1);

   let model = this;
   this.storage.get('contacts')
    .then( function (data) {
      if(data){
        delete data[contact.address];
        model.storage.set('contacts',data);
      }
    }, function (error) {
      console.log(error);
    });
  }

  activateContact(contact: ContactData){
    if(this.contactActive == contact)
      this.contactActive = null;
    else
      this.contactActive = contact;
  }

  deactivateContact(){
    this.contactActive = null;
  }

  infoContact(contact: ContactData){
    this.navCtrl.push(EditcontactPage,contact);
  }

  iconForContact(contact: ContactData){
    switch(contact.status)
    {
      case ContactStatus.Initiated:
        return "ios-contact-outline";
      case ContactStatus.Requested:
        return "ios-help-circle-outline";
      case ContactStatus.Connected:
        return "ios-contact-outline";
    }
  }
  colorForContact(contact: ContactData){
    switch(contact.status)
    {
      case ContactStatus.Initiated:
        return "secondary";
      case ContactStatus.Requested:
        return "secondary";
      case ContactStatus.Connected:
        return "primary";
    }
  }
}
