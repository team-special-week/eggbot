import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { SubscribeSetting } from './entities/subscribe-setting.entity';

@Module({
  providers: [SubscribeService],
  imports: [TypeOrmModule.forFeature([Subscribe, SubscribeSetting])],
  exports: [SubscribeService],
})
export class SubscribeModule {}
