import React from "react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex w-full justify-between rounded-xl border bg-white p-2 shadow-xl">
        <div className="flex items-center gap-x-6">
          <Button>Dashboard</Button>
          <Button>All Polls</Button>
          <Button>All Votes</Button>
        </div>
        <Button
          type="primary"
          Icon={Plus}
          onClick={() => router.push("/create")}
        >
          Create Poll
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!

  if (!session) {
    return { redirect: { destination: "/signin" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
