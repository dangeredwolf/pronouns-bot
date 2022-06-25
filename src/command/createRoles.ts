import { APIRole } from '../../node_modules/discord-api-types/payloads/v10/permissions';
import { CommandResponse } from '../response';
import { DiscordAPI } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction } from '../types';
import { CommandFailed, getErrorString } from '../errors';
import { registerGuildCommands } from '../registerGuild';

export const CreateRolesCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const roles: APIRole[] = await DiscordAPI.getRoles(guild_id);
  const guildSettings = await getGuildSettings(guild_id);

  console.log('Roles found: ', roles);
  console.log('Guild settings: ', guildSettings);

  let createdPronouns: string[] = [];

  let roleMap = {} as { [role_id: string]: boolean };

  roles.forEach(role => {
    roleMap[role?.id] = true;
  });

  // If there's any missing roles referenced by us, delete them
  for (const pronoun in guildSettings.roles) {
    if (roleMap[guildSettings.roles[pronoun]?.id] !== true) {
      delete guildSettings.roles[pronoun];
    }
  }

  const DefaultPronouns = [
    'He/Him',
    'She/Her',
    'They/Them',
    'It/Its',
    'Any Pronouns',
    'Pronouns: Ask',
  ];

  // Create roles that are completely missing
  for (let pronoun_num in DefaultPronouns) {
    const pronoun = DefaultPronouns[pronoun_num];
    if (roleMap[guildSettings.roles[pronoun]?.id] !== true) {
      const createRoleResponse = await DiscordAPI.createRole(guild_id, pronoun);
      const role: APIRole = await createRoleResponse.json();

      if (createRoleResponse.ok !== true) {
        throw new CommandFailed(
          Strings.CREATE_ROLES_FAIL.format({
            error: getErrorString(createRoleResponse),
          })
        );
      }

      if (pronoun === 'Pronouns: Ask' || pronoun === 'Any Pronouns') {
        guildSettings.roles[pronoun] = { id: role.id, special: true };
      } else {
        guildSettings.roles[pronoun] = { id: role.id };
      }

      console.log(role);
      createdPronouns.push(pronoun);
    }
  }

  await setGuildSettings(guild_id, guildSettings);
  setTimeout(async () => {
    try {
      await registerGuildCommands(interaction.guild_id as string);
    } catch (e) {
      console.log(e);
    }
  });

  if (createdPronouns.length > 0) {
    return new CommandResponse(
      Strings.CREATE_ROLES_SUCCESS.format({
        pronounList: createdPronouns.join(', '),
      })
    );
  } else {
    return new CommandResponse(Strings.CREATE_ROLES_ALREADY_DONE);
  }
};
