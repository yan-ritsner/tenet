import { WalletCreation } from './../../data/wallet-creation';
import { Component } from '@angular/core';
import { NavController, MenuController, } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-createwallet',
  templateUrl: 'createwallet.html',
})
export class CreatewalletPage {

  mnemonic: string = "";
  walletName: string;
  walletPassword :string;
  error: string;
  errorVisible: boolean = false;

  constructor(    
    public api: ApiProvider,
    public menu: MenuController,
    public navCtrl: NavController,
    public storage: Storage) {
  }

  ionViewWillEnter(){
    this.getMnemonic();
  }

  doCreateWallet(){
    let wallet = new WalletCreation(this.walletName, this.mnemonic, this.walletPassword);
    this.api
      .createWallet(wallet)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.storage.get('wallets')
            .then((data) => {
              if(!data)data = {};
              data[this.walletName] = {
                name : this.walletName,
              };
              this.storage.set('wallets',data);
            }, (error) => {
              console.log(error);
            });

            this.storage.set('wallet',
            {
              name : this.walletName,
            })
            .then(() => {
                this.navCtrl.pop();
            },(error) => {
              console.log(error);
            });
          }
        },
        error => {
          if (error.status === 0) {
            this.error = "Could not create a wallet"
          
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
      )
    ;
  }

  private getMnemonic() {
    this.api
      .getMnemonic()
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.mnemonic = response.json();
          }
        },
        error => {
          if (error.status === 0) {
            this.error = "Could not get mnemonic"
          
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
      )
    ;
  }
}
