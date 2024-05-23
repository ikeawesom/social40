"use client";

import React from "react";
import { toast } from "sonner";
import { acceptLogic } from "./ActivityWaitlist";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import InviteMembersModal from "@/src/components/utils/InviteMembersModal";
import { useInviteMembers } from "@/src/hooks/useInviteMembers";

export default function ActivityInvite({
  activityID,
  participants,
}: {
  activityID: string;
  participants: string[];
}) {
  const {
    errors,
    host,
    loading,
    members,
    router,
    setErrors,
    setLoading,
    setMembers,
  } = useInviteMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const arrProm = members.map(async (id: string) => {
      const { error } = await acceptLogic(id, activityID, host);
      if (error) return handleResponses({ status: false, error });
      return handleResponses();
    });

    const resArr = await Promise.all(arrProm);
    let isError = false;
    resArr.forEach((item: any) => {
      const { error } = item;
      if (error) {
        isError = true;
        setErrors([...errors, error]);
      }
    });
    if (!isError) {
      handleReload(router);
      toast.success("Welcome to the new members!");
    } else {
      setLoading(false);
    }
  };

  return (
    <InviteMembersModal
      config={{ errors, loading }}
      handleSubmit={handleSubmit}
      participants={participants}
      setMembers={setMembers}
    />
  );
}
