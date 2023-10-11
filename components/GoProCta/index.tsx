import { useRouter } from "next/router";
import Button from "../Button";
import BgSVG from "./BgSVG";
import Image from "next/image";

export default function GoProCTA() {
  const router = useRouter();
  return (
    <div className="mx-auto w-full overflow-hidden rounded-xl shadow-sm">
      <div className="relative isolate bg-gray-50 px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <BgSVG />
        <div className="mx-auto flex max-w-md flex-col items-center gap-y-4 text-center lg:mx-0 lg:flex-auto lg:items-start lg:py-32 lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-4xl">
            Supercharge Your Polls <br /> with Pro.
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 lg:text-lg">
            Upgrade to our Pro feature and supercharge your polls with advanced
            analytics. Get real-time insights into your audience, track
            responses easily, and manage multiple polls with ease. With Pro
            analytics, you&apos;ll have all the data you need to make informed
            decisions and improve your polling strategy.
          </p>
          <Button onClick={() => router.push("/pro")} type="primary">
            Superchare your polls with pro
          </Button>
        </div>
        <div className="relative mt-16 h-80 lg:mt-8">
          <Image
            className="absolute left-0 top-0 w-[57rem] max-w-none rounded-2xl bg-white/5 shadow-xl ring-1 ring-white/10"
            src="/images/dashboard-pro.webp"
            alt="App screenshot"
            width={1824}
            height={1080}
          />
        </div>
      </div>
    </div>
  );
}
