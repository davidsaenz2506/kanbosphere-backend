import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { SpreadSheetService } from './spreadsheet.service';
import { SpreadSheetController } from './spreadsheet.controller';
import { WorkSpace, WorkSpaceSchema } from 'src/models/workspaces.model';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports: [MongooseModule.forFeature([{ name: WorkSpace.name, schema: WorkSpaceSchema, collection: "workspaces" }])],
    providers: [SpreadSheetService, JwtService],
    controllers: [SpreadSheetController]
})

export class SpreadSheetModule { }
