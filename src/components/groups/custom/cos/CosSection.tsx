import DefaultCard from "@/src/components/DefaultCard";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { COS_DAILY_SCHEMA } from "@/src/utils/schemas/cos";
import Link from "next/link";
import React from "react";
import CosHOTOSection from "./CosHOTOSection";

export default async function CosSection({
  groupID,
  curMemberID,
  cos,
}: {
  groupID: string;
  curMemberID: string;
  cos: {
    state: boolean;
    admins: string[];
    members: string[];
  };
}) {
  try {
    const date = new Date();
    date.setHours(date.getHours() + 8);
    const dateStr = DateToString(date).split(" ")[0];

    const prevDate = new Date();
    prevDate.setHours(prevDate.getHours() + 8);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = DateToString(prevDate).split(" ")[0];

    const month = date.getMonth(); // 0: jan, 1: feb, 2: march, etc.
    const { data, error } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${month}`,
    });

    if (error && !error.includes("not found")) throw new Error(error);

    let cosData = data as COS_DAILY_SCHEMA | null;
    let disabledDate = false;
    let activeCOS = "";
    let curDayCOS = "";
    let prevDayCos = "";
    let pendingPrevFinish = false;
    let pendingCurTakeOver = false;

    if (cosData) {
      if (cosData.plans[dateStr].disabled) {
        disabledDate = true;
      } else {
        // check if previous date COS exists
        curDayCOS = cosData.plans[dateStr].memberID;
        const prevDayCosObj = cosData.plans[prevDateStr];
        const prevDayCosDisabled = cosData.plans[prevDateStr].disabled ?? false;
        if (prevDayCosObj && !prevDayCosDisabled) {
          prevDayCos = cosData.plans[prevDateStr].memberID;
          // if exists, check if COS finished duty
          if (prevDayCosObj.finished) {
            // if finished duty, check if current day COS has taken over
            if (cosData.plans[dateStr].takenOver) {
              // next day COS has taken over
              activeCOS = cosData.plans[dateStr].memberID;
            } else {
              pendingCurTakeOver = true;
              activeCOS = prevDayCos;
            }
          } else {
            // if havent finish duty, prompt previous day COS to finish duty
            pendingPrevFinish = true;
            activeCOS = prevDayCos;
          }
        } else {
          // if dont exist, continue to today
          activeCOS = cosData.plans[dateStr].memberID;
        }
      }
    }
    return (
      <DefaultCard className="w-full">
        {!cosData || disabledDate ? (
          (cos.admins.includes(curMemberID) ||
            cos.members.includes(curMemberID)) && (
            <div className="flex w-full items-start justify-center flex-col gap-2">
              <p className="text-sm text-custom-grey-text">
                Hmm.. you do not have a COS planned for today, {dateStr}.
              </p>
              {cos.admins.includes(curMemberID) ? (
                <Link scroll={false} href={`/groups/${groupID}/COS`}>
                  <PrimaryButton className="w-fit">
                    Start Planning
                  </PrimaryButton>
                </Link>
              ) : (
                <Link
                  scroll={false}
                  href={`/groups/${groupID}/COS`}
                  className="text-xs underline text-custom-primary hover:opacity-70"
                >
                  View COS Plans
                </Link>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-xs text-custom-grey-text">Current COS</p>
            <h1 className="font-bold text-custom-dark-text">{activeCOS}</h1>
            {(cos.admins.includes(curMemberID) ||
              cos.members.includes(curMemberID)) && (
              <Link
                scroll={false}
                href={`/groups/${groupID}/COS`}
                className="text-xs underline text-custom-primary hover:opacity-70"
              >
                View COS Plans
              </Link>
            )}
            <CosHOTOSection
              activeCOS={activeCOS}
              curDayCOS={curDayCOS}
              curMemberID={curMemberID}
              pendingCurTakeOver={pendingCurTakeOver}
              pendingPrevFinish={pendingPrevFinish}
              prevDayCos={prevDayCos}
              cosData={cosData}
              dateStr={dateStr}
              prevDateStr={prevDateStr}
              month={month}
            />
          </div>
        )}
      </DefaultCard>
    );
  } catch (err: any) {
    console.log(`[COS] ${err.message}`);
  }
}
