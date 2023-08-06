import { Controller, Post, Body, Param } from '@nestjs/common';
import { SocketGateway } from 'src/datasocket/socket.gateway';
import { IContactOperations } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Controller('social')
export class SocialController {
  constructor(
    private readonly appGateway: SocketGateway,
    private readonly service: UsersService
  ) {}

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
