import { Link } from "react-router-dom";
import { logoutClient } from "../api/authService";
import { Navigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const client_table_name = localStorage.getItem("client_table_id");

const Navbar = ({ logo, profileImg, username, navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutClient();
    Navigate("/");
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
              to={`/owner-profile/${client_table_name}`}
              className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0"
            >
              <img
                src={profileImg}
                className="h-12 w-12 md:h-10 md:w-10 rounded-full border border-gray-300 shadow-md"
                alt="Profile"
              />

              <h1 className="text-lg md:text-2xl font-semibold text-center md:text-left">
                {username}
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
