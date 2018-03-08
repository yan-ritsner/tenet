import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WalletsPage } from '../wallets/wallets';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string;
  email: string;
  password :string;

  constructor(
    public menu: MenuController,
    public navCtrl: NavController, 
    public storage: Storage) {
  }

  doSignup(){

    this.storage.get('users')
    .then((data) => {
      if(!data)data = {};
      data[this.email] = {
        name : this.name,
        email: this.email,
        password: this.password
      };
      this.storage.set('users',data);
    }, (error) => {
      console.log(error);
    });

    this.storage.set('user',
    {
      isfb: false,
      name : this.name,
      email: this.email,
    })
    .then(() => {
      this.menu.enable(true);
      this.navCtrl.setRoot(WalletsPage);
    },(error) => {
      console.log(error);
    });
  }
}
