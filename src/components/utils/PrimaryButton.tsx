"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

export type ButtonType = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  activated?: boolean;
};

export default function PrimaryButton(props: ButtonType) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type ? props.type : "button"}
      className={twMerge(
        "shadow-sm text-sm duration-150 ease-in-out w-full rounded-lg bg-custom-primary text-custom-light-text px-6 py-2",
        `${
          props.disabled
            ? "opacity-70 cursor-not-allowed"
            : "hover:brightness-95"
        }`,
        props.className
      )}
    >
      {props.children ? props.children : "Click Me"}
    </button>
  );
}
