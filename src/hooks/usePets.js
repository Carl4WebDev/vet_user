import { useContext } from "react";
import { PetsContext } from "../context/pets/PetsContext";

export const usePets = () => {
  return useContext(PetsContext);
};
