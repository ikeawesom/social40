export const ROLES_DESC = {
  "permissions-allow": "Can change permissions for other members",
  "create-admins": "Can create new accounts with set permissions",
  "view-status": "Can view other lower tier member's statuses",
  "group-create": "Can create new groups and invite members",
  "book-in": "Can book people in",
  "join-groups": "Can join groups",
};

export const ROLES_HIERARCHY = {
  owner: {
    rank: 5,
    title: "Tier 5",
    desc: [
      ROLES_DESC["permissions-allow"],
      ROLES_DESC["create-admins"],
      ROLES_DESC["group-create"],
      ROLES_DESC["join-groups"],
      ROLES_DESC["view-status"],
      ROLES_DESC["book-in"],
    ],
  },
  admin: {
    rank: 4,
    title: "Tier 4",
    desc: [
      ROLES_DESC["permissions-allow"],
      ROLES_DESC["create-admins"],
      ROLES_DESC["group-create"],
      ROLES_DESC["join-groups"],
      ROLES_DESC["view-status"],
      ROLES_DESC["book-in"],
    ],
  },
  cos: {
    rank: 3,
    title: "Tier 3 (COS)",
    desc: [
      ROLES_DESC["group-create"],
      ROLES_DESC["join-groups"],
      ROLES_DESC["view-status"],
      ROLES_DESC["book-in"],
    ],
  },
  commander: {
    rank: 2,
    title: "Tier 2",
    desc: [
      ROLES_DESC["group-create"],
      ROLES_DESC["join-groups"],
      ROLES_DESC["view-status"],
    ],
  },
  member: { rank: 1, title: "Tier 1", desc: [ROLES_DESC["join-groups"]] },
} as { [role: string]: { rank: number; title: string; desc: string[] } };

export const GROUP_ROLES_HEIRARCHY = {
  owner: {
    rank: 3,
    title: "Group Owner",
  },
  admin: {
    rank: 2,
    title: "Group Admin",
  },
  member: {
    rank: 1,
    title: "Group Member",
  },
} as { [role: string]: { rank: number; title: string } };

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export const MAX_LENGTH = 30;

export const VERSION_MAP = {
  "0.1.2": {
    version: "0.1.2",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Group activities can now be added via the group dashboard by the group owner",
    ],
  },
  "0.1.1.1": {
    version: "0.1.1.1",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "COS, commanders and above can now view the BIBO statuses of members with a simple member ID search.",
      "BIBO statuses can now be generated into excel sheets for easier references.",
    ],
  },
  "0.1.1": {
    version: "0.1.1",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Status feature are now available for both members and groups.",
      "Commanders and above can now endorse statuses of others, NOT themselves.",
    ],
  },
  "0.1.0": {
    version: "0.1.0",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [],
  },
} as {
  [versionNumber: string]: {
    version: string;
    desc: string;
    updates: string[];
  };
};

export const VERSION_NUMBER = Object.keys(VERSION_MAP)[0] as string;
export const VERSION_DESC = VERSION_MAP[VERSION_NUMBER].desc;
export const VERSION_UPDATES = VERSION_MAP[VERSION_NUMBER].updates;
