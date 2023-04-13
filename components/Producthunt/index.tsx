import React, { useEffect } from "react";
import Button from "../Button";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { XIcon } from "lucide-react";

const ProductHunt = () => {
  const [showProductHunt, setShowProductHunt] = useLocalStorage<boolean>(
    "showProducthunt",
    true,
  );
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [showProductHunt]);

  if (isMounted && showProductHunt) {
    return (
      <div className="fixed bottom-2 hidden w-3/5 items-start justify-between gap-x-4 rounded-xl bg-black p-5 text-white lg:flex">
        <h1 className="w-3/5 text-left text-gray-50">
          Exciting news! Superpoll has just launched on ProductHunt. We would
          love to hear from you and welcome any feedback or suggestions you may
          have. Please feel free to leave a comment and let us know what you
          think. Your support is greatly appreciated!
        </h1>
        <div className="flex gap-x-2">
          <a
            onClick={() => {
              setShowProductHunt(false);
              window.open(
                "https://www.producthunt.com/posts/superpoll?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-superpoll",
              );
            }}
            target="_blank"
            rel="noreferrer"
            className="h-10 transition-all duration-150 ease-out hover:scale-105 active:scale-100"
          >
            <img
              className="h-full"
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=389010&theme=light"
              alt="Superpoll - Quick&#0032;polls&#0046;&#0032;Instant&#0032;insights | Product Hunt"
            />
          </a>
          <Button
            classes="hover:bg-gray-800"
            Icon={XIcon}
            onClick={() => setShowProductHunt(false)}
          ></Button>
        </div>
      </div>
    );
  }
  return null;
};

export default ProductHunt;
