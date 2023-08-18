import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ContainerDTO, ICollaborators } from "src/dto/workspaces.dto";

export type WorkSpaceDocument = WorkSpace & Document;

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

    @Prop({ required: false })
    isGoalsModeActive: boolean;

    @Prop({ required: true })
    collaborators: ICollaborators[];

    @Prop({ required: true, type: ContainerDTO })
    container: ContainerDTO;

}

export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace);