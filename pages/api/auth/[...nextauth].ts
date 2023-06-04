import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "lib/prisma";
import type { NextAuthOptions } from "next-auth";

// Providers
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";

// Import CustomsendVerificationRequest
import { CustomsendVerificationRequest } from "./signinemail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({ identifier, url, provider }) {
        CustomsendVerificationRequest({
          identifier,
          url,
          provider,
          theme: "light",
        });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.stripeSubscriptionStatus = user.stripeSubscriptionStatus;
      }
      return token;
    },

    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.stripeSubscriptionStatus = token.stripeSubscriptionStatus;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
