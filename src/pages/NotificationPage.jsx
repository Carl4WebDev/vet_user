import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

import Navbar from "../components/Navbar";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
import { getClientById } from "../api/get-api/client/getClientById";

export default function NotificationPage() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        if (!clientId) throw new Error("Client ID not found in localStorage");

        const response = await getClientById(clientId);
        setClientData(response?.client || response || null);
      } catch (err) {
        console.error("❌ Failed to fetch client data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, []);

  // ✅ Safely unwrap
  const profileImg =
    clientData?.mainImageUrl || clientData?.client?.mainImageUrl || navProfile;
  const username = clientData?.name || clientData?.client?.name || "Guest";

  // Dummy notifications for now
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

  // ✅ Handle loading/error UI
  if (loading) {
    return (
      <>
        <Navbar
          logo={navLogo}
          profileImg={navProfile}
          username="Loading..."
          navItems={clientNavItems}
        />
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-gray-600 text-sm">Loading notifications...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar
          logo={navLogo}
          profileImg={navProfile}
          username="Error"
          navItems={clientNavItems}
        />
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      </>
    );
  }

  // ✅ Main UI
  return (
    <>
      <Navbar
        logo={navLogo}
        profileImg={profileImg}
        username={username}
        navItems={clientNavItems}
      />

      <div className="min-h-screen bg-gray-200 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-cyan-600" size={24} />
            <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-gray-800">{notif.title}</h2>
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <X size={16} />
                  </button>
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
