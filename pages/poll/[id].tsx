import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import Link from "next/link";
import { LinkIcon, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/trpc";
import Skeleton from "@/components/Skeleton";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import useCopyToClipboard from "@/lib/hooks/use-copy-to-clipboard";
import { useSession } from "next-auth/react";
import Badge from "@/components/Badge";
import classNames from "classnames";
import CustomDialog from "@/components/Dialog";
import QRCode from "react-qr-code";

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
  const [showQR, setShowQR] = useState(false);

  const handleLinkClick = () => {
    toast.success("Copied to clipboard!");
    copy(`https://polls.vercel.app/poll/${id}`);
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr") as any;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
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
          refetchVoted();
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
    refetch: refetchVoted,
  } = api.polls.getAllVotes.useQuery({ pollId: id as string });

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

    const value = Math.round(
      (voted?.filter((vote: any) => vote.optionId === optionId).length /
        voted?.length) *
        100,
    );
    if (isNaN(value)) {
      return 0;
    }
    return value;
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mt-20 w-full max-w-2xl rounded-xl bg-gray-50 p-10">
          <Skeleton classes="w-4/5 text-2xl font-semibold" />
          <Skeleton classes="mt-10 h-64" />
        </div>
      </div>
    );
  }

  if (!isLoading) {
    if (session?.user?.id === poll?.userId) {
      return (
        <div className="flex w-full flex-col items-center justify-center">
          <CustomDialog isOpen={showQR} setIsOpen={setShowQR}>
            <div className="flex flex-col items-center gap-y-10 p-2">
              <QRCode
                id="qr"
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`https://superpolls.io/poll/${id}`}
                viewBox={`0 0 256 256`}
              />
              <div className="flex w-full flex-col gap-y-2">
                <Button classes="w-full" type="primary" onClick={downloadQR}>
                  Download
                </Button>
                <Button
                  classes="w-full"
                  type="secondary"
                  onClick={() => setShowQR(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CustomDialog>
          <div
            className={classNames(
              "mt-20 w-full max-w-2xl rounded-xl bg-gray-50 p-10",
            )}
          >
            <div className="flex items-center justify-between">
              <h1
                className={classNames(
                  "w-4/5 text-2xl font-semibold text-gray-900",
                )}
              >
                {poll?.title}
              </h1>
              <div className="flex items-center gap-x-2">
                <Button onClick={handleLinkClick}>
                  <LinkIcon />
                </Button>
                <Button onClick={() => setShowQR(true)}>
                  <QrCode />
                </Button>
              </div>
            </div>

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
                  <div className="mt-4 grid w-full grid-cols-2 rounded-md bg-white p-2 text-sm text-gray-900 outline outline-1 outline-gray-200">
                    <div>
                      votes:
                      <span className="font-bold">{countVotes(option.id)}</span>
                    </div>
                    <div>
                      average:
                      <span className="font-bold">
                        {averageVotes(option.id)}%
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
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
    } else {
      if (poll?.isLive) {
        return (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mt-20 w-full max-w-2xl rounded-xl bg-gray-50 p-10">
              <div className="flex items-center justify-between">
                <h1 className="w-4/5 text-2xl font-semibold">{poll?.title}</h1>
                <div className="flex items-center">
                  <Button onClick={handleLinkClick}>
                    <LinkIcon />
                  </Button>
                </div>
              </div>

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
                    {poll.isPublic &&
                      isVoted &&
                      (isLoadingVoted ? (
                        <Skeleton classes="mt-4 w-full h-10" />
                      ) : (
                        <div className="mt-4 grid w-full grid-cols-2 rounded-md bg-white p-2 text-sm text-gray-900 outline outline-1 outline-gray-200">
                          <div>
                            votes:
                            <span className="font-bold">
                              {countVotes(option.id)}
                            </span>
                          </div>
                          <div>
                            average:
                            <span className="font-bold">
                              {averageVotes(option.id)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </motion.button>
                ))}
              </div>
              <div className="text-center">
                <Button
                  disabled={isVoted}
                  onClick={handleVote}
                  type="primary"
                  classes="mt-8 w-full py-4 text-base"
                >
                  {isVoted ? "Voted" : "Vote"}
                </Button>
                <div className="mt-4 w-full text-center text-xs">
                  <Link
                    href="/create"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Create your own for free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mt-20 flex w-full max-w-2xl flex-col items-center rounded-xl bg-gray-50 p-10 text-center">
              <h1 className="text-2xl font-semibold">{poll?.title}</h1>
              <Badge
                classnames="mt-2 w-32 bg-red-100 !text-red-600"
                text="Not Live"
              />
            </div>
          </div>
        );
      }
    }
  }
};

export default PollView;
