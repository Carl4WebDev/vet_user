const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * 🩺 Fetch all veterinarians (role = 'veterinarian')
 * Includes both clinic-linked and freelance vets, but you can filter later.
 */
export async function getAllFreelanceVets() {
  try {
    const res = await fetch(`${API_BASE}/vet-freelance/all-vet/all`);
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to fetch veterinarians:", data.message);
      return [];
    }

    // The backend returns: { success, message, data }
    return data.success ? data.data : [];
  } catch (error) {
    console.error("❌ Error fetching veterinarians:", error.message);
    return [];
  }
}
