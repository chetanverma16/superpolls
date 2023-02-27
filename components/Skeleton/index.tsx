import React from "react";
import SkeletonProps from "./skeleton";

const Skeleton = ({ classes }: SkeletonProps) => {
  return (
    <div
      className={`h-10 w-full animate-pulse rounded-xl bg-gray-200 ${classes}`}
    ></div>
  );
};

export default Skeleton;
