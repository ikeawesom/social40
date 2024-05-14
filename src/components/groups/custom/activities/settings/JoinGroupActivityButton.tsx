"use client";
import React, { useState } from "react";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { useRouter } from "next/navigation";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";

export default function JoinGroupActivityButton({
  canJoin,
  activityID,
  memberID,
  requested,
  className,
}: {
  canJoin: boolean;
  activityID: string;
  memberID: string;
  requested: boolean;
  className?: string;
}) {
  const { host } = useHostname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      // add API call to handle join group activity
      const PostObj = GetPostObj({ memberID, activityID });
      const res = await fetch(`${host}/api/activity/group-request`, PostObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success("Request has been submitted.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <SecondaryButton
      onClick={handleRequest}
      disabled={!canJoin || loading || requested}
      className={twMerge(
        "grid place-items-center w-full px-3 min-w-fit",
        !canJoin
          ? "border-custom-red text-custom-red"
          : "border-custom-orange text-custom-orange",
        className
      )}
    >
      {loading ? (
        <LoadingIcon height={20} width={20} />
      ) : requested ? (
        "Requested"
      ) : canJoin ? (
        "Request to participate"
      ) : (
        "You cannot join this activity"
      )}
    </SecondaryButton>
  );
}
