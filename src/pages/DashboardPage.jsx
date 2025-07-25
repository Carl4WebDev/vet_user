import React from "react";

import Navbar from "../components/Navbar";
import FaceCard from "../components/FaceCard";

import {
  PlusIcon,
  Clock,
  Calendar,
  ArrowRightCircle,
  TimerIcon,
  ArrowRight,
} from "lucide-react";

import Leo from "../assets/leo.png";

const DashboardPage = () => {
  const today = "Thursday, July 25"; // Static value for now

  const appointments = [
    { time: "09:00 AM", name: "Deworming - Simba" },
    { time: "11:30 AM", name: "Check-up - Leo" },
    { time: "02:00 PM", name: "Grooming - Nala" },
    { time: "04:15 PM", name: "Vaccination - Max" },
  ];

  return (
    <div className="bg-[#b4b4b7] h-full">
      <Navbar />
      <div className="p-4">
        <div className="p-8 bg-[#d9d9d9] rounded-md">
          <div className=" grid grid-cols-1 md:grid-cols-2 mb-10">
            <div>
              <h1 className="text-3xl font-bold">Good Morning, Hirgie</h1>
              <p>Welcome to your dashboard!</p>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-nowrap justify-center items-center text-10px bg-white p-2 rounded-lg hover:bg-gray-200">
                <PlusIcon /> BOOK VET
              </div>
              <div className="flex flex-nowrap justify-center items-center text-10px bg-white p-2 rounded-lg hover:bg-gray-200">
                <PlusIcon /> NEW PET
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-start items-center gap-5">
            <FaceCard />
            <FaceCard />
            <FaceCard />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Left Column (8/12 on md+) */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-gray-200 p-4 md:p-8 flex flex-col gap-5">
            <h1 className="text-xl font-semibold mb-4">
              Upcoming Appointments
            </h1>

            <div className="bg-white rounded-lg flex flex-col md:flex-row items-center justify-between p-4 shadow-md">
              {/* Left: Image + Name */}
              <div className="flex items-center space-x-4">
                <img
                  src={Leo}
                  alt="Leo"
                  className="w-16 h-16 rounded-full object-center"
                />
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold">Jcaps VET</p>
                  <p className="text-sm text-gray-600">Leo</p>
                </div>
              </div>

              {/* Center: Date + Time */}
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex items-center gap-1">
                  <Calendar />
                  <span className="text-sm">September 26, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock />
                  <span className="text-sm">10:00AM</span>
                </div>
              </div>

              {/* Right: Arrow */}
              <div className="mt-4 md:mt-0">
                <ArrowRightCircle className="text-cyan-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg flex flex-col md:flex-row items-center justify-between p-4 shadow-md">
              {/* Left: Image + Name */}
              <div className="flex items-center space-x-4">
                <img
                  src={Leo}
                  alt="Leo"
                  className="w-16 h-16 rounded-full object-center"
                />
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold">Jcaps VET</p>
                  <p className="text-sm text-gray-600">Leo</p>
                </div>
              </div>

              {/* Center: Date + Time */}
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex items-center gap-1">
                  <Calendar />
                  <span className="text-sm">September 26, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock />
                  <span className="text-sm">10:00AM</span>
                </div>
              </div>

              {/* Right: Arrow */}
              <div className="mt-4 md:mt-0">
                <ArrowRightCircle className="text-cyan-500 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg flex flex-col md:flex-row items-center justify-between p-4 shadow-md">
              {/* Left: Image + Name */}
              <div className="flex items-center space-x-4">
                <img
                  src={Leo}
                  alt="Leo"
                  className="w-16 h-16 rounded-full object-center"
                />
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold">Jcaps VET</p>
                  <p className="text-sm text-gray-600">Leo</p>
                </div>
              </div>

              {/* Center: Date + Time */}
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex items-center gap-1">
                  <Calendar />
                  <span className="text-sm">September 26, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock />
                  <span className="text-sm">10:00AM</span>
                </div>
              </div>

              {/* Right: Arrow */}
              <div className="mt-4 md:mt-0">
                <ArrowRightCircle className="text-cyan-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4/12 on md+) */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="bg-white w-full flex flex-col rounded p-4">
            <h1 className="mb-4 font-bold text-lg">Live Calendar</h1>

            {/* Header */}
            <div className="flex bg-[#eee1c6] items-center justify-between p-4 border-l-8 border-[#ffa673] rounded-md">
              <div className="flex items-center gap-4 w-full">
                <img
                  src={Leo}
                  alt="Calendar"
                  className="w-16 h-16 rounded-full object-contain bg-white p-2"
                />
                <div>
                  <h2 className="text-sm font-semibold">{today}</h2>
                  <p className="text-xs text-gray-600">
                    {appointments.length} Appointments
                  </p>
                </div>
              </div>
              <ArrowRight className="w-10 h-10 md:w-16 md:h-16" />
            </div>

            {/* Appointments List */}
            <div className="mt-4 space-y-2">
              {appointments.map((appt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#fdf6ef] p-3 rounded-md text-sm"
                >
                  <span className="font-medium">{appt.name}</span>
                  <span className="text-gray-500">{appt.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white w-full flex flex-col  rounded p-4 ">
            <h1 className="mb-4 font-bold">Medical History</h1>
            <div className="flex bg-[#eee1c6] items-center justify-between p-4 border-l-8 border-[#ffa673] rounded-md">
              <div className="flex justify-start w-full items-center gap-4">
                <img
                  src={Leo}
                  className="w-16 h-16 rounded-full object-center"
                />
                <h1>Leo</h1>
                <TimerIcon />
                <p> 3 Records</p>
              </div>
              <ArrowRight className="w-10 h-10 md:w-20 md:h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
