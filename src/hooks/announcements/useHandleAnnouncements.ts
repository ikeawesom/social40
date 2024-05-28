import { DisplayMediaType } from "@/src/components/announcements/media/AddMedia";
import submitPost from "@/src/components/announcements/submitPostData";
import {
  getDefaultAnnouncement,
  ANNOUNCEMENT_SCHEMA,
} from "@/src/utils/schemas/announcements";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { handleMediaUpload } from "./handleMediaUpload";

export function useHandleAnnouncements(memberID: string) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const defaultAnnouce = getDefaultAnnouncement(memberID);

  const [postData, setPostData] = useState<ANNOUNCEMENT_SCHEMA>(defaultAnnouce);
  const [mediaFiles, setMediaFiles] = useState<DisplayMediaType[]>([]);

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
    setMediaFiles([]);
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

  const handleMediaChange = ({ file, id, src }: DisplayMediaType) =>
    setMediaFiles((temp) => [...temp, { file, id, src }]);

  const removeFile = (id: string) => {
    setMediaFiles((temp) =>
      temp.filter((item: DisplayMediaType) => item.id !== id)
    );
  };

  const handleSubmit = async (e: FormEvent, groups: string[]) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error, data: id } = await submitPost(postData, groups);
      if (error) throw new Error(error);

      // handle files upload
      if (mediaFiles.length > 0) {
        const { error } = await handleMediaUpload(id, mediaFiles);
        if (error) throw new Error(error);
      }

      reset();
      router.refresh();
      toast.success("Nice, your announcement has been posted!");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return {
    mediaFiles,
    removeFile,
    handleMediaChange,
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
