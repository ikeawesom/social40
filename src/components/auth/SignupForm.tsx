"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { LoadingIconBright } from "../utils/LoadingIcon";
import { handleServerSignUp } from "@/src/utils/auth/handleServerAuth";

export type userDetailsType = {
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

  const groupIDtrimmed = userDetails.admin.trim().toLowerCase();
  const nameTrimmed = userDetails.name
    .trim()
    .toLowerCase()
    .split(" ")
    .join("-");
  const username = `${groupIDtrimmed}-${nameTrimmed}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const { error } = await handleServerSignUp({
        groupID: groupIDtrimmed,
        memberID: username,
        userDetails,
      });
      if (error) throw new Error(error);

      setStatus("success-signup");
    } catch (e: any) {
      setStatus(e.message);
    }
    setLoading(false);
  };
  return (
    <form
      className="flex flex-col gap-y-4 items-center justify-center w-full"
      onSubmit={handleSignup}
    >
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
      <span className="min-[500px]:w-[400px] w-[85vw]">
        <input
          required
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <p className="text-gray-400 text-sm mt-2">
          Username: <span className="font-bold">{username}</span>
        </p>
      </span>
      <input
        required
        type="password"
        name="password"
        placeholder="Choose a password"
        minLength={8}
        onChange={handleChange}
      />

      <PrimaryButton
        type="submit"
        className="grid place-items-center"
        disabled={loading}
      >
        {loading ? <LoadingIconBright height={20} width={20} /> : "Sign up"}
      </PrimaryButton>
    </form>
  );
}
