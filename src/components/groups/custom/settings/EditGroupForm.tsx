"use client";
import React, { useState } from "react";
import DefaultCard from "@/src/components/DefaultCard";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";
import { useRouter } from "next/navigation";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import ToggleContainer from "@/src/components/utils/toggle/ToggleContainer";

export default function EditGroupForm({
  groupData,
}: {
  groupData: GROUP_SCHEMA;
}) {
  const router = useRouter();

  const initGroupName = groupData.groupName;
  const initGroupDesc = groupData.groupDesc;
  const initCos = groupData.cos ?? { state: false, members: [], admins: [] };

  const [loading, setLoading] = useState(false);
  const [inputGroup, setInputGroup] = useState({
    groupName: initGroupName,
    groupDesc: initGroupDesc,
    cos: initCos,
  });

  const noChange =
    inputGroup.groupName === initGroupName &&
    inputGroup.groupDesc === initGroupDesc &&
    inputGroup.cos.state === initCos.state;

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
          cos: {
            state: inputGroup.cos.state,
            admins:
              inputGroup.cos.admins.length === 0
                ? [groupData.createdBy]
                : inputGroup.cos.admins,
            members:
              inputGroup.cos.members.length === 0
                ? [groupData.createdBy]
                : inputGroup.cos.members,
          },
        } as GROUP_SCHEMA,
      });
      if (!res.status) throw new Error(res.error);
      router.refresh();
      toast.success("Successfully updated changes.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const enableCOS = () =>
    setInputGroup({
      ...inputGroup,
      cos: { ...inputGroup.cos, state: true },
    });
  const disableCOS = () =>
    setInputGroup({
      ...inputGroup,
      cos: { ...inputGroup.cos, state: false },
    });

  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-bold mb-2">General</h1>
      <form
        className="w-full flex flex-col items-start justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <FormInputContainer inputName="groupname" labelText="Group Name">
          <input
            placeholder="Choose a group name"
            name="groupName"
            required
            value={inputGroup.groupName}
            onChange={handleChange}
          />
        </FormInputContainer>
        <FormInputContainer inputName="groupDesc" labelText="Group Description">
          <input
            placeholder="Write a group desciption"
            name="groupDesc"
            required
            value={inputGroup.groupDesc}
            onChange={handleChange}
          />
        </FormInputContainer>
        <ToggleContainer
          flex
          text="Enable COS"
          disable={disableCOS}
          enable={enableCOS}
          disabled={!inputGroup.cos.state}
        />
        <PrimaryButton
          disabled={noChange || loading}
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
