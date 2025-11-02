import React, { useState } from "react";
import VetClinicCard from "./VetClinicCard";
import VetBookingModal from "../Modals/VetBookingModal";
import FreelanceBookingModal from "../Modals/FreelanceBookingModal";

export default function VetMapSidebar({ vets, showList, isFreelance }) {
  const [selectedVet, setSelectedVet] = useState(null);

  const isClinicOnline = (vet) => {
    if (vet.is_active) return true;
    const createdAt = new Date(vet.created_at);
    const diffMinutes = (Date.now() - createdAt.getTime()) / 60000;
    return diffMinutes < 30;
  };

  return (
    <>
      <div
        className={`w-full lg:w-1/3 p-4 transition-all duration-300 overflow-y-auto ${
          showList ? "sticky top-0 bg-gray-50 z-20" : "hidden lg:block"
        }`}
        style={{ maxHeight: "100vh" }}
      >
        <h2 className="text-xl font-bold mb-4">
          {isFreelance ? "Veterinarian Freelancers" : "Nearby Veterinaries"}
        </h2>

        <div className="bg-white shadow-lg rounded-lg p-4 space-y-4">
          {vets.map((vet, i) => (
            <VetClinicCard
              key={i}
              mainImage={vet.image_url}
              name={isFreelance ? vet.vet_name : vet.clinic_name}
              rating={vet.rating || 5}
              address={
                isFreelance
                  ? {
                      street: "Freelance Veterinarian",
                      city: "N/A",
                      province: "Philippines",
                    }
                  : vet.address
              }
              isOnline={isClinicOnline(vet)}
              onBook={() => setSelectedVet(vet)}
            />
          ))}
        </div>
      </div>

      {selectedVet &&
        (isFreelance ? (
          <FreelanceBookingModal
            vet={selectedVet}
            isOpen={!!selectedVet}
            onClose={() => setSelectedVet(null)}
          />
        ) : (
          <VetBookingModal
            clinicName={selectedVet.name}
            clinicId={selectedVet.clinic_id}
            isOpen={!!selectedVet}
            onClose={() => setSelectedVet(null)}
          />
        ))}
    </>
  );
}
