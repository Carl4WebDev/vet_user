const API_BASE = import.meta.env.VITE_API_BASE;

export async function getFreelanceVets() {
  try {
    const res = await fetch(`${API_BASE}/vet-freelance/all-vet/all`);
    if (!res.ok) throw new Error("Failed to fetch freelance veterinarians");
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("❌ Error fetching freelance vets:", err);
    return [];
  }
}
