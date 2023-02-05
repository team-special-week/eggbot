import { InteractionReplyOptions, MessagePayload } from 'discord.js';

export default class EggbotError extends Error {
  constructor(options: string | MessagePayload | InteractionReplyOptions) {
    super();
  }
}
