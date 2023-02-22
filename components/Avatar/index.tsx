import React from "react";
import AvatarProps from "./avatar";
import Avvvatars from "avvvatars-react";
import * as AvatarRadix from "@radix-ui/react-avatar";

const Avatar = ({ src, name, email }: AvatarProps) => {
  return (
    <AvatarRadix.Root className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-transparent transition-all duration-300 ease-out hover:border-gray-400">
      <AvatarRadix.Image
        src={src || ""}
        className="h-full w-full object-cover"
      />
      <AvatarRadix.Fallback
        className="flex h-full w-full items-center justify-center font-bold"
        delayMs={600}
      >
        <Avvvatars style="shape" value={name ? name : email} />
      </AvatarRadix.Fallback>
    </AvatarRadix.Root>
  );
};

export default Avatar;
