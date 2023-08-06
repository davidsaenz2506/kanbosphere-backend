import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { SocketGateway } from 'src/datasocket/socket.gateway';
import { IUserInvitations } from 'src/dto/userdata.dto';
import { IContactOperations } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Controller('social')
export class SocialController {
  constructor(
    private readonly appGateway: SocketGateway,
    private readonly service: UsersService
  ) {}

  @UseGuards(AuthGuard)
  @Post('/sendInvitationToJob/:guestId')
  async SendJobInvitation(
    @Param('guestId') guestId: string,
    @Body() body: Partial<IUserInvitations>,
  ) {
    await this.service.SendJobInvitation(body, guestId);
    await this.appGateway.UserUpdateManagement({
      currentReceiverId: guestId,
      currentTransmitterId: body.hostId,
    });
    return { message: "Sended" }
  }

  @UseGuards(AuthGuard)
  @Post('/handleInvitationToJob/:guestId')
  async AcceptJobInvitation(
    @Param('guestId') guestId: ObjectId,
    @Body() body: Partial<IUserInvitations>,
  ) {
    await this.service.HandleJobInvitation(body, guestId);
    await this.appGateway.WorkspacesUpdateManagement({
      currentReceiverId: guestId,
      currentTransmitterId: body.hostId,
    });
    return { message: "Updated" }
  }

  @Post('/contactOperations/:userId')
  async AcceptFriendRequest(
    @Param('userId') username: string,
    @Body() body: IContactOperations,
  ) {
    switch (body.method) {
      case 'sendreq':
        await this.service.SendFriendRequest(username, body.canonicalId);
        await this.appGateway.UserUpdateManagement({
          currentReceiverId: username,
          currentTransmitterId: body.canonicalId,
        });
        return;
      case 'acceptreq':
        await this.service.AcceptFriendRequest(username, body.canonicalId);
        await this.appGateway.UserUpdateManagement({
          currentReceiverId: username,
          currentTransmitterId: body.canonicalId,
        });
        return;
      case 'deletereq':
        await this.service.DeleteFriendRequest(username, body.canonicalId);
        await this.appGateway.UserUpdateManagement({
          currentReceiverId: username,
          currentTransmitterId: body.canonicalId,
        });
        return;
      case 'delete':
        await this.service.DeleteFriend(username, body.canonicalId);
        await this.appGateway.UserUpdateManagement({
          currentReceiverId: username,
          currentTransmitterId: body.canonicalId,
        });
        return;
      default:
        break;
    }
  }
}
