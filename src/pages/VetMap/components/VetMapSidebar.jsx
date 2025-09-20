import React, { useState } from "react";
import VetClinicCard from "./VetClinicCard";
import VetBookingModal from "../Modals/VetBookingModal";

export default function VetMapSidebar({ vets, showList }) {
  const [selectedClinic, setSelectedClinic] = useState(null);

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
              name={vet.name}
              rating={vet.rating || 5}
              address={vet.address}
              onBook={() => setSelectedClinic(vet)}
            />
          ))}
        </div>
      </div>

      {/* Single Booking Modal */}
      {selectedClinic && (
        <VetBookingModal
          clinicName={selectedClinic.name}
          clinicId={selectedClinic.id}
          isOpen={!!selectedClinic}
          onClose={() => setSelectedClinic(null)}
        />
      )}
    </>
  );
}
