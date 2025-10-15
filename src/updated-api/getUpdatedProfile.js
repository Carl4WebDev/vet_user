const API_BASE = import.meta.env.VITE_API_BASE;
export async function getUpdatedProfile(petId) {
  try {
    const res = await fetch(`${API_BASE}/api/pets/full/${petId}`);
    const data = await res.json();

    if (!data.success)
      throw new Error(data.message || "Failed to fetch profile");
    return data.data;
  } catch (error) {
    console.error("Error fetching updated profile:", error);
    throw error;
  }
}
