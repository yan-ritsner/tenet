import { MessageData } from './message-data';
import { ContactData } from './contact-data';
import { ContactStatus } from './contact-status';

export class Connector {

    public contact: ContactData;
    public pc: any;
    public dc: any;
    public offer: any;
    public answer: any;
    public messages: Array<MessageData> = [];
    public messagesMax: number = 1000;
    public messagesCount: number = 100;

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
        this.dc.onclose = () => {console.log("close"); this.contact.status = ContactStatus.Accepted};
        this.dc.onmessage = e => { this.dcReceive(e.data)};
    }
  
    dcSend(message: string)
    {
        this.dc.send(message);
        this.addMessage(message, true);
    }

    dcReceive(message: string)
    {
        this.addMessage(message, false);
    }

    addMessage(message: string, out: boolean)
    {
        let messageData = new MessageData(message,new Date(),out);
        this.messages.push(messageData);
        if(this.messages.length > this.messagesMax)
        {
            this.messages.splice(0, this.messagesCount);
        }
    }

    isOpen()
    {
        return this.dc.readyState == "open";
    }

    isClosed()
    {
        return this.dc.readyState == "closing" || this.dc.readyState == "closed";
    }
  }
  