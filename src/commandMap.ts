import { CreateCustomPronounCommand } from './command/createCustomRole';
import { CreateRolesCommand } from './command/createRoles';
import { DeleteRoleCommand } from './command/deleteRole';
import { UnassignRoleCommand } from './command/unassignRole';
import { ListRolesCommand } from './command/listRoles';
import { RegisterGlobalCommand, RegisterGuildCommand } from './command/register';
import { SendPronounPickerCommand } from './command/sendPronounPicker';
import { SetPronounsRoleCommand } from './command/setPronounRoles';
import { VersionCommand } from './command/version';
import { DELETE_ROLE, UNASSIGN_ROLE } from './registerGuild';
import {
  REGISTER_GLOBAL,
  REGISTER_GUILD,
  SET_ROLE,
  CREATE_ROLES,
  VERSION,
  LIST_ROLES,
  SEND_PRONOUN_PICKER,
  CREATE_CUSTOM_ROLE,
} from './commandDefinitions';

export const CommandMap = {
  [REGISTER_GLOBAL.name]: RegisterGlobalCommand,
  [REGISTER_GUILD.name]: RegisterGuildCommand,
  [SET_ROLE.name]: SetPronounsRoleCommand,
  [CREATE_ROLES.name]: CreateRolesCommand,
  [VERSION.name]: VersionCommand,
  [LIST_ROLES.name]: ListRolesCommand,
  [SEND_PRONOUN_PICKER.name]: SendPronounPickerCommand,
  [CREATE_CUSTOM_ROLE.name]: CreateCustomPronounCommand,
  [DELETE_ROLE.name]: DeleteRoleCommand,
  [UNASSIGN_ROLE.name]: UnassignRoleCommand,
};
