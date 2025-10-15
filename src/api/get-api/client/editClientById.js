const API_BASE = import.meta.env.VITE_API_BASE;

export const editClientById = async (clientId, clientData) => {
  try {
    // ✅ If already a FormData instance, send it directly
    const isFormData = clientData instanceof FormData;
    const body = isFormData
      ? clientData
      : (() => {
          const fd = new FormData();
          for (const [key, value] of Object.entries(clientData)) {
            if (value) fd.append(key, value);
          }
          if (clientData.main_image)
            fd.append("main_image", clientData.main_image);
          if (clientData.background_image)
            fd.append("background_image", clientData.background_image);
          return fd;
        })();

    const response = await fetch(
      `${API_BASE}/clients/edit-client/${clientId}`,
      {
        method: "PUT",
        body, // no headers here — fetch auto-sets correct multipart boundary
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error editing client by ID:", error);
    throw error;
  }
};
