import { prisma } from "../../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {

    app.post('/polls', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const  {title} = createPoolBody.parse(request.body)
        // return response.status(201).send();
        const poll = await prisma.poll.create({
            data: {
                title,
            }
        })
       return reply.status(201).send({ pollId : poll.id });
    });
}
