import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLog, UserLogDocument } from 'src/models/userlog.model';

export interface IUser {
  username: string;
  fullname: string;
  email: string;
  userID: string;
  password: string;
  profilePicture: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserLog.name) private usersLogModel: Model<UserLogDocument>,
  ) { }

  async FindOneAndProceed(username: string): Promise<IUser | undefined> {
    return this.usersLogModel.findOne({ username });
  }
}
