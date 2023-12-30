"use client";
import React from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DismissButton({
  activityID,
  host,
  memberID,
}: {
  memberID: string;
  activityID: string;
  host: string;
}) {
  const router = useRouter();
  const handleDismiss = async () => {
    try {
      const MemberObj = GetPostObj({ memberID, activityID });
      const res = await fetch(`${host}/api/activity/set-dismiss`, MemberObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success("Activity dismissed.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <SecondaryButton className="w-fit" onClick={handleDismiss}>
      Dismiss
    </SecondaryButton>
  );
}
