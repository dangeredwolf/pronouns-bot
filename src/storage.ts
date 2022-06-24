import { GuildSettings } from './types';

export const getGuildSettings = async (guild_id: string): Promise<GuildSettings> => {
  let guildSettings: GuildSettings =
    (await PRONOUNS_BOT_GUILD_SETTINGS.get(guild_id, { type: 'json' })) ||
    ({ roles: {} } as GuildSettings);

  if (typeof guildSettings.roles === 'undefined') {
    guildSettings.roles = {};
  }

  let migratedLegacySettings = false;

  if (typeof guildSettings.roles['he'] === 'string') {
    guildSettings.roles['He/Him'] = { id: guildSettings.roles['he'] };
    delete guildSettings.roles['he'];
    migratedLegacySettings = true;
  }
  if (typeof guildSettings.roles['she'] === 'string') {
    guildSettings.roles['She/Her'] = { id: guildSettings.roles['she'] };
    delete guildSettings.roles['she'];
    migratedLegacySettings = true;
  }
  if (typeof guildSettings.roles['they'] === 'string') {
    guildSettings.roles['They/Them'] = { id: guildSettings.roles['they'] };
    delete guildSettings.roles['they'];
    migratedLegacySettings = true;
  }
  if (typeof guildSettings.roles['it'] === 'string') {
    guildSettings.roles['It/Its'] = { id: guildSettings.roles['it'] };
    delete guildSettings.roles['it'];
    migratedLegacySettings = true;
  }
  if (typeof guildSettings.roles['ask'] === 'string') {
    guildSettings.roles['Pronouns: Ask'] = {
      id: guildSettings.roles['ask'],
      special: true,
    };
    delete guildSettings.roles['ask'];
    migratedLegacySettings = true;
  }
  if (typeof guildSettings.roles['any'] === 'string') {
    guildSettings.roles['Any Pronouns'] = {
      id: guildSettings.roles['any'],
      special: true,
    };
    delete guildSettings.roles['any'];
    migratedLegacySettings = true;
  }
  if (
    guildSettings.roles['Pronouns: Ask'] &&
    !guildSettings.roles['Pronouns: Ask'].special
  ) {
    guildSettings.roles['Pronouns: Ask'] = {
      id: guildSettings.roles['Pronouns: Ask'].id,
      special: true,
    };
    migratedLegacySettings = true;
  }
  if (
    guildSettings.roles['Any Pronouns'] &&
    !guildSettings.roles['Any Pronouns'].special
  ) {
    guildSettings.roles['Any Pronouns'] = {
      id: guildSettings.roles['Any Pronouns'].id,
      special: true,
    };
    migratedLegacySettings = true;
  }

  if (migratedLegacySettings) {
    await setGuildSettings(guild_id, guildSettings);
  }

  return guildSettings;
};

export const setGuildSettings: any = async (
  guild_id: string,
  settings: GuildSettings
) => {
  // If any custom pronouns have enums from regular roles, remove them
  return await PRONOUNS_BOT_GUILD_SETTINGS.put(guild_id, JSON.stringify(settings));
};
