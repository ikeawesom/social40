"use client";

import { deleteStatistic } from "@/src/utils/members/SetStatistics";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { handleReload } from "../../navigation/HeaderBar";
import SecondaryButton from "../../utils/SecondaryButton";
import Image from "next/image";

export default function DeleteStatisticButton({
  type,
  memberID,
  id,
}: {
  type: string;
  memberID: string;
  id: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (confirm("Are you sure you want to delete this statistic?")) {
        const { error } = await deleteStatistic(type, memberID, id);
        if (error) throw new Error(error);
        toast.success("Aw, sad to see that progress go!");
        handleReload(router);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div className="w-full flex items-center justify-end">
      <SecondaryButton
        onClick={handleDelete}
        className="w-fit flex items-center justify-center gap-1 bg-transparent hover:bg-custom-light-text/50 px-2 border-0 shadow-none"
      >
        <h1 className="text-xs text-custom-grey-text">Delete</h1>
        <Image
          alt="Delete Statistic"
          src="/icons/icon_trash_grey.svg"
          width={15}
          height={15}
        />
      </SecondaryButton>
    </div>
  );
}
