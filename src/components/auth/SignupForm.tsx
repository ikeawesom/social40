"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";

type userDetailsType = {
  admin: string;
  password: string;
  name: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SignupForm({ setStatus }: statusType) {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>({
    admin: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    setStatus("success-signup");
  };

  return (
    <form
      className="flex flex-col gap-y-4 items-center justify-center w-full"
      onSubmit={handleSignup}
    >
      <input
        required
        type="text"
        name="name"
        placeholder="Enter your name"
        onChange={handleChange}
      />
      <input
        required
        type="password"
        name="password"
        placeholder="Choose a password"
        onChange={handleChange}
      />
      <span className="min-[500px]:w-[400px] w-[85vw]">
        <input
          required
          type="text"
          name="admin"
          placeholder="Admin ID"
          onChange={handleChange}
        />
        <p className="text-gray-400 text-sm mt-2">
          You can get this from your commanders.
        </p>
      </span>
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "Sign up"}
      </PrimaryButton>
    </form>
  );
}
