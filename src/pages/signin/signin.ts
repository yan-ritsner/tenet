import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WalletsPage } from '../wallets/wallets';

@Component({
  selector: 'page-sigin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  email: string;
  password :string;
  errorVisible: boolean;

  constructor(
    public menu: MenuController,
    public navCtrl: NavController, 
    public storage: Storage) {
  }

  doSignin(){

    this.storage.get('users')
    .then((data) => {
      if(data && 
         data[this.email] && 
         data[this.email].password == this.password){
          this.storage.set('user',
          {
            isfb: false,
            name : data[this.email].name,
            email: this.email,
          })
          .then(() => {
            this.menu.enable(true);
            this.navCtrl.setRoot(WalletsPage);
          },(error) => {
            console.log(error);
          });
      }
      else
      {
        this.errorVisible = true;
      }
    }, (error) => {
      console.log(error);
    });


  }
}
