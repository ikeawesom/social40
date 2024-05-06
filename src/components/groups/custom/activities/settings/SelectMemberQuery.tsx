import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import React from "react";
import { twMerge } from "tailwind-merge";
import SelectMemberTab from "./SelectMemberTab";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "@/src/components/utils/QueryInput";
import AnnouncementTag from "@/src/components/announcements/AnnouncementTag";

export default function SelectMemberQuery({
  groupMembers,
  loading,
  addMembers,
  setMembers,
}: {
  loading: boolean;
  groupMembers: GroupDetailsType;
  setMembers: React.Dispatch<
    React.SetStateAction<{
      check: string;
      members: string[];
    }>
  >;
  addMembers: {
    check: string;
    members: string[];
  };
}) {
  const { handleSearch, itemList, search } = useQueryObj({ obj: groupMembers });

  return (
    <div className="w-full">
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for member"
        search={search}
      />
      {addMembers.members.length > 0 && (
        <>
          <p className="my-1 text-sm text-custom-grey-text">
            Adding ({addMembers.members.length}):{" "}
          </p>
          <InnerContainer className="mb-2 border-[1px] border-custom-light-text flex-row items-center justify-start gap-2 flex-wrap p-2 max-h-[10vh]">
            {addMembers.members.map((id: string) => (
              <AnnouncementTag
                onClick={() =>
                  setMembers({
                    ...addMembers,
                    members: addMembers.members.filter((s: string) => s != id),
                  })
                }
                isDelete
                key={id}
              >
                {id}
              </AnnouncementTag>
            ))}
          </InnerContainer>
        </>
      )}
      <InnerContainer
        className={twMerge(
          "max-h-[30vh]",
          loading && "w-full flex items-center justify-center h-[20vh]"
        )}
      >
        {loading ? (
          <LoadingIcon height={40} width={40} />
        ) : (
          itemList &&
          Object.keys(itemList).map((memberID: string) => (
            <SelectMemberTab
              key={memberID}
              setMembers={setMembers}
              memberData={itemList[memberID]}
              addMembers={addMembers}
            />
          ))
        )}
      </InnerContainer>
    </div>
  );
}
