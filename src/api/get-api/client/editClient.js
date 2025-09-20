const API_BASE = import.meta.env.VITE_API_BASE;

export const editClientById = async (clientId, clientData) => {
  try {
    const response = await fetch(
      `${API_BASE}/clients/edit-client/${clientId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData), // 👈 send updated pet data
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing client by ID:", error);
    throw error;
  }
};
