import { Module } from '@nestjs/common';
import { DataUpdatesController } from './dataserver.controller';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { UsersService } from 'src/users/users.service';
import { Server } from 'socket.io';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLog, UserLogSchema } from 'src/models/userlog.model';
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';

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
  controllers: [DataUpdatesController],
  providers: [
    WorkspacesService,
    UsersService,
    { provide: 'SOCKET_SERVER', useValue: new Server(null) },
  ],
})
export class SocketModule {}
