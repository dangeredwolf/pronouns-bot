import { CommandResponse } from '../response';
import { discordApiCall } from '../discordAPI';
import { assertGuild } from '../sanitization';
import { Strings } from '../strings';
import { OptionedCommandInteraction } from '../types';
import { CommandFailed, getErrorString } from '../errors';

const createMessage = async (channel_id: string, title?: string, subtitle?: string) => {
  console.log('Creating message...');
  let response = await discordApiCall(`/channels/${channel_id}/messages`, 'POST', {
    embeds: [
      {
        type: 'rich',
        title: title || Strings.PROMPT_DEFAULT_TITLE,
        description: subtitle || Strings.PROMPT_DEFAULT_SUBTITLE,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'He/Him',
            style: 1,
            custom_id: 'he',
          },
          {
            type: 2,
            label: 'She/Her',
            style: 1,
            custom_id: 'she',
          },
          {
            type: 2,
            label: 'They/Them',
            style: 1,
            custom_id: 'they',
          },
          {
            type: 2,
            label: 'It/Its',
            style: 1,
            custom_id: 'it',
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'Any Pronouns',
            style: 2,
            custom_id: 'any',
          },
          {
            type: 2,
            label: 'Ask me!',
            style: 2,
            custom_id: 'ask',
          },
        ],
      },
    ],
  });

  console.log('Request to create message finished, response: ', response);
  return response;
};

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

  let response = await createMessage(channel_id, title, subtitle);

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
