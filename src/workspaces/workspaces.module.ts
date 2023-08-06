import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { MongooseModule } from "@nestjs/mongoose"
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { SocketModule } from 'src/datasocket/socket.module';
import { SocketGateway } from 'src/datasocket/socket.gateway';


@Module({
    imports: [MongooseModule.forFeature([{ name: WorkSpace.name, schema: WorkSpaceSchema, collection: "workspaces" }]), SocketModule],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, JwtService, {
        provide: 'SOCKET_SERVER', useValue: new Server(null)
    }],
    exports: [WorkspacesService]
})
export class WorkspacesModule { }
