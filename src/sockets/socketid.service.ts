import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketIdService {
  private socketId: string = '';

  setSocketId(id: string) {
    this.socketId = id;
  }

  getSocketId(): string {
    return this.socketId;
  }
}