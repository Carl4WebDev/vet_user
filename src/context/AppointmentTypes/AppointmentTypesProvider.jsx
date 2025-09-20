import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AppointmentTypesContext from "./AppointmentTypesContext";
const API_BASE = import.meta.env.VITE_API_BASE;

export const AppointmentTypesProvider = ({ children }) => {
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all appointment types
  const fetchAppointmentTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/appointment-types`);
      setAppointmentTypes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointment types:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointmentTypes();
  }, [fetchAppointmentTypes]);

  return (
    <AppointmentTypesContext.Provider
      value={{ appointmentTypes, loading, error, fetchAppointmentTypes }}
    >
      {children}
    </AppointmentTypesContext.Provider>
  );
};
