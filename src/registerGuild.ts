import { REGISTER_GLOBAL, REGISTER_GUILD } from './commandDefinitions';

const developerCommands: any[] = [REGISTER_GLOBAL, REGISTER_GUILD];

const testGuildId = PRONOUNS_BOT_TEST_GUILD_ID;
import { registerCommands } from './register';
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIApplicationCommand, 
} from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { PermissionFlagsBits } from '../node_modules/discord-api-types/payloads/common';
import { getGuildPronouns } from './roles';

const ManageGuild = String(PermissionFlagsBits.ManageGuild);

// @ts-ignore Despite Discord API docs, some of the "required" properties are optional. Even Discord doesn't use all of them.
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
// https://github.com/discord/cloudflare-sample-app/blob/main/src/commands.js#L6
export const DELETE_ROLE: APIApplicationCommand = {
  name: 'delete_role',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Delete a pronoun role',
  options: [
    {
      name: 'pronoun',
      description: 'Pronoun to delete',
      type: ApplicationCommandOptionType.String,
      choices: [],
    },
  ],
};

// @ts-ignore Despite Discord API docs, some of the "required" properties are optional. Even Discord doesn't use all of them.
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
// https://github.com/discord/cloudflare-sample-app/blob/main/src/commands.js#L6
export const UNASSIGN_ROLE: APIApplicationCommand = {
  name: 'unassign_role',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Unassigns a role from a pronoun',
  options: [
    {
      name: 'pronoun',
      description: 'Pronoun to unassign',
      type: ApplicationCommandOptionType.String,
      choices: [],
    },
  ],
};

/**
 * Register all commands with a specific guild/server. Useful during initial
 * development and testing.
 */
export const registerGuildCommands = async (guild_id: string): Promise<Response> => {
  if (!testGuildId) {
    throw new Error('The PRONOUNS_BOT_TEST_GUILD_ID environment variable is required.');
  }

  let commands: APIApplicationCommand[] = [];

  let guildDeleteRole = DELETE_ROLE;
  let guildUnassignRole = UNASSIGN_ROLE;
  let guildDeleteRoleOption = guildDeleteRole?.options?.[0] as any;
  let guildUnassignRoleOption = guildUnassignRole?.options?.[0] as any;
  let roleOptions: any[] = [];
  let roles = await getGuildPronouns(guild_id);

  console.log(roleOptions);

  guildDeleteRoleOption.choices = [];
  guildUnassignRoleOption.choices = [];

  // Create an option for each role
  roles.forEach(role => {
    guildDeleteRoleOption.choices.push({
      name: role.name,
      description: `${role.name} Pronoun`,
      value: role.name,
    });

    guildUnassignRoleOption.choices.push({
      name: role.name,
      description: `${role.name} Pronoun`,
      value: role.name,
    });
  });

  commands.push(guildDeleteRole);
  commands.push(guildUnassignRole);

  const url = `/applications/${DISCORD_APPLICATION_ID}/guilds/${testGuildId}/commands`;
  if (guild_id === PRONOUNS_BOT_TEST_GUILD_ID) {
    commands = commands.concat(developerCommands);
  }
  const res = await registerCommands(url, commands);
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
