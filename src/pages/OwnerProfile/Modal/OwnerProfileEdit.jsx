import { useState, useEffect } from "react";
import { editClientById } from "../../../api/get-api/client/editClientById";
import navProfile from "../../../assets/nav-profile.png"; // default profile
import defaultBanner from "../../../assets/nav-profile.png"; // make sure you have this file in /assets

export default function OwnerProfileEdit({
  isOpen,
  setIsOpen,
  clientId,
  mainImage,
  bgImage,
}) {
  const [formData, setFormData] = useState({
    client_name: "",
    gender: "",
    phone: "",
    tel_num: "",
    bio: "",
    street: "",
    city: "",
    province: "",
    postal_code: "",
  });

  // 🧠 For image previews and files
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 🧩 Initialize with passed images
  useEffect(() => {
    if (mainImage) setProfilePreview(mainImage);
    if (bgImage) setBannerPreview(bgImage);
  }, [mainImage, bgImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Instant profile image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setProfilePreview(URL.createObjectURL(file)); // instant preview
    }
  };

  // ✅ Instant banner image preview
  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreview(URL.createObjectURL(file)); // instant preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value) payload.append(key, value);
    }

    if (mainImageFile) payload.append("main_image", mainImageFile);
    if (bannerImageFile) payload.append("background_image", bannerImageFile);

    try {
      const res = await editClientById(clientId, payload);
      console.log("✅ Client updated:", res);
      setIsOpen(false);
      window.location.reload(); // refresh to reflect latest images
    } catch (err) {
      console.error("❌ Failed to update client:", err);
      alert("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div
        className="
          bg-[#EDEDED]
          w-full max-w-[880px]
          rounded-[16px]
          shadow-2xl
          border border-gray-400
          relative
          flex flex-col
          overflow-hidden
          max-h-[85vh]
        "
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-y-auto scroll-smooth"
        >
          {/* 🖼️ Banner Section */}
          <div className="relative h-[180px] w-full flex-shrink-0 bg-[#5A5A5A]">
            <img
              src={bannerPreview || bgImage || defaultBanner}
              alt="Banner Preview"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out"
              onError={(e) => (e.currentTarget.src = defaultBanner)}
            />
            <button
              type="button"
              onClick={() => document.getElementById("bannerUpload").click()}
              className="absolute top-3 right-3 bg-white text-gray-800 px-3 py-1 rounded-full shadow-md hover:bg-gray-100 text-sm font-medium transition"
            >
              Change Banner
            </button>
            <input
              id="bannerUpload"
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              className="hidden"
            />
          </div>

          {/* ❌ Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white rounded-full p-1 px-2 text-lg font-bold"
          >
            ✕
          </button>

          {/* 🧑 Profile Image Section */}
          <div className="flex justify-center -mt-14 mb-4">
            <label className="relative group cursor-pointer">
              <img
                src={profilePreview || mainImage || navProfile}
                alt="Profile Preview"
                className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-md object-cover bg-gray-200 transition-all duration-300 ease-in-out"
                onError={(e) => (e.currentTarget.src = navProfile)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded-full transition">
                Change
              </div>
            </label>
          </div>

          {/* 🧾 Form Fields */}
          <div className="px-6 pb-6 flex-1">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
              Edit Owner Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>

              {/* Tel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tel. Number
                </label>
                <input
                  name="tel_num"
                  value={formData.tel_num}
                  onChange={handleChange}
                  placeholder="Enter telephone number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>
            </div>

            {/* 🏠 Address Fields */}
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["street", "city", "province", "postal_code"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                  />
                </div>
              ))}
            </div>

            {/* 🧠 Bio */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none resize-none bg-white h-[100px]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2 rounded-md text-white font-semibold transition-all ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
