import React, { useState } from "react";
import VetClinicCard from "./VetClinicCard";
import VetBookingModal from "../Modals/VetBookingModal";

export default function VetMapSidebar({ vets, showList }) {
  const [selectedClinic, setSelectedClinic] = useState(null);
  console.log(vets);

  const isClinicOnline = (vet) => {
    if (vet.is_active) return true;
    const createdAt = new Date(vet.created_at);
    const diffMinutes = (Date.now() - createdAt.getTime()) / 60000;
    return diffMinutes < 30; // treat new clinics (<30 mins old) as online
  };

  return (
    <>
      <div
        className={`w-full lg:w-1/3 p-4 transition-all duration-300 overflow-y-auto ${
          showList ? "sticky top-0 bg-gray-50 z-20" : "hidden lg:block"
        }`}
        style={{ maxHeight: "100vh" }}
      >
        <h2 className="text-xl font-bold mb-4">Nearby Veterinaries</h2>

        {/* Vet List */}
        <div className="bg-white shadow-lg rounded-lg p-4 space-y-4">
          {vets.map((vet, i) => (
            <VetClinicCard
              key={i}
              mainImage={vet.image_url}
              name={vet.clinic_name}
              rating={vet.rating || 5}
              address={vet.address}
              isOnline={isClinicOnline(vet)} // ✅ frontend-only logic
              onBook={() => setSelectedClinic(vet)}
            />
          ))}
        </div>
      </div>

      {/* Single Booking Modal */}
      {selectedClinic && (
        <VetBookingModal
          clinicName={selectedClinic.name}
          clinicId={selectedClinic.clinic_id}
          isOpen={!!selectedClinic}
          onClose={() => setSelectedClinic(null)}
        />
      )}
    </>
  );
}
