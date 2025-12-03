import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';

const cookieExtractor = (req:Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }

  // console.log('--- JWT Strategy Debug ---');
  // console.log('Cookies:', req.cookies);
  // console.log('Extracted Token:', token ? 'Found' : 'Not Found');
  
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {

    // console.log('--- Key Debug ---');
    // console.log('JWT_ACCESS_SECRET is:', process.env.JWT_ACCESS_SECRET ? 'Present' : 'UNDEFINED!!');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secretKey', // .envで管理する
    });
  }

  async validate(payload: any) {

    // console.log('--- JWT Validation Success ---');
    // console.log('Payload:', payload);

    // ↓↓↓ @Req() req.userに入る値 ↓↓↓
    return {sub: payload.sub, email: payload.email, role: payload.role}
  }
}