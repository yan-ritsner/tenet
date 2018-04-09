import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { ParticlesModule } from 'angular-particle'
import { HttpModule } from '@angular/http';
import { Clipboard } from '@ionic-native/clipboard';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { SignupPage } from './../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { WalletsPage } from './../pages/wallets/wallets';
import { AddwalletPage } from './../pages/addwallet/addwallet';
import { CreatewalletPage } from './../pages/createwallet/createwallet';
import { SendPage } from './../pages/send/send';
import { ReceivePage } from './../pages/receive/receive';
import { TransactionsPage } from './../pages/transactions/transactions';
import { MessengerPage } from './../pages/messenger/messenger';
import { ContactsPage } from './../pages/contacts/contacts';
import { MessagesPage } from './../pages/messages/messages';
import { AddcontactPage } from './../pages/addcontact/addcontact';
import { EditcontactPage } from './../pages/editcontact/editcontact';
import { MapPage } from './../pages/map/map';

import { ApiProvider } from '../providers/api/api';
import { SystemProvider } from '../providers/system/system';
import { ListenerProvider } from '../providers/listener/listener';

@NgModule({
  declarations: [
    MyApp,

    LoginPage,
    UserPage,
    SignupPage,
    SigninPage,
    WalletsPage,
    AddwalletPage,
    CreatewalletPage,
    SendPage,
    ReceivePage,
    TransactionsPage,
    MessengerPage,
    ContactsPage,
    MessagesPage,
    AddcontactPage,
    EditcontactPage,
    MapPage
  ],
  imports: [
    ParticlesModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    LoginPage,
    UserPage,
    SignupPage,
    SigninPage,
    WalletsPage,
    AddwalletPage,
    CreatewalletPage,
    SendPage,
    ReceivePage,
    TransactionsPage,
    MessengerPage,
    ContactsPage,
    MessagesPage,
    AddcontactPage,
    EditcontactPage,
    MapPage
  ],
  providers: [
    Clipboard,
    StatusBar,
    SplashScreen,
    Facebook,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    
    ApiProvider,
    SystemProvider,
    ListenerProvider
  ]
})
export class AppModule {}
