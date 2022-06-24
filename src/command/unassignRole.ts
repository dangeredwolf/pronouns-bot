import { DiscordAPI } from '../discordAPI';
import { registerGuildCommands } from '../registerGuild';
import { CommandResponse } from '../response';
import { assertGuild, assertOption } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { APIRole } from 'discord-api-types/payloads/v10/permissions';

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

export const UnassignRoleCommand = async (
  interaction: OptionedCommandInteraction,
  options: OptionsList
) => {
  assertGuild(interaction);
  const roleOption: string = assertOption(options.pronoun).value;
  const guildId = interaction.guild_id as string;
  let guildSettings = await getGuildSettings(guildId);
  const roleId = guildSettings.roles[roleOption]?.id || '';
  const roles: APIRole[] = await DiscordAPI.getRoles(guildId);

  delete guildSettings.roles[roleOption];

  await deleteExtraneousRole(guildId, roleOption, guildSettings);
  try {
    await registerGuildCommands(interaction.guild_id as string);
  } catch (e) {
    console.log(e);
  }

  return new CommandResponse(Strings.UNASSIGN_ROLE_SUCCESS.format({ name: roleOption }));
};
