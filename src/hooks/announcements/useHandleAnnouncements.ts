import submitPost, {
  handleSearchGroup,
} from "@/src/components/announcements/submitPostData";
import {
  getDefaultAnnouncement,
  ANNOUNCEMENT_SCHEMA,
} from "@/src/utils/schemas/announcements";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

export function useHandleAnnouncements(memberID: string) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const defaultAnnouce = getDefaultAnnouncement(memberID);

  const [postData, setPostData] = useState<ANNOUNCEMENT_SCHEMA>(defaultAnnouce);

  const [isPriv, setIsPriv] = useState(false);

  const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const enablePin = () => setPostData({ ...postData, pin: true });
  const disablePin = () => setPostData({ ...postData, pin: false });
  const enablePriv = () => setIsPriv(true);
  const disablePriv = () => setIsPriv(false);

  const reset = () => {
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setPostData(defaultAnnouce);
    setAdvanced(false);
    setIsPriv(false);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent, groups: string[]) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, error } = await submitPost(postData, groups);
      if (!status) throw new Error(error);
      reset();
      router.refresh();
      toast.success("Nice, your announcement has been posted!");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return {
    setShowModal,
    loading,
    showModal,
    reset,
    handleSubmit,
    handleChange,
    postData,
    setAdvanced,
    advanced,

    enablePin,
    disablePin,
    disablePriv,
    enablePriv,
    isPriv,
  };
}
