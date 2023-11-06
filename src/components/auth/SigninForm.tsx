"use client";
import React, { useState } from "react";
import { authHandler } from "@/src/firebase/auth";
import PrimaryButton from "../utils/PrimaryButton";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import { useAuth } from "@/src/contexts/AuthContext";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { clearCookies } from "@/src/utils/clearCookies";
import { useRouter } from "next/navigation";

type userDetailsType = {
  email: string;
  password: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SigninForm({ setStatus }: statusType) {
  const router = useRouter();
  const { setMember } = useAuth();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>({
    email: "",
    password: "",
  });

  const username = userDetails.email.toLowerCase().trim();
  const emailMerged = `${username}@digital40sar.com`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // lowercase memberID (not case-sensitive)
      const memberID = username;

      // setting cookie for memberID
      const PostMember = GetPostObj({ memberID });
      const resB = await fetch(`${host}/api/auth/cookiemember`, PostMember);

      const { status, error } = await resB.json();

      if (!status) throw new Error(error);

      // sign in to firebase
      const auth = getAuth(FIREBASE_APP);
      const res = await authHandler.signIn(
        auth,
        emailMerged,
        userDetails.password
      );

      if (!res.status) throw new Error(res.error);
      router.refresh();
      setMember(memberID);
    } catch (e: any) {
      await clearCookies(host);
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
