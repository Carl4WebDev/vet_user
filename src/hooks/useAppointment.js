import { useContext } from "react";
import { ScheduleContext } from "../context/Appointments/ScheduleContext";

export const useAppointment = () => {
  return useContext(ScheduleContext);
};
