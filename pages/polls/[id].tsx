import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { Link, Share } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/trpc";
import Skeleton from "@/components/Skeleton";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import cx from "classnames";

const PollView = () => {
  const router = useRouter();
  const { id } = router.query;

  // State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleLinkClick = () => {
    toast.success("Copied to clipboard!");
  };

  const { data: poll, isLoading } = api.polls.getPoll.useQuery(
    {
      id: id as string,
    },
    { enabled: !!id },
  );

  const handleCurrentOption = (id: string) => {
    if (selectedOptionId === id) {
      setSelectedOptionId(null);
    } else {
      setSelectedOptionId(id);
    }
  };

  const handleVote = () => {
    // TODO: Add voting functionality
    // if (poll) {
    //   if (selectedOption === null) {
    //     toast.error("Please select an option to vote");
    //     return;
    //   }
    //   mutation.mutate({
    //     pollId: id as string,
    //     vote: poll.options[selectedOption],
    //   });
    //   setIsVoted(true);
    // } else {
    //   toast.error("Something went wrong, please try again later");
    // }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-16 w-full rounded-xl bg-gray-50 p-10">
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="w-4/5 text-2xl font-semibold">{poll?.title}</h1>
            <div className="flex items-center">
              <Button onClick={handleLinkClick}>
                <Link />
              </Button>
              <Button>
                <Share />
              </Button>
            </div>
          </div>
        )}
        {isLoading ? (
          <Skeleton classes="mt-10 h-64" />
        ) : (
          <div className="mt-10 flex flex-col items-center gap-y-6">
            {poll?.options.map((option) => (
              <motion.button
                key={option.id}
                onTap={() => handleCurrentOption(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex w-full items-center rounded-xl bg-white px-3 py-4 text-left shadow-md transition-all duration-200 ease-out hover:!bg-gray-900 hover:!text-white"
                style={{
                  backgroundColor:
                    selectedOptionId === option.id ? "#000" : "#fff",
                  color: selectedOptionId === option.id ? "#fff" : "#000",
                }}
              >
                {option.title}
              </motion.button>
            ))}
          </div>
        )}
        <Button
          // disabled={isVoted}
          onClick={handleVote}
          type="primary"
          classes="mt-10 w-full px-4 py-4 text-xl"
        >
          Vote
          {/* {isVoted ? "Voted" : "Vote"} */}
        </Button>
      </div>
    </div>
  );
};

export default PollView;
