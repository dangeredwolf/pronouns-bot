import { CommandResponse } from '../response';
import { Strings } from '../strings';

export const VersionCommand = async () => {
  return new CommandResponse(Strings.VERSION_INFO);
};
