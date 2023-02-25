import React from "react";
import { useRouter } from "next/router";

const PollView = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>PollView Id:{id}</div>;
};

export default PollView;
