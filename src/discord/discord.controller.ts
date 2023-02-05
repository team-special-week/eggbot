import { Controller, Logger } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as path from 'path';
import { CreateSubscribeDto } from '../subscribe/dto/create-subscribe.dto';
import { SubscribeService } from '../subscribe/subscribe.service';
import transformAndValidate from '../common/utils/transformAndValidate';

interface ICommand {
  name: string;
  description: string;
}

@Controller('discord')
export class DiscordController {
  private readonly discordClient = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  private readonly logger = new Logger(DiscordController.name);

  private readonly EGGBOT_TOKEN: string;
  private readonly EGGBOT_CLIENT_ID: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly subscribeService: SubscribeService,
  ) {
    this.EGGBOT_TOKEN = this.configService.get<string>('EGGBOT_TOKEN');
    this.EGGBOT_CLIENT_ID = this.configService.get<string>('EGGBOT_CLIENT_ID');

    this.discordClient.login(this.EGGBOT_TOKEN).then();
    this.discordClient.once(Events.ClientReady, (c) => {
      this.logger.log(`Ready! Logged in as ${c.user.tag}`);
      this.refreshingCommands().then();
    });
    this.discordClient.on(
      Events.InteractionCreate,
      this.clientSlashCommandOn.bind(this),
    );
  }

  protected async subscribe(interaction: ChatInputCommandInteraction) {
    const createSubscribeDto = await transformAndValidate(CreateSubscribeDto, {
      channelId: interaction.channelId,
      subscriberName: interaction.user.username,
    });

    const subscribe = await this.subscribeService.getSubscribeByChannelId(
      createSubscribeDto.channelId,
    );

    if (subscribe) {
      await interaction.reply({
        content: '🐔 이미 이 채널에 뉴스레터를 보내고 있습니다.',
      });
      return;
    }

    await this.subscribeService.createSubscribe(createSubscribeDto);
    await interaction.reply({
      content: '🥚 이제 이 채널에 뉴스레터를 보내드릴게요.',
    });
  }

  protected async unsubscribe(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: '🍳 더 이상 이 채널에 뉴스레터를 보내지 않습니다.',
    });
  }

  private async clientSlashCommandOn(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const func = this[interaction.commandName].bind(this);
    if (!func) {
      this.logger.error('Unknown command: ' + interaction.commandName);
    }

    await func(interaction);
  }

  private async refreshingCommands() {
    const rest = new REST({ version: '10' }).setToken(this.EGGBOT_TOKEN);
    const commands = (
      JSON.parse(
        readFileSync(path.join(process.env.PWD, 'commands.json'), 'utf8') ||
          '[]',
      ) as ICommand[]
    ).map((command) =>
      new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .toJSON(),
    );

    try {
      this.logger.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data = (await rest.put(
        Routes.applicationCommands(this.EGGBOT_CLIENT_ID),
        {
          body: commands,
        },
      )) as any[];

      this.logger.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (ex) {
      this.logger.error(ex);
    }
  }
}
