"use client";
import { ROLES_DESC, ROLES_HIERARCHY } from "@/src/utils/constants";
import React, { useState } from "react";
import SecondaryButton from "../../../utils/SecondaryButton";
import Image from "next/image";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import PrimaryButton from "../../../utils/PrimaryButton";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { Onboarding } from "@/src/utils/onboarding";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { LoadingIconBright } from "../../../utils/LoadingIcon";

type NewMemberType = {
  memberData: MEMBER_SCHEMA;
};
export default function CreateNewMemberForm({ memberData }: NewMemberType) {
  const currentRole = memberData.role;
  const { host } = useHostname();
  const [newDetails, setNewDetails] = useState({
    id: "",
    name: "",
    password: "",
  });

  const [newRole, setNewRole] = useState("member");
  const [showRoles, setShowRoles] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const email = `${newDetails.id}@digital40sar.com`;

  const ready =
    newDetails.id !== "" &&
    newDetails.name !== "" &&
    newDetails.password !== "";

  const getPermissions = (roleA: string) => {
    var obj = {} as any;
    Object.keys(ROLES_HIERARCHY).forEach((item: any) => {
      if (ROLES_HIERARCHY[item].rank <= ROLES_HIERARCHY[roleA].rank) {
        obj[item] = ROLES_HIERARCHY[item];
      }
    });
    return obj;
  };

  const permissionList = getPermissions(currentRole);
  const defaultPerms =
    Object.keys(permissionList)[Object.keys(permissionList).length - 1];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setNewDetails({
      ...newDetails,
      [name]: name === "id" ? value.toLowerCase() : value,
    });
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRole(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // check if new user
      const newMemberStatus = await fetch(
        `${host}/api/profile/member`,
        GetPostObj({ memberID: newDetails.id })
      );
      const newMemberData = await newMemberStatus.json();

      if (newMemberData.status)
        throw new Error("Member ID taken. Please choose another.");
      // new user
      console.log("New member. Preparing to register");

      const onboardMemberStatus = await Onboarding.Account({
        displayName: newDetails.name,
        memberID: newDetails.id,
        email: email,
        password: newDetails.password,
        role: newRole,
      });

      if (!onboardMemberStatus.status)
        throw new Error(onboardMemberStatus.error);
      console.log("Registed user.");
      toast.success(
        "Registration successful. They may now sign in with the new account."
      );
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      {showRoles !== "" ? (
        <>
          <div
            onClick={() => setShowRoles("")}
            className="flex items-center justify-start gap-1 mb-2 cursor-pointer hover:bg-custom-light-text duration-150 rounded-md w-fit pl-1 pr-2 py-1"
          >
            <Image
              alt="Back"
              src="/icons/navigation/icon_back.svg"
              width={20}
              height={20}
            />
            <p className="text-custom-dark-text font-bold text-sm">Back</p>
          </div>
          <p className="text-xs text-custom-grey-text mb-1">
            This can be changed later.
          </p>
          <select
            value={showRoles}
            onChange={(e) => setShowRoles(e.target.value)}
          >
            {Object.keys(permissionList).map((item: any) => (
              <option value={item} key={item}>
                {permissionList[item].title}
              </option>
            ))}
          </select>

          <div className="w-full mt-2 flex items-start flex-col justify-start gap-1">
            {Object.keys(ROLES_DESC).map((itemA: string) => {
              const desc = ROLES_DESC[itemA];
              const includes = permissionList[showRoles].desc.includes(
                desc
              ) as boolean;
              return (
                <div
                  key={itemA}
                  className="flex items-center justify-start gap-1"
                >
                  {includes ? (
                    <Image
                      alt="Yes"
                      src="/icons/features/icon_tick.svg"
                      width={25}
                      height={25}
                    />
                  ) : (
                    <Image
                      alt="Yes"
                      src="/icons/features/icon_cross_red.svg"
                      width={25}
                      height={25}
                    />
                  )}
                  <p key={itemA} className="text-sm">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
          {permissionList[showRoles].notes && (
            <p className="text-xs text-custom-grey-text text-start mt-1">
              NOTE: {permissionList[showRoles].notes}
            </p>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center justify-start gap-3 mt-4 pb-2"
        >
          <input
            required
            type="text"
            name="id"
            placeholder="Choose a Member ID"
            value={newDetails.id}
            onChange={handleChange}
          />
          <input
            required
            type="text"
            name="name"
            placeholder="Choose a Display Name"
            value={newDetails.name}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between gap-2 w-full">
            <input
              type={show ? "text" : "password"}
              required
              name="password"
              minLength={8}
              value={newDetails.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <SecondaryButton
              onClick={() => setShow(!show)}
              className="w-fit self-stretch px-2 border-0 shadow-none"
            >
              {show ? (
                <Image
                  src="/icons/icon_hide.svg"
                  alt="Hide"
                  width={30}
                  height={30}
                />
              ) : (
                <Image
                  src="/icons/icon_show.svg"
                  alt="Show"
                  width={30}
                  height={30}
                />
              )}
            </SecondaryButton>
          </div>

          <div className="w-full flex flex-col items-start justify-start gap-1">
            <div className="flex items-center justify-start gap-1">
              <label
                htmlFor="permission"
                className="w-fit text-sm text-custom-dark-text"
              >
                Set Permissions
              </label>
              <SecondaryButton
                onClick={() => setShowRoles(defaultPerms)}
                className="w-fit self-stretch p-0 border-0 shadow-none"
              >
                {showRoles ? (
                  <Image
                    src="/icons/icon_question_primary.svg"
                    alt="Show"
                    width={25}
                    height={25}
                  />
                ) : (
                  <Image
                    src="/icons/icon_question.svg"
                    alt="Hide"
                    width={25}
                    height={25}
                  />
                )}
              </SecondaryButton>
            </div>

            <select
              name="permission"
              id="permission"
              className="flex-1"
              value={newRole}
              onChange={handleChangeSelect}
            >
              {Object.keys(permissionList).map((item: string) => {
                return (
                  <option key={item} value={item}>
                    {permissionList[item].title}
                  </option>
                );
              })}
            </select>
          </div>
          <PrimaryButton
            type="submit"
            className="grid place-items-center"
            disabled={loading || !ready}
          >
            {loading ? (
              <LoadingIconBright width={20} height={20} />
            ) : (
              "Create Account"
            )}
          </PrimaryButton>
        </form>
      )}
    </>
  );
}
