"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { acceptLogic } from "./ActivityWaitlist";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import { useRouter } from "next/navigation";

export default function InviteMemberForm({
  activityID,
  host,
  participants,
}: {
  activityID: string;
  host: string;
  participants: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (confirm(`Are you sure you want to invite ${member}?`)) {
        // check if member entered exists
        const memberObj = GetPostObj({ memberID: member });
        const resA = await fetch(`${host}/api/profile/member`, memberObj);
        const bodyA = await resA.json();
        if (!bodyA.status) throw new Error(bodyA.error);

        // exists in activity
        if (Object.keys(participants).includes(member))
          throw new Error(
            `${member} is already participating in this activity.`
          );

        const res = await acceptLogic(member, activityID, host);
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully invited member to activity");
        handleReload(router);
      }
    } catch (err: any) {
      if (err.message.includes("not found")) {
        toast.error(
          "A user with that memberID does not exist. Please try again."
        );
      } else {
        toast.error(err.message);
      }
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
