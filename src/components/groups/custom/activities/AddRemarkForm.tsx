import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import React, { useState } from "react";
import { toast } from "sonner";

export default function AddRemarkForm({
  activityID,
  memberID,
  close,
}: {
  memberID: string;
  activityID: string;
  close: () => void;
}) {
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    remark: "",
  });

  const handleRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inputObj = GetPostObj({
        memberID,
        activityID,
        remarks: input.remark,
        remarkTitle: input.title,
      });

      const res = await fetch(
        `${host}/api/activity/group-set-remark`,
        inputObj
      );
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      toast.success(
        "Remark submitted to activity owner. Thanks for providing your feedback!"
      );
      close();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleChangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleRemark}
      className="flex flex-col gap-y-4 items-center justify-center w-full"
    >
      <FormInputContainer inputName="title" labelText="Title your remark">
        <input
          type="text"
          required
          name="title"
          onChange={handleChange}
          placeholder="e.g. Difficulty, Training Programme, etc."
          value={input.title}
        />
      </FormInputContainer>
      <FormInputContainer inputName="remark" labelText="Enter your remark">
        <textarea
          required
          name="remark"
          value={input.remark}
          onChange={handleChangeArea}
          placeholder="e.g. This activity was too strenuous and could add more breaks, etc."
          className="resize-none h-[10vh]"
        />
      </FormInputContainer>
      <PrimaryButton
        className="grid place-items-center"
        type="submit"
        disabled={loading}
      >
        {loading ? <LoadingIconBright height={20} width={20} /> : "Submit"}
      </PrimaryButton>
    </form>
  );
}
