"use client";

import React from "react";
import { toast } from "sonner";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import InviteMembersModal from "@/src/components/utils/InviteMembersModal";
import { useInviteMembers } from "@/src/hooks/useInviteMembers";
import { Onboarding } from "@/src/utils/onboarding";

export default function GroupInvite({
  groupID,
  participants,
}: {
  groupID: string;
  participants: string[];
}) {
  const {
    errors,
    loading,
    members,
    router,
    setErrors,
    setLoading,
    setMembers,
    resetErrors,
  } = useInviteMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const arrProm = members.map(async (id: string) => {
      const { error } = await Onboarding.GroupMember({
        groupID,
        memberID: id,
        role: "member",
      });
      if (error)
        return handleResponses({ status: false, error: { id, error } });
      return handleResponses();
    });

    const resArr = await Promise.all(arrProm);
    let isError = false;
    const temp = [] as string[];
    resArr.forEach((item: any) => {
      const { error } = item;
      if (error) {
        isError = true;
        const { error: msg, id } = error;
        const to_push = `${id}: ${msg}`;
        temp.push(to_push);
      }
    });
    setErrors(temp);
    if (!isError) {
      handleReload(router);
      toast.success("Welcome to the new members!");
    } else {
      setLoading(false);
    }
  };

  return (
    <InviteMembersModal
      resetError={resetErrors}
      config={{ errors, loading }}
      handleSubmit={handleSubmit}
      participants={participants}
      setMembers={setMembers}
    />
  );
}
