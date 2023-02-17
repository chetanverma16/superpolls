import { Icon } from "lucide-react";

export default interface ButtonProps {
  type?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  Icon?: React.ElementType;
}
