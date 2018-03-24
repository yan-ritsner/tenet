import { PrivateKey } from 'bitcore-lib';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-messanger',
  templateUrl: 'messanger.html',
})
export class MessangerPage {

  address: string = "myaddress";
  tab: string = "messages";

  constructor(public navCtrl: NavController,    
              public clipboard: Clipboard,
              public toastCtrl: ToastController) {

  }


  createAddress(){
    var key = new PrivateKey();
    var pubKey = key.toPublicKey();
  }

  doCopy(){
    if(!this.address) return;
    this.clipboard.copy(this.address);
    this.copyStringToClipboard(this.address)
    let toast = this.toastCtrl.create({
      message: 'Address: ' +this.address +' copied!' ,
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
