import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/lib/utils";
import { useRouter } from "next/router";

// Components
import Button from "@/components/Button";
import Head from "next/head";

export default function SignIn({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const router = useRouter();
  // States
  const [email, setEmail] = useState("");

  const handleEmailSignIn = () => {
    if (validateEmail(email)) {
      signIn("email", { email });
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  const handleTwitterSignIn = () => {
    signIn("twitter");
  };

  useEffect(() => {
    if (router.query.q === "gopro") {
      toast.error("Please sign in to continue");
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Superpoll - Sign in</title>
        <meta name="title" content="Superpoll - Sign in" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://superpoll.app/" />
        <meta property="og:title" content="Superpoll - Sign in" />
        <meta property="og:image" content="/og.webp" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://superpoll.app/" />
        <meta property="twitter:title" content="Superpoll - Sign in" />
        <meta property="twitter:image" content="/og.webp" />
      </Head>
      <div className="mt-32 flex w-full flex-col items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
        <div className="mt-10 flex w-full max-w-md flex-col items-center gap-y-4 rounded-xl bg-gray-50 p-10 shadow-sm">
          <div className="w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="w-full rounded-xl border px-4 py-2 outline-none"
            />
            <Button
              classes="text-center justify-center w-full mt-2"
              type="primary"
              onClick={handleEmailSignIn}
            >
              Continue With Email
            </Button>
          </div>
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex w-full items-center justify-center">
              <hr className="w-full bg-gray-200" style={{ height: "2px" }} />
              <h3 className="px-4 text-gray-400">or</h3>
              <hr className="w-full bg-gray-200" style={{ height: "2px" }} />
            </div>
            <div className="flex flex-col items-center gap-y-4">
              <Button
                classes="w-full justify-center border border-gray-200 shadow-sm bg-white"
                onClick={handleGoogleSignIn}
              >
                Continue With Google
              </Button>
              <Button
                classes="w-full justify-center border border-gray-200 shadow-sm bg-white"
                onClick={handleTwitterSignIn}
              >
                Continue With Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
