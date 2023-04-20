export default interface LinkBtnProps {
  href: string;
  type?: "primary";
  children?: React.ReactNode;
  classes?: string;
  Icon?: React.ElementType;
  iconPosition?: "left" | "right";
}
