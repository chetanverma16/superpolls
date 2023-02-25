import React from "react";
import ButtonProps from "./button";
import { motion } from "framer-motion";

const Button = ({
  type,
  children,
  onClick,
  classes,
  Icon,
  iconPosition,
}: ButtonProps) => {
  if (type === "primary") {
    return (
      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          duration: 0.05,
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        className={`inline-flex w-fit items-center rounded-lg bg-black px-3 py-2 text-base text-white transition-all duration-300 ease-in-out hover:bg-gray-900 ${classes}`}
      >
        {Icon && <Icon size={20} className="mr-2" />}
        {children}
      </motion.button>
    );
  }

  if (type === "secondary") {
    return (
      <button
        onClick={onClick}
        className={`inline-flex w-fit items-center rounded-lg bg-gray-100 px-3 py-2 text-base text-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-200 active:bg-gray-300 ${classes}`}
      >
        {Icon && <Icon size={20} className="mr-2" />}
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex w-fit items-center rounded-lg px-3 py-2 text-base transition-all duration-300 ease-in-out hover:bg-gray-100 active:bg-gray-200 ${classes}`}
    >
      {Icon && <Icon size={20} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;