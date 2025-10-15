const API_BASE = import.meta.env.VITE_API_BASE;

export async function updatePetWithImages(petId, formData, images = {}) {
  const fd = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, value);
  });

  if (images.main) fd.append("main_image", images.main);
  if (images.background) fd.append("background_image", images.background);

  const res = await fetch(`${API_BASE}/pets/update/${petId}`, {
    method: "PUT",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update pet");
  return data;
}
