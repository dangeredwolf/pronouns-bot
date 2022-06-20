import { InteractionResponseType } from '../node_modules/discord-api-types/payloads/v10/_interactions/responses';
import { MessageFlags } from '../node_modules/discord-api-types/payloads/v10/channel';

export class JsonResponse extends Response {
  constructor(body: unknown, init?: any) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
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
