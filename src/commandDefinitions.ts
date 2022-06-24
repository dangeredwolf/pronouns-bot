import { PermissionFlagsBits } from '../node_modules/discord-api-types/payloads/common';
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';

// BigInt can't be JSON.stringified, and 1 << 5 isn't big enough to cause issues with floats anyway
const ManageGuild = Number(PermissionFlagsBits.ManageGuild);

export const SET_ROLE = {
  name: 'set_role',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Assign an existing role to a pronoun',
  options: [
    {
      name: 'pronoun',
      description: 'Pronoun to assign the role to',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'role',
      description: 'Role corresponding to the pronoun',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'special',
      description:
        'True = Display separately from other pronouns (used for Any Pronouns/Pronouns: Ask)',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

export const CREATE_CUSTOM_ROLE = {
  name: 'create_role',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Create a custom pronoun with a new role',
  options: [
    {
      name: 'pronoun',
      description: 'Pronoun to create a role for',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'special',
      description:
        'True = Display separately from other pronouns (used for Any Pronouns/Pronouns: Ask)',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

export const VERSION = {
  name: 'version',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Displays the current running build of the bot',
};

export const CREATE_ROLES = {
  name: 'create_default_roles',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description:
    'Create these default roles: He/Him, She/Her, They/Them, It/Its, Any Pronouns, Pronouns: Ask',
};

export const REGISTER_GLOBAL = {
  name: 'register_global',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: 0, // Administrator only
  description: 'Re-register global bot commands',
};

export const REGISTER_GUILD = {
  name: 'register_guild',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: 0, // Administrator only
  description: 'Re-register test guild bot commands',
};

export const LIST_ROLES = {
  name: 'list_roles',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'List all roles for pronouns in the guild',
};

export const SEND_PRONOUN_PICKER = {
  name: 'prompt',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ManageGuild,
  description: 'Sends a message to the channel with a picker for pronouns',
  options: [
    {
      name: 'title',
      description:
        'A title for the embed sent with the picker; if not specified, a default title will be used',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'subtitle',
      description:
        'A subtitle for the embed sent with the picker; if not specified, a default title will be used',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};
