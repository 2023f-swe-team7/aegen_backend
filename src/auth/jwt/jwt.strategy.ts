import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../../config/database/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('허용되지않은 user입니다');
    }

    return user;
  }
}
