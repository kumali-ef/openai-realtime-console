import { RealtimeRelay } from './lib/relay.js';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

dotenv.config({ override: true });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    `Environment variable "OPENAI_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 8081;

const fastify = Fastify();
fastify.register(fastifyWebsocket);

const relay = new RealtimeRelay(OPENAI_API_KEY, fastify.log);

fastify.get('/', { websocket: true }, (socket, req) => {
  relay.connectionHandler(socket, req);
});

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
