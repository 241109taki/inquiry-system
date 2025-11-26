import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    // 環境変数(.env)を読み込む設定
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // データベース(PostgreSQL)への接続設定
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'inquiry_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // エンティティを自動読み込み
      synchronize: true, // ★開発用: エンティティ変更時に自動でテーブルを更新する
    }),

    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}