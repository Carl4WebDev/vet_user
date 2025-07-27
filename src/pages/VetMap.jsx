import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Navbar from "../components/Navbar";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 7.0735, // Sample lat/lng (Davao)
  lng: 125.6121,
};

const VetMap = () => {
  const [showList, setShowList] = useState(true);

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

  const vetList = (
    <div className="bg-white shadow-lg rounded-lg p-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-3 shadow">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">Vet Essence Animal Clinic</h3>
            <span className="bg-green-400 h-3 w-3 rounded-full" />
          </div>
          <p className="text-xs text-gray-500">2 miles away</p>
          <p className="text-xs text-gray-500">⭐ 4.8 (10)</p>
          <p className="text-xs">8:00 AM - 10:00 PM</p>
          <div className="mt-2 flex justify-between gap-2">
            <button className="text-white bg-blue-500 px-3 py-1 rounded text-xs">
              Book Now
            </button>
            <button className="text-blue-600 border border-blue-500 px-3 py-1 rounded text-xs">
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col-reverse lg:flex-row h-[100vh] overflow-hidden">
        {/* Sidebar List */}
        <div
          className={`w-full lg:w-1/3 p-4 transition-all duration-300 overflow-y-auto ${
            showList ? "sticky top-0 bg-gray-50 z-20" : "hidden lg:block"
          }`}
          style={{ maxHeight: "100vh" }}
        >
          <h2 className="text-xl font-bold mb-4">Nearby Veterinaries</h2>

          {/* Search + Filter */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for a vet"
              className="flex-1 px-3 py-2 border rounded-full"
            />
            <Search className="text-gray-600" />
            <button className="px-3 py-2 border rounded-full">
              <Filter size={16} />
            </button>
          </div>

          {vetList}
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-2/3 h-[50vh] lg:h-full">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {/* Example markers */}
              {[...Array(8)].map((_, i) => (
                <Marker
                  key={i}
                  position={{
                    lat: center.lat + Math.random() * 0.01 - 0.005,
                    lng: center.lng + Math.random() * 0.01 - 0.005,
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default VetMap;
