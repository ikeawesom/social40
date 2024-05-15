"use client";

import { FetchPaginateActivity } from "@/src/utils/home/ActivityFeed";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import FeedGroupCardClient from "./FeedGroupCardClient";
import { useMemberID } from "@/src/hooks/useMemberID";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { useInView } from "react-intersection-observer";
import { sleep } from "@/src/utils/sleep";
import ErrorActivities from "../screens/ErrorActivities";

export default function FeedGroupClient({
  hidden,
  groupID,
  activities,
  lastPointer,
}: {
  hidden: string[];
  groupID: string;
  activities: GROUP_ACTIVITIES_SCHEMA[];
  lastPointer: string;
}) {
  const { memberID } = useMemberID();
  const [activityData, setActivityData] = useState(activities);
  const [lastRef, setLastRef] = useState(lastPointer);
  const [finished, setFinished] = useState(false);

  const fetchData = async () => {
    await sleep(400);
    if (finished) return;

    try {
      const { data: pagiData, error } = await FetchPaginateActivity({
        groupID,
        hidden,
        lastPointer: lastRef,
      });

      if (error) throw new Error(error);
      const { data, lastPointer } = pagiData;

      if (data.length === 0) throw new Error("undefined");

      setActivityData((prev: GROUP_ACTIVITIES_SCHEMA[]) => [...prev, ...data]);
      setLastRef(lastPointer);
    } catch (err: any) {
      const { message } = err;
      if (message.includes("undefined")) {
        // finished all data
        setFinished(true);
      } else {
        toast.error(err.message);
      }
    }
  };

  const { ref, inView } = useInView();
  useEffect(() => {
    if (!finished && inView) fetchData();
  }, [inView]);

  const handleRemove = (index: number) => {
    let temp = [...activityData];
    temp.splice(index, 1);
    setActivityData(temp);
  };

  if (activityData.length === 0)
    return (
      <ErrorActivities text="Well, looks like there are no activites here for you." />
    );

  return (
    <div
      className={twMerge(
        "flex w-full flex-col items-center justify-center gap-4",
        !finished && "pb-6"
      )}
    >
      {activityData.map((data: GROUP_ACTIVITIES_SCHEMA, index: number) => {
        const { activityID } = data;

        return (
          <FeedGroupCardClient
            onDismiss={() => handleRemove(index)}
            key={activityID}
            index={index}
            activityData={data}
            memberID={memberID}
          />
        );
      })}
      {!finished && (
        <div ref={ref} className="grid place-items-center w-full">
          <LoadingIcon height={40} width={40} />
        </div>
      )}
    </div>
  );
}
