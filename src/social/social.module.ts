import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocketModule } from 'src/datasocket/socket.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [SocketModule, UsersModule],
    controllers: [SocialController]
})

export class SocialModule { }
