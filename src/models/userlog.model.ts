import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserLogDocument = UserLog & Document;

@Schema()
export class UserLog {

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

}

export const UserLogSchema = SchemaFactory.createForClass(UserLog);