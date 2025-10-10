// components/LiveCalendar.jsx
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function LiveCalendar({ appointments, image }) {
  const [showModal, setShowModal] = useState(false);
  const [hasTodayAppointment, setHasTodayAppointment] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // ✅ Check if there's any appointment for today
  useEffect(() => {
    const hasToday = appointments.some((appt) => {
      const apptDate = new Date(appt.date).toISOString().split("T")[0]; // normalize
      return apptDate === todayStr;
    });

    setHasTodayAppointment(hasToday);

    if (hasToday) {
      setShowModal(true);
    }
  }, [appointments, todayStr]);

  return (
    <div className="bg-white rounded p-4">
      <h1 className="mb-4 font-bold text-lg sm:text-xl">Live Calendar</h1>
      {!hasTodayAppointment && (
        <h2 className="mb-4 font-bold text-lg sm:text-xl">
          No Appointments today!
        </h2>
      )}
      {/* ✅ Only show if there is an appointment today */}
      {hasTodayAppointment && (
        <>
          <div className="flex flex-col sm:flex-row bg-[#eee1c6] items-center justify-between p-4 border-l-8 border-[#ffa673] rounded-md gap-3">
            <div className="flex items-center gap-4 w-full">
              <img
                src={image}
                alt="Calendar"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white p-2"
              />
              <div>
                <h2 className="text-sm sm:text-base font-semibold">
                  {todayStr}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {appointments.length} Appointments
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {appointments
              .filter((appt) => {
                const apptDate = new Date(appt.date)
                  .toISOString()
                  .split("T")[0];
                return apptDate === todayStr;
              })
              .map((appt, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#fdf6ef] p-3 rounded-md text-sm sm:text-base"
                >
                  <span className="font-medium">{appt.pet_name}</span>
                  <span className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-0">
                    {`${appt.start_time} - ${appt.end_time}`}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* ✅ Modal only if there's an appointment today */}
      {showModal && hasTodayAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs sm:max-w-sm text-center shadow-lg">
            <h2 className="text-base sm:text-lg font-bold text-[#ffa673]">
              Appointment Reminder
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              You have an appointment today.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-[#ffa673] text-white px-4 py-2 rounded-lg hover:bg-[#ff944d] text-sm sm:text-base"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
