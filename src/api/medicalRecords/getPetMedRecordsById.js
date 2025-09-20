const API_BASE = import.meta.env.VITE_API_BASE;

export async function getPetMedRecordsById(petId) {
  const res = await fetch(
    `${API_BASE}/medical-records/get-pet-records/${petId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pet medical records data");
  }

  const data = await res.json(); // Parse the response once
  console.log(data); // Log the parsed data

  return data; // Return the parsed data
}
