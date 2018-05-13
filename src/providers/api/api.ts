import { Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/interval";
import 'rxjs/add/operator/startWith';

import { WalletCreation } from '../../data/wallet-creation';
import { WalletRecovery } from '../../data/wallet-recovery';
import { WalletLoad } from '../../data/wallet-load';
import { TransactionBuilding } from '../../data/transaction-building';
import { TransactionSending } from '../../data/transaction-sending';
import { WalletInfo } from '../../data/wallet-info';
import { FeeEstimation } from '../../data/fee-estimation';
import { ListenData } from '../../data/listen-data';
import { ConnectData } from '../../data/connect-data';

@Injectable()
export class ApiProvider {

  private headers = new Headers({'Content-Type': 'application/json'});
  private pollingInterval = 1000;
  //private localNode = 'http://192.168.10.115:37222/api';
  private awsNode = 'http://52.16.204.42:37222/api';
  private currentApiUrl = this.awsNode;

  constructor(public http: Http) {
  
  }

   /**
     * Gets available wallets at the default path
     */
    getWalletFiles(): Observable<any> {
      return this.http
        .get(this.currentApiUrl + '/wallet/files')
        .map((response: Response) => response);
     }

    /**
      * Get a new mnemonic
      */
    getMnemonic(): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('language', 'English');
      params.set('wordCount', '12');

      return this.http
        .get(this.currentApiUrl + '/wallet/mnemonic', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

        /**
     * Create a new wallet.
     */
    createWallet(data: WalletCreation): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/wallet/create/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Recover a wallet.
     */
    recoverWallet(data: WalletRecovery): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/wallet/recover/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Load a wallet
     */
    loadWallet(data: WalletLoad): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/wallet/load/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }
    
    /**
     * Get wallet status info from the API.
     */
    getWalletStatus(): Observable<any> {
      return this.http
        .get(this.currentApiUrl + '/wallet/status')
        .map((response: Response) => response);
    }

    /**
     * Get general wallet info from the API once.
     */
    getGeneralInfoOnce(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('Name', data.walletName);

      return this.http
        .get(this.currentApiUrl + '/wallet/general-info', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }


    /**
     * Get general wallet info from the API.
     */
    getGeneralInfo(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('Name', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/general-info', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get wallet balance info from the API.
     */
    getWalletBalance(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/balance', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get the maximum sendable amount for a given fee from the API
     */
    getMaximumBalance(data): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0");
      params.set('feeType', data.feeType);
      params.set('allowUnconfirmed', "true");

      return this.http
        .get(this.currentApiUrl + '/wallet/maxbalance', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get a wallets transaction history info from the API.
     */
    getWalletHistory(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/history', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get an unused receive address for a certain wallet from the API.
     */
    getUnusedReceiveAddress(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      return this.http
        .get(this.currentApiUrl + '/wallet/unusedaddress', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get multiple unused receive addresses for a certain wallet from the API.
     */
    getUnusedReceiveAddresses(data: WalletInfo, count: string): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      params.set('count', count);
      return this.http
        .get(this.currentApiUrl + '/wallet/unusedaddresses', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

        /**
     * Get get all receive addresses for an account of a wallet from the API.
     */
    getAllReceiveAddresses(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      return this.http
        .get(this.currentApiUrl + '/wallet/addresses', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Estimate the fee of a transaction
     */
    estimateFee(data: FeeEstimation): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', data.accountName);
      params.set('destinationAddress', data.destinationAddress);
      params.set('amount', data.amount);
      params.set('feeType', data.feeType);
      params.set('allowUnconfirmed', "true");

      return this.http
        .get(this.currentApiUrl + '/wallet/estimate-txfee', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Build a transaction
     */
    buildTransaction(data: TransactionBuilding): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/wallet/build-transaction', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Send transaction
     */
    sendTransaction(data: TransactionSending): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/wallet/send-transaction', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Send shutdown signal to the daemon
     */
    shutdownNode(): Observable<any> {
      return this.http
        .post(this.currentApiUrl + '/node/shutdown', '')
        .map((response: Response) => response);
    }

    /**
     * Send messaging start listening command 
     */
    messagingStartListening(data: ListenData): Observable<any> {
      console.log("messagingStartListening-request");
      return this.http
        .post(this.currentApiUrl + '/messaging/startlistening', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => {
          console.log("messagingStartListening-response");
          return response;
        });
    }

    /**
     * Send messaging stop listening command 
     */
    messagingStopListening(data: ListenData): Observable<any> {
      console.log("messagingStopListening-request");
      return this.http
        .post(this.currentApiUrl + '/messaging/stoplistening', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => {
          console.log("messagingStopListening-response");
          return response;
        });
    }
    
    /**
     * Send messaging connect command 
     */
    messagingConnect(data: ConnectData): Observable<any> {
      console.log("messagingConnect-request");
      return this.http
        .post(this.currentApiUrl + '/messaging/connect', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => {
          console.log("messagingConnect-response");
          return response;
        });
    }
    
    /**
     * Get messaging connection requests
     */
    messagingGetConnections(data: ListenData): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('address', data.address);
      console.log("messagingGetConnections-request");
      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/messaging/connections', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => {
          console.log("messagingGetConnections-response");
          return response;
        });
    }

}
