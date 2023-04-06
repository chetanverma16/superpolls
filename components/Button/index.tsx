import React from "react";
import ButtonProps from "./button";
import { motion } from "framer-motion";

const Button = ({
  type,
  children,
  onClick,
  classes,
  Icon,
  disabled,
  selected,
}: ButtonProps) => {
  if (type === "primary") {
    return (
      <motion.button
        disabled={disabled}
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          duration: 0.05,
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        className={`inline-flex w-fit items-center justify-center rounded-lg bg-black px-3 py-2 text-xs text-white transition-all duration-300 ease-in-out hover:bg-gray-900 lg:text-base ${classes} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {Icon && <Icon size={20} className={`${children && "mr-2"}`} />}
        {children && children}
      </motion.button>
    );
  }

  if (type === "secondary") {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex w-fit items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-200 active:bg-gray-300 lg:text-base ${classes} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {Icon && <Icon size={20} className={`${children && "mr-2"}`} />}
        {children && children}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex w-fit items-center justify-center rounded-lg px-3 py-2 text-xs transition-all duration-300 ease-in-out hover:bg-gray-100 active:bg-gray-200 lg:text-base ${classes} disabled:cursor-not-allowed disabled:opacity-50 ${
        selected === true && "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {Icon && <Icon size={20} className={`${children && "mr-2"}`} />}
      {children && children}
    </button>
  );
};

export default Button;
