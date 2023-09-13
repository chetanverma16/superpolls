// components/mdx/P.tsx

import React from "react";

export default function P({ children }: { children?: React.ReactNode }) {
  return <p className="text-gray-600">{children}</p>;
}
