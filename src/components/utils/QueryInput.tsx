import React from "react";
import { twMerge } from "tailwind-merge";

export default function QueryInput({
  search,
  handleSearch,
  placeholder,
  className,
}: {
  placeholder: string;
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      className={twMerge("mb-2", className)}
      value={search}
      onChange={handleSearch}
      placeholder={placeholder}
    />
  );
}
