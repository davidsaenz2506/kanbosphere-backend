import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WorkSpaceDocument = WorkSpace & Document;

interface IToDoData {
    userId: string,
    taskId: string,
    status: string,
    info: string,
    title: string,
    createdDate: Date
}

@Schema()
export class WorkSpace {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    createdDate: Date;

    @Prop({ required: true })
    createdById: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    wspData: IToDoData[];

}

export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace);