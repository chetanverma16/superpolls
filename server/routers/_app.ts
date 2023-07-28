import { pollsRouter } from "./polls";
import { createTRPCRouter } from "../trpc";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";
import { aiRouter } from "./ai";
import { analyticsRouter } from "./analytics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  polls: pollsRouter,
  stripe: stripeRouter,
  user: userRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
