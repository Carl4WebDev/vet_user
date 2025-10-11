import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

import Navbar from "../../components/Navbar";
import navLogo from "../../assets/nav-logo.png";
import navProfile from "../../assets/nav-profile.png";
import { clientNavItems } from "../../config/navItems";

import { getPetById } from "../../api/pets/getPetById";
import { editPetById } from "../../api/pets/editPetById";
import { useError } from "../../hooks/useError";
import PetProfileEdit from "./Modal/PetProfileEdit";

const client_name = localStorage.getItem("client_name");
import Leo from "../../assets/leo.png";

export default function PetProfilePage() {
  const { showError } = useError();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { petId } = useParams();
  const [petRecords, setPetRecords] = useState([]); // <-- renamed to make clear it’s an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const response = await getPetById(petId);

        // ✅ your API returns { success, message, data: [ ...records ] }
        if (response.success && Array.isArray(response.data)) {
          setPetRecords(response.data);
        } else {
          showError("No pet records found");
        }
      } catch (err) {
        console.error("Failed to fetch pet data:", err);
        showError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchPetData();
  }, [petId]);

  const handleSave = async (formData) => {
    try {
      const mappedData = {
        name: formData.client_name,
        age: formData.age,
        weight: formData.weight,
        gender: formData.gender,
        birthday: formData.birthday,
        species: formData.species,
        breed: formData.breed,
        bio: formData.bio,
      };
      await editPetById(petId, mappedData);

      const refreshed = await getPetById(petId);
      if (refreshed.success && Array.isArray(refreshed.data)) {
        setPetRecords(refreshed.data);
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error saving pet:", err);
      showError(err.message || "Failed to update pet");
    }
  };

  if (loading) return <p>Loading pet data...</p>;
  if (!petRecords.length)
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

  // ✅ Extract main pet info from first record
  const pet = petRecords[0];

  return (
    <div>
      <Navbar
        logo={navLogo}
        profileImg={navProfile}
        username={client_name}
        navItems={clientNavItems}
      />

      <PetProfileEdit
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        onSave={handleSave}
      />

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
        <div className="relative bg-[#5a5a5a] h-[200px] sm:h-[250px] rounded-sm overflow-visible">
          <button
            className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil size={16} />
            Edit
          </button>

          <div className="flex flex-col items-center ">
            <img
              src={pet.pet_image_url || Leo}
              alt="Profile"
              className="w-[200px] h-[200px] md:w-[200px] border-black md:h-[200px] items-center rounded-full border-2 mt-[-10px] shadow-lg object-cover -mt-30"
            />
            <p className="mt-2 text-center text-xl font-semibold text-gray-800">
              {pet.pet_name || "Unnamed Pet"}
            </p>
          </div>
        </div>

        {/* Pet Info */}
        <div className="sm:ml-30 sm:mr-30 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-center justify-items-center">
          <div className="w-40 h-25 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#1490BD] via-[#068ABA]" />
            <div className="px-3">
              <p className="text-sm font-regular text-sky-600 mb-2">Age</p>
              <p className="text-black text-m font-semibold">
                {pet.pet_age ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="w-40 h-25 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#477B36] via-[#477B36]" />
            <div className="px-3">
              <p className="text-sm font-regular text-green-600 mb-2">Weight</p>
              <p className="text-black text-m font-semibold">
                {pet.pet_weight ? `${pet.pet_weight} kg` : "N/A"}
              </p>
            </div>
          </div>

          <div className="w-40 h-25 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#C0A80E] via-[#BDA400]" />
            <div className="px-3">
              <p className="text-sm font-regular text-yellow-600 mb-2">
                Gender
              </p>
              <p className="text-black text-m font-semibold">
                {pet.pet_gender || "N/A"}
              </p>
            </div>
          </div>

          <div className="w-40 h-25 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#570096] via-[#570096]" />
            <div className="px-3">
              <p className="text-sm font-regular text-purple-600 mb-2">
                Birthday
              </p>
              <p className="text-black text-m font-semibold">
                {pet.pet_birthday
                  ? new Date(pet.pet_birthday).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="w-40 h-25 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#C71818] via-[#C71818]" />
            <div className="px-3 ">
              <p className="text-sm font-regular text-red-600 mb-2">Species</p>
              <p className="text-black text-m font-semibold">
                {pet.pet_species || "N/A"}
              </p>
            </div>
          </div>

          <div className="w-36 rounded-lg bg-white shadow">
            <div className="h-2 rounded-t-lg bg-gradient-to-b from-[#C76D00] via-[#C76D00]" />
            <div className="px-3">
              <p className="text-sm font-regular text-orange-600 mb-2">Breed</p>
              <p className="text-black text-m font-semibold">
                {pet.pet_breed || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Pet's Bio */}
        <div className="ml-5 mr-5 sm:ml-35 sm:w-205 bg-white p-4 rounded-lg shadow mt-6">
          <h3 className="font-semibold text-lg mb-2">Pet's Bio</h3>
          <p className="text-gray-600 text-m leading-relaxed">
            {pet.pet_bio || "No Bio"}
          </p>
        </div>

        {/* Health Record */}
        <div className="">
          <h3
            className="ml-1 font-semibold text-xl mt-5 -mb-3"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "30px",
              lineHeight: "34px",
              letterSpacing: "0%",
            }}
          >
            Health Record
          </h3>

          {petRecords && petRecords.length > 1 ? (
            <div className="bg-white mt-6 p-10 w-full rounded-t-xl">
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5"
                style={{
                  fontFamily: "Platypi, sans-serif",
                  fontSize: "24px",
                  lineHeight: "20px",
                  letterSpacing: "0%",
                }}
              >
                {petRecords.map((rec, index) => (
                  <div
                    key={rec.record_id || index}
                    className="relative border-[1px] bg-white rounded-lg overflow-hidden"
                    style={{
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "#000000B2",
                    }}
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
                      <h4 className="font-bold text-xl mb-2">
                        Medical History {index + 1}
                      </h4>
                      <p className="text-sm -mt-1">
                        <b>Date:</b>{" "}
                        {rec.visit_date
                          ? new Date(rec.visit_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-sm">
                        <b>Description:</b>{" "}
                        {rec.description || "No description"}
                      </p>
                      <p className="text-sm">
                        <b>Veterinarian:</b>{" "}
                        {rec.veterinarian_name || "Unknown"}
                      </p>
                      <p className="text-sm">
                        <b>Diagnosis:</b>{" "}
                        {rec.primary_diagnosis || "No diagnosis"}
                      </p>
                      <p className="text-sm">
                        <b>Test Result:</b> {rec.test_results || "N/A"}
                      </p>
                      <p className="text-sm">
                        <b>Action:</b> {rec.key_action || "N/A"}
                      </p>
                      <p className="text-sm">
                        <b>Medication:</b> {rec.medication_given || "N/A"}
                      </p>
                      <p className="text-sm mb-10">
                        <b>Remarks:</b> {rec.notes || "N/A"}
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
              <p className="text-md text-gray-500 mt-2">
                Once your veterinarian adds medical history, it will appear
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
