import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { PlusIcon } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

// Component
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import PollCard from "@/components/PollCard";
import Skeleton from "@/components/Skeleton";
import { Title } from "@tremor/react";

const AllPolls = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // Mutation
  const removePollMutation = api.polls.removePoll.useMutation();

  // Query
  const {
    data: userPolls,
    isLoading,
    error,
    refetch,
  } = api.polls.getUserPolls.useQuery(
    { userId: session?.user.id, page, search: debouncedSearch },
    { enabled: !!session },
  );

  // Delete Poll
  const handleDelete = (id: string) => {
    const removePollPromise = removePollMutation.mutateAsync(
      { id },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
    toast.promise(removePollPromise, {
      loading: "Removing Poll...",
      success: "Poll removed successfully!",
      error: "Something went wrong",
    });
  };

  if (error) {
    toast.error(`Something went wrong, Error: ${error.message}`);
  }

  // Effect
  useEffect(() => {
    if (debouncedSearch.length > 0) {
      refetch();
    }
  }, [debouncedSearch]);

  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="flex w-full items-center justify-between">
        <Title>All Polls</Title>
        <input
          className="h-full w-96 rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search Polls"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-x-4 gap-y-4">
        {isLoading ? (
          <>
            <Skeleton classes="h-24 p-10" />
            <Skeleton classes="h-24 p-10" />
          </>
        ) : userPolls?.items.length === 0 ? (
          <EmptyState
            title="No poll found"
            description="Sorry, there are no polls available at the moment. Please create a new poll to get started."
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
              {userPolls.items.map(
                ({
                  id,
                  title,
                  _count,
                  isPublic,
                  isLive,
                  isAuthenticated,
                }: any) => (
                  <PollCard
                    id={id}
                    key={id}
                    title={title}
                    votes={_count.Vote}
                    options={_count.options}
                    isPublic={isPublic}
                    isLive={isLive}
                    isAuthenticated={isAuthenticated}
                    handleDelete={handleDelete}
                    refetch={refetch}
                  />
                ),
              )}
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
      <div className="py-10"></div>
    </div>
  );
};

export default AllPolls;
