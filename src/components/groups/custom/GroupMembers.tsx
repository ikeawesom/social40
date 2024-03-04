"use client";
import React, { useState } from "react";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";
import { twMerge } from "tailwind-merge";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import InviteMemberForm from "./InviteMemberForm";
import HRow from "../../utils/HRow";
import PrimaryButton from "../../utils/PrimaryButton";
import handleBookIn from "@/src/hooks/groups/custom/handleBookIn";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingIconBright } from "../../utils/LoadingIcon";

export type GroupDetailsType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export default function GroupMembers({
  membersList,
  groupID,
  curMember,
}: {
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [online, setOnline] = useState(0);
  const { itemList, search, handleSearch } = useQueryObj({ obj: membersList });
  const admin =
    GROUP_ROLES_HEIRARCHY[curMember.role].rank >=
    GROUP_ROLES_HEIRARCHY["admin"].rank;

  const [biboLoad, setBiboLoad] = useState(false);
  const handleBookInButton = async () => {
    if (
      confirm("Are you sure you want to book in all members of this group?")
    ) {
      setBiboLoad(true);
      try {
        const res = await handleBookIn(membersList);
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully booked in all members in group");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setBiboLoad(false);
    }
  };

  const addOnline = () => setOnline((online) => online + 1);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <h1
        onClick={() => setShow(!show)}
        className={twMerge(
          "text-start cursor-pointer underline text-sm duration-150",
          !show ? "text-custom-grey-text" : "text-custom-primary"
        )}
      >
        {show ? "Hide Breakdown" : "View Breakdown"}
      </h1>
      {show && (
        <>
          <QueryInput
            placeholder="Search for Member ID"
            handleSearch={handleSearch}
            search={search}
          />
          {/* <div className="flex items-center justify-end gap-1 w-fit">
            <p className="text-xs text-custom-grey-text">{online} in camp</p>
            <StatusDot className="w-1 h-1" status />
          </div> */}
          <InnerContainer className="max-h-[60vh] relative">
            <div className="w-full p-2 pt-0 sticky top-0 left-0 z-10 bg-white shadow-sm">
              <PrimaryButton
                disabled={biboLoad}
                onClick={handleBookInButton}
                className="w-fit self-start"
              >
                {biboLoad ? (
                  <LoadingIconBright width={20} height={20} />
                ) : (
                  "Book All In"
                )}
              </PrimaryButton>
            </div>
            {Object.keys(itemList).map((item) => (
              <GroupMemberTab
                addOnline={addOnline}
                curMember={curMember}
                groupID={groupID}
                key={item}
                data={itemList[item]}
              />
            ))}
          </InnerContainer>
          {admin && (
            <>
              <HRow />
              <InviteMemberForm membersList={membersList} groupID={groupID} />
            </>
          )}
        </>
      )}
    </div>
  );
}
