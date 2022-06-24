import { CommandResponse } from './response';
import { Strings } from './strings';

export class CommandRuntimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CommandFailed extends CommandRuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class MissingOptionError extends CommandRuntimeError {
  constructor(optionName?: string) {
    super(
      optionName
        ? Strings.MISSING_FIELD.format({ field: optionName })
        : Strings.GENERIC_MISSING_FIELD
    );
  }
}

export class InvalidOptionError extends CommandRuntimeError {
  constructor(optionName: string) {
    super(Strings.INVALID_FIELD.format({ field: optionName }));
  }
}

export class GuildOnlyCommandError extends CommandRuntimeError {
  constructor() {
    super(Strings.GENERIC_GUILD_MISSING);
  }
}

export const getErrorString = (response: Response): string =>
  (response as any).message || response.statusText;

export const handleCommandError = async (error: Error): Promise<CommandResponse> => {
  console.error(error);

  const errString = String(error).replace(/^Error: /g, '');
  const errStack = String(error.stack).replace(/^Error: /g, '');

  if (error instanceof CommandRuntimeError) {
    return new CommandResponse(errString);
  } else {
    return new CommandResponse(Strings.UNKNOWN_COMMAND_ERROR.format({ error: errStack }));
  }
};
