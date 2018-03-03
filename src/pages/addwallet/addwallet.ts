import { Component } from '@angular/core';
import { NavController, MenuController, } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { WalletLoad } from './../../data/wallet-load';

@Component({
  selector: 'page-addwallet',
  templateUrl: 'addwallet.html',
})
export class AddwalletPage {

  name: string;
  password :string;
  error: string;
  errorVisible: boolean = false;

  constructor(
    public api: ApiProvider,
    public menu: MenuController,
    public navCtrl: NavController) {
      
  }

  doAddWallet(){
    this.error = null;
    this.errorVisible = false;

    let walletLoad = new WalletLoad(this.name,this.password);

    this.api.loadWallet(walletLoad)
    .subscribe(
      response => {
        if (response.status >= 200 && response.status < 400) {

        }
      },
      error => {
        
        if (error.status === 0) {
          this.error = "Could not login to the wallet"
        
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
}
