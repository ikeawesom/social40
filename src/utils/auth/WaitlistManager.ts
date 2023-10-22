import { dbHandler } from "../../firebase/db";
import handleResponses from "../handleResponses";
import { GROUP_SCHEMA, WAITLIST_SCHEMA } from "../schemas/groups";
import { userHandler } from "./UserManager";

class WaitListClass {
  constructor() {}

  async addToWaitlist({ name, username, password, adminID }: WAITLIST_SCHEMA) {
    try {
      const exists = await dbHandler.get({ col_name: "Groups", id: adminID });

      if (!exists.status)
        throw new Error(
          "You have entered an invalid Admin ID. Please try again or contact your commander."
        );

      var GROUP_DATA = exists.data as GROUP_SCHEMA;
      var waitlist = GROUP_DATA.requestedMembers;

      waitlist.forEach((item) => {
        if (item.username === username)
          throw new Error(
            "This user's registration is still pending approval. Please try again later. "
          );
      });

      const to_add = {
        name: name,
        username: username,
        password: password,
        adminID: adminID,
      } as WAITLIST_SCHEMA;

      waitlist.push(to_add);

      GROUP_DATA = { ...GROUP_DATA, requestedMembers: waitlist };

      const res = await dbHandler.add({
        col_name: "Groups",
        id: adminID,
        to_add: GROUP_DATA,
      });

      if (!res.status) throw new Error(res.error);
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e, status: false });
    }
  }

  async removeFromWaitlist({ adminID, index }: WAITLIST_SCHEMA) {
    try {
      const exists = await dbHandler.get({ col_name: "Groups", id: adminID });
      var GROUP_DATA = exists.data as GROUP_SCHEMA;
      var waitlist = GROUP_DATA.requestedMembers;

      const curUser = waitlist[index];

      const resA = await userHandler.initalizeMember(
        curUser.name,
        curUser.username,
        curUser.password,
        false
      );

      if (!resA.status) throw new Error(resA.error);

      waitlist.splice(index, 1);

      GROUP_DATA = { ...GROUP_DATA, requestedMembers: waitlist };

      const res = await dbHandler.add({
        col_name: "Groups",
        id: adminID,
        to_add: GROUP_DATA,
      });

      if (!res.status) throw new Error(res.error);
      return handleResponses();
    } catch (e) {
      return handleResponses({ error: e, status: false });
    }
  }
}

export const waitlistHandler = new WaitListClass();
