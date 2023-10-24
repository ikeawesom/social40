import React from "react";
import { useGroupMembers } from "@/src/hooks/groups/custom/useGroupMembers";
import LoadingIcon from "../../utils/LoadingIcon";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import { toast } from "sonner";

export default function GroupMembers({ groupID }: { groupID: string }) {
  const { membersList, error } = useGroupMembers(groupID);

  if (membersList) {
    const empty = Object.keys(membersList).length === 0;
    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 max-h-[40vh]">
        <div className="w-full">
          <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
            Members
          </h1>
          <HRow />
        </div>
        <InnerContainer>
          {!empty ? (
            Object.keys(membersList).map((item) => (
              <GroupMemberTab key={item} data={membersList[item]} />
            ))
          ) : (
            <>
              <p className="text-start text-custom-grey-text text-xs">
                No members yet. Invite others and start tracking!
              </p>
            </>
          )}
        </InnerContainer>
      </DefaultCard>
    );
  }
  if (error) {
    toast.error(error);
  }
  return <LoadingIcon />;
}
