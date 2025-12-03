import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_DURATION = 30 * 60 * 1000;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  // ユーザー検証: LocalStrategyから呼ばれる
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています。')
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()))
      throw new ForbiddenException('アカウントはロックされています。${remainingMinutes}分後に再試行してください。');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      if(user.failedAttempts > 0 || user.lockedUntil) {
        await this.usersService.update(user.id, {
          failedAttempts: 0,
          lockedUntil: null
        });
      }

      const { password, ...result } = user;
      return result;
    } else {
      const newFailedAttempts = user.failedAttempts + 1;
      let newLockedUntil = user.lockedUntil;

      if (newFailedAttempts >= this.MAX_ATTEMPTS) {
        newLockedUntil = new Date(Date.now() + this.LOCK_DURATION);
      }

      await this.usersService.update(user.id, {
        failedAttempts: newFailedAttempts,
        lockedUntil: newLockedUntil
      });

      if (newFailedAttempts >= this.MAX_ATTEMPTS) {
        throw new ForbiddenException('ログイン試行が上限を超えました。しばらくの間アカウントをロックします。')
      }
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています。')
    }
  }
  
  // Cookieトークン生成
  async getTokens(userId: String, email: string, role:string) {
    const payload = { sub: userId, email, role };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        { secret:process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        payload,
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { access_token: at, refresh_token: rt};
  }


  // ログイン(JWT発行): AuthControllerから呼ばれる
  async login(user: any){
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;

    // Cookieにセットするための設定を返す
    // return {
    //   access_token: token,
    // };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.usersService.update(userId, { hashedRefreshToken: hash });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if(!tokenMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { hashedRefreshToken: undefined })
  }
}