import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refresh_token;
                },
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-key',
            passReqToCallback: true,
        });
    }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;
    return {
      ...payload,
      refreshToken
    };
  }
}