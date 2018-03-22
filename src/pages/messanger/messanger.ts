import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-messanger',
  templateUrl: 'messanger.html',
})
export class MessangerPage {

  address: string = "myaddress";
  tab: string = "messages";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  doCopy()
  {

  }

}
