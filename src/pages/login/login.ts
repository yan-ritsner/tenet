import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController, MenuController } from 'ionic-angular';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FB_APP_ID: number = 792896977566345;

  pStyle: object = {};
  pParams: object = {};
  pWidth: number = 100;
  pHeight: number = 100;

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public fb: Facebook,
    public nativeStorage: NativeStorage) {
    this.fb.browserInit(this.FB_APP_ID, "v2.8");

    menu.enable(true);
    
    this.pStyle = {
      'background-color' : '#222',
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
        //now we have the users info, let's save it in the NativeStorage
        this.nativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(() => {
          nav.setRoot(UserPage);
        },(error) => {
          console.log(error);
        })
      })
    }, (error) => {
      console.log(error);
    });
  }
}
