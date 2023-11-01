import { FIREBASE_APP } from "./config";
import {
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  collection,
  limit,
  query,
  getDocs,
  where,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  orderBy,
} from "firebase/firestore";
import handleResponses from "../utils/handleResponses";

// const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_DB = initializeFirestore(FIREBASE_APP, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

console.log("Initailized Firestore");

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

  async addGeneral({ path, to_add }) {
    try {
      const ref = await addDoc(collection(FIREBASE_DB, path), to_add);
      return handleResponses({ data: ref });
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
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return handleResponses({ data: docSnap.data() });
      return handleResponses({ error: "Data not found.", status: false });
    } catch (error) {
      return handleResponses({ error: error.message, status: false });
    }
  }

  async getDocs({ col_name }) {
    const colRef = collection(FIREBASE_DB, col_name);
    try {
      const docsSnap = await getDocs(colRef);
      return handleResponses({ data: docsSnap.docs });
    } catch (error) {
      return handleResponses({ error: error.message, status: false });
    }
  }

  async getSpecific(args) {
    const { path, field, criteria, value, orderCol, ascending } = args;

    try {
      const colRef = collection(FIREBASE_DB, path);
      var q;

      if (orderCol && field) {
        q = query(
          colRef,
          where(field, criteria, value),
          orderBy(orderCol, !ascending ? "desc" : "asc")
        );
      } else if (!orderCol && field) {
        q = query(colRef, where(field, criteria, value));
      } else if (orderCol && !field) {
        const asc = ascending ? "asc" : "desc";
        q = query(colRef, orderBy(orderCol, asc));
      } else {
        throw new Error("Invalid props.");
      }

      const qSnap = await getDocs(q);

      if (qSnap.docs.length === 0)
        throw new Error(
          `No document matching your criteria of "${field} ${criteria} ${value}".`
        );
      var docList = {};

      qSnap.forEach((doc) => {
        docList[doc.id] = doc.data();
      });
      return handleResponses({ data: docList });
    } catch (err) {
      return handleResponses({ error: err.message, status: false });
    }
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
