import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: Date } {
    return {
      message: '🚀 API連携成功！NestJSからの返信です。',
      timestamp: new Date(),
    };
  }
}