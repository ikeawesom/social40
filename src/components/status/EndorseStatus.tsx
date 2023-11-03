"use client";
import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import LoadingIcon from "../utils/LoadingIcon";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function EndorseStatus({
  statusID,
  memberID,
  adminID,
  className,
  router,
}: {
  statusID: string;
  memberID: string;
  adminID: string;
  className?: string;
  router?: AppRouterInstance;
}) {
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);

  const handleEndorse = async () => {
    setLoading(true);
    try {
      const PostObj = GetPostObj({ statusID, memberID, adminID });
      await fetch(`${host}/api/profile/endorse-status`, PostObj);
      if (router) router.refresh();
      toast.success("Status endorsed successfully.");
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };
  return (
    <SecondaryButton
      disabled={loading}
      onClick={handleEndorse}
      className={twMerge(
        "grid place-items-center px-2 text-custom-orange border-custom-orange text-sm",
        className
      )}
    >
      {loading ? <LoadingIcon width={20} height={20} /> : "Endorse"}
    </SecondaryButton>
  );
}
