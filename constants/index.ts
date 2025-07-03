import {
  TbBrain,
  TbBroadcast,
  TbChartBar,
  TbDashboard,
  TbFileDescription,
  TbHelp,
  TbPlayCard,
  TbReportAnalytics,
  TbSettings,
  TbTerminal,
  TbTrophy,
  TbUsers,
  TbBolt,
  TbTarget,
  TbTimeDuration15,
} from "react-icons/tb";

export const features = [
  {
    icon: TbBrain,
    title: "AI-Powered Questions",
    description: "Generate dynamic quizzes with Gemini 2.0 technology",
    color: "text-purple-500",
  },
  {
    icon: TbUsers,
    title: "Multiplayer Battles",
    description: "Compete with friends in real-time quiz challenges",
    color: "text-blue-500",
  },
  {
    icon: TbChartBar,
    title: "Advanced Analytics",
    description: "Track your progress and identify areas for improvement",
    color: "text-green-500",
  },
  {
    icon: TbTrophy,
    title: "Achievements & Rewards",
    description: "Unlock badges and climb the global leaderboards",
    color: "text-yellow-500",
  },
];

export const stats = [
  { label: "Active Users", value: "10K+", icon: TbUsers },
  { label: "Quiz Questions", value: "50K+", icon: TbTarget },
  { label: "Avg. Session", value: "15 min", icon: TbTimeDuration15 },
  { label: "Success Rate", value: "85%", icon: TbChartBar },
];

export const navData = {
  brand: {
    title: "QuizCraft",
    logo: TbBrain,
    tagline: "Crafting Knowledge, One Quiz at a Time",
  },
  navMain: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: TbDashboard,
    },
    {
      title: "Play Quiz",
      href: "/quiz",
      icon: TbPlayCard,
    },
    {
      title: "Create Quiz",
      href: "/create",
      icon: TbBolt,
    },
    {
      title: "My Quizzes",
      href: "/my-quizzes",
      icon: TbFileDescription,
    },
    {
      title: "Leaderboards",
      href: "/leaderboards",
      icon: TbTrophy,
    },
    {
      title: "Multiplayer",
      href: "/multiplayer",
      icon: TbUsers,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: TbReportAnalytics,
    },
    {
      title: "Test",
      href: "/test",
      icon: TbTarget,
    },
  ],
  navAdmin: [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: TbTerminal,
    },
    {
      title: "Manage Quizzes",
      href: "/admin/quizzes",
      icon: TbFileDescription,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: TbUsers,
    },
    {
      title: "System Analytics",
      href: "/admin/analytics",
      icon: TbChartBar,
    },
    {
      title: "Announcements",
      href: "/admin/announcements",
      icon: TbBroadcast,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: TbSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: TbHelp,
    },
  ],
};
