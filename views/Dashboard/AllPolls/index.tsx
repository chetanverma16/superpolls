import React from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import PollCard from "@/components/PollCard";
import Skeleton from "@/components/Skeleton";
import toast from "react-hot-toast";

const AllPolls = () => {
  const { data: session } = useSession();

  // Fetch Featured Polls
  const {
    data: userPolls,
    isLoading,
    error,
  } = api.polls.getUserPolls.useQuery(
    { userId: session?.user.id },
    { enabled: !!session },
  );

  if (error) {
    toast.error(`Something went wrong, Error: ${error.message}`);
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">All Polls</h2>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-x-4 gap-y-4">
        {isLoading ? (
          <>
            <Skeleton classes="h-24 p-10" />
            <Skeleton classes="h-24 p-10" />
          </>
        ) : (
          userPolls?.map(({ id, title, _count }: any) => (
            <PollCard
              id={id}
              key={id}
              title={title}
              votes={_count.Vote}
              options={_count.options}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllPolls;
