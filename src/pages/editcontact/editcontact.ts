import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactData } from './../../data/contact-data';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-editcontact',
  templateUrl: 'editcontact.html',
})
export class EditcontactPage {

  name: string;
  contact: ContactData;
  
  error: string;
  errorVisible: boolean = false;

  constructor(public navCtrl: NavController,    
              public navParams: NavParams,
              public storage: Storage) {
    this.contact = navParams.data;
    this.name = this.contact.name;
  }

  saveContact(){
    this.contact.name = this.name;

    let model = this;
    this.storage.get('contacts')
     .then( function (data) {
       if(data){
         data[model.contact.address] = model.contact;
         model.storage.set('contacts',data);
       }
     }, function (error) {
       console.log(error);
     });

    this.navCtrl.pop();
  }
}
