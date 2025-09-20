const API_BASE = import.meta.env.VITE_API_BASE;

// ✅ Edit (update) one pet by ID
export const editPetById = async (petId, petData) => {
  try {
    const response = await fetch(`${API_BASE}/pets/edit-pet/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData), // 👈 send updated pet data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing pet by ID:", error);
    throw error;
  }
};
