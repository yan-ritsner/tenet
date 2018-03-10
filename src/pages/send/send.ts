import { WalletsPage } from './../wallets/wallets';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { SystemProvider } from '../../providers/system/system';
import { TransactionBuilding } from '../../data/transaction-building';
import { TransactionSending } from '../../data/transaction-sending';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  amount: number;
  address: string;
  fee: string ="medium";
  password: string;

  error: string;
  errorVisible: boolean = false;

  isSending: boolean = false;

  transaction : TransactionBuilding;
  transactionHex: string;
  responseMessage: any;
  estimatedFee: number;

  constructor(    
    public navCtrl: NavController,
    public api: ApiProvider,
    public system: SystemProvider,
    public toastCtrl: ToastController) {
  }

  doSend(){
    this.isSending = true;
    this.buildTransaction();
  }

  public buildTransaction() {
    this.transaction = new TransactionBuilding(
      this.system.getWalletName(),
      "account 0",
      this.password,
      this.address,
      this.amount != null ? this.amount.toString():"0",
      this.fee,
      true
    );

    this.api
      .buildTransaction(this.transaction)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            console.log(response);
            this.responseMessage = response.json();
          }
        },
        error => {
          console.log(error);
          this.isSending = false;
          if (error.status === 0) {
            this.error = "Could not build transaction"
          
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
        () => {
          this.estimatedFee = this.responseMessage.fee;
          this.transactionHex = this.responseMessage.hex;
          if (this.isSending) {
            this.sendTransaction(this.transactionHex);
          }
        }
      )
    ;
  };

  private sendTransaction(hex: string) {
    let transaction = new TransactionSending(hex);
    this.api
      .sendTransaction(transaction)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.isSending = false;
  
            let toast = this.toastCtrl.create({
              message: 'Transaction successfully sent!',
              duration: 3000
            });
            toast.present();
            this.navCtrl.push(WalletsPage);
          }
        },
        error => {
          console.log(error);
          this.isSending = false;
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
