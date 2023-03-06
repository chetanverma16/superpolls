import { Icon } from "lucide-react";

export default interface ButtonProps {
  type?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  classes?: string;
  Icon?: React.ElementType;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  selected?: boolean;
}
