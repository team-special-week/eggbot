import { Injectable } from '@nestjs/common';
import { SubscribeService } from '../subscribe/subscribe.service';
import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { NewsLetterCategoryDropdown } from '../common/enums/newsLetterCategory';
import transformAndValidate from '../common/utils/transformAndValidate';
import { RemoveSubscribeDto } from '../subscribe/dto/remove-subscribe.dto';
import DiscordInteractionReply from '../common/types/discordInteractionReplyType';
import { CreateSubscribeDto } from 'src/subscribe/dto/create-subscribe.dto';

@Injectable()
export class DiscordService {
  constructor(private readonly subscribeService: SubscribeService) {}

  async subscribe(
    interaction: ChatInputCommandInteraction,
  ): Promise<DiscordInteractionReply> {
    const subscribe = await this.subscribeService.getSubscribeByChannelId(
      interaction.channelId,
    );

    if (subscribe) {
      return {
        content: '🥚 이미 이 채널에 뉴스레터를 보내고 있어요.',
      };
    }

    // 카테고리 선택 Dropdown 을 생성
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('subscribeNewsLetterCategory')
        .setPlaceholder('어떤 주제를 구독할까요?')
        .addOptions(NewsLetterCategoryDropdown),
    );

    return {
      content: '이 채널에 어떤 주제의 뉴스를 보낼까요?',
      components: [row],
    };
  }

  async unsubscribe(
    interaction: ChatInputCommandInteraction,
  ): Promise<DiscordInteractionReply> {
    const removeSubscribeDto = await transformAndValidate(RemoveSubscribeDto, {
      channelId: interaction.channelId,
    });

    const subscribe = await this.subscribeService.getSubscribeByChannelId(
      removeSubscribeDto.channelId,
    );

    if (!subscribe) {
      return {
        content: '🍳 이 채널에는 뉴스레터를 보내고 있지 않아요.',
      };
    }

    await this.subscribeService.removeSubscribe(removeSubscribeDto);

    return {
      content: '🍳 더 이상 이 채널에 뉴스레터를 보내지 않습니다.',
    };
  }

  async subscribeNewsLetterCategory(interaction: StringSelectMenuInteraction) {
    const createSubscribeDto = await transformAndValidate(CreateSubscribeDto, {
      channelId: interaction.channelId,
      subscriberName: interaction.user.username,
      newsLetterCategory: interaction.values[0],
    });

    await this.subscribeService.createSubscribe(createSubscribeDto);

    return {
      content: '🥚 이제 이 채널에 뉴스레터를 보내드릴게요 :)',
    };
  }
}
