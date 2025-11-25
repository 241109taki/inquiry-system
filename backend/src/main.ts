import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ★ フロントエンド(localhost:3000)からのアクセスを許可する設定
  app.enableCors({
    origin: 'http://localhost:3000', // フロントエンドのURL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ★ APIのURLの先頭に必ず '/api' をつける設定
  // 例: http://localhost:4000/api/hello となる
  app.setGlobalPrefix('api');

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
