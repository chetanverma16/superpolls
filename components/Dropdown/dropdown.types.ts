export default interface DropdownProps {
  Trigger: React.ReactNode;
  items: Items[];
}

type Items = {
  title: string;
  selected?: boolean;
  onClick: () => void;
};
