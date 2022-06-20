import { Router } from 'itty-router';

import { APIPingInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/ping';
import { APIApplicationCommandInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands';
import { APIMessageComponentInteraction } from '../node_modules/discord-api-types/payloads/v10/_interactions/messageComponents';
import {
  InteractionResponseType,
  InteractionType,
} from '../node_modules/discord-api-types/payloads/v10/_interactions/responses';

import { verify } from './verify';
import { routeCommand } from './commandRouter';
import { JsonResponse } from './response';
import { Constants } from './constants';
import { handleMessageComponent } from './messageComponentHandler';
import { OptionedCommandInteraction } from './types';
import { CommandResponse } from './response';
import { CommandFailed, CommandInvalidError } from './errors';
import { Strings } from './strings';

const router = Router();

router.post('/api/interactions', async (request: Request) => {
  const isValidRequest = await verify(request.clone());

  // If the request is not properly signed, we must return a 401 error
  if (!isValidRequest) {
    return new Response('Invalid signature', { status: 401 });
  }

  const data = (await request.json()) as
    | APIPingInteraction
    | APIApplicationCommandInteraction
    | APIMessageComponentInteraction
    | OptionedCommandInteraction;

  console.log(data);

  switch (data.type) {
    /*
     *  Ping/Pong needed for the initial interaction URL handshake
     *  https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
     */
    case InteractionType.Ping: {
      return new JsonResponse({
        type: InteractionResponseType.Pong,
      });
    }
    /*
     *  Handles actual application commands
     */
    case InteractionType.ApplicationCommand: {
      try {
        return await routeCommand(data as OptionedCommandInteraction);
      } catch (error: any) {
        console.error(error);

        const errString = String(error).replace(/^Error: /g, '');

        if (error instanceof CommandInvalidError) {
          return new CommandResponse(errString);
        } else {
          throw new CommandFailed(
            Strings.UNKNOWN_COMMAND_ERROR.format({ error: errString })
          );
        }
      }
    }

    /*
     *  Handles actual application commands
     */
    case InteractionType.MessageComponent: {
      return await handleMessageComponent(data as APIMessageComponentInteraction);
    }
  }
});

/* 
  You can use this for initial command registration.
  Afterwards, comment it out and use /register_guild or /register_global commands
  in your test server (PRONOUNS_BOT_TEST_GUILD_ID)
*/

// router.get('/__register', async (request: Request) => {
//   await doRegisterCommands();

//   return new Response('Registered commands', {status: 200});
// });

router.all('*', async request => {
  return Response.redirect(Constants.REDIRECT_URL);
});

/*
  Event to receive web requests on Cloudflare Worker
*/
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(router.handle(event.request));
});
