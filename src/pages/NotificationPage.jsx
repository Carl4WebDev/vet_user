// pages/NotificationPage.jsx
import React from "react";
import { Bell, X } from "lucide-react";
import Navbar from "../components/Navbar";

import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
const client_name = localStorage.getItem("client_name");
import { clientNavItems } from "../config/navItems";

const navProfileClient = localStorage.getItem("navProfileClient");

export default function NotificationPage() {
  // Hardcoded notifications
  const notifications = [
    {
      id: 1,
      title: "System Update",
      message: "We will have scheduled maintenance on Sept 25, 2025, 2:00 AM.",
      date: "Sept 18, 2025",
    },
    {
      id: 2,
      title: "Welcome!",
      message: "Thank you for using our veterinary system. 🐾",
      date: "Sept 10, 2025",
    },
    {
      id: 3,
      title: "New Feature",
      message: "Booking reminders are now available in your profile.",
      date: "Sept 5, 2025",
    },
  ];

  return (
    <>
      <Navbar
        logo={navLogo}
        profileImg={navProfileClient || navProfile}
        username={client_name}
        navItems={clientNavItems}
      />
      <div className="min-h-screen bg-gray-200 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-cyan-600" size={24} />
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-gray-800">{notif.title}</h2>
                  <X size={16} className="text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-2">{notif.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
