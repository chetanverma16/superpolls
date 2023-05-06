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
  Wand2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  return (
    <>
      <div className="mt-10 flex w-full flex-col items-center gap-y-6 text-center lg:mt-20">
        <h1 className="text-4xl font-semibold text-gray-900 lg:text-5xl">
          Say Goodbye to Clunky Polls: Our App Offers an Elegant and Smooth
          Interface
        </h1>
        <p className="text-base leading-relaxed text-gray-500 lg:text-xl">
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

        <div className="borde-gray-200 h-full w-full overflow-hidden rounded-xl border shadow-lg">
          <iframe
            className="h-64 w-full md:h-96 lg:h-[32rem]"
            src="https://www.youtube.com/embed/5M5omZU-csw"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="mt-20 flex flex-col gap-y-6">
        <h1 className="text-xl font-semibold text-gray-900 lg:text-3xl">
          The exceptional features that make us stand <br /> out in a crowded
          market...
        </h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-2">
            <Component className="h-6 lg:h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              Amazing Design
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
              Make your polls stand out with Superpoll - the simple and
              effective way to create beautiful polls.
            </p>
          </div>
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-4">
            <ShieldCheck className="h-6 lg:h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              Secure Polls
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
              We understand the importance of poll security, which is why we go
              above and beyond to ensure your polls are protected.
            </p>
          </div>
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-6">
            <Wand2 className="h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              AI-powered poll options
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
              This feature leverages advanced machine learning techniques to
              analyze data and generate a list of potential options for a poll
              or survey.
            </p>
          </div>
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-2">
            <Share className="h-6 lg:h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              Sharing
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
              Whether you want to share your poll with the world or just a
              select few, our platform makes it easy.
            </p>
          </div>
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-2">
            <Joystick className="h-6 lg:h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              Easily Close Poll
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
              With our platform, you have complete control over when voting
              begins and ends on your polls.
            </p>
          </div>
          <div className="col-auto flex flex-col gap-y-2 rounded-xl border border-gray-200 p-6 text-left shadow-lg transition-all duration-200 hover:border-gray-400 lg:col-span-2">
            <QrCode className="h-10" />
            <h2 className="text-base font-semibold text-gray-900 lg:text-xl">
              Generate QR
            </h2>
            <p className="text-md text-gray-500 lg:text-lg">
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
