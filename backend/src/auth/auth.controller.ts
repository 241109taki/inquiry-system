import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  // メールアドレス, パスワードの検証
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({passthrough: true}) res: express.Response) {
    const { access_token } = await this.authService.login(req.user);

    // HttpOnly Cookieにjwtをセット
    res.cookie('jwt', access_token, {
        httpOnly: true, // JSからアクセス不可 (xss対策)
        secure: process.env.NODE_ENV === 'production', //本番環境はHTTPS必須
        sameSite: 'lax', // CSRF対策
        maxAge: 3600 * 1000, // 1時間
    });
    return { message: 'Login success', user: req.user};
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('jwt'); // Cookie削除
    return { message: 'Logged out' };
  }
}