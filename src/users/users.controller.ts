import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser, UsersService } from './users.service';
import { UserDataDTO } from 'src/dto/userdata.dto';
import { IFriendRequest } from 'src/models/userlog.model';
import { ObjectId } from 'mongoose';

export interface IContactOperations {
  canonicalId: ObjectId;
  method: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('/update/:userId')
  async FindUserAndUpdate(
    @Param('userId') username: string,
    @Body() body: UserDataDTO,
  ) {
    const userData = await this.service.FindOneAndUpdate(username, body);
    return userData;
  }

  @UseGuards(AuthGuard)
  @Get('/getUsers/:username')
  async FindRelatedUsers(@Param('username') username: string, @Request() req) {
    const userData: IUser[] = await this.service.FindUserQuery(username, req);
    return userData;
  }

  @UseGuards(AuthGuard)
  @Post('/getUsersByArray')
  async GetUsersByArray(@Body() body: ObjectId[]) {
    const userData: IUser[] = await this.service.FindLotOfUsers(body);
    return userData;
  }

  @UseGuards(AuthGuard)
  @Post('/contactOperations/:userId')
  async AcceptFriendRequest(
    @Param('userId') username: string,
    @Body() body: IContactOperations,
  ) {
    switch (body.method) {
      case 'sendreq':
        return this.service.SendFriendRequest(username, body.canonicalId);
      case 'acceptreq':
        return this.service.AcceptFriendRequest(username, body.canonicalId);
      case 'deletereq':
        return this.service.DeleteFriendRequest(username, body.canonicalId);
      case 'delete':
        return this.service.DeleteFriend(username, body.canonicalId);
      default:
        break;
    }
  }
}
