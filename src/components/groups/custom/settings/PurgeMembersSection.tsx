"use client";
import DefaultCard from "@/src/components/DefaultCard";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React, { useState } from "react";
import GroupMemberTab from "./GroupMemberTab";
import QueryInput from "@/src/components/utils/QueryInput";
import useQueryObj from "@/src/hooks/useQueryObj";
import { twMerge } from "tailwind-merge";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { purgeMembers } from "@/src/utils/groups/purgeMembers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PurgeMembersSection({
  groupID,
  groupMembers,
}: {
  groupID: string;
  groupMembers: {
    [memberID: string]: GROUP_MEMBERS_SCHEMA;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({
    state: false,
    selected: [] as string[],
  });
  const { handleSearch, itemList, search } = useQueryObj({ obj: groupMembers });

  const handleSelect = (memberID: string) => {
    const curSelect = selected.selected;
    if (curSelect.includes(memberID)) {
      const index = curSelect.indexOf(memberID);
      curSelect.splice(index, 1);
    } else {
      curSelect.push(memberID);
    }
    setSelected({ ...selected, selected: curSelect });
  };

  const handleSelectAll = () => {
    if (matchArr(selected.selected, Object.keys(groupMembers))) {
      setSelected({ ...selected, selected: [] });
    } else {
      setSelected({ ...selected, selected: Object.keys(groupMembers) });
    }
  };

  const handleSelectTroopers = () => {
    const curSelect = selected.selected;
    Object.keys(groupMembers).forEach((memberID: string) => {
      if (
        groupMembers[memberID].role === "member" &&
        !selected.selected.includes(memberID)
      ) {
        curSelect.push(memberID);
      }
    });
    setSelected({ ...selected, selected: curSelect });
  };

  const matchArr = (arr: any[], arrA: any[]) => {
    if (arr.length !== arrA.length) return false;
    arr.forEach((item: any, index: number) => {
      if (arr[index] !== arrA[index]) return false;
    });
    return true;
  };

  const handlePurge = async () => {
    if (
      confirm(
        "Are you sure you want to purge all selected members? This means deleting their accounts and all their relevant data in Social40. This action is irreversible!"
      )
    ) {
      setLoading(true);
      try {
        const res = await purgeMembers(selected.selected, groupID);
        if (!res.status) throw new Error(res.error);
        // handleReload(router);
        toast.success("Members purged successfully");
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-bold mb-2">Purge Members</h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for members"
        search={search}
      />
      <InnerContainer
        className={twMerge(
          "max-h-[60vh] relative",
          loading && "pointer-events-none"
        )}
      >
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full z-40 bg-white/80 grid place-items-center">
            <div className="flex items-center justify-center flex-col gap-1">
              <LoadingIcon height={30} width={30} />
              <p className="text-sm text-center">
                Purging members... Please do not leave this screen.
              </p>
            </div>
          </div>
        )}
        <div className="w-full bg-white sticky top-0 left-0 z-20 p-2 shadow-sm flex items-center justify-between flex-wrap gap-2">
          <p
            onClick={handleSelectAll}
            className="hover:brightness-75 cursor-pointer duration-150 text-sm underline text-custom-primary"
          >
            {matchArr(selected.selected, Object.keys(groupMembers))
              ? "Deselect All"
              : "Select All"}
          </p>
          <p
            onClick={handleSelectTroopers}
            className="hover:brightness-75 cursor-pointer duration-150 text-sm underline text-custom-primary"
          >
            Select All Troopers
          </p>
          <SecondaryButton
            onClick={handlePurge}
            className="w-fit border-red-500"
            disabled={selected.selected.length === 0}
          >
            <p className="text-xs text-red-500 font-bold">
              Purge Members ( {selected.selected.length} )
            </p>
          </SecondaryButton>
        </div>
        {Object.keys(itemList).map((memberID: string) => (
          <GroupMemberTab
            onClick={() => handleSelect(memberID)}
            key={memberID}
            data={itemList[memberID]}
            className={twMerge(
              selected.selected.includes(memberID)
                ? "bg-custom-light-orange hover:brightness-95"
                : "hover:bg-custom-light-text"
            )}
          />
        ))}
      </InnerContainer>
    </DefaultCard>
  );
}
