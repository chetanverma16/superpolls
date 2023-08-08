import { StripeSubscriptionStatus } from "@prisma/client";

export default interface PollCardProps {
  id: string;
  title: string;
  options?: number;
  votes: number;
  voted?: string;
  isVotedScreen?: boolean;
  handleDelete?: (id: string) => void;
  isPro?: StripeSubscriptionStatus | null;
  isLive?: boolean;
  isPublic?: boolean;
  isAuthenticated?: boolean;

  refetch?: () => void;
}
