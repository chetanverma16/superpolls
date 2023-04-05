import React from "react";
import { api } from "@/lib/trpc";
import PricingSection from "@/components/Pricing";
import Spinner from "@/components/Spinner";

const Pricing = () => {
  const { data: isPro, isLoading } = api.user.subscriptionStatus.useQuery();

  if (isLoading)
    return (
      <div className="mt-32 flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (isPro) {
    return (
      <div className="mt-32 flex h-full flex-col items-center justify-center">
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
