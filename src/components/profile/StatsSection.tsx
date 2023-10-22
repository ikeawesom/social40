"use client";
import React, { useEffect } from "react";
import DefaultCard from "../DefaultCard";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import HRow from "../utils/HRow";
import ActivityFeed from "./stats/ActivityFeed";
import StatsFeed from "./stats/StatsFeed";
import StatusFeed from "./stats/StatusFeed";
import { ACTIVITY_SCHEMA } from "@/src/utils/schemas/activities";
import { STATISTICS_SCHEMA } from "@/src/utils/schemas/statistics";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";

const STAT_TABS = [
  {
    id: "activity",
    title: "Activity",
    icon: "icon_activities.svg",
    active: "icon_activities_active.svg",
  },
  {
    id: "stats",
    title: "Statistics",
    icon: "icon_stats.svg",
    active: "icon_stats_active.svg",
  },
  {
    id: "statuses",
    title: "Statuses",
    icon: "icon_medical.svg",
    active: "icon_medical_active.svg",
  },
];

type StatsSectionType = {
  className?: string;
  activities?: { [activityID: string]: ACTIVITY_SCHEMA } | null;
  statistics?: { [statisticID: string]: STATISTICS_SCHEMA } | null;
  statuses?: { [statusID: string]: STATUS_SCHEMA } | null;
};

export default function StatsSection({
  className,
  statistics,
  activities,
  statuses,
}: StatsSectionType) {
  const params = useSearchParams();
  const option = params.get("option");

  return (
    <DefaultCard
      className={twMerge(
        "flex flex-col gap-y-3 items-center justify-start",
        className
      )}
    >
      <ul className="grid grid-cols-3 w-full gap-2">
        {STAT_TABS.map((item) => (
          <li key={item.id}>
            <Link
              href={`profile?${new URLSearchParams({ option: item.id })}`}
              className={twMerge(
                "col-span-1 grid place-content-center border-b-2 border-b-transparent py-2",
                option === item.id ? "border-b-custom-primary" : ""
              )}
            >
              <Image
                src={
                  option === item.id
                    ? `/icons/features/${item.active}`
                    : `/icons/features/${item.icon}`
                }
                height={30}
                width={30}
                alt={item.title}
              />
            </Link>
          </li>
        ))}
      </ul>
      <HRow />
      {option === "activity" && activities ? (
        <ActivityFeed activities={activities} />
      ) : option === "stats" && statistics ? (
        <StatsFeed statistics={statistics} />
      ) : option === "statuses" && statuses ? (
        <StatusFeed status={statuses} />
      ) : (
        <></>
      )}
    </DefaultCard>
  );
}
