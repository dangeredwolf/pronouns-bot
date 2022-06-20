import { APIMessageComponentInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/messageComponents';
import { APIGuildMember } from '../node_modules/discord-api-types/payloads/v10/guild';
import { CommandResponse } from './response';
import { discordApiCall } from './discordAPI';
import { getGuildSettings } from './storage';
import { PronounNames, Pronouns } from './types';
import { Strings } from './strings';
import { CommandFailed, getErrorString } from './errors';

export const handleMessageComponent = async (data: APIMessageComponentInteraction) => {
  console.log(data);
  const selectedPronoun = data.data.custom_id as Pronouns;
  const role_id = (await getGuildSettings(data.guild_id as string)).roles[
    selectedPronoun
  ];
  const user = data.member as APIGuildMember;
  return await toggleRole(
    PronounNames[selectedPronoun],
    data.guild_id as string,
    role_id,
    user
  );
};

const processError = (response: Response, failPrompt: string): CommandResponse => {
  let message = getErrorString(response);
  if (message === 'Unknown Role') {
    throw new CommandFailed(Strings.ROLE_NOT_CONFIGURED);
  } else if (message === 'Missing Permissions' || message === 'Missing Access') {
    throw new CommandFailed(Strings.ROLE_NO_PERMISSION);
  }
  throw new CommandFailed(failPrompt.format({ error: message }));
};

const toggleRole = async (
  pronoun: PronounNames,
  guild_id: string,
  roleId: string = '0',
  member: APIGuildMember
) => {
  if (member.roles.includes(roleId)) {
    const deleteRole = await discordApiCall(
      `/guilds/${guild_id}/members/${member.user?.id}/roles/${roleId}`,
      'DELETE'
    );
    if (deleteRole.ok) {
      return new CommandResponse(
        Strings.ROLE_REMOVE_SUCCESS.format({ pronoun: pronoun })
      );
    } else {
      return processError(deleteRole, Strings.ROLE_REMOVE_FAIL);
    }
  } else {
    const addRole = await discordApiCall(
      `/guilds/${guild_id}/members/${member.user?.id}/roles/${roleId}`,
      'PUT'
    );
    if (addRole.ok) {
      return new CommandResponse(Strings.ROLE_ADD_SUCCESS.format({ pronoun: pronoun }));
    } else {
      processError(addRole, Strings.ROLE_ADD_FAIL);
    }
  }
};
