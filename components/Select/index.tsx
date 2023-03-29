import { ChevronDown } from "lucide-react";
import React from "react";
import SelectProps from "./select.types";

const Select = ({ options, onChange }: SelectProps) => (
  <div className="relative flex w-full items-center">
    <select
      onChange={onChange}
      className="w-full appearance-none rounded-xl bg-white p-4 text-gray-800 outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2" />
  </div>
);

export default Select;
