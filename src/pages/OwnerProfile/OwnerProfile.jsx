import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import OwnerProfileEdit from "./Modal/OwnerProfileEdit";
import Navbar from "../../components/Navbar";
import NavLogo from "../../assets/nav-logo.png";
import NavProfile from "../../assets/nav-profile.png";
import { clientNavItems } from "../../config/navItems";
import { getClientById } from "../../api/get-api/client/getClientById";
import { Pencil } from "lucide-react";

const client_name = localStorage.getItem("client_name");

export default function OwnerProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { clientTableId } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Assuming we have client ID stored or we can get it from somewhere
        const clientId = localStorage.getItem("client_id");
        if (!clientId) {
          throw new Error("Client ID not found");
        }

        const data = await getClientById(clientId);
        setClientData(data);
      } catch (err) {
        console.error("Failed to fetch client data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientTableId]);

  if (loading) {
    return (
      <>
        <Navbar
          logo={NavLogo}
          profileImg={NavProfile}
          username={client_name || "Guest"}
          navItems={clientNavItems}
        />
        <div className="flex justify-center items-center h-screen w-full">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        logo={NavLogo}
        profileImg={NavProfile}
        username={client_name || "Guest"}
        navItems={clientNavItems}
      />
      <div className="bg-white shadow-lg w-full h-full mx-auto overflow-hidden border border-gray-300">
        {/* Banner */}
        <div className="relative bg-[#5a5a5a] h-[200px] md:h-[250px] w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow"
          >
            <Pencil size={16} />
            Edit
          </button>
          <OwnerProfileEdit
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            clientId={clientTableId}
          />
        </div>

        {/* Profile Info */}
        <div className="bg-gray-100 px-6 pb-8 w-full h-full">
          <div className="relative flex flex-col items-start md:flex-row md:items-start gap-6 -mt-25 w-full">
            {/* Profile Image */}
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-[200px] h-[200px] md:w-[200px] md:h-[200px] rounded-full border-4 border-white shadow-lg object-cover"
            />

            {/* Name & Details */}
            <div className="flex-1 md:mt-30 w-full">
              <h2 className="md:text-3xl text-4xl font-semibold text-center mb-5 md:text-left w-full">
                {clientData.client_name || "Not Specified"}
              </h2>
            </div>
          </div>

          {/* UserDetails Section */}
          <div className="ml-2 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm w-full">
            <div className="flex justify-start gap-2 w-full">
              <img
                src="./id_icon.png"
                alt=""
                className="h-7 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">ID Number</p>
                <p className="text-black text-m font-regular">
                  {clientData.user_id || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 w-full">
              <img
                src="./user_icon.png"
                alt=""
                className="h-5 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">Gender</p>
                <p className="text-black text-m font-regular">
                  {clientData.gender || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 w-full">
              <img
                src="./phone_icon.png"
                alt=""
                className="h-6 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">Phone Number</p>
                <p className="text-black text-m font-regular">
                  {clientData.phone || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 w-full">
              <img
                src="./phone_icon.png"
                alt=""
                className="h-6 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">Tel. Number</p>
                <p className="text-black text-m font-regular">
                  {clientData.tel_num || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 w-full">
              <img
                src="./email_icon.png"
                alt=""
                className="h-4 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">Email</p>
                <p className="text-black text-m font-regular">
                  {clientData.email || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 w-full">
              <img
                src="./location_icon.png"
                alt=""
                className="h-6 w-auto mt-3 mr-1"
              />
              <div className="w-full">
                <p className="text-black text-s font-regular">Address</p>
                <p className="text-black text-m font-regular">{`${clientData.street}-${clientData.city}-${clientData.province}-${clientData.postal_code}-${clientData.country}-${clientData.unit_number}`}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 w-full">
            <h3 className="font-medium text-xl mb-2">Bio</h3>
            <p className="text-gray-600 text-m w-full">
              {clientData.bio || "Not Specified"}
            </p>
          </div>

          {/* Statistics */}
          <div className="mt-8 w-full">
            <h3 className="font-semibold mb-4 w-full">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {/* Card 1 - All Clinic Visited */}
              <div className="relative bg-white shadow rounded-lg p-3 text-center overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-b from-[#1490BD] via-[#068ABA]"></div>
                <p className="text-[#068ABA] text-m mt-1">All Clinic Visited</p>
                <p className="text-3xl font-semibold font-playfair mt-10">1</p>
              </div>

              {/* Card 2 - Missed Appointments */}
              <div className="relative bg-white shadow rounded-lg p-3 text-center overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-b from-[#C0A80E] via-[#BDA400]"></div>
                <p className="text-[#BDA400] text-m mt-1">
                  Missed Appointments
                </p>
                <p className="text-3xl font-semibold mt-10">0</p>
              </div>

              {/* Card 3 - Last Visit */}
              <div className="relative bg-white shadow rounded-lg p-3 text-center overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-b from-[#C76D00] via-[#C76D00]"></div>
                <p className="text-[#C76D00] text-m mt-1">Last Visit</p>
                <p className="text-3xl font-semibold font-playfair mt-10">
                  Sep 26, 2024
                </p>
              </div>

              {/* Card 4 - Number of Pets */}
              <div className="relative bg-white shadow rounded-lg p-3 text-center overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-b from-[#477B36] via-[#477B36]"></div>
                <p className="text-[#477B36] text-m mt-1">Number of Pets</p>
                <p className="text-3xl font-semibold mt-10">3</p>
              </div>

              {/* Card 5 - Cancelled Appointments */}
              <div className="relative bg-white shadow rounded-lg p-3 text-center overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-b from-[#C71818] via-[#C71818]"></div>
                <p className="text-[#C50000] text-m mt-1">
                  Cancelled Appointments
                </p>
                <p className="text-3xl font-semibold mt-10">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
