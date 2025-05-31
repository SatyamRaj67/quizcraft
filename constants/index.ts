import {
  TbAward,
  TbCashRegister,
  TbChartBar,
  TbDashboard,
  TbReportAnalytics,
} from "react-icons/tb";

export const navData = {
  main: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: TbDashboard,
    },
    {
      title: "Market",
      href: "/market",
      icon: TbChartBar,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: TbReportAnalytics,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: TbCashRegister,
    },
    {
      title: "Achievements",
      href: "/achievements",
      icon: TbAward,
    },
  ],
};
