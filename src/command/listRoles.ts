import { CommandResponse } from '../response';
import { assertGuild } from '../sanitization';
import { getGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, PronounNames, Pronouns } from '../types';

export const ListRolesCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const guildSettings = await getGuildSettings(guild_id);

  console.log('Guild settings: ', guildSettings);

  const roles: string[] = [];

  // If there's any missing roles referenced by us, replace them
  for (const pronoun_str of Object.keys(guildSettings.roles)) {
    const pronoun: Pronouns = pronoun_str as Pronouns;
    roles.push(
      Strings.LIST_ROLE_ENTRY.format({
        pronoun: PronounNames[pronoun],
        role_id: guildSettings.roles[pronoun],
      })
    );
  }

  return new CommandResponse(
    Strings.LIST_ROLES_RESULT.format({ roles: roles.join('\n') })
  );
};
