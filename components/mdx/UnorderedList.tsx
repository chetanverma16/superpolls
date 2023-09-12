import React from "react";

const UnorderedList = ({ children }: { children?: React.ReactNode }) => {
  return <ul className="list-inside list-disc">{children}</ul>;
};

export default UnorderedList;
