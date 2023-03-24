export default interface PollCardProps {
  id: string;
  title: string;
  options?: number;
  votes: number;
  voted?: string;
  isVotedScreen?: boolean;
  handleDelete?: (id: string) => void;
}
