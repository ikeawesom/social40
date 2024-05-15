"use client";

import { FetchPaginateActivity } from "@/src/utils/home/ActivityFeed";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import FeedGroupCardClient from "./FeedGroupCardClient";
import { useMemberID } from "@/src/hooks/useMemberID";
import ActivityFeedSkeleton from "./ActivityFeedSkeleton";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";

export type PaginatedActivityData = {
  activities: {
    [id: string]: GROUP_ACTIVITY_SCHEMA;
  };
  pointer: any;
};

export default function FeedGroupClient({
  hidden,
  groupID,
}: {
  hidden: string[];
  groupID: string;
}) {
  const [loading, setLoading] = useState(false);
  const { memberID } = useMemberID();
  const [activityData, setActivityData] = useState<PaginatedActivityData>({
    activities: {},
    pointer: null,
  });
  const [fetch, setFetch] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchData = async () => {
    if (finished) return;

    try {
      const { data: pagiData, error } = await FetchPaginateActivity({
        groupID,
        lastPointer: activityData.pointer ?? null,
      });

      if (error) throw new Error(error);
      const { data, lastPointer } = pagiData;

      hidden.forEach((id: string) => {
        delete data[id];
      });

      if (Object.keys(data).length === 0) throw new Error("undefined");

      setActivityData({
        pointer: lastPointer,
        activities: { ...activityData.activities, ...data },
      });
    } catch (err: any) {
      const { message } = err;
      if (message.includes("undefined")) {
        // finished all data
        setFinished(true);
      } else {
        toast.error(err.message);
      }
    }
    setLoading(false);
  };

  const handleScroll = async () => {
    if (finished) return;
    // console.log("H:", document.documentElement.scrollHeight);
    // console.log("T:", document.documentElement.scrollTop);
    // console.log("W:", window.innerHeight);

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !loading
    ) {
      setLoading(true);
      setTimeout(() => {
        setFetch((fetch) => fetch + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!finished) fetchData();
  }, [fetch]);

  if (Object.keys(activityData.activities).length === 0)
    return <ActivityFeedSkeleton />;

  return (
    <div
      className={twMerge(
        "flex w-full flex-col items-center justify-center gap-4",
        !finished && "pb-6"
      )}
    >
      {Object.keys(activityData.activities).map((id: string, index: number) => {
        return (
          <FeedGroupCardClient
            index={index}
            activityData={JSON.parse(
              JSON.stringify(activityData.activities[id])
            )}
            memberID={memberID}
            key={id}
          />
        );
      })}
      {loading && !finished && (
        <div className="grid place-items-center w-full">
          <LoadingIcon height={40} width={40} />
        </div>
      )}
    </div>
  );
}
