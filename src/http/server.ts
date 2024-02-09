import fastify from 'fastify';
import { createPoll } from './routes/create-polls';

const app = fastify();

app.register(createPoll);

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running on http://localhost:3333');
});

