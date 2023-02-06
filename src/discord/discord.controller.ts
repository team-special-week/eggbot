import { Controller, Logger } from '@nestjs/common';
import {
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

import { DiscordService } from './discord.service';

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
    private readonly discordService: DiscordService,
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
      this.clientInteractionCreate.bind(this),
    );
  }

  private async clientInteractionCreate(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const func = this.discordService[interaction.commandName]?.bind(
        this.discordService,
      );
      if (func) {
        interaction.reply(await func(interaction));
      }
    }

    if (interaction.isStringSelectMenu()) {
      const func = this.discordService[interaction.customId]?.bind(
        this.discordService,
      );
      if (func) {
        interaction.reply(await func(interaction));
      }
    }
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
