"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import PrimaryButton from "../utils/PrimaryButton";
import Image from "next/image";
import { dbHandler } from "@/src/firebase/db";
import useFetchUserDataClient from "@/src/utils/useFetchUserDataClient";
import handleSearchGroup from "@/src/utils/groups/handleSearchGroup";

export default function SearchGroups() {
  const [loading, setLoading] = useState(false);
  const [groupID, setGroupID] = useState("");
  const data = useFetchUserDataClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dbHandler.get({
        col_name: "GROUPS",
        id: groupID,
      });

      if (!res.data)
        throw new Error(
          "You have entered an invalid group ID. Please try again."
        );

      if (data) {
        const res = await handleSearchGroup({ data, groupID });
        if (!res.status) throw new Error(res.error);
        toast.success(
          `You have requested to join ${groupID}. Please wait for a group admin to accept your request.`
        );
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  };
  return (
    <form
      className="flex items-center justify-between w-full gap-2 mb-2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        required
        placeholder="Enter group name"
        className="text-sm"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setGroupID(e.target.value)
        }
      />
      <PrimaryButton
        className="w-fit self-stretch px-2"
        type="submit"
        disabled={loading}
      >
        <Image
          src="icons/navigation/icon_search.svg"
          alt="Search"
          height={30}
          width={30}
        />
      </PrimaryButton>
    </form>
  );
}
