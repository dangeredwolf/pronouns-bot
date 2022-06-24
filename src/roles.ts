import { getGuildSettings } from './storage';

export const getGuildPronouns = async (guild_id: string) => {
  let roles = [];
  const guildSettings = await getGuildSettings(guild_id);
  let keys = Object.keys(guildSettings.roles);

  for (const pronoun_str in keys) {
    const pronoun: string = keys[pronoun_str];
    console.log('pronoun', pronoun);
    if (guildSettings.roles[pronoun]?.id) {
      roles.push({
        keyName: pronoun,
        name: pronoun,
        roleId: guildSettings.roles[pronoun].id,
        special: guildSettings.roles[pronoun].special,
      });
    }
  }

  return roles;
};
