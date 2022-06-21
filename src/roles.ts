import { getGuildSettings } from './storage';
import { PronounNames, Pronouns } from './types';

export const getGuildPronouns = async (guild_id: string) => {
  let roles = [];
  const guildSettings = await getGuildSettings(guild_id);

  for (const pronoun_str of Object.keys(guildSettings.roles)) {
    const pronoun: Pronouns = pronoun_str as Pronouns;
    roles.push({
      keyName: pronoun,
      name: PronounNames[pronoun],
      roleId: guildSettings.roles[pronoun],
    });
  }

  for (const pronoun_str in guildSettings.customRoles) {
    const pronoun: Pronouns = pronoun_str as Pronouns;
    roles.push({
      keyName: pronoun,
      name: pronoun,
      roleId: guildSettings.customRoles[pronoun],
    });
  }

  return roles;
};
