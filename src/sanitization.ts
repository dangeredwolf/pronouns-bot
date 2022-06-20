import { OptionedCommandInteraction } from './types';
import { APIPingInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/ping';
import { APIApplicationCommandInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { APIMessageComponentInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/messageComponents';
import { GuildOnlyCommandError } from './errors';

export const assertGuild = (
  interaction:
    | APIPingInteraction
    | APIApplicationCommandInteraction
    | APIMessageComponentInteraction
    | OptionedCommandInteraction
): void => {
  if (typeof interaction.guild_id !== 'string') {
    throw new GuildOnlyCommandError();
  }
};
