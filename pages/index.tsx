import Button from "@/components/Button";
import GoProCTA from "@/components/GoProCta";
import {
  Component,
  HomeIcon,
  Joystick,
  Plus,
  QrCode,
  Share,
  ShieldCheck,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  return (
    <>
      <div className="mt-20 flex w-full flex-col items-center gap-y-6 text-center">
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
        <div className="borde-gray-200 overflow-hidden rounded-xl border shadow-lg">
          <img
            className="h-full w-full"
            src="/images/poll.png"
            alt="header image"
          />
        </div>
      </div>
      <div className="mt-20 flex flex-col gap-y-6">
        <h1 className="text-4xl font-semibold text-gray-900">
          The exceptional features that make us stand <br /> out in a crowded
          market...
        </h1>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-2 flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400">
            <Component className="h-10" />
            <h2 className="text-xl font-semibold text-gray-900">
              Amazing Design
            </h2>
            <p className="text-lg text-gray-500">
              Make your polls stand out with Superpoll - the simple and
              effective way to create beautiful polls.
            </p>
          </div>
          <div className="col-span-4 flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400">
            <ShieldCheck className="h-10" />
            <h2 className="text-xl font-semibold text-gray-900">
              Secure Polls
            </h2>
            <p className="text-lg text-gray-500">
              We understand the importance of poll security, which is why we go
              above and beyond to ensure your polls are protected.
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400">
            <Share className="h-10" />
            <h2 className="text-xl font-semibold text-gray-900">Sharing</h2>
            <p className="text-lg text-gray-500">
              Whether you want to share your poll with the world or just a
              select few, our platform makes it easy.
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400">
            <Joystick className="h-10" />
            <h2 className="text-xl font-semibold text-gray-900">
              Easily Close Poll
            </h2>
            <p className="text-lg text-gray-500">
              With our platform, you have complete control over when voting
              begins and ends on your polls.
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400">
            <QrCode className="h-10" />
            <h2 className="text-xl font-semibold text-gray-900">Generate QR</h2>
            <p className="text-lg text-gray-500">
              Simplify polling at your next event with our one-click QR code
              access.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <GoProCTA />
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
