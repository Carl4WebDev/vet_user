import { useState, useCallback } from "react"; // ✅ added useCallback safely
import { ScheduleContext } from "./ScheduleContext";
import { useError } from "../../hooks/useError";

const API_BASE = import.meta.env.VITE_API_BASE;

export const ScheduleProvider = ({ children }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showError } = useError();

  // ✅ Memoized: prevents infinite re-renders
  const fetchAvailableSlots = useCallback(
    async (vetId, typeId, date) => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/appointments/available-slots?vetId=${vetId}&typeId=${typeId}&date=${date}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch slots");

        setAvailableSlots(data.availableSlots);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // ✅ Memoized: stable reference for ClientDashboard
  const fetchGoingAppointments = useCallback(async () => {
    try {
      const clientId = localStorage.getItem("client_table_id");
      setLoading(true);

      const res = await fetch(`${API_BASE}/appointments/client/${clientId}`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to fetch appointments");

      setAppointments(data);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // ✅ Memoized but unchanged signature
  const bookAppointment = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to book appointment");

        return data; // appointment details
      } catch (err) {
        showError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

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
