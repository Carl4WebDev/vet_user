import { Link, useNavigate } from "react-router-dom";
import { logoutClient } from "../api/authService";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext"; // ✅ Global chat context import
const notifCount = parseInt(localStorage.getItem("notif_count")) || 0;

const Navbar = ({ logo, profileImg, username, navItems }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [clientTableId, setClientTableId] = useState(null);
  const { totalUnread } = useChat(); // ✅ Access global unread count

  useEffect(() => {
    // ✅ Safe client_table_id fetch
    const storedId = localStorage.getItem("client_table_id");
    if (storedId && storedId !== "undefined" && storedId !== "null") {
      setClientTableId(storedId);
    } else {
      const timer = setTimeout(() => {
        const retryId = localStorage.getItem("client_table_id");
        if (retryId && retryId !== "undefined" && retryId !== "null") {
          setClientTableId(retryId);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = () => {
    logoutClient();
    navigate("/");
  };

  const handleProfileClick = (e) => {
    if (!clientTableId) {
      e.preventDefault();
      alert("Please wait — your profile is still loading...");
      return;
    }
  };

  return (
    <div className="bg-[#D9D9D9] w-full shadow-md">
      <div className="flex justify-between items-center px-4 md:px-11 py-2">
        {/* Logo */}
        <Link to="/client-dashboard">
          <img src={logo} className="h-14 md:h-20" alt="Logo" />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-40">
          {isOpen ? (
            <X
              className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <Menu
              className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>

        {/* Navigation */}
        <div
          className={`md:flex md:flex-row md:gap-5 md:items-center md:static absolute bg-[#D9D9D9] md:bg-transparent w-full md:w-auto left-0 transition-all duration-300 ease-in-out ${
            isOpen
              ? "top-0 h-screen opacity-100 flex flex-col items-center justify-center gap-6 z-40"
              : "top-[-100vh] opacity-0 md:opacity-100"
          }`}
        >
          {Array.isArray(navItems) &&
            navItems.map(({ to, icon: Icon, label }, index) => (
              <Link
                key={index}
                to={to}
                title={label}
                onClick={() => setIsOpen(false)}
                className="relative" // ✅ for badge positioning
              >
                <div className="bg-white p-3 rounded-full hover:bg-gray-200 transition flex items-center justify-center shadow-md relative">
                  {Icon && (
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  )}

                  {/* ✅ Red unread badge for "Messages" */}
                  {label?.toLowerCase() === "messages" &&
                    typeof totalUnread === "number" &&
                    totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 min-w-[18px] text-center shadow">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}

                  {/* 🔵 Notification badge (localStorage) */}
                  {label?.toLowerCase() === "notifications" &&
                    notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 min-w-[18px] text-center shadow">
                        {notifCount > 99 ? "99+" : notifCount}
                      </span>
                    )}
                </div>
              </Link>
            ))}

          {/* Profile & Logout */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <Link
              to={clientTableId ? `/owner-profile/${clientTableId}` : "#"}
              onClick={handleProfileClick}
              className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0"
            >
              <img
                src={profileImg}
                className={`h-12 w-12 md:h-10 md:w-10 rounded-full border border-gray-300 shadow-md ${
                  !clientTableId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                alt="Profile"
                onError={(e) => {
                  // ✅ Safe fallback
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />
              <h1
                className={`text-lg md:text-2xl font-semibold text-center md:text-left ${
                  !clientTableId ? "text-gray-400" : "text-black"
                }`}
              >
                {username || "Loading..."}
              </h1>
            </Link>

            <LogOut
              onClick={handleLogout}
              className="bg-white h-9 w-9 md:h-10 md:w-10 p-2 rounded-full hover:cursor-pointer hover:bg-gray-200 shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
