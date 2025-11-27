import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // ★ フロントエンド(localhost:3000)からのアクセスを許可する設定
  app.enableCors({
    origin: 'http://localhost:3000', // フロントエンドのURL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ★ APIのURLの先頭に必ず '/api' をつける設定
  // 例: http://localhost:4000/api/hello となる
  app.setGlobalPrefix('api');

  // ★ バリデーションを有効化する設定
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTOに定義されていないプロパティを削除
    transform: true, // 受信データをDTOの方に自動変換
  }));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
