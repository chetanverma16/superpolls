export default interface ToogleProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
