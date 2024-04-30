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
  UpdateMembersCOSPoints,
} from "@/src/utils/groups/COS/handleCOS";
import { COS_TYPES, CosDailyType } from "@/src/utils/schemas/cos";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { getType } from "./CreatePlanSection";
import Notice from "@/src/components/utils/Notice";

export default function MonthlyPlanList({
  sortedPlans,
  groupData,
  month,
  memberPoints,
  confirmed,
}: {
  sortedPlans: { [date: string]: CosDailyType };
  groupData: GROUP_SCHEMA;
  month: string;
  memberPoints: { [memberID: string]: number };
  confirmed: boolean;
}) {
  const router = useRouter();
  const { memberID } = useMemberID();
  const [unlocked, setUnlock] = useState(false);
  const [plans, setPlans] = useState(sortedPlans);
  const [ori, setOri] = useState(sortedPlans);
  const [allowed, setAllowed] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showScores, setShowScores] = useState(true);

  useEffect(() => {
    if (memberID !== "") setAllowed(admins.includes(memberID));
  }, [memberID]);

  const sortScores = (memberPoints: { [memberID: string]: number }) => {
    let tempObj = {} as { [memberID: string]: number };
    const sortedArr = Object.keys(memberPoints).sort(
      (a, b) => memberPoints[b] - memberPoints[a]
    );
    sortedArr.forEach((id: string) => {
      tempObj[id] = memberPoints[id];
    });
    return tempObj;
  };

  const getNewParticipantsScores = () => {
    let poinsObj = {} as { [memberID: string]: number };
    Object.keys(sortedPlans).forEach((date: string) => {
      const { memberID, type } = sortedPlans[date];
      const oldPoint = Object.keys(poinsObj).includes(memberID)
        ? poinsObj[memberID]
        : memberPoints[memberID];
      const newPoint = Number(oldPoint) + Number(COS_TYPES[type]);
      poinsObj[memberID] = newPoint;
    });
    return sortScores(poinsObj);
  };

  const newMemberPoints = getNewParticipantsScores() as {
    [memberID: string]: number;
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

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { error } = await UpdateMembersCOSPoints(
        newMemberPoints,
        groupID,
        month
      );
      if (error) throw new Error(error);
      router.refresh();
      toast.success(
        "Points for members updated successfully. This plan is now locked."
      );
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const { cos, groupID } = groupData;
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
          <SecondaryButton
            onClick={handleDelete}
            disabled={loading || !allowed}
            className="text-custom-red border-custom-red bg-custom-light-red self-stretch"
          >
            {deleting ? "Deleting..." : "Delete Plan"}
          </SecondaryButton>
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
                        {memberPoints[id]}
                      </h1>
                    ) : (
                      <h1 className="font-bold text-custom-green">
                        {memberPoints[id]} {" >> "} {newMemberPoints[id]}
                      </h1>
                    )}
                  </div>
                ))}
              </InnerContainer>
              {allowed && !confirmed && (
                <>
                  <p className="text-xs text-start text-custom-grey-text mt-1">
                    By confirming the scores, the system will finalize the duty
                    points of the above members. We suggest only confirming the
                    scores at the end of the month when all duties have been
                    served.
                  </p>
                  <PrimaryButton disabled={loading} onClick={handleConfirm}>
                    Confirm Scores
                  </PrimaryButton>
                </>
              )}
            </>
          )}
        </DefaultCard>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        {Object.keys(plans).map((date: string) => {
          const { day, memberID, month, type } = plans[date];
          return (
            <DefaultCard
              className="w-full py-2 px-3 flex items-center justify-between"
              key={date}
            >
              <div>
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
                <p
                  onClick={() => togglePublicHols(date)}
                  className={twMerge(
                    "w-fit text-xs mt-2 text-custom-grey-text underline cursor-pointer hover:text-custom-primary",
                    !unlocked && "pointer-events-none"
                  )}
                >
                  Toggle as Public Holiday
                </p>
              </div>
              <div className="self-start">
                <p className="text-xs text-custom-grey-text text-end mb-2">
                  To earn: {COS_TYPES[type]}
                </p>
                {type === "weekend" && <Badge>WEEKEND</Badge>}
                {type === "public" && (
                  <Badge
                    backgroundColor="bg-purple-50"
                    primaryColor="border-purple-300"
                  >
                    HOLIDAY
                  </Badge>
                )}
              </div>
            </DefaultCard>
          );
        })}
      </div>
    </>
  );
}
