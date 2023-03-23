import Button from "@/components/Button";
import { HomeIcon, Plus, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="mt-20 flex w-full flex-col items-center gap-y-4 text-center">
      <h1 className="text-5xl font-semibold text-gray-900">
        Say Goodbye to Clunky Polls: Our App Offers an Elegant and Smooth
        Interface
      </h1>
      <p className="text-lg text-gray-500">
        Our app offers an elegant and smooth interface that makes creating and
        sharing polls a breeze. With our advanced features, including
        customizable templates, real-time results, and detailed analytics, you
        can create beautiful polls that engage your audience and provide
        valuable insights.
      </p>
      <div className="flex items-center gap-x-4">
        <Button
          onClick={() => router.push("/create")}
          type="secondary"
          Icon={Plus}
        >
          Create Free poll
        </Button>
        {session?.data ? (
          <Button
            onClick={() => router.push("/dashboard")}
            type="primary"
            Icon={HomeIcon}
          >
            Go to dashboard
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/signin")}
            type="primary"
            Icon={User}
          >
            Create account for free
          </Button>
        )}
      </div>
    </div>
  );
}
