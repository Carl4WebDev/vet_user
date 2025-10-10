const API_BASE = import.meta.env.VITE_API_BASE;

export async function forgotPassword(email, secret_key) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, secret_key }),
  });

  if (!res.ok) throw new Error("Failed to verify secret key");
  return await res.json();
}
