import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface dataPrivate {
  user: string,
  message: string
}

interface dataFree {
  message: string
}

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private onlineUsers = new Map<string, string>()

  // Register user like online
  @SubscribeMessage('register') 
  register(@ConnectedSocket() client: Socket, user: string){
    this.onlineUsers.set(user, client.id)
  }

  // Send message to user private online
  @SubscribeMessage('privateMessage')
  handleMessage(@MessageBody() client: Socket, data: dataPrivate){
    const user = this.onlineUsers.get(data.user)
    if(user){
      this.server.to(user).emit('private_message', data.message)
    }
  }

  // See everyone online users
  @SubscribeMessage('onlineUsers')
  handleOnlineUsers(@ConnectedSocket() client: Socket){
    const usersOnline = Array.from(this.onlineUsers.keys())
    client.emit('onlineUsers', usersOnline)
  }

  @SubscribeMessage('free_message')
  handleFreeMessage(@MessageBody() client: Socket, data: dataFree){
    this.server.emit('free_message', data.message)
  }
  
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}