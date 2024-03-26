"use client";
import React, { useState } from "react";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import PrimaryButton from "../../utils/PrimaryButton";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useRouter } from "next/navigation";
import { setGameToken } from "./gameToken";

export default function EditProfileForm({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const oldName = memberData.displayName;
  const oldRank = memberData.rank;

  const [loading, setLoading] = useState(false);
  const [memberDetails, setMemberDetails] = useState({
    name: memberData.displayName,
    rank: memberData.rank,
  });

  const changes =
    memberDetails.name === oldName && memberDetails.rank === oldRank;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberDetails({ ...memberDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // easter egg
    if (memberDetails.rank.trim().toLowerCase() === "i want to play")
      return await setGameToken(memberData.memberID);

    setLoading(true);
    try {
      const PostObj = GetPostObj({
        memberID: memberData.memberID,
        rank: memberDetails.rank,
        name: memberDetails.name,
      });
      const res = await fetch(`${host}/api/profile/edit`, PostObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      toast.success("Changes saved successfully.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center justify-start gap-4"
    >
      <input
        required
        name="name"
        type="text"
        value={memberDetails.name}
        onChange={handleChange}
        placeholder="Choose a display name"
      />
      <div className="w-full">
        <input
          name="rank"
          type="text"
          value={memberDetails.rank}
          onChange={handleChange}
          placeholder="Your rank: REC, 3SG, CPT, etc.."
        />
        <p className="mt-1 text-sm text-custom-grey-text">
          Note that this will be shown on your profile.
        </p>
      </div>
      <PrimaryButton
        disabled={loading || changes}
        type="submit"
        className="grid place-items-center"
      >
        {loading ? (
          <LoadingIconBright width={20} height={20} />
        ) : (
          "Save Changes"
        )}
      </PrimaryButton>
    </form>
  );
}
