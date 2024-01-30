import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectMemberTab from "./SelectMemberTab";
import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";
import { twMerge } from "tailwind-merge";

type groupMembersType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export default function SelectMembers({
  setMembers,
  addMembers,
}: {
  setMembers: React.Dispatch<
    React.SetStateAction<{
      check: boolean;
      members: string[];
    }>
  >;
  addMembers: {
    check: boolean;
    members: string[];
  };
}) {
  const [loading, setLoading] = useState(false);

  const [groupID, setID] = useState("");
  const [groupMembers, setGroupMembers] = useState<groupMembersType>();
  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    setID(id);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (groupID !== "") {
          const res = await dbHandler.getSpecific({
            path: `GROUPS/${groupID}/MEMBERS`,
            orderCol: "dateJoined",
            ascending: true,
          });
          setGroupMembers(res.data);
        }
      } catch (err: any) {
        toast.error(err.any);
      }
      setLoading(false);
    }

    fetchData();
  }, [groupID]);

  if (groupID !== "") {
    return (
      <InnerContainer
        className={twMerge(
          "max-h-[50vh]",
          loading && "w-full flex items-center justify-center h-[20vh]"
        )}
      >
        {loading ? (
          <LoadingIcon height={40} width={40} />
        ) : (
          groupMembers &&
          Object.keys(groupMembers).map((memberID: string) => (
            <SelectMemberTab
              key={memberID}
              setMembers={setMembers}
              memberData={groupMembers[memberID]}
              addMembers={addMembers}
            />
          ))
        )}
      </InnerContainer>
    );
  }
}
