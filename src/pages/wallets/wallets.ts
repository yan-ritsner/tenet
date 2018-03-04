import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddwalletPage } from '../addwallet/addwallet';
import { Storage } from '@ionic/storage';
import { SystemProvider } from '../../providers/system/system';

@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {

  public wallet : string;

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public system: SystemProvider) {
  }

  ionViewWillEnter(){
    let env = this;
    this.storage.get('wallet')
    .then( function (data) {
      if(data){
        env.wallet = data.name;
        env.system.setWalletName(env.wallet);
      }
      else{
        env.wallet = "Please add or create a wallet."
      }
    }, function (error) {
      console.log(error);
    });
  }

  send(){
    alert("send")
  }

  receive(){
    alert("receive")
  }

  addWallet(){
      this.navCtrl.push(AddwalletPage);
  }

  createWallet(){
    alert("createWallet")
  }


}