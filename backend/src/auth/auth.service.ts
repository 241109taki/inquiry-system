import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_DURATION = 30 * 60 * 1000;

  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}
  
  // ユーザー検証: LocalStrategyから呼ばれる
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
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
        await this.userService.update(user.id, {
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

      await this.userService.update(user.id, {
        failedAttempts: newFailedAttempts,
        lockedUntil: newLockedUntil
      });

      if (newFailedAttempts >= this.MAX_ATTEMPTS) {
        throw new ForbiddenException('ログイン試行が上限を超えました。しばらくの間アカウントをロックします。')
      }
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています。')
    }
  }

  // ログイン(JWT発行): AuthControllerから呼ばれる
  async login(user: any){
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Cookieにセットするための設定を返す
    return {
      access_token: token,
    };
  }
}