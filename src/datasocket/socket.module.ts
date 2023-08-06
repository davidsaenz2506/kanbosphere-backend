import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { UsersService } from 'src/users/users.service';
import { Server } from 'socket.io';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLog, UserLogSchema } from 'src/models/userlog.model';
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';
import { SocketIdService } from 'src/sockets/socketid.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLog.name, schema: UserLogSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      {
        name: WorkSpace.name,
        schema: WorkSpaceSchema,
        collection: 'workspaces',
      },
    ]),
  ],
  providers: [
    WorkspacesService,
    UsersService,
    SocketIdService,
    SocketGateway,
    { provide: 'SOCKET_SERVER', useValue: new Server(null) },
  ],
  exports: [SocketGateway]
})

export class SocketModule {}
