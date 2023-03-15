import { Check, CheckCircle, Edit, Trash } from "lucide-react";
import React from "react";
import Badge from "../Badge";
import Button from "../Button";
import { motion } from "framer-motion";
import PollCardProps from "./pollcard.types";
import { useRouter } from "next/router";

const PollCard = ({
  id,
  title,
  options,
  votes,
  voted,
  isVotedScreen,
}: PollCardProps) => {
  const router = useRouter();
  return (
    <motion.div
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99, transition: { duration: 0.2 } }}
      onTap={() => router.push(`/poll/${id}`)}
      className="flex cursor-pointer items-start justify-between rounded-xl border border-transparent bg-gray-50 p-6 hover:border-gray-200"
    >
      <div className={isVotedScreen ? "w-full" : "w-4/6"}>
        <h1 className="text-lg text-gray-900">{title}</h1>
        <div className="mt-2 flex items-center gap-x-2">
          {votes && (
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
      </div>
      {!isVotedScreen && (
        <div className="flex items-center gap-x-2">
          <Button
            Icon={Trash}
            classes="bg-red-400 text-white hover:bg-red-500"
          />
        </div>
      )}
    </motion.div>
  );
};

export default PollCard;
