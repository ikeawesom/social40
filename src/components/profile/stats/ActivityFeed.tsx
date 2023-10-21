import fetchUserDataClient from "@/src/utils/fetchUserDataClient";
import { ACTIVITY_SCHEMA } from "@/src/utils/schemas/member";
import React from "react";

type ActivityDisplay = {
  owner: string;
  title: string;
  desc: string;
  type: string;
  likes: string[];
  dateCreated: string;
};

export default function ActivityFeed({
  activities,
}: {
  activities: ACTIVITY_SCHEMA[];
}) {
  const displayName = fetchUserDataClient()?.displayName;

  if (activities.length !== 0)
    return (
      <div className="grid grid-cols-1 gap-y-4">
        {activities.map((item) => (
          <div
            key={item.uid}
            className="col-span-1 p-2 border-t-2 border-b-2 border-custom-light-text flex flex-col items-start justify-center"
          >
            <div className="flex flex-col gap-1 items-start justify-center">
              <h1>{displayName}</h1>
              <p>{item.dateCreated}</p>
            </div>
            <div className="flex flex-col gap-2 items-start justify-center">
              <h1>{item.title}</h1>
              <h4>{item.desc}</h4>
            </div>
            <p>{item.likes.length} likes</p>
          </div>
        ))}
      </div>
    );
  return (
    <div className="min-h-[30vh] grid place-items-center p-2">
      <p className="text-center text-custom-grey-text text-sm">
        Hmm.. it's quiet here. Post something!
      </p>
    </div>
  );
}
