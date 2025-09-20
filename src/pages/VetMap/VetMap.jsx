import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import VetMapSidebar from "./components/VetMapSidebar";
import VetMapContainer from "./components/VetMapContainer";

import { useNavigate } from "react-router-dom";

import NavProfile from "../../assets/nav-profile.png";
import NavLogo from "../../assets/nav-logo.png";

import { clientNavItems } from "../../config/navItems";
import { getAllClinics } from "../../api/get-api/clinics/getClinicsService.js";

import { useClient } from "../../hooks/useClient.js";

export default function VetMap() {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(true);
  const [vets, setVets] = useState([]);

  const { client, loading, error, fetchClient } = useClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const clientId = localStorage.getItem("client_id");

    if (!token || role !== "client") {
      navigate("/");
      return;
    }
    // Fetch clinics from backend
    const fetchClinics = async () => {
      try {
        const data = await getAllClinics();
        setVets(data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };

    fetchClient(clientId);

    fetchClinics();
  }, [navigate, fetchClient]);

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
        profileImg={NavProfile}
        username={client?.name || "Guest"}
        navItems={clientNavItems}
      />
      <div className="flex flex-col-reverse lg:flex-row h-[100vh] overflow-hidden">
        <VetMapSidebar vets={vets} showList={showList} />
        <VetMapContainer vets={vets} />
      </div>
    </>
  );
}
