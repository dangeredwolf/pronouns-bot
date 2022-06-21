import { APIRole } from '../../node_modules/discord-api-types/payloads/v10/permissions';
import { CommandResponse } from '../response';
import { DiscordAPI } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import {
  OptionedCommandInteraction,
  PronounNames,
  Pronouns,
  DefaultPronounNames,
} from '../types';
import { CommandFailed, getErrorString } from '../errors';

export const CreateCustomPronounCommand = async (
  interaction: OptionedCommandInteraction
) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const roles: APIRole[] = await DiscordAPI.getRoles(guild_id);
  const guildSettings = await getGuildSettings(guild_id);

  const pronounName: string = interaction.data.options[0].value as string;

  let roleMap = {} as { [role_id: string]: boolean };

  for (let id in roles) {
    roleMap[roles[id].id] = true;
  }

  if (typeof guildSettings.customRoles === 'undefined') {
    guildSettings.customRoles = {};
  }

  let existingRole = guildSettings.customRoles[pronounName];

  if (DefaultPronounNames[pronounName] === true) {
    throw new CommandFailed(
      Strings.CUSTOM_ROLE_IS_DEFAULT.format({ pronoun: pronounName })
    );
  }

  if (typeof existingRole !== 'undefined' && roleMap[existingRole.id] === true) {
    throw new CommandFailed(Strings.CUSTOM_ROLE_EXISTS.format({ pronoun: pronounName }));
  }

  const createRoleResponse = await DiscordAPI.createRole(guild_id, pronounName);
  const role: APIRole = await createRoleResponse.json();
  guildSettings.customRoles[pronounName] = { id: role.id };

  await setGuildSettings(guild_id, guildSettings);

  return new CommandResponse(
    Strings.CUSTOM_ROLE_CREATED.format({ pronoun: pronounName })
  );
};