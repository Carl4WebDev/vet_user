const API_BASE = import.meta.env.VITE_API_BASE;

export async function getClientById(userId) {
  const res = await fetch(`${API_BASE}/clients/get-client-only/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch client data");
  }

  const data = await res.json(); // Parse the response once
  console.log(data); // Log the parsed data

  return data; // Return the parsed data
}
