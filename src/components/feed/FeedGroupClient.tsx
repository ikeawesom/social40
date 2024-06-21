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
  activities,
  lastPointerServer,
  path,
  config,
}: {
  hidden: string[];
  activities: GROUP_ACTIVITIES_SCHEMA[];
  lastPointerServer: string;
  config?: null | {
    field: string;
    criteria: string;
    value: any;
  };
  path: string;
}) {
  const { memberID } = useMemberID();
  const [activityData, setActivityData] = useState(activities);
  const [lastRef, setLastRef] = useState(lastPointerServer);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    await sleep(400);
    if (finished) return;

    try {
      let newPointer = lastRef;
      while (newPointer !== undefined) {
        setLoading(true);
        const { data: pagiData, error } = await FetchPaginateActivity({
          hidden,
          lastPointer: newPointer,
          path,
          config: config ?? null,
        });

        if (error) throw new Error(error);
        const { data, lastPointer } = pagiData;

        // console.log("previous pointer:", lastRef);
        // console.log("new pointer:", lastPointer);
        // console.log(data);

        setLastRef(lastPointer);
        setLoading(false);
        if (data.length !== 0) {
          // console.log("data:", data);
          setActivityData((prev: GROUP_ACTIVITIES_SCHEMA[]) => [
            ...prev,
            ...data,
          ]);
          break;
        }
        newPointer = lastPointer;
      }
      if (newPointer === undefined) throw new Error("undefined");
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
  }, [inView, activityData]);

  const handleRemove = (index: number) => {
    let temp = [...activityData];
    temp.splice(index, 1);
    setActivityData(temp);
  };

  if (activityData.length === 0 && finished)
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
            toggleView={() => handleRemove(index)}
            key={activityID}
            index={index}
            activityData={data}
            memberID={memberID}
          />
        );
      })}
      {!finished && !loading && (
        <div ref={ref} className="grid place-items-center w-full">
          <LoadingIcon height={40} width={40} />
        </div>
      )}
    </div>
  );
}
