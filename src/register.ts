import {
  CREATE_ROLES,
  LIST_ROLES,
  REGISTER_GLOBAL,
  REGISTER_GUILD,
  SEND_PRONOUN_PICKER,
  SET_ROLE,
  SET_CUSTOM_ROLE,
  VERSION,
} from './commandDefinitions';
import { discordApiCall } from './discordAPI';
import { getErrorString } from './errors';

const token = PRONOUNS_BOT_TOKEN;
const applicationId = DISCORD_APPLICATION_ID;
const testGuildId = PRONOUNS_BOT_TEST_GUILD_ID;

const publicCommands = [SET_ROLE, CREATE_ROLES, VERSION, LIST_ROLES, SEND_PRONOUN_PICKER];
const developerCommands = [REGISTER_GLOBAL, REGISTER_GUILD, SET_CUSTOM_ROLE];

if (!token) {
  throw new Error('The PRONOUNS_BOT_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The PRONOUNS_BOT_APPLICATION_ID environment variable is required.');
}

/**
 * Register all commands with a specific guild/server. Useful during initial
 * development and testing.
 */

export const registerGuildCommands = async (): Promise<Response> => {
  if (!testGuildId) {
    throw new Error('The PRONOUNS_BOT_TEST_GUILD_ID environment variable is required.');
  }
  const url = `/applications/${applicationId}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url, developerCommands);
  const json: any[] = (await res.json()) as any[];
  console.log(json);
  json.forEach(async (cmd: any) => {
    const response = await fetch(
      `/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });

  return res;
};

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */

export const registerGlobalCommands = async (): Promise<Response> => {
  const url = `/applications/${applicationId}/commands`;
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
  await registerGuildCommands();
};
