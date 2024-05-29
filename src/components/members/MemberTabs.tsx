"use client";

import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import useGetAllSearchParams from "@/src/utils/helpers/getAllSearchParams";
import { useRouter } from "next/navigation";

export type MemberTabsType = {
  id: string;
  icon: string;
};

export const MEMBER_TABS = [
  {
    id: "activities",
    icon: "icon_activities.svg",
  },
  {
    id: "statuses",
    icon: "icon_medical.svg",
  },
  {
    id: "HA",
    icon: "icon_heat.svg",
  },
  {
    id: "settings",
    icon: "icon_setting.svg",
  },
] as MemberTabsType[];

export default function MemberTabs({
  view,
  memberID,
}: {
  view: string;
  memberID: string;
}) {
  const [curView, setCurView] = useState(view);
  const { values } = useGetAllSearchParams();
  const router = useRouter();

  const handleLink = (id: string) => {
    setCurView(id);
    router.replace(
      `/members/${memberID}?${new URLSearchParams({ ...values, view: id })}`,
      { scroll: false }
    );
  };

  return (
    <div className="w-full flex items-center justify-between gap-2">
      {MEMBER_TABS.map((tab: MemberTabsType) => {
        const { icon, id } = tab;
        const isActive = id === curView;
        return (
          <SecondaryButton
            className={twMerge(
              "flex items-center justify-center gap-1 min-w-fit px-3 py-2",
              isActive && "bg-custom-primary text-custom-light-text font-bold"
            )}
            key={id}
            onClick={() => handleLink(id)}
          >
            <Image
              alt=""
              width={25}
              height={25}
              src={`/icons/features/${icon}`}
              className={isActive ? "" : "opacity-50 duration-150"}
            />
          </SecondaryButton>
        );
      })}
    </div>
  );
}
