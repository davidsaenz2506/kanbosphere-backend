import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type UserLogDocument = UserLog & Document;

export interface IFriendRequest {
     canonicalId: string;
     requestDate?: Date
}

@Schema()
export class UserLog {

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    userID: string;

    @Prop({ required: true })
    fullname: string;

    @Prop({ required: true })
    profilePicture: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    friends: IFriendRequest[];
    
    @Prop({ required: true })
    requests: IFriendRequest[];

}

export const UserLogSchema = SchemaFactory.createForClass(UserLog);