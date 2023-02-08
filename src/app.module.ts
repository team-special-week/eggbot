import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { validate } from './config/env.validation';
import { SubscribeModule } from './subscribe/subscribe.module';
import { CrawlerModule } from './crawler/crawler.module';
import { PaperboyModule } from './paperboy/paperboy.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    DiscordModule,
    SubscribeModule,
    CrawlerModule,
    PaperboyModule,
    ScheduleModule.forRoot(),
    NewsletterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
