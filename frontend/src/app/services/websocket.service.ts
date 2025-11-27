import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * WebSocket Service
 * Handles real-time communication with backend via WebSocket
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  private connectionSubject = new Subject<boolean>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() { }

  /**
   * Connect to WebSocket server
   * @param url - WebSocket server URL
   */
  connect(url: string): Observable<any> {
    return new Observable(observer => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.connectionSubject.next(true);
          observer.next({ type: 'connected' });
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.messageSubject.next(message);
            observer.next(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connectionSubject.next(false);
          observer.error(error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          this.connectionSubject.next(false);
          this.attemptReconnect(url);
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        observer.error(error);
      }
    });
  }

  /**
   * Send message through WebSocket
   * @param message - Message to send
   */
  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  /**
   * Subscribe to messages
   */
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  /**
   * Subscribe to connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(url).subscribe(
          () => console.log('Reconnection successful'),
          (error) => console.error('Reconnection failed:', error)
        );
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}
