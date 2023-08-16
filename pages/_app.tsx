import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import { Inter } from "@next/font/google";
import Layout from "@/components/Layout";
import { api } from "@/lib/trpc";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  useEffect(() => {
    Crisp.configure("a5b4004f-6647-4ad9-afd4-4f133e9238a7");
  }, []);

  return (
    <SessionProvider session={session}>
      <Analytics />
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
