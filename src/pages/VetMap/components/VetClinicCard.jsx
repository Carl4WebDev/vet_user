import React from "react";
import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import NavLogo from "../../../assets/nav-logo.png";

export default function VetClinicCard({
  mainImage,
  name,
  rating,
  address,
  onBook,
  isOnline, // ✅ added
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 border border-gray-200">
      {/* Left Side Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-mono font-bold">{name}</h2>
          {/* ✅ dynamic status indicator */}
          <span
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-1">
          <span className="flex items-center gap-1 text-lg font-semibold">
            {rating}
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={"black"} stroke="black" />
            ))}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <MapPin size={14} className="mr-1 text-cyan-600" />
          <span>
            {address
              ? `${address.street || "N/A"}, ${address.city || ""}, ${
                  address.province || ""
                }`
              : "N/A"}
          </span>
        </div>

        {/* Hours */}
        <p className="text-xs text-gray-500 mt-1">Operating hours</p>
        <p className="text-sm">Weekdays 8am - 10pm</p>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={mainImage || NavLogo}
          alt={name}
          className="rounded-md w-28 h-20 object-cover"
        />
        <button
          onClick={onBook}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-full text-sm"
        >
          Book Now
        </button>
        <Link to="/messages">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm">
            Message us
          </button>
        </Link>
      </div>
    </div>
  );
}
