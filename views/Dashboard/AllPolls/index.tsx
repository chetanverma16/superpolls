import React from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import PollCard from "@/components/PollCard";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { Filter } from "lucide-react";

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

  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">All Polls</h2>
        <Dropdown
          Trigger={<Button Icon={Filter}>Filter</Button>}
          items={[
            { title: "Most Voted", onClick: () => console.log("filter") },
            { title: "Most Options", onClick: () => console.log("filter") },
          ]}
        ></Dropdown>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-x-4 gap-y-4">
        <PollCard />
        <PollCard />
        <PollCard />
        <PollCard />
      </div>
    </div>
  );
};

export default AllPolls;
