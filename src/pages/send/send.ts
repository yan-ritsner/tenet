import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  amount: number;
  address: string;
  fee: string ="medium";
  password:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendPage');
  }

  doSend()
  {

  }

}
