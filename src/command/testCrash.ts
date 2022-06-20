import { MissingOptionError } from '../errors';

export const TestCrash = async () => {
  throw new MissingOptionError('deez nuts');
};
