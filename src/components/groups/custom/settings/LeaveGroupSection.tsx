"use client";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function LeaveGroupSection({
  curMember,
  groupID,
}: {
  groupID: string;
  curMember: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { host } = useHostname();
  const handleLeave = async () => {
    if (
      confirm(
        "Are you sure you want to leave this group? You will need to request to join again later if you change your mind."
      )
    ) {
      setLoading(true);
      try {
        const PostObj = GetPostObj({ groupID, memberID: curMember });
        const res = await fetch(`${host}/api/groups/remove-member`, PostObj);
        const body = await res.json();
        if (!body.status) throw new Error(body.error);
        toast.success(`Left group ${groupID}.`);
        handleReload(router);
        router.replace("/groups", { scroll: false });
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };
  return (
    <SecondaryButton
      className="grid place-items-center text-custom-light-text font-bold bg-custom-red"
      disabled={loading}
      onClick={handleLeave}
    >
      {loading ? <LoadingIconBright height={20} width={20} /> : "Leave Group"}
    </SecondaryButton>
  );
}
