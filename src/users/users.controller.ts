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
import { IUserInvitations, UserDataDTO } from 'src/dto/userdata.dto';
import { ObjectId } from 'mongoose';

export interface IContactOperations {
  canonicalId: ObjectId;
  method: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) { }

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
  @Post('/sendInvitationToJob/:guestId')
  async SendJobInvitation(
    @Param('guestId') guestId: string,
    @Body() body: Partial<IUserInvitations>,
  ) {
    await this.service.SendJobInvitation(body, guestId);
    return { message: "Sended" }
  }

  @UseGuards(AuthGuard)
  @Post('/handleInvitationToJob/:guestId')
  async AcceptJobInvitation(
    @Param('guestId') guestId: string,
    @Body() body: Partial<IUserInvitations>,
  ) {
    await this.service.HandleJobInvitation(body, guestId);
    return { message: "Updated" }
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
        this.service.SendFriendRequest(username, body.canonicalId);
        return
      case 'acceptreq':
        this.service.AcceptFriendRequest(username, body.canonicalId);
        return
      case 'deletereq':
        this.service.DeleteFriendRequest(username, body.canonicalId);
        return
      case 'delete':
        this.service.DeleteFriend(username, body.canonicalId);
        return
      default:
        break;
    }
  }
}
