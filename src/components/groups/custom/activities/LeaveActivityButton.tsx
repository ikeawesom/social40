"use client";
import React, { useState } from "react";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";

export default function LeaveActivityButton({
  activityID,
  memberID,
}: {
  activityID: string;
  memberID: string;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const setAlert = async () => {
    if (
      confirm(
        "Are you sure you want to leave this activity? You will have to request to participate again if you choose to leave."
      )
    )
      await handleLeave();
  };
  const handleLeave = async () => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({ activityID, memberID });
      const res = await fetch(`${host}/api/activity/group-leave`, ActivityObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      router.back();
      toast.success("Left activity");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <PrimaryButton
      disabled={loading}
      type="submit"
      onClick={setAlert}
      className={twMerge("bg-custom-red grid place-items-center w-full")}
    >
      {loading ? (
        <LoadingIconBright width={20} height={20} />
      ) : (
        "Leave activity"
      )}
    </PrimaryButton>
  );
}
