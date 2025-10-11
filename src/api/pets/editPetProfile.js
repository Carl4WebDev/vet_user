// src/api/pets/editPetProfile.js
const API_BASE = import.meta.env.VITE_API_BASE;

export const editPetProfile = async (petId, formData /* FormData */) => {
  const res = await fetch(`${API_BASE}/petProfile/${petId}/profile`, {
    method: "PUT",
    body: formData, // let browser set Content-Type boundary
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
