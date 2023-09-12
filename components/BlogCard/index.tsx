import Link from "next/link";
import { PostPreview } from "@/types/posts";

export default function PostCard({
  postPreview,
}: {
  postPreview: PostPreview;
}) {
  return (
    <Link
      className="rounded-xl border border-gray-200 p-6 shadow-lg hover:border-gray-500"
      href={`/blog/${postPreview.slug}`}
    >
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl">{postPreview.title}</h2>
        <p className="text-gray-400">{postPreview.description}</p>
      </div>
    </Link>
  );
}
