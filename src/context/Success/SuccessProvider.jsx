// src/context/SuccessProvider.jsx
import { useState } from "react";
import { SuccessContext } from "./SuccessContext";

export const SuccessProvider = ({ children }) => {
  const [success, setSuccess] = useState("");

  const showSuccess = (msg) => setSuccess(msg);
  const clearSuccess = () => setSuccess(""); // Hide modal

  return (
    <SuccessContext.Provider value={{ success, showSuccess, clearSuccess }}>
      {children}
    </SuccessContext.Provider>
  );
};
