export const ROLES_HIERARCHY = {
  owner: 5,
  uadmin: 4,
  admin: 3,
  umember: 2,
  member: 1,
} as { [role: string]: number };

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export const MAX_LENGTH = 30;
