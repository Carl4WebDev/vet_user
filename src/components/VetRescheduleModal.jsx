import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

import { useAppointment } from "../hooks/useAppointment";
import { useAppointmentTypes } from "../hooks/useAppointmentTypes";
import { useSuccess } from "../hooks/useSuccess";
import { useError } from "../hooks/useError";

import { rescheduleAppointment } from "../api/appointments/rescheduleAppointment";

export default function VetRescheduleModal({
  isOpen,
  onClose,
  appointment,
  onRescheduleSuccess,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showError } = useError();
  const { showSuccess } = useSuccess();
  const { appointmentTypes, fetchAppointmentTypes } = useAppointmentTypes();
  const { availableSlots, fetchAvailableSlots } = useAppointment();

  // Load initial data
  useEffect(() => {
    if (isOpen && appointment) {
      const formattedDate = appointment.date
        ? new Date(appointment.date).toISOString().split("T")[0]
        : "";

      setSelectedDate(formattedDate);
      setSelectedSlot({
        start: appointment.start_time,
        end: appointment.end_time,
      });
      setNotes(appointment.notes || "");
      fetchAppointmentTypes();

      if (appointment.vet_id && formattedDate && appointment.type_id) {
        fetchAvailableSlots(
          appointment.vet_id,
          appointment.type_id,
          formattedDate
        );
      }
    }
  }, [isOpen]);

  // Refetch slots when date changes
  useEffect(() => {
    if (selectedDate && appointment?.vet_id && appointment?.type_id) {
      fetchAvailableSlots(
        appointment.vet_id,
        appointment.type_id,
        selectedDate
      );
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      showError("Please select a time slot.");
      return;
    }

    // 🔎 Extra check before rescheduling
    const slotStillAvailable = availableSlots.some(
      (s) => s.start === selectedSlot.start && s.end === selectedSlot.end
    );
    if (!slotStillAvailable) {
      showError("This slot is no longer available. Please pick another.");
      return;
    }

    try {
      setSubmitting(true);

      const updated = await rescheduleAppointment(appointment.appointment_id, {
        date: selectedDate,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        notes,
      });

      console.log("🔍 API RESPONSE:", updated);

      showSuccess("✅ Appointment rescheduled successfully!");

      // Build FULL updated appointment object
      const updatedAppointment = {
        ...appointment, // all existing details stay intact
        ...updated?.appointment, // apply backend-updated fields
        date: selectedDate, // ensure formatted date is used
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        notes,
      };

      if (onRescheduleSuccess) {
        onRescheduleSuccess(updatedAppointment);
      }

      handleClosed();
    } catch (err) {
      console.error("Reschedule failed:", err);
      showError(
        "Failed to reschedule. Please try again. Check the date and time."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosed = () => {
    setSelectedDate("");
    setSelectedSlot(null);
    setNotes("");
    onClose();
  };

  // Find the current appointment type for display
  const currentAppointmentType = appointmentTypes?.find(
    (type) => type.type_id === appointment?.type_id
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative border-2 border-black overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClosed}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-sm font-light">Reschedule Appointment</h2>
        <h3 className="font-bold mb-4">
          {appointment?.clinic_name || "Clinic"}
        </h3>

        <form className="space-y-3 z-[99999]" onSubmit={handleSubmit}>
          {/* Type + Date */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">Type of Visit</label>
              <div className="w-full border rounded px-2 py-1 bg-gray-100">
                {currentAppointmentType
                  ? `${currentAppointmentType.name} - ${currentAppointmentType.duration_minutes} mins`
                  : "Loading..."}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Schedule Date:</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
              />
            </div>
          </div>

          {/* Slots */}
          <div>
            <label className="block text-sm mb-1">Available Time Slots:</label>
            <div className="flex flex-wrap gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
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
                ))
              ) : (
                <p className="text-sm text-gray-500">No slots available.</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm mb-1">Additional Information</label>
            <textarea
              rows={3}
              className="w-full border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for the appointment"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded flex items-center justify-center disabled:bg-cyan-300"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Confirm Reschedule"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
