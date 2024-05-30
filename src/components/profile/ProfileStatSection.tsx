import React from "react";
import ProfileStatCard, { ProfileStatType } from "./ProfileStatCard";
import { twMerge } from "tailwind-merge";

export interface ProfileStatSectionType extends ProfileStatType {
  className?: string;
  title?: string;
  onClick?: () => void;
}
export default function ProfileStatSection({
  config,
  title,
  value,
  className,
  onClick,
}: ProfileStatSectionType) {
  return (
    <div className={twMerge("w-full", className)}>
      <p className="text-xs text-custom-dark-text mb-1 font-bold">
        {title ?? "Title"}
      </p>
      <ProfileStatCard onClick={onClick} config={config} value={value} />
    </div>
  );
}
