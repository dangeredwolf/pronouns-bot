import { APIRole } from '../../node_modules/discord-api-types/payloads/v10/permissions';
import { CommandResponse } from '../response';
import { DiscordAPI } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, PronounNames, Pronouns } from '../types';
import { CommandFailed, getErrorString } from '../errors';

export const CreateRolesCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const roles: APIRole[] = await DiscordAPI.getRoles(guild_id);
  const guildSettings = await getGuildSettings(guild_id);

  console.log('Roles found: ', roles);
  console.log('Guild settings: ', guildSettings);

  let roleMap = {} as { [role_id: string]: boolean };

  let createdPronouns: PronounNames[] = [];

  roles.forEach(role => {
    roleMap[role.id] = true;
  });

  // If there's any missing roles referenced by us, replace them
  for (const pronoun_str of Object.keys(guildSettings.roles)) {
    const pronoun: Pronouns = pronoun_str as Pronouns;

    if (roleMap[guildSettings.roles[pronoun]] !== true) {
      const createRoleResponse = await DiscordAPI.createRole(guild_id, pronoun);
      const role: APIRole = await createRoleResponse.json();
      console.log(role);
      guildSettings.roles[pronoun] = role.id;
      createdPronouns.push(PronounNames[pronoun]);
    }
  }

  // Create roles that are completely missing
  for (const pronoun_str of Object.keys(Pronouns)) {
    const pronoun: Pronouns = pronoun_str as Pronouns;

    if (typeof guildSettings.roles[pronoun as Pronouns] === 'undefined') {
      const createRoleResponse = await DiscordAPI.createRole(guild_id, pronoun);
      const role: APIRole = await createRoleResponse.json();

      if (createRoleResponse.ok !== true) {
        throw new CommandFailed(
          Strings.CREATE_ROLES_FAIL.format({
            error: getErrorString(createRoleResponse),
          })
        );
      }

      console.log(role);
      guildSettings.roles[pronoun] = role.id;
      createdPronouns.push(PronounNames[pronoun]);
    }
  }

  await setGuildSettings(guild_id, guildSettings);

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
