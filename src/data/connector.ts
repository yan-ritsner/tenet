import { ContactData } from './contact-data';
import { ContactStatus } from './contact-status';

export class Connector {

    public contact: ContactData;
    public pc: any;
    public dc: any;
    public offer: any;
    public answer: any;

    constructor(contact: ContactData) {
       this.contact = contact;
    }
    
    pcCreate(iceServers: any[])
    {
        this.pc = new RTCPeerConnection({ iceServers: iceServers});
        this.pc.ondatachannel = e => { this.dcInit(e.channel)};
        this.pc.oniceconnectionstatechange = e => {console.log( this.pc.iceConnectionState)};
    }

    pcClose()
    {
        if(this.pc == null) return;
        this.pc.close();
    } 

    dcCreate(name: string)
    {
        let dc = this.pc.createDataChannel(name)
        this.dcInit(dc);
    }

    dcInit(dc: any)
    {
        this.dc = dc;
        this.dc.onopen = () => {console.log("open"); this.contact.status = ContactStatus.Connected};
        this.dc.onmessage = e => {console.log(e.data)};
    }
  
  }
  