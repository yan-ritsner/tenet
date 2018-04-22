import { Connector } from './../../data/connector';
import { ContactPayload } from './../../data/contact-payload';
import { SystemProvider } from './../../providers/system/system';
import { ListenerProvider } from './../../providers/listener/listener';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddcontactPage } from './../addcontact/addcontact';
import { EditcontactPage } from './../editcontact/editcontact';
import { ContactData } from './../../data/contact-data';
import { ContactStatus } from '../../data/contact-status';
import * as Message from 'bitcore-message';
import { PublicKey } from 'bitcore-lib';
import { ConnectData } from '../../data/connect-data';
import { ApiProvider } from '../../providers/api/api';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit, OnDestroy {

  servers: any = [{ urls: "stun:stun.l.google.com:19302" }];

  contacts: Array<ContactData> = [];
  contactsDict : any = {};
  contactActive: ContactData = null;
  contactsConnectors: any = {};
  contactSelected: Connector;
  @Output() 
  onContactSelected: EventEmitter<Connector> = new EventEmitter<Connector>();

  error: string;
  errorVisible: boolean = false;

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public clipboard: Clipboard,
              public toastCtrl: ToastController,
              public listener: ListenerProvider,
              public system: SystemProvider,
              public api: ApiProvider) {
  }

  ngOnInit(){
    this.getContactRequest();
    this.loadContacts();
  }

  ngOnDestroy(){
    this.disposeContacts();
  }

  address(){
    return this.system.getAddress();
  }

  disposeContacts(): any {
    for(var i=0;i<this.contacts.length;i++)
    {
      let contact = this.contacts[i];
      let connector = this.contactsConnectors[contact.address];
      if(connector) connector.pcClose();
    }
  }

  getContactRequest(){
    this.listener.getUpdates().subscribe(u=>this.contactRequest(u));
    var connections = this.listener.getConnections();
    for(var i=0; i<connections.length; i++)
    {
        this.contactRequest(connections[i]);
    }
    this.listener.clearConnections();
  }

  loadContacts(){
    let model = this;
    this.storage.get('contacts')
    .then( function (data) {
      if(data){
        var keys = Object.keys(data);
        for(let i= 0; i < keys.length; i++)
        {
          let contactData  = data[keys[i]];
          let contact = new ContactData(contactData.name, contactData.address, contactData.status);
          contact.pubKey = contactData.pubKey;
          contact.initiator = contactData.initiator;
          model.contactsDict[keys[i]] = contact;
          model.contacts.push(contact);
        }
      }
    }, function (error) {
      console.log(error);
    });
  }

  contactRequest(data){
    let connectData  = JSON.parse(data);
    let messageData = connectData.message;
    let signature = connectData.signature;
    let message = new Message(messageData);
    let messageObj = JSON.parse(messageData);
    let pubKey = PublicKey.fromString(messageObj.pubKey)
    let address = pubKey.toAddress().toString();
    let name  =  messageObj.username ? messageObj.username : "New Contact Request";
    let payloadType = messageObj.payloadType;
    let payload = messageObj.payload;
    let verified = message.verify(address, signature);

    if(!verified){
      console.error("Contact was not verified");
      return;
    }

    let contact = this.contactsDict[address];

    //Contact request
    if(!contact)
    {
      contact = new ContactData(name, address, ContactStatus.Requested);
      contact.pubKey = messageObj.pubKey;
  
      this.contacts.push(contact);
      this.contactsDict[address] = contact;
  
      this.sendResponse(contact, null, null);
    }
    //Contact response
    else if(payloadType == null)
    {
      if(contact.name == "New Contact") contact.name = name;
      contact.status = ContactStatus.Accepted;
      contact.pubKey = messageObj.pubKey;

      this.storeContact(contact);
    }
    //Connect offer request
    else if(payloadType == ContactPayload.Offer)
    {
      this.processOffer(contact, payload);
    }
    //Connect answer response
    else if(payloadType == ContactPayload.Answer)
    {
      this.processAnswer(contact, payload);
    }
  }

  sendOffer(contact: ContactData) : Connector
  {
    let connector = new Connector(contact);
    connector.pcCreate(this.servers);
    connector.dcCreate("chat");

    this.contactsConnectors[contact.address] = connector;

    connector.pc.createOffer()
      .then(d=> connector.pc.setLocalDescription(d))
      .catch(d=>console.log(d));

    connector.pc.onicecandidate = e => {
      if (e.candidate) return;
      connector.offer = connector.pc.localDescription.sdp
      this.sendResponse(contact, ContactPayload.Offer, connector.offer);
    }

    return connector;
  }

  processOffer(contact: ContactData, offer: string) : Connector
  {
    let connector = new Connector(contact);
    let desc = new RTCSessionDescription({type:"offer", sdp: offer});
    connector.pcCreate(this.servers);
    connector.offer = offer;

    this.contactsConnectors[contact.address] = connector;

    connector.pc.setRemoteDescription(desc)
      .then(() => connector.pc.createAnswer())
      .then(d => connector.pc.setLocalDescription(d))
      .catch(d =>console.log(d));

    connector.pc.onicecandidate = e =>{
      if (e.candidate) return;
      connector.answer = connector.pc.localDescription.sdp;
      this.sendResponse(contact, ContactPayload.Answer, connector.answer);
    }
    
    return connector;
  }

  processAnswer(contact: ContactData, answer: string)
  {
    let connector = this.contactsConnectors[contact.address];
    if(!connector) return;
    
    var desc = new RTCSessionDescription({ type:"answer", sdp: answer });
    connector.pc.setRemoteDescription(desc).catch(d =>console.log(d));
  }

  sendResponse(contact: ContactData, payloadType: ContactPayload, payload: any)
  {
    let messageData = JSON.stringify({
      username: this.system.getUsername(),
      pubKey: this.system.getPubKey().toString(),
      payloadType: payloadType,
      payload: payload
    });
    let message = new Message(messageData);
    let key = this.system.getKey();
    let signature = message.sign(key);
    let data = JSON.stringify({
      message: messageData,
      signature : signature,
    });
    
    let model = this;
    let connectData = new ConnectData(contact.address, data);
    this.api
    .messagingConnect(connectData)
    .subscribe(
      response => {
        if (response.status >= 200 && response.status < 400){
         contact.status = ContactStatus.Accepted
         model.storeContact(contact);
        }
      },
      error => {
        console.log(error);
       
        if (error.status === 0) {
          this.error = "Could not send accept request"
        
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
  }

  storeContact(contact: ContactData){
    let model = this;
    model.storage.get('contacts')
    .then((data) => {
      if(!data) data = {};
      data[contact.address] = contact;
      model.storage.set('contacts',data);
    }, (error) => {
      console.log(error);
    });
  }

  addContact(){
    this.navCtrl.push(AddcontactPage, this);
  }

  deleteContact(contact: ContactData){
   let index = this.contacts.indexOf(contact);
   this.contacts.splice(index,1);
   delete this.contactsDict[contact.address];
   if(this.contactsConnectors[contact.address])
   {
    this.contactsConnectors[contact.address].pcClose();
    delete this.contactsConnectors[contact.address];
   }

   let model = this;
   this.storage.get('contacts')
    .then( function (data) {
      if(data){
        delete data[contact.address];
        model.storage.set('contacts',data);
      }
    }, function (error) {
      console.log(error);
    });
  }

  activateContact(contact: ContactData){
    if(this.contactActive == contact)
      this.contactActive = null;
    else
      this.contactActive = contact;
  }

  deactivateContact(){
    this.contactActive = null;
  }

  selectContact(contact: ContactData){
    var connector = this.contactsConnectors[contact.address];
    this.contactSelected = connector ? connector : this.sendOffer(contact);
    this.onContactSelected.emit(this.contactSelected);
  }

  infoContact(contact: ContactData){
    this.navCtrl.push(EditcontactPage,contact);
  }

  iconForContact(contact: ContactData){
    switch(contact.status)
    {
      case ContactStatus.Initiated:
        return "ios-contact-outline";
      case ContactStatus.Requested:
        return "ios-help-circle-outline";
      case ContactStatus.Accepted:
        return "ios-contact-outline";
      case ContactStatus.Connected:
        return "ios-contact-outline";
    }
  }
  colorForContact(contact: ContactData){
    switch(contact.status)
    {
      case ContactStatus.Initiated:
        return "secondary";
      case ContactStatus.Requested:
        return "secondary";
      case ContactStatus.Accepted:
        return "primary3";
      case ContactStatus.Connected:
        return "primary";
    }
  }


  doCopy(){
    let address = this.address();
    if(!address) return;
    this.clipboard.copy(address);
    this.copyStringToClipboard(address)
    let toast = this.toastCtrl.create({
      message: 'Address: ' +address +' copied!' ,
      duration: 3000
    });
    toast.present();
  }

  copyStringToClipboard (str: string) {
    function handler (event){
        event.clipboardData.setData('text/plain', str);
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
  }

  testContacts(){
    let contact1 = new ContactData("Contact 1", "Address 1", ContactStatus.Requested);
    let contact2 = new ContactData("Contact 2", "Address 2", ContactStatus.Initiated);
    let contact3 = new ContactData("Contact 3", "Address 3", ContactStatus.Connected);
    this.contacts.push(contact1);
    this.contacts.push(contact2);
    this.contacts.push(contact3);
  }
}
