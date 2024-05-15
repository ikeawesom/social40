"use client";
import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import LoadingIcon from "../utils/LoadingIcon";

export default function DismissButton({
  activityID,
  host,
  memberID,
  toggleView,
}: {
  memberID: string;
  activityID: string;
  host: string;
  toggleView?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDismiss = async () => {
    setLoading(true);
    if (toggleView) toggleView();

    try {
      const MemberObj = GetPostObj({ memberID, activityID });
      const res = await fetch(`${host}/api/activity/set-dismiss`, MemberObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <SecondaryButton
      className={
        "justify-self-end w-fit self-stretch flex items-center justify-center text-xs"
      }
      disabled={loading}
      onClick={handleDismiss}
    >
      {loading ? <LoadingIcon width={15} height={15} /> : "Dismiss"}
    </SecondaryButton>
  );
}
