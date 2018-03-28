import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddcontactPage } from './../addcontact/addcontact';
import { ContactData } from './../../data/contact-data';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit {

  contacts: Array<ContactData> = [];

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
          let contact  = data[keys[i]];
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

}
