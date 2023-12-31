"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "../utils/PrimaryButton";

export default function BookSomeoneButton() {
  const router = useRouter();
  return (
    <PrimaryButton
      onClick={() => router.push("/book-someone", { scroll: false })}
      className="mb-2"
    >
      Book Someone In
    </PrimaryButton>
  );
}
