// src/api/get/getVetByClinic.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getVetByClinic(clinicId) {
  try {
    const res = await fetch(`${API_BASE}/clinic/all-vet/${clinicId}`);
    if (!res.ok) throw new Error("Failed to fetch veterinarians");

    const result = await res.json();

    // ✅ Your backend returns: { success: true, data: [ ...vets ] }
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    console.warn("Unexpected response format:", result);
    return []; // fallback
  } catch (err) {
    console.error("❌ getVetByClinic error:", err);
    return [];
  }
}
