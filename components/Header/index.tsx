import Link from "next/link";
import React from "react";
import Button from "components/Button";
import HeaderProps from "./header";
import { CreditCard, User } from "lucide-react";

const Header = ({}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Link href="/" className="text-xl font-bold">
        Superpolls
      </Link>
      <nav className="flex items-center gap-x-4">
        <Link href="/pricing">
          <Button Icon={CreditCard}>Pricing</Button>
        </Link>
        <Link href="/signin">
          <Button type="primary" Icon={User}>
            Sign in
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Header;
