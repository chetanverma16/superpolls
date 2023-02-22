export default interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  email: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
