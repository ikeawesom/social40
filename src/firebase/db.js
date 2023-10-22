import { FIREBASE_APP } from "./config";
import {
  getFirestore,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  collection,
  limit,
  query,
  getDocs,
} from "firebase/firestore";
import handleResponses from "../utils/handleResponses";

const FIREBASE_DB = getFirestore(FIREBASE_APP);

class DbClass {
  constructor() {}

  async add({ col_name, to_add, id }) {
    try {
      const ref = doc(FIREBASE_DB, col_name, id);
      await setDoc(ref, to_add);
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e.message, status: false });
    }
  }

  async edit({ col_name, data, id }) {
    try {
      const ref = doc(FIREBASE_DB, col_name, id);
      await setDoc(ref, data, { merge: true });
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e.message, status: false });
    }
  }

  async delete({ col_name, id }) {
    try {
      const ref = doc(FIREBASE_DB, col_name, id);
      await deleteDoc(ref);
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e.message, status: false });
    }
  }

  async get({ col_name, id }) {
    const docRef = doc(FIREBASE_DB, col_name, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) return handleResponses({ data: docSnap.data() });

    return handleResponses({ error: "Data not found", status: false });
  }

  async colExists({ path }) {
    try {
      const colRef = collection(FIREBASE_DB, path);
      const limitColRef = query(colRef, limit(1));
      const docSnap = await getDocs(limitColRef);

      if (docSnap.docs.length === 0) throw new Error("Collection not found.");

      var docList = {};

      docSnap.forEach((doc) => {
        docList[doc.id] = doc.data();
      });
      return handleResponses({ data: docList });
    } catch (err) {
      return handleResponses({ error: err.message, status: false });
    }
  }
}

export const dbHandler = new DbClass();
