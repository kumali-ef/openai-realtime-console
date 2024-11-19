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

const relay = new RealtimeRelay(OPENAI_API_KEY);

fastify.get('/', { websocket: true }, (connection, req) => {
  relay.connectionHandler(connection.socket, req);
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
