"use client";
import React, { useState } from "react";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { deleteHA } from "@/src/utils/groups/HA/handleDeleteHA";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteHAButton({
  groupID,
  reportID,
}: {
  groupID: string;
  reportID: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this HA report? This cannot be undone!"
      )
    ) {
      setLoading(true);
      try {
        const { error } = await deleteHA(reportID, groupID);
        if (error) throw new Error(error);
        router.refresh();
        router.replace(`/groups/${groupID}/HA-report`, { scroll: false });
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    setLoading(false);
  };
  return (
    <SecondaryButton
      disabled={loading}
      onClick={handleDelete}
      className="text-custom-red border-custom-red bg-custom-light-red w-fit self-center flex items-center justify-center gap-1"
    >
      {loading ? "Deleting..." : "Delete Report"}
    </SecondaryButton>
  );
}
