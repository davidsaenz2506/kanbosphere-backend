import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, ObjectId } from 'mongoose';
import { IUserInvitations, UserDataDTO } from 'src/dto/userdata.dto';
import {
  IFriendRequest,
  UserLog,
  UserLogDocument,
} from 'src/models/userlog.model';

import * as jwt from 'jsonwebtoken';
import * as sharp from 'sharp';
import { join } from 'path';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';

export interface IUser {
  _id: ObjectId;
  username: string;
  fullname: string;
  email: string;
  userID: string;
  password: string;
  profilePicture: string;
  friends: ObjectId[];
  requests: IFriendRequest[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserLog.name) private usersLogModel: Model<UserLogDocument>,
    @InjectModel(WorkSpace.name)
    private workspaceModel: Model<WorkSpaceDocument>,
  ) {}

  async FindOneAndProceed(username: string): Promise<IUser | undefined> {
    return this.usersLogModel.findOne({ username });
  }

  async FindByUserId(userId: ObjectId): Promise<IUser | undefined> {
    return this.usersLogModel.findOne({ _id: userId });
  }

  async FindOneAndUpdate(
    username: string,
    body: UserDataDTO,
  ): Promise<IUser | undefined> {
    return this.usersLogModel.findOneAndUpdate(
      { username: username },
      { $set: body },
      { new: true },
    );
  }

  async SendJobInvitation(
    hostInfo: Partial<IUserInvitations>,
    guestId: string,
  ): Promise<any> {
    return this.usersLogModel.findOneAndUpdate(
      { _id: guestId },
      {
        $push: {
          invitations: {
            ...hostInfo,
            requestDate: new Date(),
          },
        },
      },
    );
  }

  async HandleJobInvitation(
    hostInfo: Partial<IUserInvitations>,
    guestId: ObjectId,
  ): Promise<any> {
    console.log(hostInfo);
    switch (hostInfo.method) {
      case 'delete':
        return this.usersLogModel.findOneAndUpdate(
          { _id: guestId },
          {
            $pull: {
              invitations: {
                $and: [
                  { workspaceToJoinId: hostInfo.workspaceToJoinId },
                  { hostId: hostInfo.hostId },
                ],
              },
            },
          },
        );

      case 'accept':
        console.log('Aceptando!');
        await this.usersLogModel.findOneAndUpdate(
          { _id: guestId },
          {
            $pull: {
              invitations: {
                $and: [
                  { workspaceToJoinId: hostInfo.workspaceToJoinId },
                  { hostId: hostInfo.hostId },
                ],
              },
            },
          },
        );

        return this.workspaceModel.findOneAndUpdate(
          { _id: hostInfo.workspaceToJoinId },
          {
            $push: {
              collaborators: {
                _id: guestId,
                name: (await this.FindByUserId(guestId)).username,
                role: 'GUEST',
              },
            },
          },
        );
    }
  }

  async FindUserQuery(username: string, request: Request): Promise<any> {
    const jsonWebTokenData: string =
      request.headers.authorization.split(' ')[1];
    const userSessionData: any = decodeJwtToken(jsonWebTokenData);
    const currentUserFriendsAndRequest = await this.usersLogModel
      .findOne({ username: userSessionData.username })
      .select({ friends: 1, requests: 1, _id: 1 });

    const currentUserFriends: string[] =
      currentUserFriendsAndRequest.friends.map(
        (currentFriend) => currentFriend.canonicalId,
      );
    const currentUserRequests: string[] =
      currentUserFriendsAndRequest.requests.map(
        (currentFriend) => currentFriend.canonicalId,
      );
    const userDataCompressed: any = [];

    function decodeJwtToken(token: string): any {
      try {
        const decodedToken = jwt.verify(token, 'super-secret');
        return decodedToken;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }

    const userDownload = await this.usersLogModel
      .find(
        {
          $and: [
            { username: new RegExp(username, 'i') },
            { username: { $ne: userSessionData.username } },
            {
              _id: {
                $nin: [...currentUserFriends, ...currentUserRequests],
              },
            },
            {
              'requests.canonicalId': {
                $nin: [currentUserFriendsAndRequest._id.toString()],
              },
            },
          ],
        },
        { password: 0, friends: 0, requests: 0, invitations: 0 },
      )
      .limit(3);

    for (const currentUser of userDownload) {
      const jsonUserData = currentUser.toJSON();
      const bas64Data: string[] = currentUser.profilePicture.split(',');
      const imageBuffer = Buffer.from(bas64Data[1], 'base64');

      const compressedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 100 })
        .toBuffer();

      // @ts-ignore
      (jsonUserData.profilePicture = [
        bas64Data[0],
        btoa(String.fromCharCode(...new Uint8Array(compressedImageBuffer))),
      ]),
        join(',');

      userDataCompressed.push(jsonUserData);
    }

    return userDataCompressed;
  }

  async FindLotOfUsers(request: ObjectId[]): Promise<any> {
    const userDataCompressed = [];
    const userDownload = await this.usersLogModel.find(
      {
        $and: [
          {
            _id: {
              $in: request,
            },
          },
        ],
      },
      {
        password: 0,
        friends: 0,
        requests: 0,
        'invitations.hostId': 0,
        'invitations.hostName': 0,
        'invitations.workspaceToJoinType': 0,
        'invitations.workspaceUsersAmount': 0,
        'invitations.workspaceToJoin': 0,
        'invitations.requestDate': 0,
      },
    );

    for (const currentUser of userDownload) {
      const jsonUserData = currentUser.toJSON();
      const bas64Data: string[] = currentUser.profilePicture.split(',');
      const imageBuffer = Buffer.from(bas64Data[1], 'base64');

      const compressedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 100 })
        .toBuffer();

      // @ts-ignore
      (jsonUserData.profilePicture = [
        bas64Data[0],
        btoa(String.fromCharCode(...new Uint8Array(compressedImageBuffer))),
      ]),
        join(',');

      userDataCompressed.push(jsonUserData);
    }

    return userDataCompressed;
  }

  async SendFriendRequest(_id: string, canonicalId: ObjectId): Promise<any> {
    const session = await this.usersLogModel.startSession();

    try {
      session.startTransaction();
      const sendUserRequest = await this.usersLogModel.updateOne(
        { _id },
        {
          $push: {
            requests: {
              canonicalId: canonicalId,
              requestDate: new Date(),
            },
          },
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return sendUserRequest;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async AcceptFriendRequest(_id: string, canonicalId: ObjectId): Promise<any> {
    const session = await this.usersLogModel.startSession();

    try {
      session.startTransaction();
      await this.usersLogModel.updateOne(
        { _id },
        {
          $pull: {
            requests: {
              canonicalId: canonicalId,
            },
          },
        },
        { session },
      );

      await this.usersLogModel.updateOne(
        { _id: canonicalId },
        {
          $push: {
            friends: {
              canonicalId: _id,
            },
          },
        },
        { session },
      );

      const updateRequest = await this.usersLogModel.updateOne(
        { _id },
        {
          $push: {
            friends: {
              canonicalId: canonicalId,
            },
          },
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return updateRequest;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async DeleteFriendRequest(_id: string, canonicalId: ObjectId): Promise<any> {
    const session = await this.usersLogModel.startSession();

    try {
      session.startTransaction();
      const deleteRequest = await this.usersLogModel.updateOne(
        { _id },
        {
          $pull: {
            requests: {
              canonicalId: canonicalId,
            },
          },
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return deleteRequest;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async DeleteFriend(_id: string, canonicalId: ObjectId): Promise<any> {
    const session = await this.usersLogModel.startSession();

    try {
      session.startTransaction();
      await this.usersLogModel.updateOne(
        { _id: canonicalId },
        {
          $pull: {
            friends: {
              canonicalId: _id,
            },
          },
        },
        { session },
      );

      const deleteRequest = await this.usersLogModel.updateOne(
        { _id },
        {
          $pull: {
            friends: {
              canonicalId: canonicalId,
            },
          },
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return deleteRequest;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
