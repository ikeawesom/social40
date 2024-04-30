"use client";
import React, { useEffect, useState } from "react";
import Modal from "../utils/Modal";
import Image from "next/image";
import PrimaryButton from "../utils/PrimaryButton";
import Link from "next/link";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { toast } from "sonner";
import ModalHeader from "../utils/ModalHeader";

export default function FeedbackModal({
  memberID,
}: {
  memberID: string | undefined;
}) {
  const { host } = useHostname();
  const [show, setShow] = useState("new");

  useEffect(() => {
    const handleFeedback = async () => {
      // get member data
      const memberObj = GetPostObj({ memberID });
      const res = await fetch(`${host}/api/profile/member`, memberObj);
      const body = await res.json();
      if (!body.status) return;

      // show feedback modal if feedback not done
      const data = body.data as MEMBER_SCHEMA;
      if (!data.feedback) setShow("show");
    };

    // if first time user on the page per session
    if (show === "new" && memberID !== undefined) handleFeedback();
  }, [show, memberID]);

  const handleSubmit = async () => {
    // close modal
    setShow("finished");

    // set finished feedback to database
    const memberObj = GetPostObj({ memberID });
    const res = await fetch(`${host}/api/profile/feedback-done`, memberObj);
    const body = await res.json();

    if (!body.status) toast.error(body.error.message);
  };

  if (show === "show")
    return (
      <Modal>
        <ModalHeader
          close={() => setShow("closed")}
          className="mb-2"
          heading="Enjoying Social40?"
        />
        <div className="flex flex-col items-center justify-start gap-2 mb-2">
          <Image
            src="/icons/icon_smile.svg"
            alt="Feedback"
            width={100}
            height={100}
          />
          <p className="text-center text-sm">
            Give us some feedback, your response means a lot to us! It will only
            take a short bit of your time.
          </p>
        </div>
        <Link href="https://bit.ly/social40-feedback" onClick={handleSubmit}>
          <PrimaryButton className="flex items-center justify-center">
            Begin Feedback
            <Image
              src="/icons/icon_right_bright.svg"
              alt=""
              width={20}
              height={20}
            />
          </PrimaryButton>
        </Link>
      </Modal>
    );
}
