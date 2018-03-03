import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { ParticlesModule } from 'angular-particle'
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { SignupPage } from './../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { WalletsPage } from './../pages/wallets/wallets';
import { AddwalletPage } from './../pages/addwallet/addwallet';

import { ApiProvider } from '../providers/api/api';
import { SystemProvider } from '../providers/system/system';

@NgModule({
  declarations: [
    MyApp,

    LoginPage,
    UserPage,
    SignupPage,
    SigninPage,
    WalletsPage,
    AddwalletPage
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
    AddwalletPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    
    ApiProvider,
    SystemProvider
  ]
})
export class AppModule {}
