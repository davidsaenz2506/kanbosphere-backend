import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLog, UserLogSchema } from 'src/models/userlog.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
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
  providers: [
    UsersService,
    JwtService,
    {
      provide: 'SOCKET_SERVER',
      useValue: new Server(null),
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
