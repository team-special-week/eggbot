import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { SubscribeSetting } from './entities/subscribe-setting.entity';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    @InjectRepository(SubscribeSetting)
    private readonly subscribeSettingRepository: Repository<SubscribeSetting>,
  ) {}

  async createSubscribe(dto: CreateSubscribeDto): Promise<Subscribe> {
    const setting = await this.subscribeSettingRepository.save({});
    return this.subscribeRepository.save({
      ...dto,
      setting,
    });
  }

  async getSubscribeByChannelId(channelId: string): Promise<Subscribe> {
    return this.subscribeRepository.findOne({ where: { channelId } });
  }
}
