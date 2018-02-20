import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {

  user: any;
  userReady: boolean = false;

  constructor(
    public navCtrl: NavController,
    public fb: Facebook,
    public storage: Storage) {}

  ionViewCanEnter(){
    this.storage.get('user')
    .then((data) => {
      if(data)
      {
        this.user = {
          name: data.name,
          gender: data.gender,
          picture: data.picture
        };
        this.userReady = true;
      }
      else
      {
        this.navCtrl.push(LoginPage);
      }
    }, (error) => {
      console.log(error);
    });
  }

  doFbLogout(){
    var nav = this.navCtrl;
    this.fb.logout()
    .then((response) => {
      //user logged out so we will remove him from the Storage
      this.storage.remove('user');
      nav.push(LoginPage);
    }, (error) => {
      console.log(error);
    });
  }
}
