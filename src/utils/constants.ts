import { BadgeColorsType } from "./schemas/members";

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
  GOLD: {
    bg: "bg-orange-300",
    text: "text-orange-700",
  },
  SHARPSHOOTER: {
    bg: "bg-green-300",
    text: "text-green-800",
  },
  RECON: {
    bg: "bg-blue-300",
    text: "text-blue-800",
  },
  FLASH: {
    bg: "bg-red-600",
    text: "text-yellow-200",
  },
} as {
  [key: string]: BadgeColorsType;
};

export const MAX_LENGTH = 30;

export const GROUP_MEMBERS_SELECT_OPTIONS = {
  "Book In": {
    withOwner: true,
  },
  "Book Out": {
    withOwner: true,
  },
  "Mark as On-Course": {
    withOwner: true,
  },
  "Unmark as On-Course": {
    withOwner: true,
  },
  "Remove from Group": {
    withOwner: false,
  },
  "Make Admin": {
    withOwner: false,
  },
  "Remove Admin": {
    withOwner: false,
  },
} as {
  [action: string]: {
    withOwner: boolean;
  };
};

export const ACTIVITY_TYPE = ["Light", "Moderate", "Strenuous"];
export const GROUP_ACTIVITY_PARTICIPANTS = {
  all: {
    text: "All Members",
    isDefault: true,
  },
  admins: {
    text: "Only Admins",
    isDefault: false,
  },
  members: {
    text: "Only Members",
    isDefault: false,
  },
  course: {
    text: "Members On Course",
    isDefault: false,
  },
  custom: {
    text: "Custom",
    isDefault: false,
  },
} as {
  [type: string]: {
    isDefault: boolean;
    text: string;
  };
};

export const GROUP_ACTIVITY_CREATION_PROGRESS = [
  "Creating group activity...",
  "Collecting participants...",
  "Verifiying and adding participants...",
  "Finishing up...",
];

export const MONTHS = [
  "JANUARY",
  "FEBUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export type DefaultStatsType = {
  name: string;
  featured: boolean;
  scoringType: "ASC" | "DESC";
  criteria?: any;
  timing?: boolean;
  weightage: number;
  bestScore: number;
};

export const DEFAULT_STATS = {
  IPPT: {
    name: "IPPT",
    featured: true,
    scoringType: "DESC",
    criteria: { gold: 85, silver: 75, pass: 61 },
    weightage: 35,
    bestScore: 100,
  },
  ATP: {
    name: "ATP",
    featured: true,
    scoringType: "DESC",
    criteria: {
      mm: 29,
      pass: 21,
    },
    weightage: 25,
    bestScore: 100,
  },
  VOC: {
    name: "VOC",
    featured: true,
    scoringType: "ASC",
    timing: true,
    weightage: 20,
    bestScore: 960,
  },
  SOC: {
    name: "SOC",
    featured: false,
    scoringType: "ASC",
    timing: true,
    weightage: 10,
    bestScore: 284,
  },
} as { [type: string]: DefaultStatsType };

export const LEADERBOARD_CATS = {
  OVERALL: {
    name: "OVERALL",
    timing: false,
  },
  IPPT: {
    name: "IPPT",
    timing: false,
  },
  ATP: {
    name: "ATP",
    timing: false,
  },
  VOC: {
    name: "VOC",
    timing: true,
  },
  SOC: {
    name: "SOC",
    timing: true,
  },
  COS: {
    name: "COS",
    timing: false,
  },
  "guard-duty": {
    name: "Guard Duty",
    timing: false,
  },
} as LeaderboardCatType;

export type LeaderboardCatType = {
  [type: string]: { name: string; timing: boolean };
};

export type PodiumType = "GOLD" | "SILVER" | "BRONZE" | "DEFAULT";
export const PODIUM_INDEX_TYPE = {
  0: "SILVER",
  1: "GOLD",
  2: "BRONZE",
} as { [index: number]: string };

export const TOTAL_DUTY_POINTS = 30;
export const DUTY_WEIGHTAGE = 10;

export type GAME_TYPE = {
  id: string;
  title: string;
  comingSoon: boolean;
  img: string;
};

export const GAMES_LIST = {
  stallion: {
    id: "stallion",
    title: "Stallion Wars",
    comingSoon: false,
    img: "/images/games/stallion/card-background.jpg",
  },
  poker: {
    id: "poker",
    title: "Poker",
    comingSoon: true,
    img: "/images/games/poker/card-background.png",
  },
} as { [gameID: string]: GAME_TYPE };
