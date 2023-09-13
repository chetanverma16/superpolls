import React from "react";

const BlockQuote = ({ children }: { children?: React.ReactNode }) => {
  return (
    <blockquote className="w-full rounded-md bg-gray-100 px-4 py-2">
      {children}
    </blockquote>
  );
};

export default BlockQuote;
