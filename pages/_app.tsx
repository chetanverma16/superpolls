import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import { Inter } from "@next/font/google";
import Layout from "@/components/Layout";
import { api } from "@/lib/trpc";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <RWBProvider>
        <div className={cx(inter.variable, "mx-auto max-w-5xl p-6")}>
          <Layout>
            <Toaster />
            <Header />
            <Component {...pageProps} />
          </Layout>
        </div>
      </RWBProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
