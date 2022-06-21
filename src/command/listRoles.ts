import { CommandResponse } from '../response';
import { getGuildPronouns } from '../roles';
import { assertGuild } from '../sanitization';
import { getGuildSettings } from '../storage';
import { Strings } from '../strings';
import { OptionedCommandInteraction, PronounNames, Pronouns } from '../types';

export const ListRolesCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;
  const guildSettings = await getGuildSettings(guild_id);

  console.log('Guild settings: ', guildSettings);

  const roleStrings: string[] = [];
  const roles = await getGuildPronouns(guild_id);

  for (let i in roles) {
    roleStrings.push(
      Strings.LIST_ROLE_ENTRY.format({
        pronoun: roles[i].name,
        role_id: roles[i].roleId,
      })
    );
  }

  return new CommandResponse(
    Strings.LIST_ROLES_RESULT.format({ roles: roleStrings.join('\n') })
  );
};
