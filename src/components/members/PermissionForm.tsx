"use client";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
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
import HRow from "../utils/HRow";

export default function PermissionForm({
  currentMember,
  viewMember,
}: {
  currentMember: MEMBER_SCHEMA;
  viewMember: MEMBER_SCHEMA;
}) {
  const router = useRouter();

  const oldRole = viewMember.role;

  const [confirm, setConfirm] = useState("");
  const [currentRole, setCurrentRole] = useState(oldRole);
  const [loading, setLoading] = useState(false);
  const { host } = useHostname();

  const ready = confirm === viewMember.memberID;
  const noChange = currentRole === oldRole;
  const sameRole = viewMember.role === currentMember.role;

  const getPermissions = (roleA: string) => {
    var obj = {} as any;
    Object.keys(ROLES_HIERARCHY).forEach((item: any) => {
      if (ROLES_HIERARCHY[item].rank < ROLES_HIERARCHY[roleA].rank) {
        obj[item] = ROLES_HIERARCHY[item];
      }
    });
    return obj;
  };

  const permissions = getPermissions(currentMember.role);

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
          <h1 className="text-start font-semibold text-base">Permissions</h1>
          <HRow className="mb-2" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start justify-center gap-2"
          >
            <div className="flex items-center justify-start w-full gap-2">
              <p className="text-sm flex-[2]">Your permissions</p>
              <p className="flex-[3] text-sm font-semibold">
                {ROLES_HIERARCHY[currentMember.role].title}
              </p>
            </div>
            <div className="flex items-center justify-start w-full gap-2">
              <label htmlFor="permission" className="text-sm w-fit">
                Set Permissions
              </label>
              {sameRole ? (
                <>
                  <p className="flex-1 text-sm font-semibold">
                    {ROLES_HIERARCHY[viewMember.role].title}
                  </p>
                </>
              ) : (
                <select
                  name="permission"
                  id="permission"
                  className="flex-[3]"
                  value={currentRole}
                  onChange={handleChangeSelect}
                >
                  {Object.keys(permissions).map((item: string) => {
                    return (
                      <option key={item} value={item}>
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
              <p className="text-sm text-custom-grey-text">
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
        </div>
      </div>
    </DefaultCard>
  );
}
