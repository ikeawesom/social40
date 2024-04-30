"use client";
import React, { useState } from "react";
import DefaultCard from "@/src/components/DefaultCard";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

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
            admins: inputGroup.cos.admins ?? [groupData.createdBy],
            members: inputGroup.cos.members ?? [groupData.createdBy],
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

  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-bold mb-2">General</h1>
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
        <SecondaryButton
          onClick={() =>
            setInputGroup({
              ...inputGroup,
              cos: { ...inputGroup.cos, state: !inputGroup.cos.state },
            })
          }
          className={twMerge(
            "w-fit",
            inputGroup.cos.state &&
              "bg-custom-light-orange border-custom-orange"
          )}
        >
          {inputGroup.cos.state ? "COS Enabled" : "Enable COS"}
        </SecondaryButton>
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
