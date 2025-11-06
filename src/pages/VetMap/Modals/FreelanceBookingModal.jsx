import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePets } from "../../../hooks/usePets";
import { useAppointmentTypes } from "../../../hooks/useAppointmentTypes";
import { useError } from "../../../hooks/useError";
import { useSuccess } from "../../../hooks/useSuccess";
import { getFreelanceSlots } from "../../../updated-api/getFreelanceSlots";
import { bookFreelanceAppointment } from "../../../updated-api/bookFreelanceAppointment";

export default function FreelanceBookingModal({ vet, isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState([]);
  const { pets, fetchPets } = usePets();
  const { appointmentTypes, fetchAppointmentTypes } = useAppointmentTypes();
  const { showError } = useError();
  const { showSuccess } = useSuccess();

  const clientId = localStorage.getItem("client_table_id");

  useEffect(() => {
    if (isOpen) {
      fetchPets(clientId);
      fetchAppointmentTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate && selectedType && vet?.vet_id) {
      getFreelanceSlots(vet.vet_id, selectedDate, selectedType)
        .then(setSlots)
        .catch(() => showError("Failed to load available slots"));
    }
  }, [selectedDate, selectedType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPet || !selectedSlot || !selectedType) {
      showError("Please complete all required fields");
      return;
    }

    try {
      await bookFreelanceAppointment({
        clientId,
        petId: selectedPet,
        vetId: vet.vet_id,
        typeId: selectedType,
        date: selectedDate,
        startTime: selectedSlot.start,
        notes,
      });
      showSuccess("✅ Appointment booked successfully!");
      onClose();
    } catch (err) {
      showError(err.message || "Booking failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[99999] overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative border-2 border-black shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-sm font-light">Freelance Veterinarian</h2>
        <h3 className="font-bold mb-4">
          {vet?.vet_name || vet?.name}{" "}
          <span className="text-[13px] font-light text-gray-500">
            ({vet?.specialization})
          </span>
        </h3>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Pet */}
          <div>
            <label className="block text-sm mb-1">Select Pet</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
            >
              <option value="">-- Select --</option>
              {pets.map((p) => (
                <option key={p.pet_id} value={p.pet_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type + Date */}
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
                    {type.name} - {type.duration_minutes} mins
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                // ✅ This version uses local time, not UTC
                min={
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
          </div>

          {/* Time Slots */}
          {slots.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {slots.map((slot, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1 rounded border text-sm ${
                    selectedSlot?.start === slot.start
                      ? "bg-cyan-500 text-white border-cyan-500"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {slot.start} - {slot.end}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No available slots</p>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm mb-1">Additional Info</label>
            <textarea
              rows={3}
              className="w-full border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="(Optional)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
          >
            Schedule Now
          </button>
        </form>
      </div>
    </div>
  );
}
