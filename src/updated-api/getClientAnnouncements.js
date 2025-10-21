const API_BASE2 = import.meta.env.VITE_API_BASE2;

export async function getClientAnnouncements() {
  try {
    const res = await fetch(
      `${API_BASE2}/api/announcements/pet_owners_announcements`
    );
    if (!res.ok) throw new Error("Failed to fetch announcements");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching announcements:", err);
    throw err;
  }
}
