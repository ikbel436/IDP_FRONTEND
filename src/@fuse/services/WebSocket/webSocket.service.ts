import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private notificationSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:3000');
    
    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      // Emit the notification directly
      this.notificationSubject.next(notification);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  get notifications() {
    return this.notificationSubject.asObservable();
  }
}
