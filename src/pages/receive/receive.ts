import { WalletInfo } from './../../data/wallet-info';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { SystemProvider } from '../../providers/system/system';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {

  address: string = null;
  addresses: any;
  moreAddresses: boolean = false;

  error: string;
  errorVisible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public system: SystemProvider,
    public clipboard: Clipboard,
    public toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.getAddresses();
  }


  getAddresses() {
    let walletName = this.system.getWalletName();
    if(!walletName) return;
    let wallet = new WalletInfo(walletName);
    this.api
      .getAllReceiveAddresses(wallet)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            let ads = response.json().addresses.filter(a=> !a.isUsed && !a.isChange);
            if(ads.length > 5) {
              ads = ads.slice(0,5);
              this.moreAddresses = true;
            }
            this.addresses = ads;
          }
        },
        error => {
          if (error.status === 0) {
            this.error = "Could not get addresses"
          
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

  newAddress(){
    let walletName = this.system.getWalletName();
    if(!walletName) return;
    let wallet = new WalletInfo(walletName);
    this.api
      .getUnusedReceiveAddress(wallet)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.address = response.json();
          }
        },
        error => {
          if (error.status === 0) {
            this.error = "Could not get address"
          
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

  doCopy(address : string){
    this.clipboard.copy(address);
    this.copyStringToClipboard(address)
    let toast = this.toastCtrl.create({
      message: 'Address: ' +address +' copied!' ,
      duration: 3000
    });
    toast.present();
  }

  copyStringToClipboard (str: string) {
    function handler (event){
        event.clipboardData.setData('text/plain', str);
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
  }
}
