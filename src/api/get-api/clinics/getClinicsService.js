const API_BASE = import.meta.env.VITE_API_BASE;

export const getAllClinics = async () => {
  try {
    const response = await fetch(`${API_BASE}/clinic/get-clinics`, {
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
    console.error("Error fetching clinics:", error);
    throw error;
  }
};
