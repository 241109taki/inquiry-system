import { Controller, ForbiddenException, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.auth.guard';
import type { RequestWithUser } from './types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  private setCookies(res: express.Response, access_token: string, refresh_token: string){
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, //15m
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 3600 * 1000,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({passthrough: true}) res: express.Response) {
    const { access_token, refresh_token } = await this.authService.login(req.user);

    // HttpOnly Cookieにセット
    this.setCookies(res, access_token, refresh_token);
    return { message: 'Login success', user: req.user};
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithUser, @Res({ passthrough: true }) res:express.Response) {
    const userId = req.user['sub'];
    const oldRefreshToken = req.user['refreshToken'];
    if (!oldRefreshToken) {
      throw new ForbiddenException('No refresh token provided')
    }
    const { access_token, refresh_token } = await this.authService.refreshTokens(userId, oldRefreshToken);

    this.setCookies(res, access_token, refresh_token);

    return { message: 'Token refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: express.Response) {
    await this.authService.logout(req.user['sub']);
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, //15m
    }); // Cookie削除
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return { message: 'Logged out' };
  }


  @Get('check-cookie')
  checkCookie(@Req() req: express.Request) {
    console.log('届いたCookie:', req.cookies);
    return { message: 'ログを確認してください' };
}
}