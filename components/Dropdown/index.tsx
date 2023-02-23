import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import DropdownProps from "./dropdown";
import Button from "../Button";

export default function Dropdown({ Trigger, items }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center">
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg border bg-white p-2 shadow-xl">
          {items.map(({ title, onClick }, index) => (
            <Menu.Item key={index}>
              <Button classes="w-full" onClick={onClick}>
                {title}
              </Button>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
