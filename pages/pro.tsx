import PricingSection from "@/components/Pricing";
import { useSession } from "next-auth/react";

const Pricing = () => {
  const session = useSession();
  if (session.data?.user?.stripeSubscriptionStatus === "active") {
    return (
      <div className="mt-10 flex h-full flex-col items-center justify-center lg:mt-10">
        <h1 className="text-3xl font-bold">You are already a pro!</h1>
      </div>
    );
  } else {
    return (
      <div>
        <PricingSection />
      </div>
    );
  }
};

export default Pricing;
