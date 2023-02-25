import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pollsRouter = createTRPCRouter({
  createPoll: publicProcedure
    .input(
      z.object({
        name: z.string(),
        pollOptions: z.array(z.string()),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.pollOptions.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Poll must have at least 2 options",
        });
      }
      return ctx.prisma.poll.create({
        data: {
          title: input.name,
          pollOptions: input.pollOptions,
        },
      });
    }),
});
