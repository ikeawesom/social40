"use client";

import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { FinishCOSDuty } from "@/src/utils/groups/COS/handleCOS";
import { COS_DAILY_SCHEMA, COS_TYPES } from "@/src/utils/schemas/cos";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CosHOTOSection({
  activeCOS,
  curDayCOS,
  pendingCurTakeOver,
  pendingPrevFinish,
  prevDayCos,
  curMemberID,
  cosData,
  dateStr,
  prevDateStr,
  month,
}: {
  activeCOS: string;
  curDayCOS: string;
  prevDayCos: string;
  pendingPrevFinish: boolean;
  pendingCurTakeOver: boolean;
  curMemberID: string;
  dateStr: string;
  prevDateStr: string;
  cosData: COS_DAILY_SCHEMA;
  month: number;
}) {
  const router = useRouter();
  const { groupID } = cosData;
  const [loading, setLoading] = useState(false);
  const to_earn = Number(COS_TYPES[cosData.plans[prevDateStr].type]);

  const handleFinish = async () => {
    setLoading(true);

    try {
      const { error } = await FinishCOSDuty(
        groupID,
        dateStr,
        prevDateStr,
        cosData,
        month,
        to_earn
      );

      if (error) throw new Error(error);
      router.refresh();
      toast.success("Duty finished. Now awaiting next day COS to take over.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleTakeOver = async () => {
    setLoading(true);
    try {
      const { error } = await dbHandler.edit({
        col_name: `GROUPS/${groupID}/COS`,
        id: `${month}`,
        data: {
          plans: {
            ...cosData.plans,
            [dateStr]: { ...cosData.plans[dateStr], takenOver: true },
          },
        },
      });
      if (error) throw new Error(error);
      router.refresh();
      toast.success("COS duty taken over");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <div className="w-full flex items-center justify-end">
      {pendingPrevFinish &&
        !pendingCurTakeOver &&
        activeCOS === curMemberID && (
          <PrimaryButton
            disabled={loading}
            onClick={handleFinish}
            className="w-fit px-4 mt-2"
          >
            {loading ? "Working..." : `Finish Duty (+${to_earn})`}
          </PrimaryButton>
        )}
      {!pendingPrevFinish &&
        pendingCurTakeOver &&
        activeCOS === curMemberID && (
          <p className="animate-pulse text-xs text-custom-primary">
            Awaiting take over...
          </p>
        )}
      {pendingPrevFinish &&
        !pendingCurTakeOver &&
        curDayCOS === curMemberID && (
          <p className="animate-pulse text-xs text-custom-primary">
            Awaiting previous COS to finish duty...
          </p>
        )}
      {prevDayCos !== "" &&
        !pendingPrevFinish &&
        pendingCurTakeOver &&
        curDayCOS === curMemberID && (
          <PrimaryButton
            className="mt-2 w-fit px-4"
            onClick={handleTakeOver}
            disabled={loading}
          >
            {loading ? "Working..." : "Take Over"}
          </PrimaryButton>
        )}
    </div>
  );
}
