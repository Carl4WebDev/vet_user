// pages/VetMap/VetMap.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import VetMapSidebar from "./components/VetMapSidebar";
import VetMapContainer from "./components/VetMapContainer";

import { useNavigate } from "react-router-dom";
import NavProfile from "../../assets/nav-profile.png";
import NavLogo from "../../assets/nav-logo.png";
import { clientNavItems } from "../../config/navItems";
import { getAllClinics } from "../../api/get-api/clinics/getClinicsService.js";
import { getFreelanceVets } from "../../updated-api/getFreelanceVets.js";

import { useClient } from "../../hooks/useClient.js";

export default function VetMap() {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(true);
  const [vets, setVets] = useState([]);
  const [showFreelancers, setShowFreelancers] = useState(false);
  const { client, loading, error, fetchClient } = useClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const clientId = localStorage.getItem("client_id");

    if (!token || role !== "client") {
      navigate("/");
      return;
    }

    fetchClient(clientId);

    // load clinics initially
    fetchClinics();
  }, [navigate, fetchClient]);

  const fetchClinics = async () => {
    try {
      const data = await getAllClinics();
      setVets(data);
    } catch (err) {
      console.error("Error fetching clinics:", err);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const data = await getFreelanceVets();
      setVets(data);
    } catch (err) {
      console.error("Error fetching freelance vets:", err);
    }
  };

  const handleToggle = async () => {
    setShowFreelancers((prev) => !prev);
    if (!showFreelancers) await fetchFreelancers();
    else await fetchClinics();
  };

  // Navbar scroll behavior
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowList(scrollTop < lastScrollTop);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <p>Loading client...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!client) return <p>No client data found.</p>;

  return (
    <>
      <Navbar
        logo={NavLogo}
        profileImg={client.mainImageUrl || NavProfile}
        username={client?.name || "Guest"}
        navItems={clientNavItems}
      />

      <div className="flex flex-col-reverse lg:flex-row h-[100vh] overflow-hidden">
        <VetMapSidebar
          vets={vets}
          showList={showList}
          isFreelance={showFreelancers}
        />

        <div className="absolute top-24 right-8 z-50">
          <button
            onClick={handleToggle}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {showFreelancers ? "Show Clinics" : "Veterinarian Freelancers"}
          </button>
        </div>

        <VetMapContainer vets={vets} />
      </div>
    </>
  );
}
