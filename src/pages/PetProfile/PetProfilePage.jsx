import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

import Navbar from "../../components/Navbar";
import navLogo from "../../assets/nav-logo.png";
import navProfile from "../../assets/nav-profile.png";
import { clientNavItems } from "../../config/navItems";

import { getUpdatedProfile } from "../../updated-api/getUpdatedProfile";
import { updatePetWithImages } from "../../updated-api/updatePetWithImages";
import { useError } from "../../hooks/useError";
import PetProfileEdit from "./Modal/PetProfileEdit";

import { getClientById } from "../../api/get-api/client/getClientById";

import Leo from "../../assets/leo.png";

const client_id = localStorage.getItem("client_id");

export default function PetProfilePage() {
  const { showError } = useError();
  const { petId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);

  // 🐾 Fetch Pet Info
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const petData = await getUpdatedProfile(petId);
        setPet(petData);
      } catch (err) {
        console.error("Failed to fetch pet data:", err);
        showError(err.message || "Something went wrong fetching pet");
      } finally {
        setLoading(false);
      }
    };
    if (petId) fetchPetData();
  }, [petId]);

  // 👤 Fetch Client Info
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(client_id);
        setClientData(data);
      } catch (err) {
        console.error("Failed to fetch client data:", err);
        showError(err.message || "Something went wrong fetching client");
      }
    };
    if (client_id) fetchClient();
  }, [client_id]);

  // 🧩 Handle Save
  const handleSave = async (formData, images) => {
    try {
      const mappedData = {
        name: formData.name,
        age: formData.age,
        weight: formData.weight,
        gender: formData.gender,
        birthday: formData.birthday,
        species: formData.species,
        breed: formData.breed,
        bio: formData.bio,
      };

      Object.keys(mappedData).forEach(
        (key) =>
          (mappedData[key] === "" || mappedData[key] === undefined) &&
          delete mappedData[key]
      );

      await updatePetWithImages(petId, mappedData, {
        main: images.mainImageFile,
        background: images.bannerImageFile,
      });

      const refreshed = await getUpdatedProfile(petId);
      setPet(refreshed);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error saving pet:", err);
      showError(err.message || "Failed to update pet");
    }
  };

  if (loading) return <p>Loading pet data...</p>;

  if (!pet)
    return (
      <div className="flex items-center justify-center">
        <div className="p-6 border border-gray-200 rounded-xl shadow-sm text-center text-gray-500 bg-white/40 backdrop-blur-sm">
          <p className="text-lg font-semibold">No data available</p>
          <p className="text-sm text-gray-400 mt-1">
            It seems there are no records yet for this pet.
          </p>
        </div>
      </div>
    );

  // ✅ Safe destructure for Navbar
  const client = clientData?.client || {};
  const profileImage = client.mainImageUrl || navProfile;
  const username = client.name || "Client";

  return (
    <div>
      {/* 🧭 Navbar */}
      <Navbar
        logo={navLogo}
        profileImg={profileImage}
        username={username}
        navItems={clientNavItems}
      />

      {/* 🐾 Pet Edit Modal */}
      <PetProfileEdit
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        onSave={handleSave}
        pet={pet}
      />

      {/* 🐶 Pet Section */}
      <div
        className="sm:mt-10 mt-5 bg-[#D9D9D9] shadow-lg w-full mx-auto rounded-xl sm:overflow-visible border border-gray-300"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          fontStyle: "normal",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {/* Banner */}
        <div className="relative bg-[#5a5a5a] h-[200px] sm:h-[250px] rounded-sm overflow-hidden">
          <img
            src={pet.background_image_url || Leo}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <button
            className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow z-20"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil size={16} />
            Edit
          </button>

          <div className="relative flex flex-col items-center mt-[120px] z-10">
            <img
              src={pet.main_image_url || Leo}
              alt="Profile"
              className="w-[200px] h-[200px] md:w-[220px] md:h-[220px] rounded-full border-4 border-white shadow-lg object-cover z-10 -translate-y-30"
            />
            <p className="mt-2 text-center text-xl font-semibold text-white z-10 absolute translate-y-20 bg-amber-500 p-2 rounded-md">
              {pet.name || "Unnamed Pet"}
            </p>
          </div>
        </div>

        {/* Pet Info */}
        <div className="sm:ml-30 sm:mr-30 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-center justify-items-center">
          <InfoBox label="Age" value={pet.age ?? "N/A"} color="sky" />
          <InfoBox
            label="Weight"
            value={pet.weight ? `${pet.weight} kg` : "N/A"}
            color="green"
          />
          <InfoBox label="Gender" value={pet.gender || "N/A"} color="yellow" />
          <InfoBox
            label="Birthday"
            value={
              pet.birthday ? new Date(pet.birthday).toLocaleDateString() : "N/A"
            }
            color="purple"
          />
          <InfoBox label="Species" value={pet.species || "N/A"} color="red" />
          <InfoBox label="Breed" value={pet.breed || "N/A"} color="orange" />
        </div>

        {/* Bio */}
        <div className="ml-5 mr-5 sm:ml-35 sm:w-205 bg-white p-4 rounded-lg shadow mt-6">
          <h3 className="font-semibold text-lg mb-2">Pet's Bio</h3>
          <p className="text-gray-600 text-m leading-relaxed">
            {pet.bio || "No Bio"}
          </p>
        </div>
      </div>

      {/* 🩺 Health Records */}
      <div className="mt-8">
        <h3
          className="ml-4 font-semibold text-2xl"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 400,
            lineHeight: "34px",
          }}
        >
          Health Record
        </h3>

        {pet.medical_records && pet.medical_records.length > 0 ? (
          <div className="bg-white mt-6 p-6 rounded-xl">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              style={{
                fontFamily: "Platypi, sans-serif",
                fontSize: "18px",
                lineHeight: "20px",
              }}
            >
              {pet.medical_records.map((rec, index) => (
                <div
                  key={rec.record_id || index}
                  className="relative border border-gray-300 bg-white rounded-lg overflow-hidden shadow-md"
                >
                  <div
                    className="h-10 w-full"
                    style={{
                      background:
                        index % 3 === 0
                          ? "linear-gradient(to bottom, #FFBBBB 0%, rgba(153,112,112,0)100%)"
                          : index % 3 === 1
                          ? "linear-gradient(to bottom, #D8BFFF 0%, rgba(216,191,255,0)100%)"
                          : "linear-gradient(to bottom, #B8FFBF 0%, rgba(111,153,115,0)100%)",
                    }}
                  />
                  <div className="-mt-11 p-4">
                    <h4 className="font-bold text-lg mb-1">
                      Medical History {index + 1}
                    </h4>
                    <p className="text-sm">
                      <b>Date:</b>{" "}
                      {rec.date
                        ? new Date(rec.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-sm">
                      <b>Description:</b> {rec.description}
                    </p>
                    <p className="text-sm">
                      <b>Veterinarian:</b> {rec.veterinarian}
                    </p>
                    <p className="text-sm">
                      <b>Diagnosis:</b> {rec.diagnosis}
                    </p>
                    <p className="text-sm">
                      <b>Test Result:</b> {rec.test_results}
                    </p>
                    <p className="text-sm">
                      <b>Action:</b> {rec.key_action}
                    </p>
                    <p className="text-sm">
                      <b>Medication:</b> {rec.medication}
                    </p>
                    <p className="text-sm mb-3">
                      <b>Remarks:</b> {rec.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white mt-6 mb-10 p-16 w-full rounded-xl shadow-inner text-gray-500 animate-fadeIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z"
              />
            </svg>
            <h4 className="text-2xl font-semibold text-gray-700">
              No Medical Records Yet
            </h4>
            <p className="text-md text-gray-500 mt-2 text-center max-w-[400px]">
              Once your veterinarian adds medical history, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🧩 InfoBox Component
function InfoBox({ label, value, color }) {
  const colors = {
    sky: "from-[#1490BD]",
    green: "from-[#477B36]",
    yellow: "from-[#C0A80E]",
    purple: "from-[#570096]",
    red: "from-[#C71818]",
    orange: "from-[#C76D00]",
  };
  return (
    <div className="w-40 h-25 rounded-lg bg-white shadow">
      <div
        className={`h-2 rounded-t-lg bg-gradient-to-b ${colors[color]} via-${colors[color]}`}
      />
      <div className="px-3">
        <p className="text-sm font-regular text-gray-600 mb-2">{label}</p>
        <p className="text-black text-m font-semibold">{value}</p>
      </div>
    </div>
  );
}
