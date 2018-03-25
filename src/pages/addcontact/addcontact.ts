import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddcontactPage {

  address : string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  addContact(){

  }
}
