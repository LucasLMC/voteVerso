import { prisma } from "../../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function getPolls(app: FastifyInstance) {

    app.get('/polls/:pollId', async (request, reply) => {
        const createPoolParams = z.object({
            pollId: z.string().uuid(),
        })

        const  {pollId} = createPoolParams.parse(request.params)

        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    select: {
                        id:true,
                        title:true
                    }
                }
            }
        })

       return reply.status(200).send({ poll });
    });
}
