import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDTO): Promise<{ accessToken: string }> {
    const webToken = await this.authService.validateUserPassword(loginDto);
    return webToken;
  }

  @Post('/refresh')
  async refreshToken(@Body() token: string) {
    return this.authService.refreshToken(token);
  }
  
}
