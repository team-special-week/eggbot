import { InteractionReplyOptions, MessagePayload } from 'discord.js';

type DiscordInteractionReply =
  | string
  | MessagePayload
  | InteractionReplyOptions;

export default DiscordInteractionReply;
