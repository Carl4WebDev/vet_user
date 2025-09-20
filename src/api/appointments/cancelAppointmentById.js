const API_BASE = import.meta.env.VITE_API_BASE;

export const cancelAppointmentById = async (appointmentId) => {
  try {
    const response = await fetch(
      `${API_BASE}/appointments/cancel/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cancel appointment:", error);
    throw error;
  }
};
