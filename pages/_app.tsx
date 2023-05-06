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
import { useAtom } from "jotai";
import { isProAtom } from "atoms";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { useEffect } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [, setIsPro] = useAtom(isProAtom);
  const { data: pro, isLoading } = api.user.subscriptionStatus.useQuery();

  useEffect(() => {
    if (pro) {
      if (pro.status === "active") {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    }
  }, [pro, setIsPro]);

  return (
    <SessionProvider session={session}>
      <Analytics />
      <RWBProvider>
        {isLoading ? (
          <div className="mx-auto flex h-screen w-screen max-w-5xl items-center justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className={cx(inter.variable, "mx-auto max-w-5xl p-6")}>
            <Layout>
              <Toaster />
              <Header />
              <Component {...pageProps} />
            </Layout>
          </div>
        )}
      </RWBProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
