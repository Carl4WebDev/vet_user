const API_BASE = import.meta.env.VITE_API_BASE;

export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await fetch(
      `${API_BASE}/appointments/appointment/${appointmentId}`,
      {
        method: "GET",
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
    console.error("Error fetching appointment:", error);
    throw error;
  }
};
