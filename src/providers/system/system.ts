import { Injectable } from '@angular/core';
import { PrivateKey, PublicKey } from 'bitcore-lib';

@Injectable()
export class SystemProvider {

  constructor() { }

  private username: string;

  private walletPath: string;
  private currentWalletName: string;
  private coinType: number;
  private coinName: string;
  private coinUnit: string;
  private network: string;
  
  private key: PrivateKey;
  private pubKey: PublicKey;
  private address: string;

  getUsername(){
    return this.username;
  }

  setUsername(username: string){
    return this.username = username;
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

  getAddress(){
    return this.address;
  }

  setAddress(address: string){
    return this.address = address;
  }
  
  getKey(){
    return this.key;
  }

  setKey(key: PrivateKey){
    return this.key = key;
  }

  getPubKey(){
    return this.pubKey;
  }

  setPubKey(pubKey: PublicKey){
    return this.pubKey = pubKey;
  }
}
