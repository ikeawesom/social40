"use client";

import { useEffect, useState } from "react";
import Notice from "../utils/Notice";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import {
  ROLES_HIERARCHY,
  VERSION_NUMBER,
  VERSION_OBJ,
  VERSION_TITLE,
  VERSION_UPDATES,
} from "@/src/utils/constants";
import { setDismissUpdate } from "@/src/utils/profile/setDismissUpdate";
import { toast } from "sonner";
import Link from "next/link";

export default function UpdatesSection({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const { memberID, dismissedUpdates, role } = memberData;
  const [show, setShow] = useState<boolean>();

  useEffect(() => {
    if (
      (dismissedUpdates !== undefined &&
        dismissedUpdates.includes(VERSION_NUMBER)) ||
      (VERSION_OBJ.adminOnly &&
        ROLES_HIERARCHY[role].rank <= ROLES_HIERARCHY["admin"].rank)
    ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  const handleHide = async () => {
    setShow(false);
    try {
      const { error } = await setDismissUpdate(
        memberID,
        VERSION_NUMBER,
        dismissedUpdates ?? []
      );
      if (error) throw new Error(error);
      toast.success("You may view all Social40 updates in your settings.");
    } catch (err: any) {
      setShow(true);
      toast.error(err.message);
    }
  };

  if (show === true)
    return (
      <Notice status="success" noHeader>
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-xl font-bold">
            Whats New in v{VERSION_NUMBER} - {VERSION_TITLE}?
          </h1>
          <ul className="mb-1">
            {VERSION_UPDATES.map((update: string, index: number) => (
              <li key={index} className="list-disc ml-4">
                {update}
              </li>
            ))}
          </ul>
          <div className="w-full flex items-center justify-between gap-4">
            <Link
              className="text-sm underline hover:opacity-70"
              href="/docs/updates"
            >
              View All Releases
            </Link>
            <p
              onClick={handleHide}
              className="text-sm underline hover:opacity-70"
            >
              Dismiss
            </p>
          </div>
        </div>
      </Notice>
    );
}
