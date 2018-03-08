import { Component, OnInit } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { NavController, MenuController } from 'ionic-angular';
import { WalletsPage } from '../wallets/wallets';
import { SignupPage } from '../signup/signup';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit  {
  FB_APP_ID: number = 792896977566345;

  pStyle: object = {};
  pParams: object = {};
  pWidth: number = 100;
  pHeight: number = 100;

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public fb: Facebook,
    public storage: Storage) {
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  ngOnInit(){
       
    this.pStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.pParams = {
        particles: {
          line_linked: {
              enable: true,
              color: "#fff",
              opacity: 0.4,
              width: 1
            },
            number: {
                value: 100,
            },
            color: {
                value: '#fff'
            },
            shape: {
                type: 'circle',
            },
      },
    };
  }

  doFbLogin(){
    let permissions = new Array<string>();
    let nav = this.navCtrl;
    let menu = this.menu;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    this.fb.login(permissions)
    .then((response) => {
      let userId = response.authResponse.userID;
      let params = new Array<string>();

      //Getting name and gender properties
      this.fb.api("/me?fields=name,gender", params)
      .then((user) => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the Storage
        this.storage.set('user',
        {
          isfb: true,
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(() => {
          menu.enable(true);
          nav.setRoot(WalletsPage);
        },(error) => {
          console.log(error);
        })
      })
    }, (error) => {
      console.log(error);
    });
  }

  doSignin(){
    this.navCtrl.push(SigninPage);
  }
  doSignup(){
    this.navCtrl.push(SignupPage);
  }
}
