import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AddcontactPage } from './../addcontact/addcontact';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  constructor(public navCtrl: NavController) {
    
  }

  ionViewDidLoad() {

  }

  addContact(){
    this.navCtrl.push(AddcontactPage);
  }

}
