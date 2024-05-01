"use client";

import DefaultCard from "@/src/components/DefaultCard";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import Badge from "@/src/components/utils/Badge";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useMemberID } from "@/src/hooks/useMemberID";
import { MONTHS } from "@/src/utils/constants";
import {
  DeleteCOSPlan,
  EditCOSPlan,
  FinishCOSDuty,
} from "@/src/utils/groups/COS/handleCOS";
import {
  COS_DAILY_SCHEMA,
  COS_TYPES,
  CosDailyType,
} from "@/src/utils/schemas/cos";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { getType } from "./CreatePlanSection";
import Notice from "@/src/components/utils/Notice";
import { DateToString, StringToDate } from "@/src/utils/getCurrentDate";

export default function MonthlyPlanList({
  sortedPlans,
  groupData,
  month,
  memberPoints,
  membersOriginalScores,
  confirmed,
  monthCOSData,
}: {
  sortedPlans: { [date: string]: CosDailyType };
  groupData: GROUP_SCHEMA;
  month: string;
  membersOriginalScores: { [memberID: string]: number };
  memberPoints: { [memberID: string]: number };
  confirmed: boolean;
  monthCOSData: COS_DAILY_SCHEMA;
}) {
  const router = useRouter();
  const { groupID, cos } = groupData;
  const { memberID } = useMemberID();
  const [unlocked, setUnlock] = useState(false);
  const [plans, setPlans] = useState(sortedPlans);
  const [ori, setOri] = useState(sortedPlans);
  const [allowed, setAllowed] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showScores, setShowScores] = useState(true);

  const handleFinishMember = async (date: string) => {
    setLoading(true);
    try {
      const { data } = StringToDate(`${date} 12:00`);
      const nextDate = data as Date;
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = DateToString(nextDate).split(" ")[0];
      const to_earn = Number(COS_TYPES[sortedPlans[date].type]);

      const { error } = await FinishCOSDuty(
        groupID,
        nextDateStr,
        date,
        monthCOSData,
        Number(month),
        to_earn
      );

      if (error) throw new Error(error);
      router.refresh();
      toast.success("Duty confirmed and points have been added.");
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (memberID !== "") setAllowed(admins.includes(memberID));
  }, [memberID]);

  const sortScores = (memberPoints: {
    [memberID: string]: { old: number; new: number };
  }) => {
    let tempObj = {} as { [memberID: string]: { old: number; new: number } };
    const sortedArr = Object.keys(memberPoints).sort(
      (a, b) => memberPoints[b].new - memberPoints[a].new
    );
    sortedArr.forEach((id: string) => {
      tempObj[id] = memberPoints[id];
    });
    return tempObj;
  };

  const getNewParticipantsScores = () => {
    let pointsObj = {} as { [memberID: string]: { old: number; new: number } };
    Object.keys(sortedPlans).forEach((date: string) => {
      const { memberID, type } = sortedPlans[date];

      const oldPoint = Object.keys(pointsObj).includes(memberID)
        ? pointsObj[memberID].new
        : Number(membersOriginalScores[memberID]);
      const newPoint = oldPoint + Number(COS_TYPES[type]);

      if (Object.keys(pointsObj).includes(memberID)) {
        pointsObj[memberID].new = newPoint;
      } else {
        pointsObj[memberID] = {
          old: membersOriginalScores[memberID],
          new: newPoint,
        };
      }
    });
    return sortScores(pointsObj);
  };

  const newMemberPoints = getNewParticipantsScores() as {
    [memberID: string]: { old: number; new: number };
  };

  const onChangeMember = (
    e: React.ChangeEvent<HTMLSelectElement>,
    date: string
  ) => {
    setPlans({
      ...plans,
      [date]: { ...plans[date], memberID: e.target.value },
    });
  };

  const comparePlans = () => {
    const first = JSON.stringify(plans);
    const sec = JSON.stringify(ori);
    return first === sec;
  };

  const noChange = comparePlans();

  const toggleLock = () => {
    if (noChange) setUnlock(!unlocked);
    else {
      if (
        confirm(
          "Hold on there. Are you sure you want to lock this plan without saving changes?"
        )
      ) {
        setPlans(sortedPlans);
        setOri(sortedPlans);
        setUnlock(!unlocked);
      }
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this plan? This is will not affect those who have already did their duty but might affect oncoming duty personnel."
      )
    ) {
      setLoading(true);
      setAllowed(false);
      setDeleting(true);
      try {
        const { error } = await DeleteCOSPlan(groupID, month);
        if (error) throw new Error(error);
        router.refresh();
        toast.success("We have deleted your COS plan for this month.");
        router.replace(`/groups/${groupID}/COS`);
      } catch (err: any) {
        toast.error(err.message);
      }
      setAllowed(admins.includes(memberID));
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    setAllowed(false);
    try {
      const { error } = await EditCOSPlan(groupID, month, plans);
      if (error) throw new Error(error);
      router.refresh();
      toast.success("Great, we saved your changes successfully.");
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setAllowed(admins.includes(memberID));
    setLoading(false);
  };

  const togglePublicHols = (date: string) => {
    setPlans({
      ...plans,
      [date]: {
        ...plans[date],
        type:
          plans[date].type !== "public"
            ? "public"
            : getType(
                new Date(
                  new Date().getFullYear(),
                  plans[date].month,
                  plans[date].day
                ).getDay()
              ),
      },
    });
  };

  if (!cos) return;
  const { admins, members } = cos;

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-sm text-custom-grey-text">{groupID}</p>
        <h1 className="text-xl font-bold text-center">
          COS Plan for {MONTHS[parseInt(month)]}
        </h1>
        <div className="flex items-center justify-center gap-2 w-full mt-1">
          <SecondaryButton
            disabled={!allowed || confirmed}
            onClick={() => toggleLock()}
            className={twMerge(
              "flex items-center justify-center gap-1 px-3",
              unlocked && "border-custom-orange bg-custom-light-orange"
            )}
          >
            {confirmed
              ? "Plan Confirmed"
              : unlocked
              ? "Lock Plan"
              : "Unlock Plan"}

            <Image
              alt="Lock"
              src="/icons/icon_lock.svg"
              width={20}
              height={20}
            />
          </SecondaryButton>
          {allowed && (
            <SecondaryButton
              onClick={handleDelete}
              disabled={loading || !allowed}
              className="text-custom-red border-custom-red bg-custom-light-red self-stretch"
            >
              {deleting ? "Deleting..." : "Delete Plan"}
            </SecondaryButton>
          )}
        </div>
        <p className="text-sm text-custom-grey-text mt-2">
          {confirmed
            ? "This plan has been confirmed an cannot be unlocked."
            : "You must be a COS admin to unlock this plan."}
        </p>
        <HRow className="mb-2" />
        {unlocked && (
          <PrimaryButton
            disabled={loading || noChange || !allowed}
            onClick={saveChanges}
            className="px-3 w-full"
          >
            Save Changes
          </PrimaryButton>
        )}
        <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 py-3 mt-3 mb-2">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
              Final Monthly Scores
            </h1>
            <Image
              onClick={() => setShowScores(!showScores)}
              src="/icons/icon_arrow-down.svg"
              alt="Show"
              width={30}
              height={30}
              className={`duration-300 ease-in-out ${
                showScores ? "rotate-180" : ""
              }`}
            />
          </div>
          {showScores && (
            <>
              {!noChange && (
                <Notice
                  status="warning"
                  text="Make sure to save changes to see the final monthly scores update accordingly."
                  noHeader
                  containerClassName="mb-1"
                />
              )}
              <InnerContainer className="max-h-[40vh]">
                {Object.keys(newMemberPoints).map((id: string) => (
                  <div
                    key={id}
                    className="w-full flex items-center justify-between px-3 py-2 border-b-[1px] border-custom-grey-text/10"
                  >
                    <h1 className="text-sm text-custom-dark-text">{id}</h1>
                    {confirmed ? (
                      <h1 className="font-bold text-custom-green">
                        {membersOriginalScores[id]}
                      </h1>
                    ) : (
                      <h1 className="font-bold text-custom-green">
                        {newMemberPoints[id].old} {" >> "}{" "}
                        {newMemberPoints[id].new}
                      </h1>
                    )}
                  </div>
                ))}
              </InnerContainer>
            </>
          )}
        </DefaultCard>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        {Object.keys(plans).map((date: string) => {
          const { day, memberID, month, type, finished, takenOver } =
            plans[date];
          const points = COS_TYPES[type];
          const dutyOver = finished || takenOver || confirmed;

          return (
            <DefaultCard className="w-full p-3" key={date}>
              <div className="flex items-center justify-between">
                <div>
                  {type === "weekend" && (
                    <Badge className="mb-2">WEEKEND</Badge>
                  )}
                  {type === "public" && (
                    <Badge
                      className="mb-2"
                      backgroundColor="bg-purple-50"
                      borderColor="border-purple-300"
                      textColor="text-purple-300"
                    >
                      HOLIDAY
                    </Badge>
                  )}
                  <p
                    className={twMerge(
                      "text-xs text-custom-grey-text flex items-center justify-start mb-1",
                      memberID !== ori[date].memberID &&
                        "text-custom-dark-text font-bold"
                    )}
                  >
                    {day} {MONTHS[month]}
                    {memberID !== ori[date].memberID && "*"}
                  </p>
                  {dutyOver ? (
                    <h1 className="font-bold text-custom-dark-text">
                      {memberID}
                    </h1>
                  ) : (
                    <select
                      onChange={(e) => onChangeMember(e, date)}
                      value={memberID}
                      className={twMerge(
                        "custom text-sm border-[1px] border-custom-grey-text/10 rounded-md px-2 py-1",
                        !unlocked && "pointer-events-none"
                      )}
                    >
                      {members.map((id: string) => (
                        <option key={id} value={id}>
                          {id} ({memberPoints[id]})
                        </option>
                      ))}
                    </select>
                  )}
                  {!dutyOver && (
                    <p
                      onClick={() => togglePublicHols(date)}
                      className={twMerge(
                        "w-fit text-xs mt-2 text-custom-grey-text underline cursor-pointer hover:text-custom-primary",
                        !unlocked && "pointer-events-none"
                      )}
                    >
                      Toggle as Public Holiday
                    </p>
                  )}
                </div>
                <div className="self-start">
                  {!dutyOver ? (
                    <p className="text-xs text-custom-grey-text text-end mb-2">
                      To earn: {points}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-custom-green text-end mb-2">
                      +{points} points
                    </p>
                  )}
                </div>
              </div>
              {allowed && (
                <div className="flex items-center justify-end mt-2">
                  <PrimaryButton
                    onClick={async () => await handleFinishMember(date)}
                    className="w-fit"
                    disabled={dutyOver || loading}
                  >
                    {dutyOver
                      ? "Confirmed"
                      : `Confirm Duty (+${points} points)`}
                  </PrimaryButton>
                </div>
              )}
            </DefaultCard>
          );
        })}
      </div>
    </>
  );
}
