import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { clientNavItems } from "../../config/navItems";
import navLogo from "../../assets/nav-logo.png";
import navProfile from "../../assets/nav-profile.png";
import FaceCard from "../../components/FaceCard";
import NewPetModal from "./Modal/NewPetModal";
import AppointmentCard from "../../components/AppointmentCard";
import LiveCalendar from "../../components/LiveCalendar";
import MedicalHistory from "../../components/MedicalHistory";
import Leo from "../../assets/leo.png";
import { PlusIcon } from "lucide-react";

import { useAppointment } from "../../hooks/useAppointment.js";
import { useClient } from "../../hooks/useClient";
import { usePets } from "../../hooks/usePets";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [isOpenNewPetModal, setIsOpenNewPetModal] = useState(false);

  const { appointments, fetchGoingAppointments } = useAppointment();

  const { client, loading, error, fetchClient } = useClient();
  const { pets, fetchPets } = usePets();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const clientId = localStorage.getItem("client_id");

    if (!token || role !== "client") {
      navigate("/");
      return;
    }

    fetchClient(clientId);
  }, [navigate, fetchClient]);

  useEffect(() => {
    if (client?.clientId) {
      fetchGoingAppointments(client.clientId);
    }
  }, [client?.clientId, fetchGoingAppointments]);

  useEffect(() => {
    if (client?.clientId) {
      fetchPets(client.clientId);
    }
  }, [client?.clientId, fetchPets]);

  useEffect(() => {
    if (client?.clientId) {
      // ✅ store globally (for all pages)
      if (client.imageUrl) {
        localStorage.setItem("navProfileClient", client.imageUrl);
      }

      // ✅ fetch pets as usual
      fetchPets(client.clientId);
    }
  }, [client?.clientId, client?.imageUrl, fetchPets]);

  if (loading) return <p>Loading client...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!client) return <p>No client data found.</p>;
  return (
    <div className="bg-[#b4b4b7] min-h-screen">
      <Navbar
        logo={navLogo}
        profileImg={client.mainImageUrl || navProfile}
        username={client.name}
        navItems={clientNavItems}
      />

      <NewPetModal
        isOpen={isOpenNewPetModal}
        onClose={() => setIsOpenNewPetModal(false)}
      />

      <div className="p-8 bg-[#d9d9d9] rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Good Morning, {client?.name?.split(" ")[0]}
            </h1>
            <p>Welcome to your dashboard!</p>
          </div>
          <div className="flex gap-5 md:justify-end">
            {/* <button className="flex items-center gap-2 bg-white p-2 rounded-lg hover:bg-gray-200">
              <PlusIcon /> BOOK VET
            </button> */}
            <button
              onClick={() => setIsOpenNewPetModal(true)}
              className="flex items-center gap-2 bg-white p-2 rounded-lg hover:bg-gray-200"
            >
              <PlusIcon /> NEW PET
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          {pets.map((pet, index) => (
            <FaceCard
              key={index}
              petName={pet.name}
              petId={pet.pet_id}
              petImage={pet.image_url}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white mt-4 mb-8 p-10 w-full rounded-xl shadow-inner text-gray-500 animate-fadeIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h4 className="text-2xl font-semibold text-gray-700">
                No Appointments Yet
              </h4>
              <p className="text-md text-gray-500 mt-2 text-center max-w-[400px]">
                Once you book an appointment with a veterinarian, it will appear
                here.
              </p>
            </div>
          ) : (
            appointments.map((appt, index) => (
              <AppointmentCard
                key={index}
                vetName={appt.vet_name}
                petName={appt.pet_name}
                date={new Date(appt.date).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                time={`${appt.start_time} - ${appt.end_time}`}
                image={appt.pet_image_url || Leo}
                appointmentId={appt.appointment_id}
              />
            ))
          )}
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <LiveCalendar appointments={appointments} image={Leo} />
          <MedicalHistory pets={pets} />
        </div>
      </div>
    </div>
  );
}
