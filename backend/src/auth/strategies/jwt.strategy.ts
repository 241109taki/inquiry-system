import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { request } from 'http';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
            return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JET_SECRET, // .envで管理する
    });
  }

  async validate(payload: any) {
    // ↓↓↓ @Req() req.userに入る値 ↓↓↓
    return {userId: payload.sub, email: payload.email, role: payload.role}
  }
}