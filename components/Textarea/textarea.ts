import { ChangeEventHandler } from "react";

export default interface TextareaProps {
  label?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  placeholder?: string;
  name?: string;
  Icon?: React.ReactNode;
}
