import React from "react";
import { api } from "@/lib/trpc";
import { useSession } from "next-auth/react";

// Components
import {
  Card,
  Title,
  AreaChart,
  Text,
  Flex,
  Bold,
  BarList,
} from "@tremor/react";
import Skeleton from "@/components/Skeleton";
import LinkButton from "@/components/LinkButton";

const Anayltics = () => {
  const { data: session, status } = useSession();

  // Query
  const { data, isLoading } = api.analytics.getAnalytics.useQuery();
  const { data: topViews, isLoading: topViewLoading } =
    api.analytics.getTopViewedPollsByUser.useQuery();

  const { data: topVotes, isLoading: topVotesLoading } =
    api.analytics.getTopVotedPollsByUser.useQuery();

  // Generate data for top views
  const generateTopViewsData = () => {
    return topViews?.map((poll) => {
      return {
        name: poll.title,
        value: poll._count.Views,
        href: `/poll/${poll.id}`,
      };
    });
  };

  // Generate data for top votes
  const generateTopVotesData = () => {
    return topVotes?.map((poll) => {
      return {
        name: poll.title,
        value: poll._count.Vote,
        href: `/poll/${poll.id}`,
      };
    });
  };

  if (status === "loading") return <Skeleton classes="w-full h-60 p-4 mt-4" />;

  if (session?.user?.stripeSubscriptionStatus !== "active") {
    return (
      <div className="flex flex-col py-10">
        <div className="flex flex-col">
          <Title>Analytics</Title>
          <Text>
            Get a better understanding of your audience by analyzing their
            viewing behavior.
          </Text>
        </div>
        <div className="flex flex-col gap-y-6 py-6">
          <Card>
            <LinkButton classes="w-full" href="/pro">
              Go Pro
            </LinkButton>
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col py-10">
        <div className="flex flex-col">
          <Title>Analytics</Title>
          <Text>
            Get a better understanding of your audience by analyzing their
            viewing behavior.
          </Text>
        </div>
        <div className="flex flex-col gap-y-6 py-6">
          <Card>
            <Title>
              Total Interactions{" "}
              <span className="text-gray-400">(last 10 days)</span>
            </Title>
            {isLoading ? (
              <Skeleton classes="w-full h-60 p-4 mt-4" />
            ) : (
              <AreaChart
                className="mt-4 h-72"
                data={data ? data : []}
                index="date"
                categories={["views", "votes"]}
                colors={["indigo", "cyan"]}
              />
            )}
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <Title>Top Viewed Polls </Title>
              <Flex className="mt-4">
                <Text>
                  <Bold>Poll</Bold>
                </Text>
                <Text>
                  <Bold>View(s)</Bold>
                </Text>
              </Flex>
              {topViewLoading ? (
                <Skeleton classes="w-full h-60 p-4 mt-2" />
              ) : (
                <BarList
                  color="indigo"
                  data={generateTopViewsData() ?? []}
                  className="mt-2"
                />
              )}
            </Card>
            <Card>
              <Title>Top Voted Polls</Title>
              <Flex className="mt-4">
                <Text>
                  <Bold>Poll</Bold>
                </Text>
                <Text>
                  <Bold>Vote(s)</Bold>
                </Text>
              </Flex>
              {topVotesLoading ? (
                <Skeleton classes="w-full h-60 p-4 mt-2" />
              ) : (
                <BarList
                  color="cyan"
                  data={generateTopVotesData() ?? []}
                  className="mt-2"
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }
};

export default Anayltics;
