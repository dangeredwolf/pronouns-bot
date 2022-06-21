import {
  APIMessageApplicationCommandInteractionData,
  APIUserApplicationCommandInteractionData,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/contextMenu';
import { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput';
import { APIApplicationCommandInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { APIApplicationCommandOptionChoice } from '../node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared';

export enum PronounNames {
  he = 'He/Him',
  she = 'She/Her',
  they = 'They/Them',
  it = 'It/Its',
  any = 'Any Pronouns',
  ask = 'Pronouns: Ask',
}

export enum Pronouns {
  he = 'he',
  she = 'she',
  they = 'they',
  it = 'it',
  any = 'any',
  ask = 'ask',
}

export interface GuildSettings {
  roles: {
    he: string;
    she: string;
    they: string;
    it: string;
    any: string;
    ask: string;
  };
  customRoles?: {
    [key: string]: string;
  };
  disabledPronouns?: Pronouns[];
}

export type APIInteractionData =
  | APIChatInputApplicationCommandInteractionData
  | APIUserApplicationCommandInteractionData
  | APIMessageApplicationCommandInteractionData;

/*
  Not sure if I'm just stupid but APIApplicationCommandInteraction does not support data.options
  even though it very much exists.

  Looking at advaith's code, he seems to be using some kind of workaround for this
  https://github.com/advaith1/activities/blob/b8805b991abbfb9f65e183c194f4616626e93ddb/src/bot.ts#L34

  However, with my TS settings while it will compile, VS Code will complain about the types constantly.
  So we'll just use our OptionedCommandInteraction to make it happier.
*/
export type OptionedCommandInteraction = APIApplicationCommandInteraction & {
  data: APIChatInputApplicationCommandInteractionData & {
    options: APIApplicationCommandOptionChoice[];
  };
};

/*
  Useful little function to format strings for us
*/

declare global {
  interface String {
    format(options: any): string;
  }
}

String.prototype.format = function (options: any) {
  return this.replace(/{([^{}]+)}/g, (match: string, name: string) => {
    if (options[name] !== undefined) {
      return options[name];
    }
    return match;
  });
};
