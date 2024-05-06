import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import SelectMemberQuery from "./SelectMemberQuery";

export default function SelectMembers({
  setMembers,
  addMembers,
}: {
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
  const [loading, setLoading] = useState(false);
  const { host } = useHostname();
  const [groupID, setID] = useState("");
  const [groupMembers, setGroupMembers] = useState<GroupDetailsType>();
  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    setID(id);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (groupID !== "") {
          const PostObj = GetPostObj({ groupID });
          // get group members
          const resB = await fetch(`${host}/api/groups/members`, PostObj);
          const bodyB = await resB.json();

          if (!bodyB.status) throw new Error(bodyB.error);
          const groupMembers = bodyB.data as GroupDetailsType;
          setGroupMembers(groupMembers);
        }
      } catch (err: any) {
        toast.error(err.any);
      }
      setLoading(false);
    }

    fetchData();
  }, [groupID]);

  if (groupID !== "") {
    if (!groupMembers)
      return (
        <InnerContainer
          className={"w-full flex items-center justify-center h-[20vh]"}
        >
          <LoadingIcon height={40} width={40} />
        </InnerContainer>
      );

    return (
      <SelectMemberQuery
        addMembers={addMembers}
        groupMembers={groupMembers}
        loading={loading}
        setMembers={setMembers}
      />
    );
  }
}
