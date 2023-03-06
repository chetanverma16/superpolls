import { Edit, Trash } from "lucide-react";
import React from "react";
import Badge from "../Badge";
import Button from "../Button";
import { motion } from "framer-motion";

const PollCard = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99, transition: { duration: 0.2 } }}
      className="flex cursor-pointer items-start justify-between rounded-xl border border-transparent bg-gray-50 p-6 hover:border-gray-200"
    >
      <div className="w-4/6">
        <h1 className="text-lg text-gray-900">
          What are your thoughts on the impact of social media on mental health
          and wellbeing?
        </h1>
        <div className="mt-2 flex items-center gap-x-2">
          <Badge text="10 Votes" backgroundColor="bg-gray-900" />
          <Badge text="4 Options" />
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Button Icon={Edit}>Edit</Button>
        <Button Icon={Trash} classes="bg-red-400 text-white hover:bg-red-500">
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default PollCard;
