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
