"use client";
import SigninForm from "@/src/components/auth/SigninForm";
import SignupForm from "@/src/components/auth/SignupForm";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const [status, setStatus] = useState("");
  const newUser = searchParams["new_user"];

  useEffect(() => {
    if (status === "success-signup")
      toast.success(
        "Your account registration is pending. Please contact you commander to approve your registration."
      );
    else if (status === "invalid-group")
      toast.error(
        "You have entered an invalid group. Please check for typos or contact your commander."
      );
    else if (status !== "" && status !== "success-signin") toast.error(status); // error message
    if (status !== "") setStatus("");
  }, [status]);

  return (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="flex flex-col gap-y-6 items-center justify-center">
        <h1 className="sm:text-6xl text-5xl">
          Social
          <span className="text-custom-primary font-bold text-center">40</span>
        </h1>
        <p className="text-custom-grey-text text-center sm:text-base text-sm">
          Compete and motivate one another to be the best.
        </p>
        {newUser === "false" ? (
          <div className="flex-col flex gap-y-4 items-center justify-center min-[500px]:w-[400px] w-[85vw]">
            <SigninForm setStatus={setStatus} />
            <p className="text-center">
              New here?{" "}
              <span>
                <Link
                  className="text-orange-500 hover:brightness-90 duration-300"
                  href={`?${new URLSearchParams({ new_user: "true" })}`}
                >
                  Sign up.
                </Link>
              </span>
            </p>
          </div>
        ) : (
          <div className="flex-col flex gap-y-4 items-center justify-center min-[500px]:w-[400px] w-[85vw]">
            <SignupForm setStatus={setStatus} />
            <p className="text-center">
              Already have an account?{" "}
              <span>
                <Link
                  className="text-orange-500 hover:brightness-90 duration-300"
                  href={`?${new URLSearchParams({ new_user: "false" })}`}
                >
                  Sign in.
                </Link>
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
