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

const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();

  const GoPro = async () => {
    // @ts-ignore : ts doesn't like the fact that we're using a mutation hook as a query hook
    const { checkoutUrl } = await createCheckoutSession();
    if (!checkoutUrl) toast.error("Something went wrong");
    router.push(checkoutUrl);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <Link href="/" className="text-xl font-bold">
        Superpolls
      </Link>
      <nav className="flex items-center gap-x-4">
        {!session && (
          <Link href="/pricing">
            <Button Icon={CreditCard}>Pricing</Button>
          </Link>
        )}

        {session ? (
          <>
            <Link href="/dashboard">
              <Button Icon={Home}>Dashboard</Button>
            </Link>
            <Button onClick={GoPro} Icon={CreditCard}>
              Go Pro
            </Button>
            <Dropdown
              items={[{ title: "Sign out", onClick: () => signOut() }]}
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

export default Header;
