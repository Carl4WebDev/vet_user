import React, { useState, useEffect } from "react";
import { AppleIcon, X } from "lucide-react";

import { useAppointment } from "../../../hooks/useAppointment";
import { usePets } from "../../../hooks/usePets";
import { useAppointmentTypes } from "../../../hooks/useAppointmentTypes";
import { useSuccess } from "../../../hooks/useSuccess";
import { useError } from "../../../hooks/useError";

export default function VetBookingModal({
  clinicName,
  isOpen,
  onClose,
  clinicId,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");

  const { showError } = useError();
  const { showSuccess } = useSuccess();
  const { appointmentTypes, fetchAppointmentTypes } = useAppointmentTypes();
  const { pets, fetchPets } = usePets();
  const { availableSlots, fetchAvailableSlots, bookAppointment } =
    useAppointment();

  // fetch slots on date change
  useEffect(() => {
    if (selectedDate && selectedType) {
      fetchAvailableSlots(1, selectedType, selectedDate);
      setSelectedSlot(null); // reset selection when type changes
    }
  }, [selectedDate, selectedType]);

  // fetch pets + appointment types when modal opens
  useEffect(() => {
    const clientTableId = localStorage.getItem("client_table_id");
    if (isOpen) {
      fetchPets(clientTableId);
      fetchAppointmentTypes();
    }
  }, [isOpen, fetchPets, fetchAppointmentTypes]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientTableId = localStorage.getItem("client_table_id");

    if (!selectedSlot || !selectedPet || !selectedType || !selectedVet) {
      showError("Please fill out all required fields.");
      return;
    }

    try {
      console.log(clinicId);
      await bookAppointment({
        clientId: clientTableId,
        petId: selectedPet,
        vetId: selectedVet,
        typeId: selectedType,
        date: selectedDate,
        startTime: selectedSlot.start,
        notes,
        clinicId: clinicId,
      });
      showSuccess("✅ Appointment booked successfully!");

      setSelectedDate("");
      setSelectedSlot(null);
      setSelectedPet("");
      setSelectedVet("");
      setSelectedType("");
      setNotes("");

      setSelectedSlot(null);
      onClose();
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  const handleClosed = () => {
    setSelectedDate("");
    setSelectedSlot(null);
    setSelectedPet("");
    setSelectedVet("");
    setSelectedType("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative border-2 border-black overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClosed}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-sm font-light">Clinic</h2>
        <h3 className="font-bold mb-4">
          {clinicName} -{" "}
          <span className="text-[13px] font-light">
            Closed during Saturday-Sunday
          </span>
        </h3>

        <form className="space-y-3 z-[99999]" onSubmit={handleSubmit}>
          {/* Pet */}
          <div>
            <label className="block text-sm mb-1">Select Pet</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
            >
              <option value="">-- Select --</option>
              {pets.map((pet) => (
                <option key={pet.pet_id} value={pet.pet_id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Veterinarian */}
          <div>
            <label className="block text-sm mb-1">Select Veterinarian</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedVet}
              onChange={(e) => setSelectedVet(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value={1}>Dr. Smith</option>
            </select>
          </div>

          {/* Type of Visit + Date */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">Type of Visit</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">-- Select --</option>
                {appointmentTypes.map((type) => (
                  <option key={type.type_id} value={type.type_id}>
                    {type.name} - {type.duration_minutes}mins
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Schedule Date:</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Available Slots */}
          {availableSlots.map((slot, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-1 rounded border ${
                selectedSlot?.start === slot.start
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {slot.start} - {slot.end}
            </button>
          ))}

          {/* Notes */}
          <div>
            <label className="block text-sm mb-1">Additional Information</label>
            <textarea
              rows={3}
              className="w-full border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
          >
            Schedule now
          </button>
        </form>
      </div>
    </div>
  );
}
