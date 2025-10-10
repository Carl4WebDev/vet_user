const API_BASE = import.meta.env.VITE_API_BASE;
export async function updatePetProfile(petId, data, profileImage, bannerImage) {
  const form = new FormData();

  // ✅ Add only non-empty fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  // ✅ Add image files if provided
  if (profileImage instanceof File) {
    form.append("profile_image", profileImage);
  }
  if (bannerImage instanceof File) {
    form.append("banner_image", bannerImage);
  }

  const res = await fetch(`${API_BASE}/petProfile/${petId}/profile`, {
    method: "PUT",
    body: form,
  });

  const result = await res.json();
  if (!res.ok)
    throw new Error(result.message || "Failed to update pet profile");
  return result;
}
