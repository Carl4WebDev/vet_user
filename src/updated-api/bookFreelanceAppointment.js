const API_BASE = import.meta.env.VITE_API_BASE;

export async function bookFreelanceAppointment(appointmentData) {
  try {
    const res = await fetch(`${API_BASE}/vet-freelance/appointments/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    });
    if (!res.ok)
      throw new Error("Failed to book appointment. Check the date and time.");
    return await res.json();
  } catch (err) {
    console.error("❌ Freelance booking error:", err);
    throw err;
  }
}
