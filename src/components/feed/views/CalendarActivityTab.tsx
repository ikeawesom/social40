import React, { useState } from "react";
import {
  DisplayDateActivityType,
  FullActivityType,
} from "./ActivityCalendarClientView";
import { MAX_ACTIVITIES_PER_DAY, tabColors } from "@/src/utils/constants";
import { twMerge } from "tailwind-merge";
import AnnouncementTag from "../../announcements/AnnouncementTag";
import DateActivityModal from "./DateActivityModal";
import Image from "next/image";
import { activitiesToDates } from "@/src/utils/home/activitiesToDates";
import StatusDot from "../../utils/StatusDot";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";

export default function CalendarActivityTab({
  dateStr,
  activities,
  index,
  isMonth,
}: {
  dateStr: string;
  activities: FullActivityType | undefined;
  index: number;
  isMonth?: { state: boolean; diffMonth: boolean };
}) {
  const [showAll, setShowAll] = useState<DisplayDateActivityType>();
  const resetShow = () => setShowAll(undefined);

  if (!activities) return <></>;

  const { sortedData: matchedActivities } = activitiesToDates({ activities });
  const isToday = DateToString(new Date()).split(" ")[0] === dateStr;
  return (
    <>
      {showAll && <DateActivityModal close={resetShow} data={showAll} />}
      {isMonth ? (
        <div
          key={index}
          onClick={() => {
            if (matchedActivities[dateStr])
              setShowAll({
                date: dateStr,
                activities: matchedActivities[dateStr],
              });
          }}
          className={twMerge(
            "flex flex-col items-start justify-start w-full p-1 border-t-[1px] border-t-custom-light-text duration-150 min-h-[6vh]",
            isMonth.diffMonth
              ? "bg-custom-grey-text/30 cursor-not-allowed"
              : "hover:bg-custom-light-text",
            isToday && "bg-custom-light-orange"
          )}
        >
          <p className="text-xs text-custom-grey-text text-end fade-in-bottom">
            {dateStr.split("/")[0]}
          </p>
          {matchedActivities[dateStr] && (
            <div className="text-sm flex items-center justify-center gap-1 fade-in-bottom">
              {Object.keys(matchedActivities[dateStr]).length}
              <StatusDot status={false} />
            </div>
          )}
        </div>
      ) : matchedActivities[dateStr] ? (
        <>
          <div
            className={twMerge(
              "flex w-full flex-wrap items-start justify-start gap-x-3 gap-y-2"
            )}
          >
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
                        tabColors[index]?.color,
                        isPT && "bg-custom-primary/80"
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
    </>
  );
}
