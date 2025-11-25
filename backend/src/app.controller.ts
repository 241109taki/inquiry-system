import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // アクセス先: GET http://localhost:4000/api
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
