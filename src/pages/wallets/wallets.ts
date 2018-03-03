import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WalletsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {

  public wallets : any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  addWallet(){
      
  }

  createWallet(){

  }
}
