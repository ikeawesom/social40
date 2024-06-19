"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Modal from "../utils/Modal";
import Image from "next/image";
import PrimaryButton from "../utils/PrimaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { toast } from "sonner";
import ModalHeader from "../utils/ModalHeader";
import { useFeedbackContext } from "@/src/contexts/FeedbackContext";
import StarsSection from "./StarsSection";
import HRow from "../utils/HRow";
import SecondaryButton from "../utils/SecondaryButton";
import FormInputContainer from "../utils/FormInputContainer";
import { confirmFeedback } from "@/src/utils/feedback/handleFeedback";
import ModalLoading from "../utils/ModalLoading";

export default function FeedbackModal({ memberID }: { memberID: string }) {
  const { host } = useHostname();
  const [show, setShow] = useState("new");
  const [loading, setLoading] = useState(false);
  const { feedbackDetails, handleChange } = useFeedbackContext();
  const rating = feedbackDetails?.rating ?? 0;
  const desc = feedbackDetails?.desc ?? "";

  useEffect(() => {
    const handleFeedback = async () => {
      const exists = localStorage.getItem("feedback") === "closed";
      // get member data
      const memberObj = GetPostObj({ memberID });
      const res = await fetch(`${host}/api/profile/member`, memberObj);
      const body = await res.json();
      if (!body.status) return;

      // show feedback modal if feedback not done
      const data = body.data as MEMBER_SCHEMA;
      if (!data.feedback && !exists) setShow("show");
    };

    // if first time user on the page per session
    if (show === "new") handleFeedback();
  }, [show]);

  useEffect(() => {
    if (show === "closed") localStorage.setItem("feedback", "closed");
  }, [show]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await confirmFeedback({ rating, desc, memberID });
      if (error) throw new Error(error);
      toast.success(
        "We appreciate your feedback! Enjoy your stay at Social40."
      );
      setShow("finished");
    } catch (err: any) {
      toast.error(
        "Hmm, we ran into an error while submitting your feedback. Please try again later."
      );
      setShow("closed");
    }
    setLoading(false);
  };

  const close = () => setShow("closed");

  if (show === "show")
    return (
      <Modal>
        <ModalHeader
          close={close}
          className="mb-2"
          heading="Enjoying Social40?"
        />
        {loading ? (
          <ModalLoading text="Retrieving your feedback..." />
        ) : (
          <>
            <div className="flex items-center justify-start gap-2 mb-2">
              <Image
                src="/icons/icon_smile.svg"
                alt="Feedback"
                width={50}
                height={50}
              />
              <p className="text-start text-sm">
                Give us some feedback, your response means a lot to us! It will
                only take a short bit of your time.
              </p>
            </div>
            <HRow className="mb-2" />
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-start justify-start gap-2"
            >
              <StarsSection />
              {rating >= 0 && (
                <FormInputContainer
                  inputName="desc"
                  className="mt-1 mb-2"
                  labelText="Tell us more... (Optional)"
                  labelClassName="text-sm"
                >
                  <textarea
                    value={desc}
                    onChange={handleChange}
                    name="desc"
                    placeholder={`e.g. I feel that ${
                      rating < 2
                        ? "Social40 can be improved"
                        : rating < 4
                        ? "Social40 is a decent app "
                        : "Social40 is very good"
                    } because...`}
                    className="resize-none"
                  />
                </FormInputContainer>
              )}
              <div className="w-full flex items-center justify-between gap-2">
                <SecondaryButton onClick={close}>Dismiss</SecondaryButton>
                <PrimaryButton
                  disabled={rating < 0}
                  type="submit"
                  className="flex items-center justify-center"
                >
                  Submit
                  <Image
                    src="/icons/icon_right_bright.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </PrimaryButton>
              </div>
            </form>
          </>
        )}
      </Modal>
    );
}
