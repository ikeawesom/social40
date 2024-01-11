import React from "react";

export default function QueryInput({
  search,
  handleSearch,
  placeholder,
}: {
  placeholder: string;
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className="mb-2"
      value={search}
      onChange={handleSearch}
      placeholder={placeholder}
    />
  );
}
