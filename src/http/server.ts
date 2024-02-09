import fastify from 'fastify';
import { createPoll } from './routes/create-polls';
import { getPolls } from './routes/get-polls';

const app = fastify();

app.register(createPoll);
app.register(getPolls);

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running on http://localhost:3333');
});

