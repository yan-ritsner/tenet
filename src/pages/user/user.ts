import { OnInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage implements OnInit {

  public user: any = {};
  public userReady: boolean = false;

  constructor(
    public navCtrl: NavController,
    public fb: Facebook,
    public storage: Storage) {}

  ngOnInit(){
     let model = this;
     model.storage.get('user')
    .then((data) => {
      if(data)
      {
        model.user = {
          isfb: data.isfb,
          name: data.name,
        };
        model.userReady = true;
      }
      else
      {
        model.navCtrl.push(LoginPage);
      }
    }, (error) => {
      console.log(error);
    });
  }

  doLogout(){
    if(this.user.isfb)
    {
      this.fb.logout()
      .then((response) => {
        //user logged out so we will remove him from the Storage
        this.logoutUser();
      }, (error) => {
        console.log(error);
      });
    }
    else
    {
      //user logged out so we will remove him from the Storage
      this.logoutUser();
    }
  }

  logoutUser(){
    this.storage.remove('user');
    this.navCtrl.push(LoginPage);
  }

}
