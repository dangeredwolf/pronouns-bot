import { Constants } from './constants';
import { APIRole } from '../node_modules/discord-api-types/payloads/v10/permissions';
import { NetworkError } from './errors';

export const discordApiCall = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<Response> => {
  return await fetch(`${Constants.API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${PRONOUNS_BOT_TOKEN}`,
    },
    method: method,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
};

export const DiscordAPI = {
  getRoles: async (guildId: string): Promise<APIRole[]> => {
    const response = await discordApiCall(`/guilds/${guildId}/roles`);
    const roles = (await response.json()) as APIRole[];

    if (response.ok !== true) {
      throw new NetworkError(`A network error occurred  ${guildId}`);
    }
    return roles;
  },
  createRole: async (guildId: string, name: string): Promise<Response> => {
    console.log('Creating role...');
    let response = await discordApiCall(`/guilds/${guildId}/roles`, 'POST', {
      name: name,
    });
    console.log('Request to create role finished, response: ', response);
    return response;
  },
};
