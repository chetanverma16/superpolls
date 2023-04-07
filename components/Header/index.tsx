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

const Header = ({ isPro }: HeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();

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
        Superpolls{" "}
        {isPro && isPro === "active" && (
          <Badge text="pro" classnames="ml-2 text-xs" />
        )}
      </Link>
      <nav className="flex items-center gap-x-4">
        {!session?.user && (
          <Link href="/pro">
            <Button Icon={CreditCard}>Go Pro</Button>
          </Link>
        )}

        {session?.user ? (
          <>
            <Link href="/dashboard">
              <Button Icon={Home}>Dashboard</Button>
            </Link>

            {isPro !== "active" && (
              <Link href="/pro" className="hidden lg:block">
                <Button Icon={CreditCard}>Go Pro</Button>
              </Link>
            )}

            <Dropdown
              items={[
                {
                  title: "Billing",
                  onClick: () => BillingSession(),
                },
                {
                  title: "Go Pro",
                  onClick: () => router.push("/pro"),
                },
                { title: "Sign out", onClick: () => signOut() },
              ]}
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
          <Link href="/signin">
            <Button type="primary" Icon={User}>
              Sign in
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default React.memo(Header);
