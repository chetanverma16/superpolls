import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import DropdownProps from "./dropdown.types";
import Button from "../Button";

export default function Dropdown({ Trigger, items }: DropdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full justify-center rounded-md">
        {Trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 flex w-56 origin-top-right flex-col items-start truncate rounded-md border border-gray-200 bg-white shadow-lg">
          <>
            {items.map(({ title, onClick, selected }, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <Button
                    onClick={onClick}
                    classes={`w-full rounded-none`}
                    selected={selected}
                  >
                    {title}
                  </Button>
                )}
              </Menu.Item>
            ))}
          </>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
