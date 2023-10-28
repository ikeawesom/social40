import React, { useState } from "react";
import DefaultCard from "@/src/components/DefaultCard";
import { useMemberID } from "@/src/hooks/useMemberID";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";

export default function EditGroupForm({
  groupData,
}: {
  groupData: GROUP_SCHEMA;
}) {
  const { memberID } = useMemberID();
  const initGroupName = groupData.groupName;
  const initGroupDesc = groupData.groupDesc;

  const [loading, setLoading] = useState(false);
  const [inputGroup, setInputGroup] = useState({
    groupName: initGroupName,
    groupDesc: initGroupDesc,
  });

  const noChange =
    inputGroup.groupName === initGroupName &&
    inputGroup.groupDesc === initGroupDesc;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputGroup({ ...inputGroup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dbHandler.edit({
        col_name: "GROUPS",
        id: groupData.groupID,
        data: {
          ...groupData,
          groupName: inputGroup.groupName,
          groupDesc: inputGroup.groupDesc,
        },
      });
      if (!res.status) throw new Error(res.error);
      toast.success("Successfully updated changes.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full">
      <form
        className="w-full flex flex-col items-start justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Choose a group name"
          name="groupName"
          required
          value={inputGroup.groupName}
          onChange={handleChange}
        />
        <input
          placeholder="Write a group desciption"
          name="groupDesc"
          required
          value={inputGroup.groupDesc}
          onChange={handleChange}
        />
        <PrimaryButton
          disabled={noChange}
          className="grid place-items-center"
          type="submit"
        >
          {loading ? (
            <LoadingIconBright width={20} height={20} />
          ) : (
            "Save Changes"
          )}
        </PrimaryButton>
      </form>
    </DefaultCard>
  );
}
