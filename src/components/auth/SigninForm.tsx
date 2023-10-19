"use client";
import React, { useState } from "react";
import { authHandler } from "@/src/firebase/auth";

import PrimaryButton from "../utils/PrimaryButton";

type userDetailsType = {
  email: string;
  password: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SigninForm({ setStatus }: statusType) {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>({
    email: "",
    password: "",
  });

  const emailMerged = `${userDetails.email}@digital40sar.com`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authHandler.signIn(emailMerged, userDetails.password);

      if (!res.status) throw new Error(res.error);
      setStatus("success-signin");
    } catch (e: any) {
      setStatus(e.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignin}
      className="flex flex-col gap-y-4 items-center justify-center w-full"
    >
      <div className="flex flex-col gap-4 w-full">
        <input
          required
          type="text"
          name="email"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Working..." : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
