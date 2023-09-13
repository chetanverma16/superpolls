// components/mdx/H1.tsx

import React from "react";

export default function H1({ children }: { children?: React.ReactNode }) {
  return <h1 className="text-2xl">{children}</h1>;
}
