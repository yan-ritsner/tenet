import { Connector } from './../../data/connector';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage implements OnInit, OnDestroy  {

  @Input() contact: Connector;

  chatText: string;

  autoScroller: MutationObserver;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ngOnInit() {
    this.autoScroller = this.autoScroll();
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  sendMessage(event: any) {
    if (!this.chatText || !this.contact || !this.contact.isOpen())
      return;

    this.contact.dcSend(this.chatText);
    this.chatText = '';
    this.scrollDown();
  }

  isToday(timestamp: number) {
    return new Date(timestamp).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
  }

  isConnected()
  {
    return this.contact && this.contact.isOpen();
  }

  private scrollDown() {
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  private autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messageContent, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  private get messageContent(): Element {
    return document.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messageContent.querySelector('.scroll-content');
  }
}
