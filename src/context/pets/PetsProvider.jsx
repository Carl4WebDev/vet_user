import axios from "axios";
import { useState, useCallback } from "react";
import { useError } from "../../hooks/useError";
import { PetsContext } from "./PetsContext";

const API_BASE = import.meta.env.VITE_API_BASE;

export const PetsProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useError();

  // ✅ Fetch all pets by client
  const fetchPets = useCallback(
    async (clientId) => {
      if (!clientId) return; // prevent invalid calls
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/pets/get-pet/${clientId}`);
        setPets(res.data || []); // assume backend returns array
      } catch (err) {
        console.error("Fetch pets error:", err);
        showError("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // ✅ Add Pet, then refresh pets
  const addPet = useCallback(
    async (petData) => {
      if (!petData?.clientId) return;
      try {
        setLoading(true);
        await axios.post(`${API_BASE}/pets/add-pet`, petData);
        await fetchPets(petData.clientId); // refresh list from server
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchPets, showError]
  );

  return (
    <PetsContext.Provider value={{ pets, addPet, loading, fetchPets }}>
      {children}
    </PetsContext.Provider>
  );
};
