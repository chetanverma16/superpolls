import Button from "@/components/Button";
import ChangeLogItem from "@/components/ChangelogItem";
import { Title, Divider } from "@tremor/react";
import { ChangelogData } from "data/changelog";
import React from "react";

const Changelog = () => {
  return (
    <div className="flex flex-col py-10">
      <div className="flex w-full items-center justify-between">
        <Title>Changelog</Title>
      </div>
      <Divider />
      <div className="flex flex-col gap-y-2 py-6">
        {ChangelogData.map((item) => (
          <ChangeLogItem key={item.date} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Changelog;
