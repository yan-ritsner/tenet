import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any;

  // set our app's pages
  pages = [
      { title: 'User Details', component: UserPage },
  ];

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar) {

    menu.enable(false);

    platform.ready().then(() => {

      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      let env = this;
      this.storage.get('user')
      .then( function (data) {
        if(data){
          // user is previously logged and we have his data
          // we will let him access the app
          env.showUserPage();
        }
        else{
           //we don't have the user data so we will ask him to log in
          env.showLoginPage();
        }
      }, function (error) {
        console.log(error);
        //error go to login
        env.showLoginPage();
      });

      this.statusBar.styleDefault();
    });
  }

  showUserPage()
  {
    this.nav.push(UserPage);
    this.splashScreen.hide();
  }

  showLoginPage()
  {
    this.nav.push(LoginPage);
    this.splashScreen.hide();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
  
}

