import LinkBtnProps from "./linkbtn";
import Link from "next/link";

const LinkButton = ({ type, children, classes, Icon, href }: LinkBtnProps) => {
  if (type === "primary") {
    return (
      <Link
        href={href}
        className={`!flex w-fit items-center justify-center rounded-lg bg-black px-3 py-2 text-xs text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-900 active:scale-100 lg:text-base ${classes}`}
      >
        {Icon && (
          <Icon className={`${children && "mr-2 h-5 w-5 lg:h-6 lg:w-6"}`} />
        )}
        {children && children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`!flex w-fit items-center justify-center rounded-lg px-3 py-2 text-xs transition-all duration-300 ease-in-out hover:bg-gray-100 active:bg-gray-200 lg:text-base ${classes}`}
    >
      {Icon && (
        <Icon className={`${children && "mr-2 h-5 w-5 lg:h-6 lg:w-6"}`} />
      )}
      {children && children}
    </Link>
  );
};

export default LinkButton;
