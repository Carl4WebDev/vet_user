import { useState } from "react";
import { X } from "lucide-react";

import { usePets } from "../../../hooks/usePets";
import { useClient } from "../../../hooks/useClient";

import { addNewPetWithImage } from "../../../updated-api/addNewPetWithImage";

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

  const [mainImage, setMainImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { showSuccess } = useSuccess();
  const { showError } = useError();

  const { addPet } = usePets();
  const { client } = useClient();
  if (!isOpen) return null;

  // 🧠 handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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
      await addNewPetWithImage(petData, mainImage);
      showSuccess("Pet added successfully! 🎉");
      onClose();
      // ✅ Refresh the page after success
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      showError(err.message);
    }
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
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </form>
        {/* Image Upload */}
        <div className="flex flex-col items-center mt-4">
          <label
            htmlFor="imageUpload"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Main Image
          </label>

          {/* Upload preview */}
          <div className="relative w-32 h-32">
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">
                  Click to upload
                </span>
              )}
            </div>
          </div>

          {/* Optional filename display */}
          {preview && (
            <p className="mt-2 text-xs text-gray-500">Preview loaded</p>
          )}
        </div>

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
