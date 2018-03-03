import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddwalletPage } from '../addwallet/addwallet';


@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {

  public wallets : any[] = [];

  constructor(public navCtrl: NavController) {

  }

  addWallet(){
      this.navCtrl.push(AddwalletPage);
  }

  createWallet(){

  }
}