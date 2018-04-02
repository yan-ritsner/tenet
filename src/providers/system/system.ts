import { Injectable } from '@angular/core';


@Injectable()
export class SystemProvider {

  constructor() { }

  private username: string;
  private messagingAddress: string;

  private walletPath: string;
  private currentWalletName: string;
  private coinType: number;
  private coinName: string;
  private coinUnit: string;
  private network: string;
  

  getUsername(){
    return this.username;
  }

  getMessagingAddress(){
    return this.messagingAddress;
  }

  getWalletPath() {
    return this.walletPath;
  }

  setWalletPath(walletPath: string) {
    this.walletPath = walletPath;
  }

  getNetwork() {
    return this.network;
  }

  setNetwork(network: string) {
    this.network = network;
  }

  getWalletName() {
    return this.currentWalletName;
  }

  setWalletName(currentWalletName: string) {
    this.currentWalletName = currentWalletName;
  }

  getCoinType() {
    return this.coinType;
  }

  setCoinType (coinType: number) {
    this.coinType = coinType;
  }

  getCoinName() {
    return this.coinName;
  }

  setCoinName(coinName: string) {
    this.coinName = coinName;
  }

  getCoinUnit() {
    return this.coinUnit;
  }

  setCoinUnit(coinUnit: string) {
    this.coinUnit = coinUnit;
  }

  setUsername(username: string){
    return this.username = username;
  }

  setMessagingAddress(messagingAddress: string){
    return this.messagingAddress = messagingAddress;
  }
  
}
