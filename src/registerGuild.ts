import {
  REGISTER_GLOBAL,
  REGISTER_GUILD,
  SET_CUSTOM_ROLE,
  CREATE_CUSTOM_ROLE,
} from './commandDefinitions';
const developerCommands = [
  REGISTER_GLOBAL,
  REGISTER_GUILD,
  SET_CUSTOM_ROLE,
  CREATE_CUSTOM_ROLE,
];

const testGuildId = PRONOUNS_BOT_TEST_GUILD_ID;
import { registerCommands } from './register';

/**
 * Register all commands with a specific guild/server. Useful during initial
 * development and testing.
 */
export const registerGuildCommands = async (): Promise<Response> => {
  if (!testGuildId) {
    throw new Error('The PRONOUNS_BOT_TEST_GUILD_ID environment variable is required.');
  }

  const url = `/applications/${DISCORD_APPLICATION_ID}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url, developerCommands);
  const json: any[] = (await res.json()) as any[];
  console.log(json);

  json.forEach(async (cmd: any) => {
    const response = await fetch(
      `/applications/${DISCORD_APPLICATION_ID}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });

  return res;
};
