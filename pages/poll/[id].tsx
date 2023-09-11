import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Activity, LinkIcon, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/trpc";
import { useSession } from "next-auth/react";
import QRCode from "react-qr-code";

// Hooks
import useLocalStorage from "@/lib/hooks/use-local-storage";
import useCopyToClipboard from "@/lib/hooks/use-copy-to-clipboard";

// Component
import Skeleton from "@/components/Skeleton";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { AreaChart } from "@tremor/react";
import Spinner from "@/components/Spinner";
import Head from "next/head";

const PollView = () => {
  // Router
  const router = useRouter();
  const { id } = router.query;

  // Hooks
  const { data: session } = useSession();
  const [value, copy] = useCopyToClipboard();

  // State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [votes, setVotes] = useLocalStorage<any>("votes", []);
  const [isVoting, setIsVoting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Mutation
  const mutation = api.polls.vote.useMutation();
  const { mutateAsync: increaseViewCount } =
    api.analytics.increaseViewCount.useMutation();

  useEffect(() => {
    if (votes.find((vote: any) => vote.poll === id)) {
      setIsVoted(true);
      setSelectedOptionId(votes.find((vote: any) => vote.poll === id).option);
    }
  }, [id, votes]);

  useEffect(() => {
    if (id) {
      increaseViewCount({ id: id as string, userId: session?.user?.id });
    }
  }, [id, session?.user?.id]);

  // Handle link click
  const handleLinkClick = () => {
    toast.success("Copied to clipboard!");
    copy(`https://superpoll.app/poll/${id}`);
  };

  // Download QR
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

  // getAnalytics
  const { data: analytics, isLoading: analyticsLoading } =
    api.analytics.getAnalyticsById.useQuery(
      {
        id: id as string,
      },
      {
        enabled: showAnalytics,
      },
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
        onError: () => {
          setIsVoting(false);
        },
      },
    );

    toast.promise(votePromise, {
      loading: "Voting...",
      success: "Voted successfully!",
      error: (err) => {
        return err.message;
      },
    });
  };

  // Fetch voted
  const {
    data: voted,
    isLoading: isLoadingVoted,
    error: isErrorVoted,
    refetch: refetchVoted,
  } = api.polls.getAllVotes.useQuery(
    { pollId: id as string },
    {
      enabled: isVoted || session?.user?.id === poll?.userId,
    },
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
    if (poll?.isLive) {
      return (
        <>
          <Head>
            <title>{poll?.title} | Superpoll</title>
            <meta name="title" content={poll?.title} />
            <meta name="description" content={poll?.title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://superpoll.app/" />
            <meta property="og:title" content={poll?.title} />
            <meta property="og:image" content="/og.webp" />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://superpoll.app/" />
            <meta property="twitter:title" content={poll?.title} />
            <meta property="twitter:image" content="/og.webp" />
          </Head>
          <div className="flex w-full flex-col items-center justify-center">
            {/* QR */}
            <Modal showModal={showQR} setShowModal={setShowQR}>
              <div className="flex h-96 flex-col items-center gap-y-10 p-2">
                <QRCode
                  id="qr"
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={`https://superpoll.app/poll/${id}`}
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
            </Modal>

            {/* Analytics Modal */}
            <Modal showModal={showAnalytics} setShowModal={setShowAnalytics}>
              <div
                tabIndex={0}
                className="flex w-full items-center justify-center"
              >
                {analyticsLoading ? (
                  <Spinner />
                ) : (
                  <AreaChart
                    className="h-96"
                    data={analytics ? analytics : []}
                    index="date"
                    categories={["views", "votes"]}
                    colors={["indigo", "cyan"]}
                  />
                )}
              </div>
            </Modal>
            <div className="mt-20 w-full max-w-2xl rounded-xl bg-gray-50 p-10">
              <div className="flex items-center justify-between">
                <h1 className="w-4/5 text-2xl font-semibold">{poll?.title}</h1>
                <div className="flex items-center">
                  <Button onClick={handleLinkClick}>
                    <LinkIcon />
                  </Button>

                  {session?.user?.id === poll?.userId && (
                    <Button onClick={() => setShowQR(true)}>
                      <QrCode />
                    </Button>
                  )}
                  {session?.user?.id === poll?.userId && (
                    <Button onClick={() => setShowAnalytics(true)}>
                      <Activity />
                    </Button>
                  )}
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
                      (isVoted || session?.user.id === poll.userId) &&
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
        </>
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
  // }
};

export default PollView;
