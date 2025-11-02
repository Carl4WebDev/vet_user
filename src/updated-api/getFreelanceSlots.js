// src/api/get/freelancers/getFreelanceSlots.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getFreelanceSlots(vetId, date, typeId) {
  const res = await fetch(
    `${API_BASE}/vet-freelance/appointments/slots/${vetId}/${date}/${typeId}`
  );
  if (!res.ok) throw new Error("Failed to fetch freelance slots");
  const data = await res.json();
  console.log("🐾 Freelance Slots Response:", data);
  return data.slots || []; // ✅ always return array
}
