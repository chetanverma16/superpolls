import LayoutProps from "./layout";
import React from "react";
import Header from "../Header";
import { useRouter } from "next/router";

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-5xl p-6">
      {router.pathname === "/embed/[id]" ? null : <Header />}
      <div className={router.pathname !== "/embed/[id]" ? "mt-10" : ""}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
