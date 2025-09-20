// src/hooks/useSuccess.js
import { useContext } from "react";
import { SuccessContext } from "../context/Success/SuccessContext";

export const useSuccess = () => {
  return useContext(SuccessContext);
};
