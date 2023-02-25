import Link from "next/link";
import React from "react";
import Button from "components/Button";
import HeaderProps from "./header";
import { CreditCard, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Avatar from "../Avatar";
import Dropdown from "../Dropdown";
import { useRouter } from "next/router";

const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between py-2">
      <Link href="/" className="text-xl font-bold">
        Superpolls
      </Link>
      <nav className="flex items-center gap-x-4">
        <Link href="/pricing">
          <Button Icon={CreditCard}>Pricing</Button>
        </Link>
        {session ? (
          <>
            <Dropdown
              items={[
                {
                  title: "Dashboard",
                  onClick: () => router.push("/"),
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

export default Header;
