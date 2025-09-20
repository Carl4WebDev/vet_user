import { useState } from "react";
import { X } from "lucide-react";

import { usePets } from "../../../hooks/usePets";
import { useClient } from "../../../hooks/useClient";

import { useSuccess } from "../../../hooks/useSuccess";
import { useError } from "../../../hooks/useError";

const NewPetModal = ({ isOpen, onClose }) => {
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");

  const { showSuccess } = useSuccess();
  const { showError } = useError();

  const { addPet } = usePets();
  const { client } = useClient();
  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const petData = {
      clientId: client.clientId,
      name: petName,
      age,
      weight,
      gender,
      birthdate,
      breed,
      species,
    };

    try {
      await addPet(petData);
      showSuccess("Pet added successfully! 🎉");
    } catch (err) {
      showError(err.message);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative border-2 border-black max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Pet</h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pet Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Pet Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </div>

          {/* Species */}
          <div>
            <label className="block mb-1 text-sm font-medium">Species</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block mb-1 text-sm font-medium">Breed</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1 text-sm font-medium">Age</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          {/* weight */}
          <div>
            <label className="block mb-1 text-sm font-medium">Weight</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Birthdate */}
          <div>
            <label className="block mb-1 text-sm font-medium">Birthdate</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </form>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Pet
        </button>
      </div>
    </div>
  );
};

export default NewPetModal;
