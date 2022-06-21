import { CommandResponse, JsonResponse } from '../response';
import { InteractionResponseType } from '../../node_modules/discord-api-types/payloads/v10/_interactions/responses';
import { MessageFlags } from '../../node_modules/discord-api-types/payloads/v10/channel';
import { Strings } from '../strings';

export const VersionCommand = async (_interaction: any, request: Request) => {
  console.log(request);
  console.log("sdfsdfsdfsdfds");

  const discordLocation = `${request?.cf?.city}, ${request?.cf?.regionCode}, ${request?.cf?.country}`;
  // TODO: Find Worker location


  const response = {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [
        {
          type: 'rich',
          title: Strings.VERSION_INFO,
          description: Strings.VERSION_DESCRIPTION.format({ discordLocation: discordLocation, cfLocation: "" }),
          image: {
            url: Strings.VERSION_LOGO_URL,
          },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'GitHub',
              style: 5,
              url: Strings.GITHUB_URL,
            },
            {
              type: 2,
              label: 'Docs',
              style: 5,
              url: Strings.DOCS_URL,
            }
          ],
        }
      ],
    }
  }
  console.log(response);
  return new JsonResponse(response);
};
