import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { MongooseModule } from "@nestjs/mongoose"
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports: [MongooseModule.forFeature([{ name: WorkSpace.name, schema: WorkSpaceSchema, collection: "workspaces" }])],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, JwtService]
})
export class WorkspacesModule {}
