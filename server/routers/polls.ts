import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";

export const pollsRouter = createTRPCRouter({
  createPoll: publicProcedure
    .input(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
        userId: z.string().optional(),
        isPublic: z.boolean().optional(),
        isLive: z.boolean().optional(),
        isAuthenticated: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.options.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Poll must have at least 2 options",
        });
      }
      if (input.isAuthenticated || input.isLive || input.isPublic) {
        if (
          ctx.session &&
          ctx.session.user.stripeSubscriptionStatus !== "active"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You must have an active subscription to create a private poll",
          });
        }
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
          isAuthenticated: input.isAuthenticated,
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

      if (poll.isAuthenticated) {
        // Check if user exists
        if (!input.userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found, please login",
          });
        }
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
        search: z.string().optional(),
        // Pagination
        page: z.number().optional(),
        size: z.number().optional().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const { page = 1, size, userId } = input;
      const offset = (page - 1) * size;

      let where: Prisma.PollWhereInput = {
        userId,
      };

      if (input.search) {
        where = {
          ...where,
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        };
      }
      const items = await ctx.prisma.poll.findMany({
        skip: offset,
        take: size,
        orderBy: {
          createdAt: "desc",
        },
        where,
        select: {
          id: true,
          title: true,
          isLive: true,
          isPublic: true,
          isAuthenticated: true,
          _count: {
            select: {
              Vote: true,
              options: true,
            },
          },
        },
      });

      const totalCount = await ctx.prisma.poll.count({
        where,
      });

      const totalPages = Math.ceil(totalCount / size);
      return {
        items,
        totalPages,
      };
    }),
  getUserVotes: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        // Pagination
        page: z.number().optional(),
        size: z.number().optional().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const { page = 1, size, userId } = input;
      const offset = (page - 1) * size;

      const [items, totalCount] = await Promise.all([
        ctx.prisma.vote.findMany({
          skip: offset,
          take: size,
          where: {
            userId,
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
        }),
        ctx.prisma.vote.count({
          where: {
            userId: input.userId,
          },
        }),
      ]);
      const totalPages = Math.ceil(totalCount / size);

      return {
        items,
        totalPages,
      };
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
        isAuthenticated: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.stripeSubscriptionStatus !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to be subscribed to update your poll",
        });
      }
      return ctx.prisma.poll.update({
        where: {
          id: input.id,
        },
        data: {
          isPublic: input.isPublic,
          isLive: input.isLive,
          isAuthenticated: input.isAuthenticated,
        },
      });
    }),
});
