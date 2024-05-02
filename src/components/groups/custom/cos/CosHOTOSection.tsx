"use client";

import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { getMemberPoints } from "@/src/utils/groups/COS/getMemberPoints";
import {
  FinishCosDuty,
  GetDisplayName,
} from "@/src/utils/groups/COS/handleCOS";
import { COS_DAILY_SCHEMA, COS_TYPES } from "@/src/utils/schemas/cos";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { WhatsappShareButton } from "react-share";
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
  const [shareWS, setShareWS] = useState("");

  const handleFinish = async () => {
    setLoading(true);

    try {
      const { error: oldScoreErr, data: scoreRes } = await getMemberPoints([
        curMemberID,
      ]);
      if (oldScoreErr) throw new Error(oldScoreErr);

      const prevScore = Number(scoreRes[curMemberID]);
      const to_earn = Number(COS_TYPES[cosData.plans[prevDateStr].type]);
      const newScore = prevScore + to_earn;

      const { error } = await FinishCosDuty(
        groupID,
        `${month}`,
        prevDateStr,
        curMemberID,
        newScore
      );

      if (error) throw new Error(error);
      router.refresh();
      toast.success("Duty finished. Now awaiting next day COS to take over.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    try {
      const { data: displayName, error } = await GetDisplayName(curDayCOS);
      if (error)
        throw new Error(
          "An unexpected error has occured. Could not generate HOTO message."
        );

      const { data: displayNameA, error: errorA } = await GetDisplayName(
        curDayCOS
      );
      if (errorA)
        throw new Error(
          "An unexpected error has occured. Could not generate HOTO message."
        );

      const company = cosData.groupID;
      const hotoMSG = `INCOMING COS
DATE: ${dateStr}
COS: ${displayName.toUpperCase()}
-----------------
*${company} KEYS*
${dateStr}

Who draw the keys: ${displayNameA.toUpperCase()}
Keys returned timing: 2359
Keys drawn timing: 0001`;

      setShareWS(hotoMSG);
    } catch (err: any) {
      toast.error(err.message);
    }
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

      // send whatsapp message
      handleShare();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <div className="w-full flex items-center justify-end gap-2">
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
      {pendingPrevFinish &&
        !pendingCurTakeOver &&
        activeCOS === curMemberID && (
          <PrimaryButton
            disabled={loading}
            onClick={handleFinish}
            className="w-fit px-4"
          >
            {loading
              ? "Working..."
              : `Finish Duty (+${Number(
                  COS_TYPES[cosData.plans[prevDateStr].type]
                )})`}
          </PrimaryButton>
        )}

      {prevDayCos !== "" &&
        !pendingPrevFinish &&
        pendingCurTakeOver &&
        curDayCOS === curMemberID && (
          <PrimaryButton
            className="w-fit px-4"
            onClick={handleTakeOver}
            disabled={loading}
          >
            {loading ? "Working..." : "Take Over"}
          </PrimaryButton>
        )}
      {shareWS !== "" && (
        <WhatsappShareButton url={shareWS}>
          <span className="flex flex-row items-center justify-between gap-1 px-3 py-2 rounded-md shadow-sm bg-white  duration-200 border-[1px] cursor-pointer hover:brightness-95">
            <img src="/icons/whatsapp.svg" alt="" width={20} />
            <p className="text-sm">Send HOTO message</p>
          </span>
        </WhatsappShareButton>
      )}
    </div>
  );
}
