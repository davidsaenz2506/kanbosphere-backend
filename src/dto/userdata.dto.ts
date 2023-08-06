import { ObjectId } from "mongoose";

export interface IUserInvitations {
  hostId: ObjectId;
  hostName: string;
  workspaceToJoinId: ObjectId;
  workspaceToJoinType: string;
  workspaceUsersAmount: number;
  workspaceToJoin: string;
  requestDate: Date;
  method?: string;
}

export class UserDataDTO {
  username: string;
  fullname: string;
  email: string;
  userID: string;
  password: string;
  profilePicture: string;
  invitations: IUserInvitations[];
}
