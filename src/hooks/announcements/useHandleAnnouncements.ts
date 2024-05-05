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

  const [tempGrp, setGrp] = useState("");
  const [searching, setSearching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const reset = () => {
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => setPostData(defaultAnnouce);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, error } = await submitPost(postData);
      if (!status) throw new Error(error);
      reset();
      router.refresh();
      toast.success("Nice, your announcement has been posted!");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleAddGroup = async () => {
    setSearching(true);
    try {
      // handle group
      const { error } = await handleSearchGroup(tempGrp);
      if (error) throw new Error(error);

      const tempArr = postData.groups as string[];
      if (!tempArr.includes(tempGrp)) {
        tempArr.push(tempGrp);
        setPostData({ ...postData, groups: tempArr });
      }
    } catch (err: any) {
      const { message } = err;
      if (message.includes("not found")) {
        toast.error("Invalid group ID");
      } else {
        toast.error(err.message);
      }
    }
    setSearching(false);
  };

  const handleRemoveGroup = (group: string) => {
    const tempArr = postData.groups as string[];
    tempArr.splice(tempArr.indexOf(group), 1);
    setPostData({ ...postData, groups: tempArr });
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
    setPostData,
    handleRemoveGroup,
    tempGrp,
    setGrp,
    handleAddGroup,
    searching,
  };
}
