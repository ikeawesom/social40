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
  status,
  statusID,
  memberID,
  adminID,
  className,
  router,
}: {
  statusID: string;
  status: boolean;
  memberID: string;
  adminID: string;
  className?: string;
  router?: AppRouterInstance;
}) {
  const [statusNew, setStatusNew] = useState(status);
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);

  const handleEndorse = async () => {
    setLoading(true);
    try {
      const PostObj = GetPostObj({ statusID, memberID, adminID });
      await fetch(`${host}/api/profile/endorse-status`, PostObj);
      if (router) router.refresh();
      setStatusNew(true);

      toast.success("Status endorsed successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <div className={twMerge("flex-1 grid place-items-center", className)}>
      {statusNew ? (
        <p className="font-semibold text-custom-orange text-center text-sm">
          Endorsed
        </p>
      ) : loading ? (
        <LoadingIcon width={20} height={20} />
      ) : (
        <SecondaryButton
          onClick={handleEndorse}
          className="px-2 text-custom-orange border-custom-orange text-sm"
        >
          Endorse
        </SecondaryButton>
      )}
    </div>
  );
}
