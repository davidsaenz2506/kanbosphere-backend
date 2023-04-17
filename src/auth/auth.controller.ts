import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { AuthService } from './auth.service';
import { IUser } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/login')
  async login(@Body() loginDto: LoginDTO): Promise<{ accessToken: string }> {
    const webToken = await this.authService.validateUserPassword(loginDto);
    return webToken;
  }

  @Post('/user/:username')
  async getUser(@Param('username') username: string): Promise<IUser> {
    const userInfo = await this.authService.getUser(username);
    return userInfo;
  }

  @Post('/refresh')
  async refreshToken(@Body() token: string) {
    return this.authService.refreshToken(token);
  }

}
