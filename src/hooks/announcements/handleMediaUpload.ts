import { DisplayMediaType } from "@/src/components/announcements/media/AddMedia";
import { addMedia } from "@/src/components/announcements/submitPostData";
import { storageHandler } from "@/src/firebase/storage";
import handleResponses from "@/src/utils/helpers/handleResponses";

export async function handleMediaUpload(
  id: string,
  mediaFiles: DisplayMediaType[]
) {
  try {
    let mediaLinks = [] as string[];
    const promArr = mediaFiles.map(async (image: DisplayMediaType) => {
      const { file, id: imgID } = image;
      const { error, data } = await storageHandler.upload({
        file,
        path: `/ANNOUNCEMENTS/${id}/${imgID}`,
      });
      if (error) return handleResponses({ status: false, error });
      return handleResponses({ data });
    });
    const resolvedArr = await Promise.all(promArr);

    resolvedArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      mediaLinks.push(item.data);
    });

    const { error } = await addMedia(id, mediaLinks);
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
