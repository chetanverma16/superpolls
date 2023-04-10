import React from "react";
import TextareaProps from "./textarea";
import Button from "../Button";
import TextareaAutosize from "react-textarea-autosize";

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  name,
  rows,
  Icon,
}: TextareaProps) => {
  return (
    <div className="relative flex w-full items-start">
      <TextareaAutosize
        className="w-full rounded-md bg-white p-4 shadow-md outline-none"
        placeholder={placeholder}
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
      />
      <div className="absolute top-2 right-2">{Icon}</div>
    </div>
  );
};

export default Textarea;
