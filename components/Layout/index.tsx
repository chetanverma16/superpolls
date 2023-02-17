import LayoutProps from "./layout";
import React from "react";
import Header from "../Header";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Header />
      <div className="mt-10">{children}</div>
    </div>
  );
};

export default Layout;
