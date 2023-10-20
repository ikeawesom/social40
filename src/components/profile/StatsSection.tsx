"use client";
import React, { useEffect } from "react";
import { DataType } from "@/app/(navigation)/profile/page";
import DefaultCard from "../DefaultCard";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import HRow from "../utils/HRow";
import ActivityFeed from "./stats/ActivityFeed";
import StatsFeed from "./stats/StatsFeed";
import StatusFeed from "./stats/StatusFeed";

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

export default function StatsSection({
  className,
  medicalStatus,
  statistics,
  activities,
}: DataType) {
  const params = useSearchParams();
  const option = params.get("option");

  if (medicalStatus && statistics && activities)
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
        {option === "activity" ? (
          <ActivityFeed activities={activities} />
        ) : option === "stats" ? (
          <StatsFeed stats={statistics} />
        ) : option === "statuses" ? (
          <StatusFeed status={medicalStatus} />
        ) : (
          <></>
        )}
      </DefaultCard>
    );
}
