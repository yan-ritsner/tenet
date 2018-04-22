import { Connector } from './../../data/connector';
import { ListenerProvider } from './../../providers/listener/listener';
import { PrivateKey, PublicKey } from 'bitcore-lib';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { SystemProvider } from '../../providers/system/system';

@Component({
  selector: 'page-messenger',
  templateUrl: 'messenger.html',
})
export class MessengerPage {

  key: PrivateKey;
  pubKey: PublicKey;
  address: string = "[no address]";
  tab: string = "contacts";

  errorVisible: boolean = false;
  error: string = null;

  selectedContact: Connector;

  constructor(public navCtrl: NavController,    
              public storage: Storage,
              public api: ApiProvider,
              public listener: ListenerProvider,
              public system: SystemProvider) {

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

      model.startListening();

      model.system.setAddress(model.address);
      model.system.setKey(model.key);
      model.system.setPubKey(model.pubKey);

    }, function (error) {
      console.log(error);
    });
  }

  ionViewWillUnload(){
    this.stopListening();
  }

  startListening(){
    this.listener.startListening(this.address);
  }

  stopListening(){
    this.listener.stopListening();
  }

  contactSelected(connector: Connector){
    this.selectedContact = connector;
    this.tab = "messages";
  }
}
