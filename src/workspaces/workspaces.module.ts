import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { MongooseModule } from "@nestjs/mongoose"
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { DataUpdatesController } from 'src/datasocket/dataserver.controller';


@Module({
    imports: [MongooseModule.forFeature([{ name: WorkSpace.name, schema: WorkSpaceSchema, collection: "workspaces" }])],
    controllers: [WorkspacesController, DataUpdatesController],
    providers: [WorkspacesService, JwtService, {
        provide: 'SOCKET_SERVER', useValue: new Server(null)
    }]
})
export class WorkspacesModule { }
