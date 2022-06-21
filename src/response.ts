import { InteractionResponseType } from '../node_modules/discord-api-types/payloads/v10/_interactions/responses';
import { MessageFlags } from '../node_modules/discord-api-types/payloads/v10/channel';

export class JsonResponse extends Response {
  constructor(body: unknown, headers: { [header: string]: string } = {}) {
    super(JSON.stringify(body), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...headers,
      },
    });
  }
}

export class CommandResponse extends JsonResponse {
  constructor(content: string) {
    super({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content,
        flags: MessageFlags.Ephemeral,
      },
    });
  }
}
