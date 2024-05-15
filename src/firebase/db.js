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
  startAfter,
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
  async getRef({ col_name, id }) {
    const docRef = doc(FIREBASE_DB, col_name, id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return handleResponses({ data: docSnap });
      return handleResponses({ error: "Data not found.", status: false });
    } catch (error) {
      return handleResponses({ error: error.message, status: false });
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

  async getPaginate({ path, orderCol, ascending, limitNo, queryNext }) {
    try {
      const colRef = collection(FIREBASE_DB, path);
      var docList = {};
      let q;

      if (queryNext) {
        // queryNext: documentSnapshot
        q = query(
          colRef,
          orderBy(orderCol, ascending ? "asc" : "desc"),
          startAfter(queryNext),
          limit(limitNo)
        );
      } else {
        q = query(
          colRef,
          orderBy(orderCol ?? "", ascending ? "asc" : "desc"),
          limit(limitNo)
        );
      }

      const qSnap = await getDocs(q);
      let lastPointer;

      qSnap.forEach((doc) => {
        docList[doc.id] = doc.data();
        lastPointer = doc.data().activityID;
      });

      return handleResponses({
        data: {
          data: docList,
          lastPointer,
        },
      });
    } catch (err) {
      return handleResponses({ error: err.message, status: false });
    }
  }
  async getSpecific(args) {
    const {
      path,
      field,
      criteria,
      value,
      orderCol,
      ascending,
      orderCol2,
      ascending2,
      field2,
      criteria2,
      value2,
    } = args;

    try {
      const colRef = collection(FIREBASE_DB, path);
      var q;

      if (orderCol && orderCol2) {
        q = query(
          colRef,
          orderBy(orderCol, !ascending ? "desc" : "asc"),
          orderBy(orderCol2, !ascending2 ? "desc" : "asc")
        );
      } else if (field2 && orderCol) {
        q = query(
          colRef,
          where(field, criteria, value),
          where(field2, criteria2, value2),
          orderBy(orderCol, !ascending ? "desc" : "asc")
        );
      } else if (orderCol && field) {
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
        // throw new Error("Invalid props.");
        q = query(colRef);
      }

      const qSnap = await getDocs(q);
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
