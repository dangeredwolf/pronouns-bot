import { CommandResponse } from '../response';
import { InvalidOptionError } from '../errors';
import { assertGuild } from '../sanitization';
import { getGuildSettings, setGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, PronounNames, Pronouns } from '../types';
import { DiscordAPI } from '../discordAPI';
import { registerGuildCommands } from '../registerGuild';

export const SetPronounsRoleCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const options = interaction.data.options;
  const pronounOption = options[0];
  const roleOption = options[1];

  let pronoun: Pronouns;

  switch (pronounOption.value) {
    case PronounNames.he:
      pronoun = Pronouns.he;
      break;
    case PronounNames.she:
      pronoun = Pronouns.she;
      break;
    case PronounNames.they:
      pronoun = Pronouns.they;
      break;
    case PronounNames.it:
      pronoun = Pronouns.it;
      break;
    case PronounNames.any:
      pronoun = Pronouns.any;
      break;
    case PronounNames.ask:
      pronoun = Pronouns.ask;
      break;
    default:
      throw new InvalidOptionError('pronoun');
  }

  let settings = await getGuildSettings(interaction.guild_id as string);
  settings.roles[pronoun] = options[1].value as string;
  await registerGuildCommands(interaction.guild_id as string);
  await setGuildSettings(interaction.guild_id as string, settings);

  // DiscordAPI.getRoles(interaction.guild_id as string).then(roles => {
  //   const role = roles.find(r => r.id === settings.roles[pronoun]);
  //   let position = role?.position || 0;

  // })

  return new CommandResponse(
    Strings.SET_ROLE_SUCCESS.format({
      pronoun: pronounOption.value,
      role_id: roleOption.value,
    })
  );
};
