import fastify from 'fastify';

const app = fastify();

app.get('/hello', () => {
    return 'Welcome to NLW Expert Project !';
});

app.post('/polls', async (request, response) => {
    // return response.status(201).send();
   return request.body.title
});

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running on http://localhost:3333');
});

