import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IUser, UsersService } from 'src/users/users.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private usersService: UsersService) {
        super({
            secretOrKey: 'super-secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validateUser(payload: IJwtPayload): Promise<IUser> {

        const { username } = payload;

        const user = this.usersService.FindOneAndProceed(username);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;

    }
    
}
