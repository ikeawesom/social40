import { authHandler } from "@/src/firebase/auth";
import handleResponses from "../handleResponses";
import { MEMBER_SCHEMA } from "../schemas/member";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP, SECONDARY_FIREBASE_APP } from "@/src/firebase/config";
import { dbHandler } from "@/src/firebase/db";
import getDate from "../getDate";

class UserClass {
  constructor() {}

  async initalizeMember(
    displayName: string,
    username: string,
    password: string,
    moderator: boolean
  ) {
    const email = username + "@digital40sar.com";

    try {
      const userAuth = getAuth(SECONDARY_FIREBASE_APP);

      // create account
      const res = await authHandler.signUp(userAuth, email, password);
      if (!res.status) throw new Error(res.error);

      const uid = res.data.uid;
      await authHandler.signOutUser(userAuth);

      const to_add = {
        // general
        uid: uid,
        displayName: displayName,
        rank: "",
        username: username,
        dateCreated: getDate(),

        // fun
        points: 0,
        badges: [],
        friends: [], // list of friends UIDs

        // tracking
        bookedIn: false,
        activities: [], // aka their posts
        statistics: [],
        participatedEvents: [], // VOC, IPPT, HA, etc...
        medicalStatus: [],

        // Groups
        joinedGroups: [], // uid of groups
        ownedGroups: [], // uid of groups (only for mods)

        moderator: moderator,
      } as MEMBER_SCHEMA;

      const resA = await dbHandler.add({
        col_name: "MEMBERS",
        id: uid,
        to_add: to_add,
      });

      if (!resA.status) throw new Error(resA.error);
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e, status: false });
    }
  }
}

export const userHandler = new UserClass();
