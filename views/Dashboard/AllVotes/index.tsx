import React from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import PollCard from "@/components/PollCard";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { Filter } from "lucide-react";
import Skeleton from "@/components/Skeleton";
import toast from "react-hot-toast";

const AllPolls = () => {
  const { data: session } = useSession();

  // Fetch Featured Polls
  const {
    data: userPolls,
    isLoading,
    error,
  } = api.polls.getUserVotes.useQuery(
    { userId: session?.user.id },
    { enabled: !!session },
  );

  if (error) {
    toast.error(`Something went wrong, Error: ${error.message}`);
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">All Votes</h2>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-x-4 gap-y-4">
        {isLoading ? (
          <>
            <Skeleton classes="h-24 p-10" />
            <Skeleton classes="h-24 p-10" />
          </>
        ) : (
          userPolls?.map(({ id, poll, option }) => (
            <PollCard
              key={id}
              id={poll.id}
              title={poll.title}
              options={poll._count.options}
              votes={poll._count.Vote}
              voted={option.title}
              isVotedScreen={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllPolls;
