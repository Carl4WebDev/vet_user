import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VetMap from "./pages/VetMap/VetMap";
import ClientRegister from "./pages/ClientRegister";
import ChatPage from "./pages/ChatPage";
import PetProfilePage from "./pages/PetProfile/PetProfilePage";
import AppointmentPage from "./pages/AppointmentPage";
import OwnerProfile from "./pages/OwnerProfile/OwnerProfile";
import NotificationPage from "./pages/NotificationPage";
import MedicalHistory from "./components/MedicalHistory";
import MedicalHistoryPage from "./pages/MedicalHistoryPage";
import VetClinicChatbot from "./components/VetClinicChatbot";

// Create a separate component for the routed content
function AppContent() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute guestOnly={true}>
            <ClientLogin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client-register"
        element={
          <ProtectedRoute guestOnly={true}>
            <ClientRegister />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard */}
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pet-profile/:petId"
        element={
          <ProtectedRoute allowedRole="client">
            <PetProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vet-map"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <VetMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment-details/:appointmentId"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <AppointmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner-profile/:clientTableId"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <OwnerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-history/:petId"
        element={
          <ProtectedRoute allowedRole="client" requirePets={true}>
            <MedicalHistoryPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Main App component with Router
export default function App() {
  return (
    <Router>
      <AppContent />
      <VetClinicChatbot />
    </Router>
  );
}
