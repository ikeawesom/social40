"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
};

export default function Modal({ children, className, loading }: ModalProps) {
  return (
    <div className="min-h-screen w-full bg-black/25 fixed z-20 grid place-items-center top-0 left-0">
      {loading ? (
        <LoadingIcon />
      ) : (
        <DefaultCard className={twMerge("min-[400px]:p-6 p-4", className)}>
          {children}
        </DefaultCard>
      )}
    </div>
  );
}
