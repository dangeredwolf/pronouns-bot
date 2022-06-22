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
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { PermissionFlagsBits } from '../node_modules/discord-api-types/payloads/common';
import { getGuildPronouns } from './roles';

const ManageGuild = Number(PermissionFlagsBits.ManageGuild);

export const DELETE_ROLE = {
  name: 'delete_role',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Delete a pronoun role',
  options: [
    {
      name: 'pronoun',
      description: 'Pronoun to delete',
      type: ApplicationCommandOptionType.Subcommand,
      choices: [
        
      ],
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

  let commands = [];

  let guildDeleteRole = DELETE_ROLE;
  let roleOptions: any[] = [];
  let roles = await getGuildPronouns(guild_id);

  console.log(roleOptions);
  
  // Create an option for each role
  roles.forEach((role) => {
    guildDeleteRole.options[0].choices.push({
      // @ts-ignore TODO: Figure out type of commands
      name: role.name,
      // @ts-ignore TODO: Figure out type of commands
      description: `${role.name} Pronoun`,
      // @ts-ignore TODO: Figure out type of commands
      value: role.name
    });
  });

  commands.push(guildDeleteRole);

  const url = `/applications/${DISCORD_APPLICATION_ID}/guilds/${testGuildId}/commands`;
  // @ts-ignore TODO: Figure out type of commands
  const res = await registerCommands(url, commands.concat(developerCommands));
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
