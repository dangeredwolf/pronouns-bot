import { CommandResponse } from '../response';
import { assertGuild, assertOption } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, OptionsList } from '../types';
import { registerGuildCommands } from '../registerGuild';

export const SetPronounsRoleCommand = async (
  interaction: OptionedCommandInteraction,
  options: OptionsList
) => {
  assertGuild(interaction);

  const pronounOption = assertOption(options.pronoun).value;
  const roleOption = assertOption(options.role).value;
  const specialOption = options?.special?.value;

  let settings = await getGuildSettings(interaction.guild_id as string);
  settings.roles[pronounOption] = { id: roleOption as string };
  if (specialOption) {
    settings.roles[pronounOption].special = true;
  }
  setTimeout(async () => {
    try {
      await registerGuildCommands(interaction.guild_id as string);
    } catch (e) {
      console.log(e);
    }
  });
  await setGuildSettings(interaction.guild_id as string, settings);

  return new CommandResponse(
    Strings.SET_ROLE_SUCCESS.format({
      pronoun: options.pronoun.value,
      role_id: options.role.value,
    })
  );
};
