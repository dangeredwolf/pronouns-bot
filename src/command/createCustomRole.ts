import { APIRole } from '../../node_modules/discord-api-types/payloads/v10/permissions';
import { CommandResponse } from '../response';
import { DiscordAPI } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, OptionsList } from '../types';
import { CommandFailed } from '../errors';
import { registerGuildCommands } from '../registerGuild';

export const CreateCustomPronounCommand = async (
  interaction: OptionedCommandInteraction,
  options: OptionsList
) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const roles: APIRole[] = await DiscordAPI.getRoles(guild_id);
  const guildSettings = await getGuildSettings(guild_id);

  const pronounName: string = options?.pronoun?.value as string;
  // @ts-ignore TODO: see if this actually returns as a string or boolean
  console.log('Special?', options?.special?.value);
  const special: boolean = Boolean(options?.special?.value);

  let roleMap = {} as { [role_id: string]: boolean };

  for (let id in roles) {
    roleMap[roles[id]?.id] = true;
  }

  if (typeof guildSettings.roles === 'undefined') {
    guildSettings.roles = {};
  }

  let existingRole = guildSettings.roles[pronounName];

  if (typeof existingRole !== 'undefined' && roleMap[existingRole.id] === true) {
    throw new CommandFailed(Strings.CUSTOM_ROLE_EXISTS.format({ pronoun: pronounName }));
  }

  const createRoleResponse = await DiscordAPI.createRole(guild_id, pronounName);
  const role: APIRole = await createRoleResponse.json();
  guildSettings.roles[pronounName] = { id: role.id };

  if (special) {
    guildSettings.roles[pronounName].special = true;
  }

  await setGuildSettings(guild_id, guildSettings);
  try {
    await registerGuildCommands(interaction.guild_id as string);
  } catch (e) {
    console.log(e);
  }

  return new CommandResponse(
    Strings.CUSTOM_ROLE_CREATED.format({ pronoun: pronounName })
  );
};
