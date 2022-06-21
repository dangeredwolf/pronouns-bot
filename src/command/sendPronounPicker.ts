import { CommandResponse } from '../response';
import { discordApiCall } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { Strings } from '../strings';
import { OptionedCommandInteraction, SpecialPronouns } from '../types';
import { CommandFailed, getErrorString } from '../errors';
import { getGuildPronouns } from '../roles';

const createMessage = async (channel_id: string, guild_id: string, title?: string, subtitle?: string) => {
  console.log('Creating message...');
  let response = await discordApiCall(`/channels/${channel_id}/messages`, 'POST', {
    embeds: [
      {
        type: 'rich',
        title: title || Strings.PROMPT_DEFAULT_TITLE,
        description: subtitle || Strings.PROMPT_DEFAULT_SUBTITLE,
      },
    ],
    components: await buildButtonLayout(guild_id)
  });

  // console.log("Button layout: ", await buildButtonLayout(guild_id));

  console.log('Request to create message finished, response: ', response);
  return response;
};

const buildButtonLayout = async (guild_id: string) => {
  const pronouns = await getGuildPronouns(guild_id);

  let mainBucket = [];
  let specialBucket = [];

  for (const pronoun of pronouns) {
    if (pronoun.keyName in SpecialPronouns) {
      specialBucket.push(pronoun);
    } else {
      mainBucket.push(pronoun);
    }
  }

  let row: any[] = [];
  let mainComponents: any[] = [];
  let specialComponents: any[] = [];

  for (const pronoun of mainBucket) {
    if (row.length >= 5) {
      mainComponents.push({
        type: 1,
        components: row,
      });
      row = [];
    }
    row.push({
      type: 2,
      label: pronoun.name,
      style: 1,
      custom_id: pronoun.keyName,
    });
  }

  mainComponents.push({
    type: 1,
    components: row,
  });

  console.log("mainComponents", mainComponents);

  for (const pronoun of specialBucket) {
    if (row.length >= 5) {
      specialComponents.push({
        type: 1,
        components: row,
      });
      row = [];
    }
    row.push({
      type: 2,
      label: pronoun.name,
      style: 2,
      custom_id: pronoun.keyName,
    });
  }
  
  specialComponents.push({
    type: 1,
    components: row,
  });

  console.log("specialComponents", specialComponents);

  return mainComponents.concat(specialComponents);
}

export const SendPronounPickerCommand = async (
  interaction: OptionedCommandInteraction
) => {
  assertGuild(interaction);

  const channel_id: string = interaction.channel_id;

  console.log('Channel ID: ', interaction.channel_id);
  console.log('Options: ', interaction.data.options);

  const title =
    (interaction.data.options?.[0]?.value as string) || Strings.PROMPT_DEFAULT_TITLE;
  const subtitle =
    (interaction.data.options?.[1]?.value as string) || Strings.PROMPT_DEFAULT_SUBTITLE;

  let response = await createMessage(channel_id, interaction.guild_id as string, title, subtitle);

  if (response.ok) {
    return new CommandResponse(Strings.PROMPT_SUCCESS);
  } else {
    let message = getErrorString(response);
    if (message === 'Missing Permissions') {
      throw new CommandFailed(Strings.PROMPT_MISSING_PERMISSION);
    } else if (message === 'Missing Access') {
      throw new CommandFailed(Strings.PROMPT_MISSING_ACCESS);
    }
    throw new CommandFailed(Strings.PROMPT_UNKNOWN_ERROR.format({ error: message }));
  }
};
