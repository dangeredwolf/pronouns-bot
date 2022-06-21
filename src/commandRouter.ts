import { OptionedCommandInteraction } from './types';
import { Strings } from './strings';
import { CommandFailed } from './errors';
import { CommandMap } from './commandMap';

export const routeCommand = async (
  interaction: OptionedCommandInteraction,
  request: Request
) => {
  const commandName = interaction.data.name.toLowerCase();
  const command = CommandMap[commandName];

  if (command) {
    return await command(interaction, request);
  } else {
    throw new CommandFailed(
      Strings.COMMAND_NOT_FOUND.format({ command: interaction.data.name })
    );
  }
};
