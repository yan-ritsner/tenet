import { PrivateKey } from 'bitcore-lib';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var i = 5;
    var priKey = new PrivateKey();
    var pubKey = priKey.toPublicKey();
  }

  ionViewDidLoad() {
    //var Bitcore = Bitcore;
    //var key = new Bitcore.PrivateKey();

  }

}
