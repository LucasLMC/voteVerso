import { prisma } from "../../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {

    app.get('/polls/:pollId', async (request, reply) => {
        const createPoolParams = z.object({
            pollId: z.string().uuid(),
        })

        const { pollId } = createPoolParams.parse(request.params)

        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        if (!poll) {
            return reply.status(404).send({ message: 'Poll not found' })
        }

        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

        const votes = result.reduce((obj, line, index) => {
            if (index % 2 === 0) {
                return { ...obj, [line]: Number(result[index + 1]) }
            }
            return obj
        }, {} as Record<string, number>)


        return reply.status(200).send({
            poll : {
                id : poll.id,
                title : poll.title,
                options : poll.options.map(option => ({
                    id : option.id,
                    title : option.title,
                    score : (option.id in votes) ? votes[option.id] : 0
                }))
            }
        });
    });
}
