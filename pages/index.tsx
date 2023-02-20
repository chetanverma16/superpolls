import Button from "@/components/Button";
import { Plus, User } from "lucide-react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="mt-12 flex w-3/5 flex-col gap-y-6">
      <h1 className="text-6xl font-semibold text-gray-900">
        Make Your Voice Heard with Our Elegant and Intuitive Polling App
      </h1>
      <p className="text-xl text-gray-500">
        Our intuitive polling app is designed to help you share your opinions
        and ideas in a clear and effortless way. Whether you&apos;re conducting
        market research, collecting feedback, or simply running a fun poll, our
        app offers a range of features to help you create beautiful polls that
        resonate with your audience.
      </p>
      <div className="flex items-center gap-x-4">
        <Button
          onClick={() => router.push("/create")}
          type="secondary"
          classes="text-xl"
          Icon={Plus}
        >
          Create Free
        </Button>
        <Button
          onClick={() => router.push("/signin")}
          type="primary"
          classes="text-xl"
          Icon={User}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
