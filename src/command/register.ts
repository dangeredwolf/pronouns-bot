import { CommandResponse } from '../response';
import { registerGlobalCommands, registerGuildCommands } from '../register';
import { Strings } from '../strings';
import { CommandFailed, getErrorString } from '../errors';

export const RegisterGuildCommand = async () => {
  const response = await registerGuildCommands();

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
