import { prisma } from "../../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

export async function voteOnPoll(app: FastifyInstance) {

    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        })

        const { pollOptionId } = voteOnPollBody.parse(request.body)
        const { pollId } = voteOnPollParams.parse(request.params)

        let { sessionId } = request.cookies

        if (sessionId) {
            const userPreviousVoteOnPoll = await prisma.votes.findUnique({
                where: {
                   sessionId_pollId: {
                       sessionId,
                       pollId
                   }
                }
            })

            if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
                await prisma.votes.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id
                    }
                })
            } else if(userPreviousVoteOnPoll){
                return reply.status(409).send({
                    message: 'You already voted on this poll'
                })
            }
        }

        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                signed: true,
                httpOnly: true
            })
        }

        await prisma.votes.create({
            data: {
                sessionId,
                pollId,
                pollOptionId
            }
        })

        return reply.status(201).send({
            sessionId
        });
    });
}
