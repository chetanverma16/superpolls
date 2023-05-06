import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const userRouter = createTRPCRouter({
  subscriptionStatus: publicProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session) {
      return {
        status: "free",
      };
    }

    if (!session.user?.id) {
      throw new Error("Not authenticated");
    }

    const data = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return {
      status: data.stripeSubscriptionStatus,
    };
  }),
});
