import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { SubscribeSetting } from './entities/subscribe-setting.entity';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { RemoveSubscribeDto } from './dto/remove-subscribe.dto';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    @InjectRepository(SubscribeSetting)
    private readonly subscribeSettingRepository: Repository<SubscribeSetting>,
  ) {}

  async createSubscribe(dto: CreateSubscribeDto): Promise<Subscribe> {
    const setting = new SubscribeSetting();
    setting.newLetterCategory = dto.newsLetterCategory;
    await this.subscribeSettingRepository.save(setting);

    const subscribe = new Subscribe();
    subscribe.channelId = dto.channelId;
    subscribe.subscriberName = dto.subscriberName;
    subscribe.setting = setting;
    await this.subscribeRepository.save(subscribe);

    return subscribe;
  }

  async removeSubscribe(dto: RemoveSubscribeDto): Promise<DeleteResult> {
    return this.subscribeRepository.delete({
      channelId: dto.channelId,
    });
  }

  async getSubscribeByChannelId(channelId: string): Promise<Subscribe> {
    return this.subscribeRepository.findOne({ where: { channelId } });
  }
}
