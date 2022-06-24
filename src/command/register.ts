import { CommandResponse } from '../response';
import { registerGlobalCommands } from '../register';
import { Strings } from '../strings';
import { CommandFailed, getErrorString } from '../errors';
import { registerGuildCommands } from '../registerGuild';

export const RegisterGuildCommand = async () => {
  const response = await registerGuildCommands(PRONOUNS_BOT_TEST_GUILD_ID);

  if (response.ok) {
    return new CommandResponse(Strings.GUILD_COMMAND_REGISTER_SUCCESS);
  } else {
    throw new CommandFailed(
      Strings.GUILD_COMMAND_REGISTER_FAIL.format({
        error: getErrorString(response),
      })
    );
  }
};

export const RegisterGlobalCommand = async () => {
  const response = await registerGlobalCommands();

  if (response.ok) {
    return new CommandResponse(Strings.GLOBAL_COMMAND_REGISTER_SUCCESS);
  } else {
    throw new CommandFailed(
      Strings.GLOBAL_COMMAND_REGISTER_FAIL.format({
        error: getErrorString(response),
      })
    );
  }
};
