import {
  CheckCircle,
  ExternalLink,
  InfoIcon,
  Link,
  Link2,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Badge from "../Badge";
import Button from "../Button";
import { motion } from "framer-motion";
import PollCardProps from "./pollcard.types";
import { useRouter } from "next/router";
import Toggle from "../Toggle";
import { api } from "@/lib/trpc";
import toast from "react-hot-toast";
import Tooltip from "@/components/Tooltip";
import useCopyToClipboard from "@/lib/hooks/use-copy-to-clipboard";

const PollCard = ({
  id,
  title,
  options,
  votes,
  voted,
  isVotedScreen,
  handleDelete,
  isPro,
  isLive,
  isPublic,
  refetch,
}: PollCardProps) => {
  const router = useRouter();
  const [value, copy] = useCopyToClipboard();

  const [isPublicState, setIsPublicState] = useState(isPublic);
  const [isLiveState, setIsLiveState] = useState(isLive);
  const [disableCheck, setDisableCheck] = useState(false);

  const updatePollMutation = api.polls.updatePoll.useMutation();

  const deletePoll = (e: any, id: string) => {
    e.stopPropagation();
    if (handleDelete) {
      handleDelete(id);
    }
  };

  const handleLinkClick = () => {
    toast.success("Copied to clipboard!");
    copy(`https://polls.vercel.app/poll/${id}`);
  };

  useEffect(() => {
    if (isPublicState !== isPublic || isLiveState !== isLive) {
      setDisableCheck(true);
      const updatePollPromise = updatePollMutation.mutateAsync(
        {
          id,
          isPublic: isPublicState,
          isLive: isLiveState,
        },
        {
          onSuccess: () => {
            refetch && refetch();
            setDisableCheck(false);
          },
        },
      );

      toast.promise(updatePollPromise, {
        loading: "Updating poll...",
        success: "Poll updated",
        error: "Failed to update poll",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicState, isLiveState]);

  return (
    <motion.div className="flex cursor-pointer flex-col items-start justify-between gap-y-4 rounded-xl border border-transparent bg-gray-50 p-6 hover:border-gray-200 lg:flex-row">
      <div className={isVotedScreen ? "w-full" : "w-4/6"}>
        <h1 className="text-base font-semibold text-gray-900 lg:text-lg">
          {title}
        </h1>
        <div className="mt-2 flex items-center gap-x-2">
          {votes > 0 && (
            <Badge text={`${votes} votes`} backgroundColor="bg-gray-900" />
          )}
          {options && <Badge text={`${options} Options`} />}
        </div>
        {voted && (
          <div className="mt-4 flex w-full items-center gap-x-2 rounded-xl bg-gray-200 px-4 py-2 text-gray-800">
            <CheckCircle className="h-6" />
            <div>
              You voted for <span className="font-bold">{voted}</span>
            </div>
          </div>
        )}
        {!voted && isPro && (
          <div className="mt-6 flex items-center gap-x-2">
            <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-md">
              <Toggle
                checked={isPublicState}
                onChange={setIsPublicState}
                disabled={disableCheck}
              />{" "}
              <span className="ml-2">Results Public</span>
            </div>
            <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-md">
              <Toggle
                checked={isLiveState}
                onChange={setIsLiveState}
                disabled={disableCheck}
              />

              <span className="ml-2">Live </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => router.push(`/poll/${id}`)}
          Icon={ExternalLink}
          classes="bg-blue-500 text-white hover:!bg-blue-600"
        />
        <Tooltip content="Copy Link">
          <Button
            onClick={handleLinkClick}
            Icon={Link2}
            classes="bg-green-500 text-white hover:!bg-green-600"
          />
        </Tooltip>

        {!isVotedScreen && (
          <Button
            onClick={(e) => deletePoll(e, id)}
            Icon={Trash}
            classes="bg-red-500 text-white hover:bg-red-600"
          />
        )}
      </div>
    </motion.div>
  );
};

export default PollCard;
