import React from "react";
import CustomInputProps from "./custom-input";

const CustomInput = ({
  label,
  value,
  type,
  placeholder,
  onChange,
  name,
  Icon,
  IconButtonOnClick,
}: CustomInputProps) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-400">{label}</label>
      )}
      <div className="relative flex w-full items-center">
        <input
          name={name}
          className="w-full rounded-lg border border-gray-100 bg-white px-4 py-3 text-base shadow-xl outline-none transition-all duration-300 ease-out focus:border-blue-500 focus:outline-none"
          onChange={onChange}
          type={type}
          value={value}
          placeholder={placeholder}
        />
        <button className="absolute right-2" onClick={IconButtonOnClick}>
          {Icon}
        </button>
      </div>
    </div>
  );
};

export default CustomInput;
