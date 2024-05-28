import { FIREBASE_APP } from "./config";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import handleResponses from "../utils/helpers/handleResponses";

export const FB_STORAGE = getStorage(FIREBASE_APP);

console.log("Initailized Cloud Storage");

class StorageClass {
  constructor() {}

  async upload({ file, path }) {
    try {
      const storageRef = ref(FB_STORAGE, path);
      const res = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(res.ref);
      return handleResponses({ data: url });
    } catch (err) {
      console.log("err:", err);
      return handleResponses({ status: false, error: err.message });
    }
  }

  async delete({ path }) {
    try {
      const storageRef = ref(FB_STORAGE, path);
      await deleteObject(storageRef);
      return handleResponses();
    } catch (err) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  async deleteMultiple({ path }) {
    try {
      const storageRef = ref(FB_STORAGE, path);
      const { items } = await listAll(storageRef);

      const promArr = items.map(async (item) => {
        const path = item.fullPath;
        const { error } = await this.delete({ path });
        if (error) return handleResponses({ status: false, error });
        return handleResponses();
      });

      const resArr = await Promise.all(promArr);

      resArr.forEach((item) => {
        if (item.error) throw new Error(item.error);
      });

      return handleResponses();
    } catch (err) {
      return handleResponses({ status: false, error: err.message });
    }
  }
}

export const storageHandler = new StorageClass();
