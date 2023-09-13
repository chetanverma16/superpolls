// components/mdx/H2.tsx

import React from "react";

export default function P({ children }: { children?: React.ReactNode }) {
  return <h2 className="text-lg">{children}</h2>;
}
