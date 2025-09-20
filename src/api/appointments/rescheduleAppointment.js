const API_BASE = import.meta.env.VITE_API_BASE;

export const rescheduleAppointment = async (appointmentId, updateData) => {
  try {
    const response = await fetch(
      `${API_BASE}/appointments/reschedule/${appointmentId}`,
      {
        method: "PUT", // matches your update endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData), // send new date & time
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
};
