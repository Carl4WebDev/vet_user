import {
  CalendarSearchIcon,
  BellIcon,
  MessageCircleMore,
  HomeIcon,
} from "lucide-react";

export const clientNavItems = [
  { to: "/client-dashboard", icon: HomeIcon, label: "Nav logo" },
  { to: "/vet-map", icon: CalendarSearchIcon, label: "Vet Map" },
  { to: "/notifications", icon: BellIcon, label: "Notifications" },
  { to: "/messages", icon: MessageCircleMore, label: "Messages" },
];

export const adminNavItems = [
  { to: "/dashboard", icon: CalendarSearchIcon, label: "Dashboard" },
  { to: "/manage-users", icon: BellIcon, label: "Manage Users" },
  { to: "/settings", icon: MessageCircleMore, label: "Settings" },
];
