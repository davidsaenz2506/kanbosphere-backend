import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocketModule } from 'src/datasocket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [SocketModule, UsersModule],
    controllers: [SocialController],
    providers: [JwtService]
})

export class SocialModule { }
