"use client";
import { ROLES_DESC, ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { useRouter } from "next/navigation";
import { LoadingIconBright } from "../utils/LoadingIcon";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { twMerge } from "tailwind-merge";
import DefaultCard from "../DefaultCard";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import Modal from "../utils/Modal";
import ModalHeader from "../utils/ModalHeader";

export default function PermissionForm({
  currentMember,
  viewMember,
}: {
  currentMember: MEMBER_SCHEMA;
  viewMember: MEMBER_SCHEMA;
}) {
  const router = useRouter();

  const oldRole = viewMember.role;

  const { host } = useHostname();
  const [confirm, setConfirm] = useState("");
  const [currentRole, setCurrentRole] = useState(oldRole);
  const [loading, setLoading] = useState(false);
  const [showRoles, setShowRoles] = useState("");

  const ready = confirm === viewMember.memberID;
  const noChange = currentRole === oldRole;
  const sameRole = viewMember.role === currentMember.role;

  const getPermissions = (roleA: string) => {
    var obj = {} as any;
    Object.keys(ROLES_HIERARCHY).forEach((item: any) => {
      if (ROLES_HIERARCHY[item].rank <= ROLES_HIERARCHY[roleA].rank) {
        obj[item] = ROLES_HIERARCHY[item];
      }
    });
    return obj;
  };

  const permissions = getPermissions(currentMember.role);
  const defaultPerms =
    Object.keys(permissions)[Object.keys(permissions).length - 1];

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentRole(e.target.value);
  };

  const handleChangeCfm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (sameRole)
        throw new Error(
          "You cannot change the permissions of another member of the same tier."
        );
      const PostObj = GetPostObj({
        memberID: viewMember.memberID,
        permission: currentRole,
      });
      const res = await fetch(`${host}/api/profile/set-permission`, PostObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      toast.success("Updated member's permissions successfully.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      {showRoles !== "" && (
        <Modal className="max-h-[50vh]">
          <ModalHeader
            close={() => setShowRoles("")}
            heading="View Permissions"
          />
          <select
            value={showRoles}
            onChange={(e) => setShowRoles(e.target.value)}
          >
            {Object.keys(permissions).map((item: any) => (
              <option value={item} key={item}>
                {permissions[item].title}
              </option>
            ))}
          </select>

          <div className="w-full mt-2 flex items-start flex-col justify-start gap-1">
            {Object.keys(ROLES_DESC).map((itemA: string) => {
              const desc = ROLES_DESC[itemA];
              const includes = permissions[showRoles].desc.includes(
                desc
              ) as boolean;
              return (
                <div className="flex items-center justify-start gap-1">
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
          {permissions[showRoles].notes && (
            <p className="text-xs text-custom-grey-text text-start mt-1">
              NOTE: {permissions[showRoles].notes}
            </p>
          )}
        </Modal>
      )}
      <DefaultCard className={twMerge("w-full", sameRole && "opacity-60")}>
        <div
          onClick={() => {
            sameRole &&
              toast.error(
                "You cannot change the permissions of another member of the same tier."
              );
          }}
        >
          <div className={sameRole ? "pointer-events-none" : ""}>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-row items-center justify-start gap-2">
                <h1 className="text-start font-semibold text-base">
                  Account Permissions
                </h1>
                <SecondaryButton
                  onClick={() => setShowRoles(defaultPerms)}
                  className="w-fit self-stretch p-0 border-0 shadow-none"
                >
                  {showRoles ? (
                    <Image
                      src="/icons/icon_question_primary.svg"
                      alt="Show"
                      width={30}
                      height={30}
                    />
                  ) : (
                    <Image
                      src="/icons/icon_question.svg"
                      alt="Hide"
                      width={30}
                      height={30}
                    />
                  )}
                </SecondaryButton>
              </div>
            </div>

            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start justify-center gap-2 mt-2"
              >
                <div
                  className="flex items-center justify-between w-full gap-2 shadow-sm border-[1px]
    border-gray-200 rounded-lg px-3 py-2"
                >
                  <p className="text-sm w-fit">Your Permissions</p>
                  <p className="text-sm font-semibold">
                    {ROLES_HIERARCHY[currentMember.role].title}
                  </p>
                </div>
                <div
                  className={twMerge(
                    "flex justify-between w-full gap-2 shadow-sm border-[1px] border-gray-200 rounded-lg px-3 py-2",
                    sameRole ? "flex-row items-center" : "flex-col items-start"
                  )}
                >
                  <label htmlFor="permission" className="text-sm w-fit">
                    Set Permissions
                  </label>
                  {sameRole ? (
                    <>
                      <p className="text-sm font-semibold">
                        {ROLES_HIERARCHY[viewMember.role].title}
                      </p>
                    </>
                  ) : (
                    <select
                      name="permission"
                      id="permission"
                      value={currentRole}
                      onChange={handleChangeSelect}
                    >
                      {Object.keys(permissions).map((item: string) => {
                        return (
                          <option className="p-2" key={item} value={item}>
                            {permissions[item].title}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <div className="flex flex-col items-start justify-center gap-1 w-full m2-2">
                  <p className="text-sm">
                    Please type this member's member ID below to confirm.
                  </p>
                  <input
                    type="text"
                    placeholder={viewMember.memberID}
                    value={confirm}
                    onChange={handleChangeCfm}
                  />
                  <p className="text-xs mt-1 text-custom-grey-text">
                    Note that the higher the tier, the more permissions will be
                    available to this member.
                  </p>
                </div>
                <PrimaryButton
                  type="submit"
                  disabled={loading || !ready || noChange}
                  className="grid place-items-center"
                >
                  {loading ? (
                    <LoadingIconBright width={20} height={20} />
                  ) : (
                    "Update Permissions"
                  )}
                </PrimaryButton>
              </form>
            </>
          </div>
        </div>
      </DefaultCard>
    </>
  );
}
