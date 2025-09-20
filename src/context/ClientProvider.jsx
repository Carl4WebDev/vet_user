import { useState, useCallback } from "react";
import { ClientContext } from "./ClientContext";

export function ClientProvider({ children }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchClient = useCallback(
    async (clientId) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/clients/get/${clientId}`);
        if (!res.ok) throw new Error("Failed to fetch client data");

        const data = await res.json(); // ✅ parse JSON

        setClient(data.client); // ✅ store only the client object
      } catch (err) {
        setError(err.message);
        setClient(null);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  return (
    <ClientContext.Provider value={{ client, loading, error, fetchClient }}>
      {children}
    </ClientContext.Provider>
  );
}
