"use client";
import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "./circleStyles.css";
import ProgressProvider from "./ProgressProvider";
import { twMerge } from "tailwind-merge";
import { ProfileStatSectionType } from "../../profile/ProfileStatSection";

export interface CircularProgressType extends ProfileStatSectionType {
  children: React.ReactNode;
}

export default function CircleProgess({
  value,
  config,
  children,
}: CircularProgressType) {
  const { first, second, higherBetter } = config;
  const color = higherBetter
    ? value > first
      ? "#2B8B35"
      : value > second
      ? "#FF9901"
      : "#FF4141"
    : value < first
    ? "#2B8B35"
    : value < second
    ? "#FF9901"
    : "#FF4141";

  const textColor = higherBetter
    ? value > first
      ? "text-[#2B8B35]"
      : value > second
      ? "text-[#FF9901]"
      : "text-[#FF4141]"
    : value < first
    ? "text-[#2B8B35]"
    : value < second
    ? "text-[#FF9901]"
    : "text-[#FF4141]";

  return (
    <ProgressProvider valueStart={0} valueEnd={value}>
      {(value: number) => (
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            textSize: "20px",
          })}
          value={value}
        >
          <div className="flex items-center justify-center flex-col">
            {children}
            <p
              className={twMerge("text-center font-bold", textColor)}
            >{`${value}%`}</p>
          </div>
        </CircularProgressbarWithChildren>
      )}
    </ProgressProvider>
  );
}
