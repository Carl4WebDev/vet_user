// components/AppointmentCard.jsx
import { Calendar, Clock, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

import Leo from "../assets/nav-profile.png";

export default function AppointmentCard({
  vetName,
  petName,
  date,
  time,
  image,
  appointmentId,
}) {
  return (
    <div className="bg-white w-full h-20 rounded-lg flex items-center justify-between p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={image || Leo}
          alt={petName}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="text-sm md:text-lg font-semibold">{vetName}</p>
          <p className="text-xs md:text-sm text-gray-600">{petName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Calendar />
          <span className="text-xs md:text-base">{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock />
          <span className="text-xs md:text-base">{time}</span>
        </div>
      </div>
      <Link to={`/appointment-details/${appointmentId}`}>
        <ArrowRightCircle className="text-cyan-500 h-10 w-10" />
      </Link>
    </div>
  );
}
