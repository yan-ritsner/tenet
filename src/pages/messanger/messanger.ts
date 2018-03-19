import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

 
@Component({
  selector: 'page-messanger',
  templateUrl: 'messanger.html',
})
export class MessangerPage {

  tab: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessangerPage');
  }

}
