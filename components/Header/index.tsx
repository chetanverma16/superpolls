import Link from "next/link";
import React from "react";
import Button from "components/Button";
import HeaderProps from "./header";
import { CreditCard, Home, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Avatar from "../Avatar";
import Dropdown from "../Dropdown";
import { useRouter } from "next/router";
import { api } from "@/lib/trpc";
import toast from "react-hot-toast";
import Badge from "../Badge";
import LinkButton from "../LinkButton";
import { useAtom } from "jotai";
import { isProAtom } from "atoms";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isPro, setIsPro] = useAtom(isProAtom);

  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();

  // Fetch Featured Polls

  const BillingSession = async () => {
    // @ts-ignore : ts doesn't like the fact that we're using a mutation hook as a query hook
    const { billingPortalUrl } = await createBillingPortalSession();
    if (!billingPortalUrl) toast.error("Something went wrong");
    router.push(billingPortalUrl);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <Link
        href="/"
        className="flex items-center text-base font-bold lg:text-xl"
      >
        Superpolls {isPro && <Badge text="pro" classnames="ml-2 text-xs" />}
      </Link>
      <nav className="flex items-center gap-x-4">
        {!session?.user && (
          <LinkButton href="/pro" Icon={CreditCard}>
            Go Pro
          </LinkButton>
        )}

        {session?.user ? (
          <>
            <LinkButton href="/dashboard" Icon={Home}>
              Dashboard
            </LinkButton>

            {!isPro && (
              <LinkButton
                href="/pro"
                classes="hidden lg:block"
                Icon={CreditCard}
              >
                Go Pro
              </LinkButton>
            )}

            <Dropdown
              items={
                !isPro
                  ? [
                      {
                        title: "Billing",
                        onClick: () => BillingSession(),
                      },
                      {
                        title: "Go Pro",
                        onClick: () => router.push("/pro"),
                      },
                      { title: "Sign out", onClick: () => signOut() },
                    ]
                  : [
                      {
                        title: "Billing",
                        onClick: () => BillingSession(),
                      },
                      { title: "Sign out", onClick: () => signOut() },
                    ]
              }
              Trigger={
                <Avatar
                  email={session.user?.email || ""}
                  name={session.user?.name}
                  src={session.user?.image}
                />
              }
            />
          </>
        ) : (
          <LinkButton href="/signin" type="primary" Icon={User}>
            Sign in
          </LinkButton>
        )}
      </nav>
    </div>
  );
};

export default React.memo(Header);
