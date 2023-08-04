import React from "react";
import { ChangelogItem } from "./changelogitem.type";
import { Text } from "@tremor/react";
import { format } from "date-fns";

const ChangeLogItem = ({ date, title, image, improvements }: ChangelogItem) => {
  return (
    <div className="flex flex-col gap-y-6">
      <img
        src={image}
        alt={title}
        className="h-full w-full overflow-hidden rounded-xl border border-gray-100 object-cover shadow-xl"
      />
      <div className="flex justify-between gap-y-1">
        <h2 className="flex items-center text-3xl text-gray-900">{title}</h2>
        <Text>
          <span className="text-gray-500">
            {format(new Date(date), "MMMM dd, yyyy")}
          </span>
        </Text>
      </div>
      <ul className="flex list-inside list-disc flex-col gap-y-1 text-gray-500">
        {improvements.map((improvement) => (
          <li key={improvement}>{improvement}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChangeLogItem;
