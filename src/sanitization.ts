import { OptionedCommandInteraction } from './types';
import { APIPingInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/ping';
import { APIApplicationCommandInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { APIMessageComponentInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/messageComponents';
import { GuildOnlyCommandError, MissingOptionError } from './errors';

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

export const assertOption = (option: any) => {
  if (typeof option === 'undefined' || option === null) {
    throw new MissingOptionError();
  }
  return option;
};

export const sanitizePronoun = (pronoun: string): string => {
  switch (pronoun) {
    case 'he':
      return 'He/Him';
    case 'she':
      return 'She/Her';
    case 'they':
      return 'They/Them';
    case 'it':
      return 'It/Its';
    case 'any':
      return 'Any Pronouns';
    case 'ask':
      return 'Pronouns: Ask';
    default:
      return pronoun;
  }
};
