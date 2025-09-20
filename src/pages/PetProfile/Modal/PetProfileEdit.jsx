import { useState, useEffect } from "react";
import React from "react";

export default function PetOwnerProfileEdit({ isOpen, setIsOpen, onSave }) {
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [bannerImage, setBannerImage] = useState(null);

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent overflow-auto">
      <div className="bg-[#D9D9D9] w-full max-w-[984px] max-h-[80vh] h-auto shadow-md border-[6px] border-black rounded-[20px] relative m-4 flex flex-col overflow-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Top Section */}
        <div className="flex flex-col items-center relative">
          {/* Banner */}
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Banner"
              className="absolute left-1/2 top-0 -translate-x-1/2 z-0 w-full md:w-[983px] h-[200px] md:h-[299px] rounded-[20px] object-cover"
            />
          ) : (
            <div className="absolute left-1/2 top-0 -translate-x-1/2 z-0 bg-[#5A5A5A] border w-full md:w-[983px] h-[200px] md:h-[299px] rounded-[20px]" />
          )}

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {/* Edit Banner */}
            <button
              onClick={() => document.getElementById("bannerUpload").click()}
              className="bg-white hover:bg-gray-200 text-black text-sm p-2 rounded-full shadow-md"
            >
              <img src="/edit.png" alt="Edit Banner" className="w-8 h-8" />
            </button>

            {/* Remove Banner */}
            {bannerImage && (
              <button
                onClick={() => setBannerImage(null)}
                className="bg-white hover:bg-gray-200 text-black text-sm p-2 rounded-full shadow-md"
              >
                <img src="/bin.png" alt="Remove Banner" className="w-8 h-8" />
              </button>
            )}
          </div>

          <input
            type="file"
            id="bannerUpload"
            accept="image/*"
            onChange={handleBannerImageChange}
            className="hidden"
          />

          {/* Profile Image */}
          <label className="relative z-10 cursor-pointer mt-4">
            <img
              src={profileImage}
              alt=""
              className="w-32 h-32 md:w-[300px] md:h-[300px] rounded-full border-2 bg-white border-white shadow-md object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            {!profileImage.startsWith("data:") && (
              <span className="absolute inset-0 flex items-center justify-center text-gray-700 font-semibold text-lg pointer-events-none">
                Upload photo
              </span>
            )}
          </label>
        </div>

        {/* Full Name */}
        <div className="mt-5 text-center">
          <label
            htmlFor="client_name"
            className="block mb-2 text-black text-2xl md:text-3xl font-playfair"
          >
            Full Name
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            value={formData.client_name || ""}
            onChange={handleChange}
            className="text-center mx-auto p-2 bg-white outline-none w-[90%] md:w-[300px] h-[45px] md:h-[50px] border rounded-[20px] text-lg md:text-2xl"
            placeholder="Enter your name"
          />
        </div>

        {/* Form Fields */}
        <div className="px-4 md:px-10 mt-6 space-y-5">
          {/* Row 1: Phone + Tel */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-xl md:text-3xl font-playfair">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full h-[60px] md:h-[90px] px-4 md:text-lg"
                placeholder="Phone Number"
                style={{
                  borderRadius: "11px",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "black",
                }}
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-xl md:text-3xl font-playfair">
                Tel. Number
              </label>
              <input
                type="text"
                name="tel_num"
                value={formData.tel_num || ""}
                onChange={handleChange}
                className="w-full h-[60px] md:h-[90px] px-4 md:text-lg"
                placeholder="Telephone Number"
                style={{
                  borderRadius: "11px",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "black",
                }}
              />
            </div>
          </div>

          {/* Row 2: Gender */}
          <div>
            <label className="block mb-1 text-xl md:text-3xl font-playfair">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="appearance-none w-full h-[60px] md:h-[90px] px-4 md:text-lg"
              style={{
                borderRadius: "11px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "black",
              }}
            >
              <option value="">-- Select --</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 3: Address */}
          <div>
            <label className="block mb-1 text-xl md:text-3xl font-playfair">
              Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street || ""}
              onChange={handleChange}
              className="w-full h-[60px] md:h-[90px] px-4 md:text-lg"
              placeholder="Street, City, Province"
              style={{
                borderRadius: "11px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 md:px-10 mt-6">
          <label className="block mb-2 text-xl md:text-3xl font-playfair">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            className="w-full h-[150px] md:h-[276px] border rounded-[23px] p-2 bg-white resize-none outline-none"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6 px-4 md:px-10 pb-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-[100px] md:w-[141px] h-[40px] md:h-[45px] rounded-[20px] bg-white border text-black hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="w-[100px] md:w-[141px] h-[40px] md:h-[45px] rounded-[20px] bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
