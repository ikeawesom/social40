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
    <div className="min-h-screen w-full bg-black/25 fixed z-20 grid place-items-center top-0 left-0 px-4 fade-in">
      {loading ? (
        <LoadingIcon />
      ) : (
        <DefaultCard
          className={twMerge(
            "max-w-[600px] w-[90vw] p-4 fade-in-bottom",
            className
          )}
        >
          {children}
        </DefaultCard>
      )}
    </div>
  );
}
