import { DiscordAPI } from '../discordAPI';
import { registerGuildCommands } from '../registerGuild';
import { CommandResponse } from '../response';
import { assertGuild, assertOption } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { APIRole } from '../../node_modules/discord-api-types/payloads/v10/permissions';

import { GuildSettings, OptionedCommandInteraction, OptionsList } from '../types';
import { Strings } from '../strings';

const deleteExtraneousRole = async (
  guildId: string,
  roleOption: string,
  guildSettings: GuildSettings
) => {
  delete guildSettings.roles?.[roleOption];
  await setGuildSettings(guildId, guildSettings);
  return guildSettings;
};

export const DeleteRoleCommand = async (
  interaction: OptionedCommandInteraction,
  options: OptionsList
) => {
  assertGuild(interaction);
  const roleOption: string = assertOption(options.pronoun).value;
  const guildId = interaction.guild_id as string;
  let guildSettings = await getGuildSettings(guildId);
  const roleId = guildSettings.roles[roleOption]?.id || '';
  const roles: APIRole[] = await DiscordAPI.getRoles(guildId);

  console.log('roleId', roleId);
  console.log('guildId', guildId);
  console.log('roleOption', roleOption);

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

  const role = await DiscordAPI.getRole(guildId, roleId);
  if (role) {
    await DiscordAPI.deleteRole(guildId, roleId);
  }

  await deleteExtraneousRole(guildId, roleOption, guildSettings);
  try {
    await registerGuildCommands(interaction.guild_id as string);
  } catch (e) {
    console.log(e);
  }

  if (role) {
    return new CommandResponse(Strings.DELETE_ROLE_SUCCESS.format({ name: role.name }));
  } else {
    return new CommandResponse(Strings.DELETE_ROLE_MISSING.format({ name: roleOption }));
  }
};
