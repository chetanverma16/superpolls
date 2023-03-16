import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { Link, Share } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/trpc";
import Skeleton from "@/components/Skeleton";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import useCopyToClipboard from "@/lib/hooks/use-copy-to-clipboard";
import { useSession } from "next-auth/react";

const PollView = () => {
  const router = useRouter();
  const { id } = router.query;
  const mutation = api.polls.vote.useMutation();
  const { data: session } = useSession();
  const [value, copy] = useCopyToClipboard();

  // State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [votes, setVotes] = useLocalStorage<any>("votes", []);
  const [isVoting, setIsVoting] = useState(false);

  const handleLinkClick = () => {
    toast.success("Copied to clipboard!");
    copy(`https://polls.vercel.app/poll/${id}`);
  };

  useEffect(() => {
    if (votes.find((vote: any) => vote.poll === id)) {
      setIsVoted(true);
      setSelectedOptionId(votes.find((vote: any) => vote.poll === id).option);
    }
  }, [id, votes]);

  // Fetch poll
  const {
    data: poll,
    isLoading,
    error,
  } = api.polls.getPoll.useQuery(
    {
      id: id as string,
    },
    { enabled: !!id },
  );

  // Handle current option
  const handleCurrentOption = (id: string) => {
    if (isVoting) {
      toast.error("Voting in progress");
      return;
    }
    if (isVoted) {
      toast.error("You have already voted");
      return;
    }
    if (selectedOptionId === id) {
      setSelectedOptionId(null);
    } else {
      setSelectedOptionId(id);
    }
  };

  if (error || poll === null) {
    toast.error("poll not found");
    router.push("/");
  }

  // Handle votes
  const handleVote = () => {
    if (isVoting) {
      toast.error("Voting in progress");
    }

    if (selectedOptionId === null) {
      toast.error("Please select an option to vote");
      return;
    }
    setIsVoting(true);
    const votePromise = mutation.mutateAsync(
      {
        pollId: id as string,
        optionId: selectedOptionId,
        userId: session?.user?.id,
      },
      {
        onSuccess: () => {
          setIsVoting(false);
          setIsVoted(true);
          setVotes([...votes, { poll: id, option: selectedOptionId }]);
        },
        onError: (error) => {
          toast.error(error.message);
          setIsVoting(false);
        },
      },
    );

    toast.promise(votePromise, {
      loading: "Voting...",
      success: "Voted successfully!",
      error: "Failed to vote",
    });
  };

  // Fetch voted
  const {
    data: voted,
    isLoading: isLoadingVoted,
    error: isErrorVoted,
  } = api.polls.getAllVotes.useQuery(
    { pollId: id as string },
    { enabled: !!isVoted },
  );

  const countVotes = (optionId: string) => {
    if (isLoadingVoted || isErrorVoted) {
      return 0;
    }

    return voted?.filter((vote: any) => vote.optionId === optionId).length;
  };

  const averageVotes = (optionId: string) => {
    if (isLoadingVoted || isErrorVoted) {
      return 0;
    }

    return Math.round(
      (voted?.filter((vote: any) => vote.optionId === optionId).length /
        voted?.length) *
        100,
    );
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mt-20 w-full max-w-2xl rounded-xl bg-gray-50 p-10">
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
                className="relative flex w-full flex-col items-start rounded-xl bg-white px-3 py-4 text-left text-sm shadow-md transition-all duration-200 ease-out hover:!bg-gray-900 hover:!text-white"
                style={{
                  backgroundColor:
                    selectedOptionId === option.id ? "#000" : "#fff",
                  color: selectedOptionId === option.id ? "#fff" : "#000",
                }}
              >
                {option.title}
                {isVoted &&
                  (isLoadingVoted ? (
                    <Skeleton classes="mt-4 w-full h-10" />
                  ) : (
                    <div className="mt-4 grid w-full grid-cols-2 rounded-md bg-white p-2 text-sm text-gray-900 outline outline-1 outline-gray-200">
                      <div>
                        votes:
                        <span className="font-bold">
                          {" "}
                          {countVotes(option.id)}
                        </span>
                      </div>
                      <div>
                        average:
                        <span className="font-bold">
                          {" "}
                          {averageVotes(option.id)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </motion.button>
            ))}
          </div>
        )}
        <Button
          disabled={isVoted}
          onClick={handleVote}
          type="primary"
          classes="mt-8 w-full py-4 text-base"
        >
          {isVoted ? "Voted" : "Vote"}
        </Button>
      </div>
    </div>
  );
};

export default PollView;