import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pollsRouter = createTRPCRouter({
  createPoll: publicProcedure
    .input(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
        userId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      if (input.options.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Poll must have at least 2 options",
        });
      }
      return ctx.prisma.poll.create({
        data: {
          title: input.name,
          options: {
            create: input.options.map((option) => ({
              title: option,
            })),
          },
          userId: input.userId,
        },
      });
    }),
  getPoll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.poll.findUnique({
        where: {
          id: input.id,
        },
        include: {
          options: true,
        },
      });
    }),
  vote: publicProcedure
    .input(
      z.object({
        pollId: z.string(),
        optionId: z.string(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: {
          id: input.pollId,
        },
      });
      if (!poll) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Poll not found",
        });
      }

      return ctx.prisma.vote.create({
        data: {
          pollId: input.pollId,
          optionId: input.optionId,
        },
      });
    }),
  getAllVotes: publicProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.vote.findMany({
        where: {
          pollId: input.pollId,
        },
      });
    }),
});
