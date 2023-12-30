"use client";
import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../utils/LoadingIcon";

export default function DismissButton({
  activityID,
  host,
  memberID,
}: {
  memberID: string;
  activityID: string;
  host: string;
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleDismiss = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <SecondaryButton
      className={"w-1/4 self-stretch grid place-items-center"}
      disabled={loading}
      onClick={handleDismiss}
    >
      {loading ? <LoadingIcon width={20} height={20} /> : "Dismiss"}
    </SecondaryButton>
  );
}
