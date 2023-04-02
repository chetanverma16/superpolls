import LayoutProps from "./layout";
import React from "react";
import Header from "../Header";
import { useRouter } from "next/router";
import { api } from "@/lib/trpc";

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { data: isPro } = api.user.subscriptionStatus.useQuery();

  return (
    <div className="mx-auto max-w-5xl p-6">
      {router.pathname === "/embed/[id]" ? null : <Header isPro={isPro} />}
      <div className={router.pathname !== "/embed/[id]" ? "mt-10" : ""}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
