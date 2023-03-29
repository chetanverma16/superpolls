import { ChangeEventHandler } from "react";

export default interface SelectProps {
  options: string[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
}
