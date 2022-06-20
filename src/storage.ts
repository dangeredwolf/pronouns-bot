import { GuildSettings } from './types';

export const getGuildSettings = async (guild_id: string): Promise<GuildSettings> => {
  return (
    (await PRONOUNS_BOT_GUILD_SETTINGS.get(guild_id, { type: 'json' })) ||
    ({ roles: {} } as GuildSettings)
  );
};

export const setGuildSettings = async (guild_id: string, settings: GuildSettings) => {
  return await PRONOUNS_BOT_GUILD_SETTINGS.put(guild_id, JSON.stringify(settings));
};
