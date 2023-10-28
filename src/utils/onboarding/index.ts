import handleResponses from "../handleResponses";
import {
  OnboardGroupMember,
  OnboardGroupMemberType,
} from "./OnboardGroupMember";
import { OnboardMemberTypes, OnboardNewMember } from "./OnboardNewMember";

class OnboardingClass {
  constructor() {}

  async Account({
    email,
    password,
    memberID,
    displayName,
    role,
  }: OnboardMemberTypes) {
    try {
      const res = await OnboardNewMember({
        email,
        password,
        memberID,
        displayName,
        role,
      });

      if (!res.status) throw new Error(res.error);
      return handleResponses();
    } catch (err) {
      return handleResponses({ error: err, status: false });
    }
  }

  async GroupMember({ groupID, memberID, role }: OnboardGroupMemberType) {
    try {
      const res = await OnboardGroupMember({ groupID, memberID, role });
      if (!res.status) throw new Error(res.error);
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ error: err, status: false });
    }
  }
}

export const Onboarding = new OnboardingClass();
