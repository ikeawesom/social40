"use client";

import DefaultCard from "@/src/components/DefaultCard";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import Badge from "@/src/components/utils/Badge";
import HRow from "@/src/components/utils/HRow";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useMemberID } from "@/src/hooks/useMemberID";
import { MONTHS } from "@/src/utils/constants";
import { DeleteCOSPlan, EditCOSPlan } from "@/src/utils/groups/COS/handleCOS";
import { COS_TYPES, CosDailyType } from "@/src/utils/schemas/cos";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export default function MonthlyPlanList({
  sortedPlans,
  groupData,
  month,
  memberPoints,
}: {
  sortedPlans: { [date: string]: CosDailyType };
  groupData: GROUP_SCHEMA;
  month: string;
  memberPoints: { [memberID: string]: number };
}) {
  const router = useRouter();
  const { memberID } = useMemberID();
  const [unlocked, setUnlock] = useState(false);
  const [plans, setPlans] = useState(sortedPlans);
  const [ori, setOri] = useState(sortedPlans);
  const [allowed, setAllowed] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [deleteing, setDeleting] = useState(false);

  useEffect(() => {
    if (memberID !== "") setAllowed(admins.includes(memberID));
  }, [memberID]);

  const { cos, groupID } = groupData;
  if (!cos) return;
  const { admins, members } = cos;

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

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-sm text-custom-grey-text">{groupID}</p>
        <h1 className="text-xl font-bold text-center">
          COS Plan for {MONTHS[parseInt(month)]}
        </h1>
        <div className="flex items-center justify-between gap-1 w-full mt-2">
          <SecondaryButton
            disabled={!allowed}
            onClick={() => toggleLock()}
            className={twMerge(
              "flex items-center justify-center gap-1 px-3",
              unlocked && "border-custom-orange bg-custom-light-orange"
            )}
          >
            {unlocked ? "Lock Plan" : "Unlock Plan"}
            <Image
              alt="Lock"
              src="/icons/icon_lock.svg"
              width={20}
              height={20}
            />
          </SecondaryButton>
        </div>
        <p className="text-sm text-custom-grey-text mt-1">
          You must be a COS admin to unlock this plan.
        </p>
        <HRow className="mb-2" />
        {unlocked && (
          <div className="flex items-center justify-center gap-2 w-full">
            <PrimaryButton
              disabled={loading || noChange || !allowed}
              onClick={saveChanges}
              className="px-3 w-full"
            >
              Save Changes
            </PrimaryButton>
            <SecondaryButton
              onClick={handleDelete}
              disabled={loading || !allowed}
              className="text-custom-red border-custom-red bg-custom-light-red"
            >
              {deleteing ? "Deleting..." : "Delete Plan"}
            </SecondaryButton>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        {Object.keys(plans).map((date: string) => {
          const { day, memberID, month, type } = plans[date];
          const newScore =
            Number(memberPoints[plans[date].memberID]) +
            Number(COS_TYPES[type]);
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
                <h1 className="mt-2 text-sm font-bold text-custom-green">
                  Points: {memberPoints[plans[date].memberID]} {" >> "}{" "}
                  {newScore}
                </h1>
              </div>
              <div className="self-start">
                {type === "weekend" && <Badge className="mb-1">WEEKEND</Badge>}
                {type === "public" && (
                  <Badge
                    className="mb-1"
                    backgroundColor="bg-purple-50"
                    primaryColor="border-purple-300"
                  >
                    HOLIDAY
                  </Badge>
                )}
                <p className="text-xs text-custom-grey-text text-end">
                  To earn: {COS_TYPES[type]}
                </p>
              </div>
            </DefaultCard>
          );
        })}
      </div>
    </>
  );
}
