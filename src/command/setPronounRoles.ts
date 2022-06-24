import { CommandResponse } from '../response';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction } from '../types';
import { registerGuildCommands } from '../registerGuild';

export const SetPronounsRoleCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const options = interaction.data.options;
  const pronounOption = options[0];
  const roleOption = options[1];

  let settings = await getGuildSettings(interaction.guild_id as string);
  settings.roles[pronounOption.value] = { id: options[1].value as string };
  await registerGuildCommands(interaction.guild_id as string);
  await setGuildSettings(interaction.guild_id as string, settings);

  return new CommandResponse(
    Strings.SET_ROLE_SUCCESS.format({
      pronoun: pronounOption.value,
      role_id: roleOption.value,
    })
  );
};
