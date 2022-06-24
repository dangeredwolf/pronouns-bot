import { registerGuildCommands } from '../registerGuild';
import { CommandResponse } from '../response';
import { getGuildPronouns } from '../roles';
import { assertGuild } from '../sanitization';
import { Strings } from '../strings';
import { OptionedCommandInteraction } from '../types';

export const ListRolesCommand = async (interaction: OptionedCommandInteraction) => {
  assertGuild(interaction);

  const guild_id: string = interaction.guild_id as string;

  const roleStrings: string[] = [];
  const roles = await getGuildPronouns(guild_id);

  try {
    await registerGuildCommands(interaction.guild_id as string);
  } catch (e) {
    console.log(e);
  }

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
