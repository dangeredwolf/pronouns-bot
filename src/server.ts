import { Router } from 'itty-router';

/*
  Useful little function to format strings for us
*/

declare global {
  interface String {
    format(options: any): string;
  }
}

String.prototype.format = function (options: any) {
  return this.replace(/{([^{}]+)}/g, (match: string, name: string) => {
    if (options[name] !== undefined) {
      return options[name];
    }
    return match;
  });
};

import { OptionedCommandInteraction } from './types';

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
import { handleCommandError } from './errors';

const router = Router();

router.post('/api/interactions', async (request: Request) => {
  const isValidRequest = await verify(request.clone());

  // If the request is not properly signed, we must return a 401 error
  if (!isValidRequest) {
    return new Response('Invalid signature', { status: 401 });
  }

  console.log('Cloudflare: ', request.cf);
  let headersObject = Object.fromEntries(request.headers);
  let requestHeaders = JSON.stringify(headersObject, null, 2);
  console.log(`Request headers: ${requestHeaders}`);

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
     *  Handles application commands
     */
    case InteractionType.ApplicationCommand: {
      try {
        return await routeCommand(data as OptionedCommandInteraction, request);
      } catch (error: any) {
        return await handleCommandError(error);
      }
    }

    /*
     *  Handles message components
     */
    case InteractionType.MessageComponent: {
      try {
        return await handleMessageComponent(data as APIMessageComponentInteraction);
      } catch (error: any) {
        return await handleCommandError(error);
      }
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
