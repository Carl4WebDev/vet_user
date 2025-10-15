import { Link, useNavigate } from "react-router-dom";
import { logoutClient } from "../api/authService";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = ({ logo, profileImg, username, navItems }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [clientTableId, setClientTableId] = useState(null); // ✅ state for ID

  useEffect(() => {
    // Wait for localStorage to populate (e.g., after register/login)
    const storedId = localStorage.getItem("client_table_id");
    if (storedId && storedId !== "undefined" && storedId !== "null") {
      setClientTableId(storedId);
    } else {
      // optional retry — sometimes localStorage takes a tick to update
      const timer = setTimeout(() => {
        const retryId = localStorage.getItem("client_table_id");
        if (retryId && retryId !== "undefined" && retryId !== "null") {
          setClientTableId(retryId);
        }
      }, 300); // wait 300ms
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = () => {
    logoutClient();
    navigate("/");
  };

  const handleProfileClick = (e) => {
    if (!clientTableId) {
      e.preventDefault(); // 🧱 block navigation
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
          {navItems?.map(({ to, icon: Icon, label }, index) => (
            <Link
              key={index}
              to={to}
              title={label}
              onClick={() => setIsOpen(false)}
            >
              <div className="bg-white p-3 rounded-full hover:bg-gray-200 transition flex items-center justify-center shadow-md">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
            </Link>
          ))}

          {/* Profile & Logout */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <Link
              to={clientTableId ? `/owner-profile/${clientTableId}` : "#"}
              onClick={handleProfileClick} // ✅ block if no ID yet
              className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0"
            >
              <img
                src={profileImg}
                className={`h-12 w-12 md:h-10 md:w-10 rounded-full border border-gray-300 shadow-md ${
                  !clientTableId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                alt="Profile"
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
