import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const pollsRouter = createTRPCRouter({
  createPoll: publicProcedure
    .input(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
        userId: z.string().optional(),
        isPublic: z.boolean().optional(),
        isLive: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
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
          isPublic: input.isPublic,
          isLive: input.isLive,
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
        include: {
          Vote: true,
        },
      });

      // Check if poll exists
      if (!poll) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Poll not found",
        });
      }

      // Check if user is voting on their own poll
      if (poll.userId === input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot vote on your own poll",
        });
      }

      // Check if user has already voted
      if (poll.Vote.find((vote) => vote.userId === input.userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already voted on this poll",
        });
      }

      return ctx.prisma.vote.create({
        data: {
          pollId: input.pollId,
          optionId: input.optionId,
          userId: input.userId,
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
  getUserPolls: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().optional().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      return ctx.prisma.poll.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: input.userId,
        },
        select: {
          id: true,
          title: true,
          isLive: true,
          isPublic: true,
          _count: {
            select: {
              Vote: true,
              options: true,
            },
          },
        },
      });
    }),
  getUserVotes: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      return ctx.prisma.vote.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          id: true,
          poll: {
            select: {
              id: true,
              title: true,
              _count: {
                select: {
                  Vote: true,
                  options: true,
                },
              },
            },
          },
          option: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }),
  removePoll: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.poll.delete({
        where: {
          id: input.id,
        },
      });
    }),
  updatePoll: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublic: z.boolean().optional(),
        isLive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.poll.update({
        where: {
          id: input.id,
        },
        data: {
          isPublic: input.isPublic,
          isLive: input.isLive,
        },
      });
    }),
});
