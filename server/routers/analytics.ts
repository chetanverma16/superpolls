import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

// Controllers
import generateChartData from "../controllers/analytics/getAnalytics";

export const analyticsRouter = createTRPCRouter({
  increaseViewCount: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;
      if (ctx.session) {
        if (ctx.session.user.id === userId)
          return {
            success: false,
          };
      } else {
        try {
          await ctx.prisma.views.create({
            data: {
              pollId: id as string,
            },
          });
        } catch (err) {
          console.log(err);
          return {
            success: false,
          };
        }
      }
    }),
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.stripeSubscriptionStatus !== "active") return null;
    const views = await ctx.prisma.views.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days
        },
        poll: {
          userId: ctx.session.user.id,
        },
      },
    });
    const votes = await ctx.prisma.vote.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days
        },
        poll: {
          userId: ctx.session.user.id,
        },
      },
    });
    const chartData = generateChartData(views, votes);

    return chartData;
  }),
  getAnalyticsById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.stripeSubscriptionStatus !== "active") return null;
      const { id } = input;
      const views = await ctx.prisma.views.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days
          },
          poll: {
            id: id as string,
          },
        },
      });
      const votes = await ctx.prisma.vote.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days
          },
          poll: {
            id: id as string,
          },
        },
      });
      const chartData = generateChartData(views, votes);

      return chartData;
    }),
  getTopViewedPollsByUser: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.stripeSubscriptionStatus !== "active") return null;
    const allViewsbyPoll = await ctx.prisma.poll.findMany({
      skip: 0,
      take: 10,
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            Views: true,
          },
        },
      },
    });
    if (!allViewsbyPoll) return [];
    const sortedViews = allViewsbyPoll.sort(
      (a, b) => b._count.Views - a._count.Views,
    );
    return sortedViews;
  }),
  getTopVotedPollsByUser: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.stripeSubscriptionStatus !== "active") return null;
    const allVotesbyPoll = await ctx.prisma.poll.findMany({
      skip: 0,
      take: 10,
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            Vote: true,
          },
        },
      },
    });
    if (!allVotesbyPoll) return [];
    const sortedVotes = allVotesbyPoll.sort(
      (a, b) => b._count.Vote - a._count.Vote,
    );

    return sortedVotes;
  }),
});
