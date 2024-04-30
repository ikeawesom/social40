"use client";

import DefaultCard from "@/src/components/DefaultCard";
import Badge from "@/src/components/utils/Badge";
import { MONTHS } from "@/src/utils/constants";
import { DateToString } from "@/src/utils/getCurrentDate";
import {
  COS_DAILY_SCHEMA,
  COS_MONTHLY_SCHEMA,
  CosDailyType,
} from "@/src/utils/schemas/cos";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CosPlansSection({
  cosData,
}: {
  cosData: COS_MONTHLY_SCHEMA;
}) {
  const [showAll, setShowAll] = useState(false);
  const [todayCOS, setTodayCOS] = useState<CosDailyType>();

  const date = new Date();
  const curMonth = date.getMonth().toString();
  const curMonthPlan = cosData[curMonth] ?? ({} as COS_DAILY_SCHEMA);
  const dateStr = DateToString(date).split(" ")[0];

  useEffect(() => {
    if (Object.keys(curMonthPlan).length > 0) {
      const { plans } = curMonthPlan;
      setTodayCOS(plans[dateStr]);
    }
  }, []);

  return (
    <>
      {Object.keys(cosData).length === 0 ? (
        <div className="min-h-[10vh] bg-white grid place-items-center p-4 rounded-md">
          <p className="text-sm text-custom-grey-text text-center">
            Oops, no plans here.
          </p>
        </div>
      ) : (
        <div>
          {Object.keys(curMonthPlan).length === 0 ? (
            <div className="min-h-[10vh] bg-white grid place-items-center p-4 rounded-md">
              <p className="text-sm text-custom-grey-text text-center">
                Seems like there is no COS plan for this month...
              </p>
            </div>
          ) : (
            todayCOS && (
              <DefaultCard>
                {todayCOS.type === "weekend" && (
                  <Badge className="mb-2">WEEKEND</Badge>
                )}
                {todayCOS.type === "public" && (
                  <Badge
                    className="mb-2"
                    backgroundColor="bg-purple-50"
                    primaryColor="border-purple-300"
                  >
                    HOLIDAY
                  </Badge>
                )}
                <p className="text-xs text-custom-grey-text mb-1">
                  COS for today, {dateStr}
                </p>
                <h1 className="font-bold">{todayCOS.memberID}</h1>
                <Link
                  className="text-xs underline text-custom-primary hover:opacity-70"
                  href={`/groups/${cosData[curMonth].groupID}/COS/${curMonth}`}
                >
                  See Monthly Plan
                </Link>
              </DefaultCard>
            )
          )}
          <div className="w-full flex flex-col items-start justify-start gap-2 mt-2">
            {showAll &&
              Object.keys(cosData).map((date: string) => {
                const { month } = cosData[date];
                return (
                  <Link
                    href={`/groups/${cosData[date].groupID}/COS/${cosData[date].month}`}
                    key={date}
                    className="w-full"
                  >
                    <DefaultCard className="py-2 px-3 pr-1 flex items-center justify-between gap-2 mb-2 hover:bg-custom-light-text duration-150">
                      <h4 className="font-bold text-start text-custom-dark-text">
                        {MONTHS[month]}
                      </h4>
                      <Image
                        src="/icons/icon_arrow-down.svg"
                        width={30}
                        height={30}
                        alt="Show"
                        className="-rotate-90"
                      />
                    </DefaultCard>
                  </Link>
                );
              })}
          </div>
          <div className="flex items-center justify-end mt-2">
            <p
              onClick={() => setShowAll(!showAll)}
              className="text-sm underline cursor-pointer hover:text-custom-primary text-custom-grey-text"
            >
              {showAll ? "Hide" : `View all (${Object.keys(cosData).length})`}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
