import { PrivateKey, PublicKey } from 'bitcore-lib';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-messanger',
  templateUrl: 'messanger.html',
})
export class MessangerPage {

  key: PrivateKey;
  pubKey: PublicKey;
  address: string = "[no address]";
  tab: string = "messages";

  constructor(public navCtrl: NavController,    
              public clipboard: Clipboard,
              public toastCtrl: ToastController,
              public storage: Storage) {

  }

  ionViewWillEnter(){
    let model = this;
    this.storage.get('messanger-key')
    .then( function (data) {

      model.key = new PrivateKey(data ? data : null)
      model.pubKey = model.key.toPublicKey();
      model.address = model.pubKey.toAddress().toString();

      if(!data)
      {
        model.storage.set('messanger-key', model.key.toString());
      }

    }, function (error) {
      console.log(error);
    });
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
