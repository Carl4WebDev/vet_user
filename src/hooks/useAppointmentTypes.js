import { useContext } from "react";
import AppointmentTypesContext from "../context/AppointmentTypes/AppointmentTypesContext";

export const useAppointmentTypes = () => {
  return useContext(AppointmentTypesContext);
};
