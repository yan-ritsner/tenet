import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ConnectData } from './../../data/connect-data';

@Component({
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddcontactPage {

  address: string;
  data:string = "Test";

  error: string;
  errorVisible: boolean = false;

  constructor(public navCtrl: NavController,    
              public api: ApiProvider,
              public storage: Storage) {
  }

  addContact(){
    let connectData = new ConnectData(this.address, this.data);
    this.api
      .messagingConnect(connectData)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            
            //TODO:addcontact

            this.navCtrl.pop();
          }
        },
        error => {
          console.log(error);
         
          if (error.status === 0) {
            this.error = "Could not send transaction"
          
          } else if (error.status >= 400) {
            if (!error.json().errors[0]) {
              this.error = error;
            }
            else {
              this.error = error.json().errors[0].message;
            }
          }
  
          this.errorVisible = true;
        },
      )
    ;
  }
}
