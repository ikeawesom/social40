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
  "0.5.1": {
    version: "0.5.0",
    title: "Booking In",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Commanders can now mass book in soldiers via respective group pages",
    ],
  },
  "0.5.0": {
    version: "0.5.0",
    title: "Announcements",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Admins can now create posts to broadcast announcements",
      "Friends feature has been removed",
    ],
  },
  "0.4.0": {
    version: "0.4.0",
    title: "Statuses Viewing",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Only active statuses will be shown on the main group page",
      "A link is available to view all past statuses of every member in the group",
    ],
  },
  "0.3.3": {
    version: "0.3.3",
    title: "Profile Pictures",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Introducting Profile Pictures! Users can now add profile pictures to their Social40 accounts",
    ],
  },
  "0.3.2": {
    version: "0.3.2",
    title: "Download Activity Data",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Commanders can now download participation data from group activities into spreadsheets",
    ],
  },
  "0.3.1": {
    version: "0.3.1",
    title: "Strength and Participation",
    desc: "You are part of Social40's beginning. Feel free to provide your feedback.",
    updates: [
      "Members will now be automatically added into activities upon creation except those on MC and statuses on the start date of the activity",
      "Commanders can also opt out of the previous option and choose to custom-select who to join the activity",
      "Commanders can now kick members from activities and categorise according to falling out",
      "Commanders can more easily manage participation as present fall outs are already automatically not added",
      "Commanders can view Strengths, MCs and Statuses distinctively",
    ],
  },
  "0.3.0": {
    version: "0.3.0",
    title: "Beta Release",
    desc: "First stable beta release. Some features may still be unstable.",
    updates: [],
  },
  "0.2.3": {
    version: "0.2.3",
    title: "Activity Remarks",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Members can now make remarks to activities that have ended",
      "Members must have been a participant of that activity",
      "Activity owners can view all remarks made by participants",
      "Serves to provide feedback to commanders regarding training",
    ],
  },
  "0.2.2": {
    version: "0.2.2",
    title: "Activity Feed for Groups",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Activities feed now can be split between groups and friends",
      "Group activities created will be displayed on activity feed of group members",
      "Group activities created can have restricitions (restrict to group members only and a deadline to join activity)",
      "Members can request to participate in the activity, which will be tracked on their public profile",
      "Their latest activities will be monitored to track their HA statuses",
    ],
  },
  "0.2.1": {
    version: "0.2.1",
    title: "Group Activities",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Group activities can now be added via the group dashboard by the group owner",
    ],
  },
  "0.1.2": {
    version: "0.1.2",
    title: "Specific BIBO Statuses",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "COS, commanders and above can now view the BIBO statuses of members with a simple member ID search.",
      "BIBO statuses can now be generated into excel sheets for easier references.",
    ],
  },
  "0.1.1": {
    version: "0.1.1",
    title: "Statuses",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [
      "Status feature are now available for both members and groups.",
      "Commanders and above can now endorse statuses of others, NOT themselves.",
    ],
  },
  "0.1.0": {
    version: "0.1.0",
    title: "First Release",
    desc: "Please note that this is still a beta testing version. Some features may still be unstable.",
    updates: [],
  },
} as {
  [versionNumber: string]: {
    version: string;
    title: string;
    desc: string;
    updates: string[];
  };
};

export const ACTIVITY_TYPE = ["Light", "Moderate", "Strenuous"];

export const VERSION_NUMBER = Object.keys(VERSION_MAP)[0] as string;
export const VERSION_DESC = VERSION_MAP[VERSION_NUMBER].desc;
export const VERSION_UPDATES = VERSION_MAP[VERSION_NUMBER].updates;

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
