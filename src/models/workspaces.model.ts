import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import { IFilePath, IPriority } from "src/dto/todoobject.dto";
import { IAgilePreferences, ICollaborators, ISpreadSheetPreferences } from "src/dto/workspaces.dto";

export type WorkSpaceDocument = WorkSpace & Document;

interface IToDoData {
    userId: string,
    taskId: string,
    status: string,
    priority: IPriority,
    description: string,
    info: string,
    title: string,
    createdDate: Date,
    file: IFilePath[]
}

interface ISpreadData {
    userId: string,
    columns: [],
    data: []
}

@Schema()
export class WorkSpace {

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    prefix: string;

    @Prop({ required: true })
    createdDate: Date;

    @Prop({ required: true })
    createdById: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: false })
    wspData: IToDoData[];

    @Prop({ required: false, type: Object })
    wspDataPreferences?: IAgilePreferences | ISpreadSheetPreferences;

    @Prop({ required: false, type: Object })
    spreadSheetData: ISpreadData;

    @Prop({ required: false })
    collaborators: ICollaborators[];

}

export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace);