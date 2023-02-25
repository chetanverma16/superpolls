import { ChangeEventHandler } from "react";

export default interface CustomInputProps {
  label?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  name?: string;
  Icon?: React.ReactNode;
  IconButtonOnClick?: () => void;
}
