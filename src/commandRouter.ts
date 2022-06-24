import { OptionedCommandInteraction, OptionsList } from './types';
import { Strings } from './strings';
import { CommandFailed } from './errors';
import { CommandMap } from './commandMap';

export const routeCommand = async (
  interaction: OptionedCommandInteraction,
  request: Request
) => {
  const commandName = interaction.data.name.toLowerCase();
  const command = CommandMap[commandName];

  let rawOptions = interaction.data.options || [];
  let options: OptionsList = {};

  for (let i = 0; i < rawOptions.length; i++) {
    options[rawOptions[i].name] = rawOptions[i];
  }

  console.log('Options: ', options);

  if (command) {
    return await command(interaction, options, request);
  } else {
    throw new CommandFailed(
      Strings.COMMAND_NOT_FOUND.format({ command: interaction.data.name })
    );
  }
};
