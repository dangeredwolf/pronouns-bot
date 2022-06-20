import { CreateRolesCommand } from './command/createRoles';
import { ListRolesCommand } from './command/listRoles';
import { RegisterGlobalCommand, RegisterGuildCommand } from './command/register';
import { SendPronounPickerCommand } from './command/sendPronounPicker';
import { SetPronounsRoleCommand } from './command/setPronounRoles';
import { VersionCommand } from './command/version';
import {
  REGISTER_GLOBAL,
  REGISTER_GUILD,
  SET_ROLE,
  CREATE_ROLES,
  VERSION,
  LIST_ROLES,
  SEND_PRONOUN_PICKER,
} from './commandDefinitions';

export const CommandMap = {
  [REGISTER_GLOBAL.name]: RegisterGlobalCommand,
  [REGISTER_GUILD.name]: RegisterGuildCommand,
  [SET_ROLE.name]: SetPronounsRoleCommand,
  [CREATE_ROLES.name]: CreateRolesCommand,
  [VERSION.name]: VersionCommand,
  [LIST_ROLES.name]: ListRolesCommand,
  [SEND_PRONOUN_PICKER.name]: SendPronounPickerCommand,
};
