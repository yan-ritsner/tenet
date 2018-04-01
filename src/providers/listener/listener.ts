import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { ListenData } from '../../data/listen-data';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ListenerProvider {

  connections = new Array<string>();
  updates = new Subject<string>();

  address: string;
  subs : Subscription = null;
  error: string;

  constructor(public api: ApiProvider) {
    
  }

  startListening(address: string)
  {
      this.stopListening();
      this.address = address;
      let listenData = new ListenData(this.address);
      this.api.messagingStartListening(listenData).subscribe(response => {
        if (response.status >= 200 && response.status < 400) {
          this.error = null;
          this.listenConnections();
        }
      },
      error => {
        if (error.status === 0) {
          this.error = "Could not start listening"
        
        } else if (error.status >= 400) {
          if (!error.json().errors[0]) {
            this.error = error;
          }
          else {
            this.error = error.json().errors[0].message;
          }
        }
      });
     
  }

  stopListening()
  {
    if(this.subs == null) return;
    this.subs.unsubscribe();
    let listenData = new ListenData(this.address);
    this.api.messagingStopListening(listenData).subscribe(response => {
      if (response.status >= 200 && response.status < 400) {
        this.error = null;
      }
    },
    error => {
      if (error.status === 0) {
        this.error = "Could not stop listening"
      
      } else if (error.status >= 400) {
        if (!error.json().errors[0]) {
          this.error = error;
        }
        else {
          this.error = error.json().errors[0].message;
        }
      }
    });
  }

  listenConnections()
  {
    let listenData = new ListenData(this.address);
    let listenObs = this.api.messagingGetConnections(listenData);
    this.subs = listenObs.subscribe(
      response => {
        if (response.status >= 200 && response.status < 400) {
          this.error = null;
          let connections = response.json();
          for(var i=0; i<connections.length; i++)
          {
            let cnn = connections[i];
            this.connections.push(cnn);
            this.updates.next(cnn);
          }
        }
      },
      error => {
        
        if (error.status === 0) {
          this.error = "Could not get connections"
        
        } else if (error.status >= 400) {
          if (!error.json().errors[0]) {
            this.error = error;
          }
          else {
            this.error = error.json().errors[0].message;
          }
        }
      }
    );
  }

  getConnections()
  {
    return this.connections;
  }

  getUpdates()
  {
    return this.updates;
  }

  clearConnections()
  {
    this.connections = [];
  }
}
