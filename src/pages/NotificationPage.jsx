import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

import Navbar from "../components/Navbar";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
import { getClientById } from "../api/get-api/client/getClientById";

// ✅ Import the shared API fetcher
import { getClientAnnouncements } from "../updated-api/getClientAnnouncements";

export default function NotificationPage() {
  const [clientData, setClientData] = useState(null);
  const [notifications, setNotifications] = useState([]); // ✅ now dynamic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        if (!clientId) throw new Error("Client ID not found in localStorage");

        // 🧩 Fetch client info
        const response = await getClientById(clientId);
        setClientData(response?.client || response || null);

        // 🧩 Fetch announcements from backend
        const announcements = await getClientAnnouncements();

        // ✅ Filter: show only published ones (and optionally for pet owners)
        const filtered = announcements.filter(
          (a) =>
            a.status === "Published" &&
            (a.target_role_id === 1 || a.target_role_id === null)
        );

        // ✅ Format data to fit existing UI
        const formatted = filtered.map((a) => ({
          id: a.announcement_id,
          title: a.title,
          message: a.content,
          date: new Date(a.created_at).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));

        const localNotifs =
          JSON.parse(localStorage.getItem("client_local_notifications")) || [];

        const allNotifs = [...localNotifs, ...formatted];

        setNotifications(allNotifs);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Clear the notification badge ONLY after the page finishes loading
  useEffect(() => {
    localStorage.setItem("notif_count", "0");
  }, []);

  const profileImg =
    clientData?.mainImageUrl || clientData?.client?.mainImageUrl || navProfile;
  const username = clientData?.name || clientData?.client?.name || "Guest";

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
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No announcements available.
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-gray-800">
                      {notif.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notif.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
