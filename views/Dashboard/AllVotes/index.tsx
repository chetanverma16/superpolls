import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { PlusIcon } from "lucide-react";

// Components
import { Title } from "@tremor/react";
import PollCard from "@/components/PollCard";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const AllPolls = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [page, setPage] = useState(1);

  // Fetch Featured Polls
  const {
    data: userPolls,
    isLoading,
    error,
  } = api.polls.getUserVotes.useQuery(
    { userId: session?.user.id, page },
    { enabled: !!session },
  );

  if (error) {
    toast.error(`Something went wrong, Error: ${error.message}`);
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="flex w-full items-center justify-between">
        <Title>All Polls</Title>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-x-4 gap-y-4">
        {isLoading ? (
          <>
            <Skeleton classes="h-24 p-10" />
            <Skeleton classes="h-24 p-10" />
          </>
        ) : userPolls?.items.length === 0 ? (
          <EmptyState
            title="No Votes Yet"
            description="Sorry, there are no votes available at the moment. Please create a new poll to get started."
          >
            <Button
              Icon={PlusIcon}
              onClick={() => router.push("/create")}
              type="primary"
            >
              Create Poll
            </Button>
          </EmptyState>
        ) : (
          userPolls && (
            <div className="flex flex-col gap-y-4">
              {userPolls.items.map(({ id, poll, option }) => (
                <PollCard
                  key={id}
                  id={poll.id}
                  title={poll.title}
                  options={poll._count.options}
                  votes={poll._count.Vote}
                  voted={option.title}
                  isVotedScreen={true}
                />
              ))}
              <div className="flex items-center gap-x-2">
                <Button
                  type="secondary"
                  classes="w-full"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Back
                </Button>

                <Button
                  type="secondary"
                  classes="w-full"
                  disabled={page >= userPolls.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllPolls;
