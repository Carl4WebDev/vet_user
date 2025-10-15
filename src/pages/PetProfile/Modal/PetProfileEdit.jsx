import React, { useState, useEffect } from "react";
import defaultProfile from "../../../assets/nav-profile.png"; // ✅ ensure correct fallback

export default function PetProfileEdit({ isOpen, setIsOpen, onSave, pet }) {
  const [formData, setFormData] = useState({});
  const [profilePreview, setProfilePreview] = useState(defaultProfile);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);

  // 🧠 Prefill with existing pet data when modal opens
  useEffect(() => {
    if (isOpen && pet) {
      setFormData({
        name: pet.name || pet.pet_name || "",
        age: pet.age || pet.pet_age || "",
        weight: pet.weight || pet.pet_weight || "",
        gender: pet.gender || pet.pet_gender || "",
        birthday: pet.birthday || pet.pet_birthday || "",
        species: pet.species || pet.pet_species || "",
        breed: pet.breed || pet.pet_breed || "",
        bio: pet.bio || pet.pet_bio || "",
      });
      setProfilePreview(pet.main_image_url || defaultProfile);
      setBannerPreview(pet.background_image_url || null);
    }
  }, [isOpen, pet]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setProfilePreview(URL.createObjectURL(file)); // ✅ use blob for preview
    }
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    onSave(formData, { mainImageFile, bannerImageFile });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm overflow-auto">
      <div className="bg-[#D9D9D9] w-full max-w-[984px] max-h-[90vh] shadow-md border-[6px] border-black rounded-[20px] relative m-4 flex flex-col overflow-auto">
        {/* Close */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Banner Section */}
        <div className="relative flex flex-col items-center">
          <div className="w-full h-[200px] md:h-[250px] bg-gray-500 rounded-t-[14px] overflow-hidden relative">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-500" />
            )}
            <input
              type="file"
              accept="image/*"
              id="bannerInput"
              className="hidden"
              onChange={handleBannerImage}
            />
            <button
              onClick={() => document.getElementById("bannerInput").click()}
              className="absolute top-3 right-3 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              🖊
            </button>
          </div>

          {/* Profile (Main) Image */}
          <label className="relative -mt-12 z-10 cursor-pointer">
            <img
              src={profilePreview}
              alt="Profile"
              className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMainImage}
            />
          </label>
        </div>

        {/* Pet Info Inputs */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <Input
            label="Weight (kg)"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["male", "female", "other"]}
          />
          <Input
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
          />
          <Input
            label="Species"
            name="species"
            value={formData.species}
            onChange={handleChange}
          />
          <Input
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
          <TextArea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 p-6">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-[100px] rounded-[20px] bg-white border text-black hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-[120px] rounded-[20px] bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// 🧩 Small UI helpers
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-400 rounded-lg p-2"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-400 rounded-lg p-2"
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full h-[120px] border border-gray-400 rounded-lg p-2 resize-none"
      ></textarea>
    </div>
  );
}
