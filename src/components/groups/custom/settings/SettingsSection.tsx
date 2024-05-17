import React from "react";
import DefaultCard from "@/src/components/DefaultCard";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Link from "next/link";

export default function SettingsSection({ groupID }: { groupID: string }) {
  return (
    <DefaultCard className="w-full flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-custom-primary text-center">
        Admin ID: {groupID}
      </p>
      <Link
        scroll={false}
        href={`/groups/${groupID}/settings`}
        className="w-full"
      >
        <PrimaryButton>Group Settings</PrimaryButton>
      </Link>
    </DefaultCard>
  );
}
