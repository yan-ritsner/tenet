import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';

import { AddwalletPage } from '../addwallet/addwallet';
import { CreatewalletPage } from '../createwallet/createwallet';
import { ReceivePage } from '../receive/receive';
import { SendPage } from './../send/send';

import { SystemProvider } from '../../providers/system/system';
import { ApiProvider } from './../../providers/api/api';
import { WalletInfo } from './../../data/wallet-info';

@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {

  public wallet : string;
  public walletReady : boolean = false;
  public walletSubs : Subscription = null;

  public error: string;
  public errorVisible: boolean = false;

  public confirmedBalance: number;
  public unconfirmedBalance: number;

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public system: SystemProvider,
              public api: ApiProvider) {
  }

  ionViewWillEnter(){
    let model = this;
    this.storage.get('wallet')
    .then( function (data) {
      if(data){
        model.wallet = data.name;
        model.system.setWalletName(model.wallet);
        model.walletReady = true;
        model.loadWallet();
      }
    }, function (error) {
      console.log(error);
    });
  }

  ionViewWillUnload(){
      this.unloadWallet();
  }

  send(){
    this.navCtrl.push(SendPage);
  }

  receive(){
    this.navCtrl.push(ReceivePage);
  }

  addWallet(){
      this.navCtrl.push(AddwalletPage);
  }

  createWallet(){
    this.navCtrl.push(CreatewalletPage);
  }

  restoreWallet(){
    alert("restoreWallet")
  }

  loadWallet()
  {
    this.unloadWallet();

    let walletLoad = new WalletInfo(this.wallet);

    let walletObs = this.api.getWalletBalance(walletLoad);
    this.walletSubs = walletObs.subscribe(
      response => {
        if (response.status >= 200 && response.status < 400) {

          let balanceResponse = response.json();
          this.confirmedBalance = balanceResponse.balances[0].amountConfirmed;
          this.unconfirmedBalance = balanceResponse.balances[0].amountUnconfirmed;

          this.errorVisible = false;
        }
      },
      error => {
        
        if (error.status === 0) {
          this.error = "Could not load wallet info"
        
        } else if (error.status >= 400) {
          if (!error.json().errors[0]) {
            this.error = error;
          }
          else {
            this.error = error.json().errors[0].message;
          }
        }

        this.errorVisible = true;
      }
    );
  }

  unloadWallet()
  {
    if(this.walletSubs == null) return;
    this.walletSubs.unsubscribe();
  }

  balance(value)
  {
    if(value == null) return "";
    let val = value / 100000000;
    var factor = Math.pow(10, 8);
    var formatted =  (Math.round(val * factor) / factor).toLocaleString();
    if(formatted.indexOf(".") < 0)
    formatted += ".0";
    return formatted;
  }
}