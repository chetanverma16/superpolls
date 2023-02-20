import Link from "next/link";
import React from "react";
import Button from "components/Button";
import HeaderProps from "./header";
import { CreditCard, User } from "lucide-react";

const Header = ({}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <h1 className="text-xl font-bold">Superpolls</h1>
      <nav className="flex items-center gap-x-4">
        <Link href="/">
          <Button Icon={CreditCard}>Pricing</Button>
        </Link>
        <Link href="/">
          <Button type="primary" Icon={User}>
            Signin
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Header;
