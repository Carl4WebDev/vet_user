import { useState } from "react";
import { ScheduleContext } from "./ScheduleContext";
import { useError } from "../../hooks/useError";
const API_BASE = import.meta.env.VITE_API_BASE;

export const ScheduleProvider = ({ children }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);

  const { showError } = useError();

  // Fetch available slots for a vet
  const fetchAvailableSlots = async (vetId, typeId, date) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/appointments/available-slots?vetId=${vetId}&typeId=${typeId}&date=${date}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch slots");

      setAvailableSlots(data.availableSlots);
      setLoading(false);
    } catch (err) {
      showError(err.message);
      setLoading(false);
    }
  };
  const fetchGoingAppointments = async () => {
    try {
      const clientId = localStorage.getItem("client_table_id");
      setLoading(true);

      const res = await fetch(`${API_BASE}/appointments/client/${clientId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch slots");

      setAppointments(data);
      setLoading(false);
    } catch (err) {
      showError(err.message);
      setLoading(false);
    }
  };

  // Post a new schedule (optional: admin feature)
  const bookAppointment = async (payload) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book appointment");
      return data; // appointment details
    } catch (err) {
      showError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        availableSlots,
        fetchAvailableSlots,
        appointments,
        fetchGoingAppointments,
        bookAppointment,
        loading,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
