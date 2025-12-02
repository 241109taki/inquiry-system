import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';

const cookieExtractor = (req:Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // .envで管理する
    });
  }

  async validate(payload: any) {
    // ↓↓↓ @Req() req.userに入る値 ↓↓↓
    return {userId: payload.sub, email: payload.email, role: payload.role}
  }
}