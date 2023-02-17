import Link from "next/link";
import React from "react";
import Button from "components/Button";
import HeaderProps from "./header";
import { CreditCardIcon, Plus, User } from "lucide-react";

const Header = ({}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <h1 className="text-xl font-bold">Superpolls</h1>
      <nav className="flex items-center gap-x-4">
        <Link href="/">
          <Button Icon={CreditCardIcon}>Pricing</Button>
        </Link>
        <Link href="/">
          <Button type="secondary" Icon={User}>
            Signin
          </Button>
        </Link>
        <Link href="/">
          <Button type="primary" Icon={Plus}>
            Create
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Header;
