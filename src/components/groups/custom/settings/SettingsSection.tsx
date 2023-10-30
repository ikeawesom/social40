import React from "react";
import DefaultCard from "@/src/components/DefaultCard";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useRouter } from "next/navigation";

export default function SettingsSection({ groupID }: { groupID: string }) {
  const router = useRouter();
  return (
    <DefaultCard className="w-full flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-custom-primary text-center">
        Admin ID: {groupID}
      </p>
      <PrimaryButton
        onClick={() => {
          router.push(`/groups/${groupID}/settings`, { scroll: false });
        }}
      >
        Group Settings
      </PrimaryButton>
    </DefaultCard>
  );
}
