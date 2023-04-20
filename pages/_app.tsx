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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [, setIsPro] = useAtom(isProAtom);
  const { data: pro } = api.user.subscriptionStatus.useQuery();

  if (pro && pro === "active") {
    setIsPro(true);
  }

  return (
    <SessionProvider session={session}>
      <RWBProvider>
        <div className={cx(inter.variable)}>
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        </div>
      </RWBProvider>
      <Analytics />
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
