import React from "react";
import EmptyStateProps from "./emptystate.types";

const EmptyState = ({ title, description, children }: EmptyStateProps) => {
  return (
    <div className="flex h-60 w-full flex-col items-center justify-center gap-y-4 rounded-2xl border-2 border-dashed text-center">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && (
          <p className="text-base text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default EmptyState;
