import { Strings } from './strings';

export class CommandInvalidError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CommandFailed extends CommandInvalidError {
  constructor(message: string) {
    super(message);
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class MissingOptionError extends CommandInvalidError {
  constructor(optionName: string) {
    super(Strings.MISSING_FIELD.format({ field: optionName }));
  }
}

export class InvalidOptionError extends CommandInvalidError {
  constructor(optionName: string) {
    super(Strings.INVALID_FIELD.format({ field: optionName }));
  }
}

export class GuildOnlyCommandError extends CommandInvalidError {
  constructor() {
    super(Strings.GENERIC_GUILD_MISSING);
  }
}

export const getErrorString = (response: Response): string =>
  (response as any).message || response.statusText;
