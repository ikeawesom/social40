"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { toast } from "sonner";
import { LoadingIconBright } from "../utils/LoadingIcon";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function RevokeStatus({
  memberID,
  statusID,
  commander,
  own,
}: {
  own: boolean;
  commander: boolean;
  statusID: string;
  memberID: string;
}) {
  const [loading, setLoading] = useState(false);
  const { host } = useHostname();
  const router = useRouter();

  const handleRevoke = async () => {
    setLoading(true);
    try {
      const postObj = GetPostObj({ memberID, statusID });
      const res = await fetch(`${host}/api/profile/revoke-status`, postObj);
      const data = await res.json();
      if (!data.status) throw new Error(data.error);
      toast.success("Status revoked.");
      router.refresh();
      router.back();
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleAlert = async () => {
    if (
      confirm(`Are you sure you want to revoke ${memberID}'s status?`) == true
    ) {
      await handleRevoke();
    }
  };

  const same = () => {
    toast.error(
      "You cannot revoke your own status! Please get another commander to do so."
    );
  };
  const commanderAlert = () => {
    toast.error("Please get another commander to revoke your status.");
  };
  return (
    <PrimaryButton
      onClick={async () => {
        own ? same() : !commander ? commanderAlert() : await handleAlert();
      }}
      disabled={loading}
      className={twMerge(
        "bg-red-500 text-gray-50 grid place-items-center",
        (own || !commander) && "opacity-70 cursor-not-allowed"
      )}
    >
      {loading ? <LoadingIconBright height={20} width={20} /> : "Revoke Status"}
    </PrimaryButton>
  );
}
