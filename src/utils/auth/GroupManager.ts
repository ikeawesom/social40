import { dbHandler } from "@/src/firebase/db";
import { GROUP_SCHEMA } from "../schemas/groups";
import handleResponses from "../handleResponses";

class GroupClass {
  constructor() {}

  async initializeGroup({ groupDesc, groupName, owner, uid }: GROUP_SCHEMA) {
    try {
      const { data } = await dbHandler.get({
        col_name: "GROUPS",
        id: uid,
      });

      if (data)
        throw new Error(
          "Admin ID is unavailable. Please input another Admin ID."
        );

      const to_add = {
        uid: uid, // admin ID
        owner: owner, // UID of owner
        groupName: groupName,
        groupDesc: groupDesc,
        members: [], // List of UID of members
        requestedMembers: [], // List of UID of members requested
        createdEvents: [],
        medicalStatus: [],
      };

      const res = await dbHandler.add({
        col_name: "GROUPS",
        id: uid,
        to_add: to_add,
      });

      if (!res.status) throw new Error(res.error);
      handleResponses();
    } catch (e) {
      handleResponses({ error: e, status: false });
    }
  }
}

export const groupHandler = new GroupClass();
