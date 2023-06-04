// nextauth.d.ts
import type { StripeSubscriptionStatus } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    stripeSubscriptionStatus?: StripeSubscriptionStatus;
  }
  interface Session {
    user: {
      id: string;
      stripeSubscriptionStatus?: StripeSubscriptionStatus;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    stripeSubscriptionStatus?: StripeSubscriptionStatus;
  }
}
