import {
  APIMessageApplicationCommandInteractionData,
  APIUserApplicationCommandInteractionData,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/contextMenu';
import { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput';
import { APIApplicationCommandInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { APIApplicationCommandOptionChoice } from '../node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared';

export interface OptionsList {
  [optionName: string]: APIApplicationCommandOptionChoice;
}

export interface GuildSettings {
  roles: {
    [key: string]: {
      id: string;
      special?: boolean;
    };
  };
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
