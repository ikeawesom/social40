"use client";

import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React, { useState } from "react";
import DefaultCard from "../../DefaultCard";
import { DAYS, MONTHS } from "@/src/utils/constants";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { twMerge } from "tailwind-merge";
import { activitiesToDates } from "@/src/utils/home/activitiesToDates";
import AnnouncementTag from "../../announcements/AnnouncementTag";
import DateActivityModal from "./DateActivityModal";
import Image from "next/image";

export type FullActivityType = { [id: string]: GROUP_ACTIVITY_SCHEMA };

export type DisplayDateActivityType = {
  date: string;
  activities: FullActivityType;
};
export default function ActivityCalendarClientView({
  activities,
  view,
  dates: { curDate, endDate, startDate },
}: {
  view: "monthly" | "weekly";
  activities: FullActivityType;
  dates: { curDate: Date; startDate: Date; endDate: Date };
}) {
  const MAX_ACTIVITIES_PER_DAY = 2;
  const [showAll, setShowAll] = useState<DisplayDateActivityType>();
  const startDateStr = DateToString(startDate).split(" ")[0];
  const endDateStr = DateToString(endDate).split(" ")[0];

  const resetShow = () => setShowAll(undefined);
  const { sortedData: matchedActivities } = activitiesToDates({ activities });

  const tabColors = {
    0: { color: "bg-red-600/80", src: "" },
    5: { color: "bg-custom-green/80", src: "" },
    6: { color: "bg-blue-700/80", src: "" },
    // others: "bg-custom-grey-text/40 text-white",
  } as { [index: number]: { color: string; src: string } };

  return (
    <>
      {showAll && <DateActivityModal close={resetShow} data={showAll} />}
      <DefaultCard className="w-full">
        <div className="w-full grid place-items-center">
          <h1 className="font-bold text-center text-custom-dark-text fade-in-bottom">
            {view === "monthly"
              ? MONTHS[curDate.getMonth()]
              : `${startDateStr} - ${endDateStr}`}
          </h1>
        </div>
        {/* <HRow className="mb-3" /> */}
        <table className="mt-3 w-full">
          <tbody>
            <tr>
              <th colSpan={1} className="pl-2 text-start min-w-fit">
                Days
              </th>
              <th colSpan={1} className="text-start">
                Activities
              </th>
            </tr>
            {DAYS.map((day: string, index: number) => {
              let curDate = new Date(startDate.getTime());
              curDate.setDate(curDate.getDate() + index);
              const dateStr = DateToString(curDate).split(" ")[0];
              let todayStr = DateToString(new Date()).split(" ")[0];
              const sameDay = dateStr === todayStr;
              return (
                <tr
                  key={index}
                  className={twMerge(
                    "w-full px-2 py-3 border-b-[1px] border-t-[1px] border-custom-light-text",
                    sameDay && "bg-custom-light-orange"
                  )}
                >
                  <td valign="top" className="pl-2 py-2">
                    <div className="flex gap-1 text-sm pr-3">
                      <p className="font-bold">{startDate.getDate() + index}</p>
                      <p>{day}</p>
                    </div>
                  </td>
                  <td valign="top" className="py-2 w-full">
                    {matchedActivities[dateStr] ? (
                      <>
                        <div className="flex w-full flex-wrap items-start justify-start gap-x-3 gap-y-2">
                          {Object.keys(matchedActivities[dateStr])
                            .splice(0, MAX_ACTIVITIES_PER_DAY)
                            .map((id: string) => {
                              const { activityTitle, isPT } = activities[id];
                              return (
                                <div
                                  onClick={() =>
                                    setShowAll({
                                      date: dateStr,
                                      activities: {
                                        [id]: matchedActivities[dateStr][id],
                                      },
                                    })
                                  }
                                  key={id}
                                  className={twMerge(
                                    isPT &&
                                      "fade-in-bottom cursor-pointer flex items-center justify-start gap-1 hover:bg-custom-light-text rounded-md pr-2"
                                  )}
                                >
                                  <AnnouncementTag
                                    className={twMerge(
                                      !isPT && "fade-in-bottom",
                                      "cursor-pointer bg-custom-grey-text/40 text-white",
                                      tabColors[index]?.color
                                    )}
                                    key={id}
                                  >
                                    {activityTitle}
                                  </AnnouncementTag>
                                  {isPT && (
                                    <Image
                                      alt="PT activity"
                                      className="my-1"
                                      src={`/icons/features/icon_activities_active.svg`}
                                      width={20}
                                      height={20}
                                    />
                                  )}
                                </div>
                              );
                            })}
                        </div>
                        {Object.keys(matchedActivities[dateStr]).length >
                          MAX_ACTIVITIES_PER_DAY && (
                          <div className="w-full items-center flex justify-end px-2">
                            <p
                              onClick={() =>
                                setShowAll({
                                  date: dateStr,
                                  activities: matchedActivities[dateStr],
                                })
                              }
                              className="text-sm cursor-pointer hover:text-custom-primary duration-150 underline text-custom-grey-text mt-2"
                            >
                              Show All
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DefaultCard>
    </>
  );
}
