import React from "react";
import PrimaryButton, { ButtonType } from "./PrimaryButton";
import { twMerge } from "tailwind-merge";

export default function SecondaryButton(props: ButtonType) {
  return (
    <PrimaryButton
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type ? props.type : "button"}
      className={twMerge(
        "bg-white text-custom-dark-text border-[1px] border-custom-light-text",
        `${props.disabled ? "opacity-70 cursor-not-allowed" : ""}`,
        props.activated &&
          (props.activatedStyles ??
            "bg-custom-light-orange border-custom-orange"),
        props.className
      )}
    >
      {props.children ? props.children : "Click Me"}
    </PrimaryButton>
  );
}
