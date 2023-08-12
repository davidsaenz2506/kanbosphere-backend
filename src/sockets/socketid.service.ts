import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketIdService {
  private socketClient: Socket;

  setSocket(client: Socket) {
    this.socketClient = client;
  }

  getClient(): Socket {
    return this.socketClient;
  }
}