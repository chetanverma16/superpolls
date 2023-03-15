import React from "react";
import BadgeProps from "./badge.types";

const Badge = ({ text, backgroundColor, classnames }: BadgeProps) => {
  return (
    <div
      className={`rounded-full px-3 py-1 text-white ${
        backgroundColor ? backgroundColor : "bg-blue-500"
      } ${classnames}`}
    >
      {text}
    </div>
  );
};

export default Badge;
