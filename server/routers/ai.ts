import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
const { Configuration, OpenAIApi } = require("openai");

export const aiRouter = createTRPCRouter({
  generatePollOptions: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(config);
      if (!ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      if (config.apiKey === undefined)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `generate poll options for: ${input}, no numbers and separated by a new line`,
        temperature: 0.4,
        n: 1,
      });

      return response.data;
    }),
});
