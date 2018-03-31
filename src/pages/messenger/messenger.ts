import { ListenData } from './../../data/listen-data';
import { PrivateKey, PublicKey } from 'bitcore-lib';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-messenger',
  templateUrl: 'messenger.html',
})
export class MessengerPage {

  key: PrivateKey;
  pubKey: PublicKey;
  address: string = "[no address]";
  tab: string = "contacts";
  listenSubs : Subscription = null;

  errorVisible: boolean = false;
  error: string = null;

  constructor(public navCtrl: NavController,    
              public clipboard: Clipboard,
              public toastCtrl: ToastController,
              public storage: Storage,
              public api: ApiProvider) {

  }

  ionViewWillEnter(){
    let model = this;
    this.storage.get('messenger-key')
    .then( function (data) {

      model.key = new PrivateKey(data ? data : null)
      model.pubKey = model.key.toPublicKey();
      model.address = model.pubKey.toAddress().toString();

      if(!data)
      {
        model.storage.set('messenger-key', model.key.toString());
      }
      //model.startListening();
    }, function (error) {
      console.log(error);
    });
  }

  ionViewWillUnload(){
    //this.stopListening();
  }

  startListening(){
    this.stopListening();

    let listenData = new ListenData(this.address);

    this.api.messagingStartListening(listenData);

    let listenObs = this.api.messagingGetConnections(listenData);
    this.listenSubs = listenObs.subscribe(
      response => {
        if (response.status >= 200 && response.status < 400) {
          //let connections = response.json();


          this.errorVisible = false;
        }
      },
      error => {
        
        if (error.status === 0) {
          this.error = "Could not get connections"
        
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

  stopListening(){
    if(this.listenSubs == null) return;
    this.listenSubs.unsubscribe();

    let listenData = new ListenData(this.address);
    this.api.messagingStopListening(listenData);
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
