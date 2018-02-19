import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { ParticlesModule } from 'angular-particle'

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    ParticlesModule,
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
