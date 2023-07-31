import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncoderService } from './encoders/encoder.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: 'super-secret',
    signOptions: {
      expiresIn: '5h'
    }
  }), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, EncoderService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})

export class AuthModule { }
