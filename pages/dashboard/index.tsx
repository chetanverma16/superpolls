import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";

// Component
import Button from "@/components/Button";

// View
import AllPolls from "@/views/Dashboard/AllPolls";
import AllVotes from "@/views/Dashboard/AllVotes";

const Dashboard = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div>
      <div className="flex w-full justify-between rounded-xl border bg-white p-2 shadow-xl">
        <div className="flex items-center gap-x-6">
          <Button selected={currentTab === 0} onClick={() => setCurrentTab(0)}>
            All Polls
          </Button>
          <Button selected={currentTab === 1} onClick={() => setCurrentTab(1)}>
            All Votes
          </Button>
        </div>
        <Button
          type="primary"
          Icon={Plus}
          onClick={() => router.push("/create")}
        >
          Create Poll
        </Button>
      </div>
      <div className="mt-10 w-full">
        {currentTab === 0 && <AllPolls />}
        {currentTab === 1 && <AllVotes />}
      </div>
    </div>
  );
};

export default Dashboard;
