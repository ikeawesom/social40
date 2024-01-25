import React, { useState } from "react";
import { toast } from "sonner";
import PrimaryButton from "../../utils/PrimaryButton";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import { Onboarding } from "@/src/utils/onboarding";

export default function InviteMemberForm({ groupID }: { groupID: string }) {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      const res = await Onboarding.GroupMember({
        groupID,
        memberID: member,
        role: "member",
      });
      if (!res.status) throw new Error(res.error);
      toast.success("Successfully invited member to group");
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
