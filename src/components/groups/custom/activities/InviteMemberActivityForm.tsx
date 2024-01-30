"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { acceptLogic } from "./ActivityWaitlist";

export default function InviteMemberForm({
  activityID,
  host,
}: {
  activityID: string;
  host: string;
}) {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (confirm(`Are you sure you want to invite ${member}?`)) {
        const res = await acceptLogic(member, activityID, host);
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully invited member to group");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-stretch justify-between gap-2"
    >
      <input
        type="text"
        value={member}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setMember(e.target.value);
        }}
        placeholder="Enter Member ID"
        required
      />
      <PrimaryButton
        type="submit"
        className="flex items-center justify-center w-fit"
        disabled={loading}
      >
        {loading ? <LoadingIconBright height={20} width={20} /> : "Invite"}
      </PrimaryButton>
    </form>
  );
}
