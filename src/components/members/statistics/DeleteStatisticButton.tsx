"use client";

import { deleteStatistic } from "@/src/utils/members/SetStatistics";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleReload } from "../../navigation/HeaderBar";
import SecondaryButton from "../../utils/SecondaryButton";
import Image from "next/image";
import { useMemberID } from "@/src/hooks/useMemberID";
import { getMemberData } from "@/src/utils/members/getMemberData";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { ROLES_HIERARCHY } from "@/src/utils/constants";

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
  const { memberID: curMember } = useMemberID();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await getMemberData(curMember);
      if (data) {
        const memberData = data as MEMBER_SCHEMA;
        if (
          ROLES_HIERARCHY[memberData.role].rank >=
          ROLES_HIERARCHY["memberPlus"].rank
        ) {
          setAllowed(true);
        }
      }
    };
    if (curMember !== "") getData();
  }, [curMember]);

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

  if (curMember === memberID || allowed)
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
