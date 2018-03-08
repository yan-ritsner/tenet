import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { WalletsPage } from '../pages/wallets/wallets';
import { SendPage } from '../pages/send/send';
import { ReceivePage } from '../pages/receive/receive';
import { TransactionsPage } from '../pages/transactions/transactions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any;

  // set our app's pages
  pages = [
      { title: 'User', component: UserPage, icon: "ios-contact-outline" },
      { title: 'Wallets', component: WalletsPage, icon: "ios-briefcase-outline" },
      { title: 'Send', component: SendPage, icon: "ios-arrow-dropright-outline" },
      { title: 'Receive', component: ReceivePage, icon: "ios-arrow-dropleft-outline" },
      { title: 'Transactions', component: TransactionsPage, icon: "ios-swap-outline" },
  ];

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar) {

    menu.enable(false);

    platform.ready().then(() => {

      let model = this;
      this.storage.get('user')
      .then( function (data) {
        if(data){
  
          model.showWalletsPage();
        }
        else{

          model.showLoginPage();
        }
      }, function (error) {
        console.log(error);

        model.showLoginPage();
      });

      this.statusBar.styleDefault();
    });
  }

  showWalletsPage()
  {
    this.nav.push(WalletsPage);
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

