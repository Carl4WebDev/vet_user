import React from "react";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { BellIcon, MessageCircleMore, CalendarSearchIcon } from "lucide-react";

import { Link } from "react-router-dom";

import Leo from "../assets/leo.png";

const Navbar = () => {
  return (
    <div className="bg-[#D9D9D9] w-full">
      <div className="flex justify-between items-center px-4 md:px-11 ">
        <Link to="/dashboard">
          <img src={navLogo} className="h-16 md:h-20" alt="Logo" />
        </Link>
        <div className="flex gap-3 md:gap-5 items-center">
          <Link to="/vet-map">
            <div className="bg-white p-2 rounded-full">
              <CalendarSearchIcon className="h-6 w-6 md:h-8 md:w-8" />
            </div>
          </Link>
          <div className="bg-white p-2 rounded-full">
            <BellIcon className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div className="bg-white p-2 rounded-full">
            <MessageCircleMore className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <img
            src={navProfile}
            className="h-8 w-8 md:h-10 md:w-10"
            alt="Profile"
          />
          <h1 className=" text-[15px] md:text-2xl font-semibold">
            Jo Capang Vetter
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
