import { api } from "@/lib/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Components
import Button from "../Button";

const includedFeatures = [
  "Advanced analytics",
  "AI powered poll options",
  "Unlimited polls",
  "Unlimited responses",
  "Easily control poll access",
  "Customize poll design",
  "Embed polls on your website",
];

export default function PircingSection() {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const GoPro = async () => {
    if (session?.user) {
      // @ts-ignore : ts doesn't like the fact that we're using a mutation hook as a query hook
      const { checkoutUrl } = await createCheckoutSession();
      if (!checkoutUrl) toast.error("Something went wrong");
      router.push(checkoutUrl);
    } else {
      router.push("/signin?q=gopro");
    }
  };
  return (
    <div className="mt-10 bg-white lg:mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple Pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our pricing plans are designed to cater to a variety of polling
            needs. From basic polling to advanced analytics, we&apos;ve got you
            covered. With transparent pricing and no hidden fees, you can easily
            choose the right plan that fits your budget and goals.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Pro
            </h3>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  Go pro and unlock all features
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    $4
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    per month
                  </span>
                </p>
                <Button type="primary" onClick={GoPro} classes="w-full mt-6">
                  Go Pro
                </Button>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
