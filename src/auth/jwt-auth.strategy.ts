import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_TOKEN,
    });
  }

  validate(payload: UserPayload): UserPayload {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!payload.Role) {
      throw new BadRequestException('User role must be provided!');
    }

    return payload;
  }
}
