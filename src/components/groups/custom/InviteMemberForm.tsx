import React, { useState } from "react";
import { toast } from "sonner";
import PrimaryButton from "../../utils/PrimaryButton";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import { Onboarding } from "@/src/utils/onboarding";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { GroupDetailsType } from "./GroupMembers";

export default function InviteMemberForm({
  groupID,
  membersList,
}: {
  groupID: string;
  membersList: GroupDetailsType;
}) {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState("");
  const { host } = useHostname();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (confirm(`Are you sure you want to invite ${member}?`)) {
        // check if valid member
        const memberObj = GetPostObj({ memberID: member });
        const resA = await fetch(`${host}/api/profile/member`, memberObj);
        const bodyA = await resA.json();
        if (!bodyA.status) throw new Error(bodyA.error);

        // check if member is already in the group
        if (Object.keys(membersList).includes(member))
          throw new Error(`${member} has already joined the group.`);

        const res = await Onboarding.GroupMember({
          groupID,
          memberID: member,
          role: "member",
        });
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully invited member to group");
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
