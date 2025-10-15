import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const addNewPetWithImage = async (formData, imageFile) => {
  const data = new FormData();

  // Append text fields
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== "") data.append(key, value);
  });

  // Append image if exists
  if (imageFile) data.append("main_image", imageFile);

  const res = await axios.post(`${BASE_URL}/api/pets/create-pet`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
