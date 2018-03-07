import { Component } from '@angular/core';
import { NavController, MenuController, } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-createwallet',
  templateUrl: 'createwallet.html',
})
export class CreatewalletPage {

  mnemonic: string;
  name: string;
  password :string;
  error: string;
  errorVisible: boolean = false;

  constructor(    
    public api: ApiProvider,
    public menu: MenuController,
    public navCtrl: NavController,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatewalletPage');
  }

}
