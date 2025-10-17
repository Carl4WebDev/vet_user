import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ErrorProvider } from "./context/Errors/ErrorProvider.jsx";
import { SuccessProvider } from "./context/Success/SuccessProvider.jsx";

import ErrorModal from "../src/components/ErrorModal.jsx";
import SuccessModal from "./components/SuccessModal.jsx";

import { ClientProvider } from "../src/context/ClientProvider.jsx";
import { PetsProvider } from "../src/context/pets/PetsProvider.jsx";
import { ScheduleProvider } from "./context/Appointments/ScheduleProvider.jsx";
import { AppointmentTypesProvider } from "./context/AppointmentTypes/AppointmentTypesProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClientProvider>
      <ErrorProvider>
        <SuccessProvider>
          <PetsProvider>
            <ScheduleProvider>
              <AppointmentTypesProvider>
                <ErrorModal />
                <SuccessModal />
                <App />
              </AppointmentTypesProvider>
            </ScheduleProvider>
          </PetsProvider>
        </SuccessProvider>
      </ErrorProvider>
    </ClientProvider>
  </StrictMode>
);
