import {
  CREATE_ROLES,
  LIST_ROLES,
  SEND_PRONOUN_PICKER,
  SET_ROLE,
  CREATE_CUSTOM_ROLE,
  VERSION,
} from './commandDefinitions';
import { discordApiCall } from './discordAPI';
import { getErrorString } from './errors';
import { registerGuildCommands } from './registerGuild';

const publicCommands = [
  SET_ROLE,
  CREATE_ROLES,
  VERSION,
  LIST_ROLES,
  CREATE_CUSTOM_ROLE,
  SEND_PRONOUN_PICKER,
];

if (!DISCORD_APPLICATION_ID) {
  throw new Error('The PRONOUNS_BOT_APPLICATION_ID environment variable is required.');
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */

export const registerGlobalCommands = async (): Promise<Response> => {
  const url = `/applications/${DISCORD_APPLICATION_ID}/commands`;
  return await registerCommands(url, publicCommands);
};

export const registerCommands = async (
  url: string,
  commands: any[]
): Promise<Response> => {
  const response = await discordApiCall(url, 'PUT', commands);

  if (response.ok) {
    console.log(`Registered commands on ${url}`);
  } else {
    console.error(`Error registering commands: ${getErrorString(response)}`);
    const text = await response.text();
    console.error(text);
  }
  return response;
};

export const doRegisterCommands = async () => {
  await registerGlobalCommands();
  await registerGuildCommands(PRONOUNS_BOT_TEST_GUILD_ID);
};
