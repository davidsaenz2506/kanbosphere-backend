import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { IUser, UsersService } from 'src/users/users.service';
import { EncoderService } from './encoders/encoder.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private encoderService: EncoderService,
    private jwtService: JwtService,
  ) { }

  async validateUserPassword(loginDto: LoginDTO) {
    const { username, password } = loginDto;
    const user = await this.userService.FindOneAndProceed(username);

    if (
      user &&
      (await this.encoderService.checkEncodePassword(password, user.password))
    ) {
      const payload: IJwtPayload = { username: username, active: true };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken, user };
    }

    throw new UnauthorizedException('Please check your credentials');
  }

  async getUser(username: string): Promise<IUser> {
    const user = await this.userService.FindOneAndProceed(username);
    return user;
  }

  async refreshToken(tokenInfo: any): Promise<any> {
    const user = await this.jwtService.decode(tokenInfo.token);
    const payload = {
      username: user['username'],
      active: user['active'],
    };

    const token = await this.jwtService.sign(payload);
    return { token };
  }
}
