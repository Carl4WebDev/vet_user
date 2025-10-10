const API_BASE = import.meta.env.VITE_API_BASE;

// ✅ Get one pet by ID
export const getPetById = async (petId) => {
  try {
    const response = await fetch(`${API_BASE}/pets/get-pet-records/${petId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    throw error;
  }
};
