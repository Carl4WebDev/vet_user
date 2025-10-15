import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";

import { getAppointmentById } from "../api/appointments/getAppointmentById";
import { cancelAppointmentById } from "../api/appointments/cancelAppointmentById";
import { ArrowLeft } from "lucide-react";
import { getClientById } from "../api/get-api/client/getClientById";

import VetRescheduleModal from "../components/VetRescheduleModal";
const navProfileClient = localStorage.getItem("navProfileClient");

export default function AppointmentPage() {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        if (clientId) {
          const res = await getClientById(clientId);
          setClientData(res);
        }
      } catch (err) {
        console.error("❌ Failed to fetch client for navbar:", err);
      }
    };

    fetchClient();
  }, []);

  const { appointmentId } = useParams(); // Get appointment ID from URL params
  const client_name = localStorage.getItem("client_name");

  const navigate = useNavigate();

  console.log(clientData);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!appointmentId) {
          throw new Error("No appointment ID provided");
        }

        const appointmentData = await getAppointmentById(appointmentId);
        setAppointment(appointmentData.data);
      } catch (err) {
        setError(err.message || "Failed to load appointment details");
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, refreshTrigger]); // Add refreshTrigger as dependency

  const handleCancelAppointment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!appointmentId) {
        throw new Error("No appointment ID provided");
      }

      const appointmentData = await cancelAppointmentById(appointmentId);
      setAppointment(appointmentData.data);
      navigate("/client-dashboard");
    } catch (err) {
      setError(err.message || "Failed to load appointment details");
      console.error("Error fetching appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time functions
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not available";

    try {
      // Handle time strings like "16:00:00"
      const [hours, minutes] = timeString.split(":");
      const hourNum = parseInt(hours);
      const period = hourNum >= 12 ? "PM" : "AM";
      const formattedHours = hourNum % 12 || 12; // Convert 0 to 12, 13 to 1, etc.

      return `${formattedHours}:${minutes} ${period}`;
    } catch (error) {
      console.log(error);
      return timeString; // Return original if formatting fails
    }
  };

  // Helper function to format address
  const formatFullAddress = (address) => {
    if (!address) return null;

    const { street, city, province, postalCode } = address;
    const parts = [];

    if (street) parts.push(street);
    if (city) parts.push(city);
    if (province) parts.push(province);
    if (postalCode) parts.push(postalCode);

    return parts.length > 0 ? parts.join(", ") : null;
  };

  // Function to trigger refresh after successful rescheduling
  const handleRescheduleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger useEffect
  };

  if (loading) {
    return (
      <div className="bg-[#d9d9d9] min-h-screen">
        <Navbar
          logo={navLogo}
          profileImg={
            clientData?.client.mainImageUrl || navProfile || navProfileClient
          }
          username={clientData?.client.name || client_name}
          navItems={clientNavItems}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#d9d9d9] min-h-screen">
        <Navbar
          logo={navLogo}
          profileImg={
            clientData?.client.mainImageUrl || navProfile || navProfileClient
          }
          username={clientData?.client.name || client_name}
          navItems={clientNavItems}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d9d9d9] min-h-screen">
      <Navbar
        logo={navLogo}
        profileImg={
          clientData?.client.mainImageUrl || navProfile || navProfileClient
        }
        username={clientData?.client.name || client_name}
        navItems={clientNavItems}
      />
      <div
        className="
        bg-white shadow-lg w-full max-w-[1100px] mx-auto rounded-xl overflow-hidden border border-gray-300 p-4
        sm:p-6 lg:p-8 mt-10
      "
        style={{
          fontFamily:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
        }}
      >
        <ArrowLeft
          className="m-4 hover:bg-black rounded-md hover:text-white w-10 h-10"
          onClick={() => navigate("/client-dashboard")}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
          <img
            src={appointment?.pet_image_url || navProfile}
            alt={appointment?.pet_name || "Pet"}
            className="w-16 h-16 rounded-full mb-3 sm:mb-0 sm:mr-4"
          />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-1">
              <span
                className={`w-3 h-3 rounded-full inline-block mr-2 ${
                  appointment?.status === "confirmed"
                    ? "bg-green-500"
                    : appointment?.status === "pending"
                    ? "bg-yellow-500"
                    : appointment?.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></span>
              <span className="font-semibold text-lg capitalize">
                {appointment?.status || "Unknown"}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {appointment?.pet_name || "Unknown Pet"}
            </h2>
            <p className="text-gray-500">
              {appointment?.breed || "Unknown Breed"}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 pb-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm">Service Type</p>
            <p>{appointment?.appointment_type || "Not specified"}</p>
            <p className="mt-2 text-gray-500 text-sm">Veterinarian</p>
            <p>{appointment?.vet_name || "Not specified"}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-gray-500 text-sm">Date</p>
            <p>
              {appointment?.date
                ? formatDate(appointment.date)
                : "Date not set"}
            </p>
            <p className="mt-2 text-gray-500 text-sm">Time</p>
            <p>
              {appointment?.start_time && appointment?.end_time
                ? `${formatTime(appointment.start_time)} - ${formatTime(
                    appointment.end_time
                  )}`
                : "Time not set"}
            </p>
          </div>
        </div>

        {/* Clinic Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-1">Clinic Info</h3>
          <p className="text-gray-500 text-sm">Clinic Name</p>
          <p>{appointment?.clinic_name || "Not specified"}</p>
          <p className="mt-2 text-gray-500 text-sm">Clinic Address</p>
          <p>
            {formatFullAddress({
              street: appointment?.street,
              city: appointment?.city,
              province: appointment?.province,
              postalCode: appointment?.postal_code,
            }) || "Address not specified"}
          </p>
        </div>
        <VetRescheduleModal
          isOpen={rescheduleModal}
          onClose={() => setRescheduleModal(false)}
          appointment={appointment}
          onRescheduleSuccess={handleRescheduleSuccess} // Add success callback
        />

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleCancelAppointment}
            className="py-2 px-4 bg-red-400 text-white rounded hover:bg-red-500 transition"
          >
            Cancel Appointment
          </button>
          <button
            onClick={() => setRescheduleModal(true)}
            className="py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
